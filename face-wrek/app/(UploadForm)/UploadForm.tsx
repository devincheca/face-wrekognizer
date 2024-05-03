"use client";

import { useEffect, useReducer, useRef } from "react";

import { ACTIONS } from "./actions";
import reducer from "./reducer";
import { defaultState } from "./state";
import Service from "./service";
import LoadingButton from "../(common)/components/LoadingButton";

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
    uploadService.faceInput = faceInput && faceInput.current;
    uploadService.docInput = docInput && docInput.current;
    uploadService.onComplete = ({ verification, isSuccess, isError }: any) => {
      dispatch({ type: isError ? ACTIONS.VERIFICATION_ERROR : ACTIONS.VERIFICATION_COMPLETE });

      if (isSuccess) dispatch({ type: ACTIONS.VERIFICATION_SUCCESS });
    };

    uploadService.uploadAndVerify();
  }, [state.verificationId])

  const { isLoading, isSuccess } = state;

  return (
    <>
      <div className="flex w-screen justify-around">
        <div className="flex flex-col h-96 py-5">
          <div className="flex py-5 m-auto">
            <label className="px-5">Photo of your face: </label>
            <input ref={faceInput} type="file" id="faceInput" name="faceInput" disabled={isLoading} onChange={onFaceSelect}></input>
          </div>
          <div className="flex py-5 m-auto">
            <label className="px-5">Photo of your ID Card / Passport Document:</label>
            <input ref={docInput} type="file" id="faceInput" name="faceInput" disabled={isLoading} onChange={onDocumentSelect}></input>
          </div>
          <div className="flex m-auto">
            { !isLoading && !isSuccess && <button className="bg-blue-500 hover:bg-blue-700" onClick={upload}>Verify</button> }
            { isLoading && !isSuccess && <LoadingButton /> }
          </div>
          <div className="m-auto font-bold">
            { isSuccess && <div>Identify Verification Succeeded</div>}
            { isSuccess && <div>Your face matched your ID card</div>}
          </div>
        </div>
      </div>
    </>
  );
}
