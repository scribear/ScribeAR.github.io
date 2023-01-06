import { useDispatch } from "react-redux";
import { SRecognition, API, STATUS } from "../typesImports";


const defaultSRecognition = () : SRecognition => {
   return {
      recognizer: null,
      // handler: null,
      // resetTranscript: () => useDispatch()('RESET_TRANSCRIPT'),
      status: STATUS.NULL,
      api: API.WEBSPEECH,
   }
}

export const SRecognitionReducer = (state = defaultSRecognition(), action : {type: string; payload}) => {
   // let copyStatus : SRecognition = {...state}; // Object.assign({}, state);

   switch (action.type) {
      case 'sRecog/set_recog': // Change the entire recogStatus
         return action.payload;
      case 'sRecog/set_status':
         return {...state, status: action.payload.status};
      case 'sRecog/set_api':
         return {...state, api: action.payload.api};
      default:
         return state;
   }
}