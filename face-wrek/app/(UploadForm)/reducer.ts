import { v4 as uuidv4 } from 'uuid';

import { action, ACTIONS } from "./actions";
import { IState } from "./state";

export default function reducer(state: IState, action: action) {
  const { type } = action;

  switch(type) {
    case ACTIONS.FACE_IMAGE_SELECTED:
      state = { ...state, faceInput: action.event };
      break;

    case ACTIONS.DOCUMENT_IMAGE_SELECTED:
      state = { ...state, documentInput: action.event };
      break;

    case ACTIONS.UPLOAD_START:
      if (!state.verificationId) {
        const verificationId = uuidv4();

        state = {
          ...state,
          isLoading: true,
          verificationId,
        };
      }
      break;

    case ACTIONS.VERIFICATION_COMPLETE:
      state = {
        ...state,
        isLoading: false,
      };
      break;

    case ACTIONS.VERIFICATION_SUCCESS:
      state = {
        ...state,
        isSuccess: true,
      }
      break;

    case ACTIONS.VERIFICATION_ERROR:
      state = {
        ...state,
        isLoading: false,
        verificationId: '',
      }
      break;
  }

  return state;
};
