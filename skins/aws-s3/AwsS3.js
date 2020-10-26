const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.update({
 accessKeyId: 'AKIAIVUZ4SAFNAFHQLUQ',
 secretAccessKey: '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'
});

const s3 = new AWS.S3();
function uploadToS3(fileNameOld, fileName, callback) {
    fs.readFile(fileNameOld, function (err, data) {
        if (err) { throw err; }
      
        var base64data = new Buffer(data, 'binary');
      
        var s3 = new AWS.S3();
        s3.putObject({
          Bucket: 'trilha',
          Key: fileName,
          Body: base64data,
          ACL: 'public-read'
        },function (resp) {
          console.log(arguments);
          console.log('Successfully uploaded package.');
          callback(fileName)
        });
    });
      
}

async function getS3Image(fileName) {
  const data = await s3.getObject({
    Bucket: 'trilha',
    Key: fileName,
  }).promise();

  console.log("got it")
  return data.Body;
}

async function returnAllImages(skins) {

  const promises = skins.map(async (skin) => {
    await getS3Image(skin.imageUrl).then((img) => {
      skin.image =  Buffer.from(img).toString('base64')
    })
  })
 
  await Promise.all(promises)
  console.log("Finished")
  return skins
}

module.exports.uploadToS3 = uploadToS3
module.exports.getS3Image = getS3Image
module.exports.returnAllImages = returnAllImages
