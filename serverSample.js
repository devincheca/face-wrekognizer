const AWS = require('aws-sdk');
// use your configuration
AWS.config.update({region:'us-east-1'});
const rekognition = new AWS.Rekognition();
// this is the template APIVersion from the AWS S3 docs
const S3 = new AWS.S3({apiVersion: '2006-03-01'});
const uuid = require('uuid');
// helper class and function for S3
const photoBucket = require('../helpers/photoBucket.js');
// helper class and function for token validation
const tokenValidator = require('../helpers/tokenValidator.js');
// helper class and function for token update
const tokenUpdate = require('../helpers/tokenUpdate.js');
// helper class and function for checking face match
const matchValidator = require('../helpers/matchValidator.js');
// you probably won't need this function VVV
async function deleteAssets(bucketName, faceKeyName, idCardKeyName) {
  const params = {
    Bucket: bucketName, 
    Delete: {
      Objects: [
        { Key: faceKeyName }, 
        { Key: idCardKeyName }, 
      ], 
    }
  };
  return await S3.deleteObjects(params).promise();
}
module.exports = {
  method: 'POST',
  path: '/validate/sendImg',
  options: {
    cors: true,
    payload: {
      maxBytes: 1024 * 1024 * 100,
      timeout: false,
      parse: true,
      output: 'data',
      allow: 'multipart/form-data',
      multipart: true,
    },
  },
  handler: async (request, h) => {
    // check the token, however you might do this if at all
    const validator = new tokenValidator();
    validator.token = request.payload.formToken;
    const isValidToken = await validator.isValid();
    if (!isValidToken) {
      return {
        isSuccess: false,
        error: 'Internal server error'
      };
    }
    // S3 logic
    const currentId = uuid.v4();
    const bucketName = 'rek-face-' + currentId;
    await S3.createBucket({ Bucket: bucketName }).promise();
    const faceBucket = new photoBucket();
    faceBucket.bucketName = bucketName;
    faceBucket.keyName = 'currentFace-' + currentId + '.png';
    faceBucket.fileUpload = request.payload.faceInput;
    const idCardBucket = new photoBucket();
    idCardBucket.bucketName = bucketName;
    idCardBucket.keyName = 'currentIdCard-' + currentId + '.png';
    idCardBucket.fileUpload = request.payload.idInput;
    // run upload calls in parallel
    await Promise.all([ faceBucket.upload(), idCardBucket.upload() ]);
    // Rekognition logic
    const params = {
      SourceImage: { S3Object: faceBucket.getStorageObject() },
      TargetImage: { S3Object: idCardBucket.getStorageObject() },
      SimilarityThreshold: 90
    };
    try {
      const res = await rekognition.compareFaces(params).promise();
      try {
        // housekeeping
        await deleteAssets(bucketName, faceBucket.keyName, idCardBucket.keyName);
        await S3.deleteBucket({ Bucket: bucketName }).promise();
        const matchValid = new matchValidator();
        matchValid.metaData = res;
        const updateToken = new tokenUpdate();
        updateToken.token = validator.token;
        updateToken.isVerified = matchValid.isValid();
        await updateToken.update();
      }
      catch(error) { console.trace(error); }
      return res;
    }
    catch(error) {
      console.trace(error);
      return {
        isSuccess: false,
        error: 'Internal server error'
      };
    }
  }
};

