export type IState = {
  faceInput: any;
  documentInput: any;
  isLoading: boolean;
  verificationId: string;
};

export const defaultState = {
  faceInput: null,
  documentInput: null,
  isLoading: false,
  verificationId: '',
};
