export type IState = {
  faceInput: any;
  documentInput: any;
  isLoading: boolean;
  isSuccess: boolean;
  verificationId: string;
};

export const defaultState = {
  faceInput: null,
  documentInput: null,
  isLoading: false,
  isSuccess: false,
  verificationId: '',
};
