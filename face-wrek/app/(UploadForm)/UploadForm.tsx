"use client";

import { useEffect, useReducer, useRef } from "react";

import { ACTIONS } from "./actions";
import reducer from "./reducer";
import { defaultState } from "./state";
import Service from "./service";

export default function UploadForm() {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const faceInput = useRef(null);
  const docInput = useRef(null);

  const onFaceSelect = (event: any) => dispatch({ type: ACTIONS.FACE_IMAGE_SELECTED, event });

  const onDocumentSelect = (event: any) => dispatch({ type: ACTIONS.DOCUMENT_IMAGE_SELECTED, event });

  const upload = () => dispatch({ type: ACTIONS.UPLOAD_START });

  useEffect(() => {
    const { verificationId } = state;

    if (!verificationId) return;

    const uploadService = new Service();
    uploadService.id = verificationId;
    uploadService.dispatch = dispatch;
    uploadService.faceInput = faceInput && faceInput.current;
    uploadService.docInput = docInput && docInput.current;
    uploadService.uploadAndVerify();
  }, [state.verificationId])

  const { isLoading } = state;

  return (
    <>
      <div className="flex w-screen justify-around">
        <div className="flex flex-col h-96 py-5">
          <div className="flex py-5 m-auto">
            <label className="px-5">Photo of your face: </label>
            <input ref={faceInput} type="file" id="faceInput" name="faceInput" onChange={onFaceSelect}></input>
          </div>
          <div className="flex py-5 m-auto">
            <label className="px-5">Photo of your ID Card / Passport Document:</label>
            <input ref={docInput} type="file" id="faceInput" name="faceInput" onChange={onDocumentSelect}></input>
          </div>
          <div className="flex m-auto">
            <button className="bg-blue-500 hover:bg-blue-700" disabled={isLoading} onClick={upload}>Verify</button>
          </div>
        </div>
      </div>
    </>
  );
}

/*
$ cat SendPng.js
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
*/
/*
$ cat ../helpers/photoBucket.js
const AWS = require('aws-sdk');
const S3 = new AWS.S3({apiVersion: '2006-03-01'});
class photoBucket {
  constructor() {
    this.bucketName = '';
    this.keyName = '';
    this.fileUpload = null;
  }
  getStorageObject() {
    return {
      Bucket: this.bucketName,
      Name: this.keyName,
    };
  }
  async upload() { await this.uploadImage(); }
  async uploadImage() {
    const params = {
      Bucket: this.bucketName,
      Key: this.keyName,
      Body: Buffer.from(this.fileUpload)
    };
    try {
      return await S3.putObject(params).promise();
    }
    catch(error) {
      console.trace(error);
    }
  }
}
module.exports = photoBucket;
*/
