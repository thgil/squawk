 const AWS = require('aws-sdk')

aws.config.update({
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

export default function Speak(req, res) {

  if(!req.body.audioString) return res.status(400).json('No string.');
  
  const length = 250;

  if(req.body.audioString.length > length) return res.status(400).json({message: 'Too many characters ( 250 limit for demo )'})

  const text = req.body.audioString.substring(0, length);
  const time = Date.now();


  const pollyparams = {
    'Text': text,
    'TextType': "ssml", 
    'OutputFormat': 'mp3',
    'VoiceId': 'Amy',
    'Engine': 'neural'
}

  Polly.synthesizeSpeech(pollyparams, (err, data) => {
      if (err) {
          console.log(err.message)
          res.status(400).json(err);
      } else if (data) {
          let s3params = {
              Body: data.AudioStream, 
              Bucket: "pollysquawk", 
              Key: String(time) + '.mp3',
              // ACL: "public-read"
          };

          s3.upload(s3params, function(err, data) {
              if (err) {
                  console.log(err.message);
                  res.status(400).json(err);
              } else {    
                  console.log(data.Location);
                  res.json({
                    url: data.Location
                  });
              }
          });
      }
  })
}