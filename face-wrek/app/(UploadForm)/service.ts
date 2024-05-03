import { ACTIONS } from "./actions";
import { LAMBDA, LAMBDA_POST_ACTIONS } from "../constants";

export default class Service {
  id: string | null = null;
  onComplete: (arg: any) => void = () => {};
  faceUrl: string = '';
  documentUrl: string = '';
  faceInput: HTMLInputElement | null = null;
  docInput: HTMLInputElement | null = null;
  faceImage: string | ArrayBuffer | null = null;
  faceImageType: string = '';
  docImage: string | ArrayBuffer | null = null;
  docImageType: string = '';
  isFirstImageUploaded: boolean = false;

  constructor() {}

  public async uploadAndVerify() {
    const [{ signedUrl: faceUrl }, { signedUrl: documentUrl }] = await Promise.all([
      this.getFaceUploadUrl(),
      this.getDocumentUploadUrl(),
    ]);

    this.faceUrl = faceUrl;
    this.documentUrl = documentUrl;

    if (!this.faceUrl || !this.documentUrl) return;

    await this.uploadFiles();
  }

  private async uploadFiles() {
    const faceInputFiles = this.faceInput?.files;
    const docInputFiles = this.docInput?.files;

    if (
      faceInputFiles
      && docInputFiles 
      && faceInputFiles.length === 1
      && docInputFiles.length === 1
      && this.faceInput 
      && this.docInput
    ) {
      this.faceImageType = faceInputFiles[0].type;
      this.docImageType = faceInputFiles[0].type;

      const faceReader = new FileReader();
      faceReader.onload = event => event && event.target && this.uploadFile({
        image: event.target.result,
        url: this.faceUrl,
        type: this.faceImageType,
      });
      const docReader = new FileReader();
      docReader.onload = event => event && event.target && this.uploadFile({
        image: event.target.result,
        url: this.documentUrl,
        type: this.docImageType,
      });

      faceReader.readAsDataURL(faceInputFiles[0]);
      docReader.readAsDataURL(docInputFiles[0]);
    }
  }

  private async uploadFile(file: {
    image: string | ArrayBuffer | null,
    url: string,
    type: string
  }) {
    const { image, url, type } = file;
    if (image && typeof image === 'string') {
      const binary = atob(image.split(',')[1]);
      const array = [];
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i))
      }
      const blobData = new Blob([new Uint8Array(array)], { type })
      await fetch(url, {
        method: 'PUT',
        body: blobData
      });
      if (this.isFirstImageUploaded) this.validateId();
      else this.isFirstImageUploaded = true;
    }
  }

  private async validateId() {
    const response = await fetch(`${LAMBDA.UPLOAD}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        Action: LAMBDA_POST_ACTIONS.VALIDATE_ID,
        Id: this.id,
      }),
    });

    const validation = await response.json();
    const isSuccess = validation.FaceMatches && validation.FaceMatches
      .reduce((acc: boolean, { Similarity }: any) => {
        return acc
          ? true
          : Similarity > 95;
      }, false);
    const isError = validation.$metadata && validation.$metadata.httpStatusCode !== 200;

    this.onComplete({ validation, isSuccess, isError });
  }

  private async getUrl(ObjectNamePrefix: string) {
    const response = await fetch(`${LAMBDA.UPLOAD}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        Action: LAMBDA_POST_ACTIONS.GET_URL,
        ObjectNamePrefix,
        Id: this.id,
      }),
    });

    return response.json();
  }

  async getFaceUploadUrl() {
    return this.getUrl('rek-face');
  }

  async getDocumentUploadUrl() {
    return this.getUrl('rek-doc');
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:3000',
    };
  }
}
