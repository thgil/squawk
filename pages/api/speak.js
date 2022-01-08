import { Client as FaunaClient, query as q } from "faunadb"
import rateLimit from '../../utils/rate-limit'
const { v1: uuidv1 } = require('uuid');
const AWS = require('aws-sdk')

AWS.config.update({
  'credentials': {
     'accessKeyId': process.env.AWS_ACCESS_KEY_ID_SQUAWK,
     'secretAccessKey': process.env.AWS_SECRET_ACCESS_KEY_SQUAWK
    },
})

const Polly = new AWS.Polly({
    signatureVersion: 'v4',
    region: 'us-east-1'
})

const s3 = new AWS.S3();

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 100, // Max 500 users per second
})

const client = new FaunaClient({
  secret: process.env.FAUNA_SECRET,
  scheme: "https",
  domain: "db.us.fauna.com"
})

export default async function Speak(req, res) {
  const length = 250;

  const text = '<speak>'+req.body.audioString+'</speak>';
  const voice = req.body.voice == 0 ? 'Amy' : 'Matthew';

  await limiter.check(res, 5, 'CACHE_TOKEN')
    .then( () => {
      if(req.body.audioString == '') throw new Error('No string.');
      if(req.body.audioString.length > length) throw new Error('Exceeds character limit:')

      // Due to AWS Polly character restrictions, we have to split our text into chunks.
      // const splittedText = transcript.match(/.{1500}/g);
      // then map(chunk, index) i
      // then concat mp3 files with ffmpeg?

      const pollyparams = {
        'Text': text,
        'TextType': "ssml", 
        'OutputFormat': 'mp3',
        'VoiceId': voice,
        'Engine': 'neural'
      };

      return new Promise((resolve, reject) => {
        Polly.synthesizeSpeech(pollyparams, (err, data) => {
          if (err) {
            reject(err);
          } else if (data) {
            resolve(data);
          }
        })
      });
    })
    .then((data) => {
      const s3params = {
        Body: data.AudioStream, 
        Bucket: "pollysquawk", 
        Key: uuidv1() + '.mp3',
      };

      return new Promise((resolve, reject) => { 
        s3.upload(s3params, function(err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data.Location)
          }
        })
      });
    })
    .then(async (url) => {
      await client.query(q.Create(q.Collection('texts'), { data: { length: text.length, text: text, voice: voice,  url: url}}));
      return res.json({
        url: url
      });
    })
    .catch( (err) => {
      console.log(err.message)
      return res.status(400).json({ message: err.message });
    });
}