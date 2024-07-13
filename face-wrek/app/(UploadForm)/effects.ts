import { RefObject, useEffect, Dispatch } from "react";
import { ACTIONS } from "./actions";

// Service
import Service from "./service";

type UploadAndVerifyType = {
  verificationId: string;
  faceInput: RefObject<HTMLInputElement>;
  docInput: RefObject<HTMLInputElement>;
  dispatch: Dispatch<{
    type: string;
  }>;
}

export const useUploadAndVerify = ({
  verificationId,
  faceInput,
  docInput,
  dispatch,
}: UploadAndVerifyType) => useEffect(() => {
  if (!verificationId) return;

  const uploadService = new Service();
  uploadService.id = verificationId;
  uploadService.faceInput = faceInput && faceInput.current;
  uploadService.docInput = docInput && docInput.current;
  uploadService.onComplete = ({ verification, isSuccess, isError }: any) => {
    dispatch({ type: isError ? ACTIONS.VERIFICATION_ERROR : ACTIONS.VERIFICATION_COMPLETE });

    if (isSuccess) dispatch({ type: ACTIONS.VERIFICATION_SUCCESS });
  };

  uploadService.uploadAndVerify();
}, [verificationId])
