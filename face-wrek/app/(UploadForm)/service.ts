import { LAMBDA, LAMBDA_POST_ACTIONS } from "../constants";

export default class Service {
  id: string | null = null;
  dispatch: (arg: any) => any = () => null;
  faceUrl: string | null = null;
  documentUrl: string | null = null;
  faceInput: HTMLInputElement | null = null;
  docInput: HTMLInputElement | null = null;

  constructor() {}

  public async uploadAndVerify() {
    const [{ signedUrl: faceUrl }, { signedUrl: documentUrl }] = await Promise.all([
      this.getFaceUploadUrl(),
      this.getDocumentUploadUrl(),
    ]);

    this.faceUrl = faceUrl;
    this.documentUrl = documentUrl;

    await this.uploadFiles();
  }

  private async uploadFiles() {
    const faceInputFiles = this.faceInput?.files;
    const docInputFiles = this.docInput?.files;

    if (
      faceInputFiles
      && docInputFiles 
      && this.faceInput 
      && this.docInput
      && this.faceUrl
      && this.documentUrl
    ) {
      const faceForm = document.createElement('form');
      faceForm.appendChild(this.faceInput);
      const docForm = document.createElement('form');
      docForm.appendChild(this.docInput);

      const forms = {
        face: new FormData(faceForm),
        doc: new FormData(docForm),
      };

      // this has to get modified to do atob logic
      return Promise.all([
        this.uploadFile(this.faceUrl, forms.face),
        this.uploadFile(this.documentUrl, forms.doc)
      ]);
    }
  }

  private async uploadFile(url: string, body: any) {
    return fetch(`${url}`, {
      method: 'PUT',
      body,
    });
  }

  private async getUrl(ObjectNamePrefix: string) {
    const response = await fetch(`${LAMBDA.UPLOAD}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000',
      },
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
}
