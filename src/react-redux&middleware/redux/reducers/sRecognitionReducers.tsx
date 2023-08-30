import { useDispatch } from "react-redux";
import { SRecognition, API, STATUS } from "../typesImports";


const defaultSRecognition = () : SRecognition => {
   return {
      recognizer: null,
      // handler: null,
      // resetTranscript: () => useDispatch()('RESET_TRANSCRIPT'),
      status: STATUS.TRANSCRIBING,
   }
}

export const SRecognitionReducer = (state = defaultSRecognition(), action : {type: string; payload}) => {
   // let copyStatus : SRecognition = {...state}; // Object.assign({}, state);

   switch (action.type) {
      case 'sRecog/set_recog': // Change the entire recogStatus
         return action.payload;
      case 'sRecog/set_status':
         // console.log('in set_stats: ', state.status, action.payload.status);
         if (state.status !== STATUS.ERROR) {
            return {...state, status: action.payload.status};
         }
         return state;
      default:
         return state;
   }
}
