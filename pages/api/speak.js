import rateLimit from '../../utils/rate-limit'

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

export default async function Speak(req, res) {
  const length = 250;
  const url = '';

  await limiter.check(res, 5, 'CACHE_TOKEN')
  .then( () => {
    if(req.body.audioString == '') throw new Error('No string.');
    if(req.body.audioString.length > length) throw new Error('Exceeds character limit:')

    const text = '<speak>'+req.body.audioString+'</speak>';
    const time = Date.now();
  
    const voice = req.body.voice == 0 ? 'Amy' : 'Matthew';
  
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

    Polly.synthesizeSpeech(pollyparams, (err, data) => {
      if (err) {
        return res.status(400).json(err);
      } else if (data) {
        let s3params = {
          Body: data.AudioStream, 
          Bucket: "pollysquawk", 
          Key: String(time) + '.mp3',
        };

        s3.upload(s3params, function(err, data) {
          if (err) {
            return res.status(400).json(err);
          } else {    
            return res.json({
              url: data.Location
            });
          }
        });
      }
    })
  })
  .catch( (err) => {
    console.log(err.message)
    return res.status(400).json({ message: err.message });
  })

  return;
  
}