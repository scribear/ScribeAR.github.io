import { MultiSpeakerTranscript, TranscriptBlock, Transcript } from "../types/TranscriptTypes";
import { 
   AudioEventBucket, 
   HTML5STTEventBucket, 
   AzureSTTEventBucket, 
   UserActionEventBucket, 
   AudioStream, 
   HTML5STTStream, 
   AzureSTTStream, 
   UserActionStream, 
   MainStream, 
   MainStreamMap, 
} from "../types/bucketStreamTypes";

export const TranscriptReducer = (state = new MultiSpeakerTranscript(), action : {type: string; payload: any;}) => {
   let copyState : MultiSpeakerTranscript = Object.assign({}, state);
   let transcript: Transcript = copyState.transcripts[0]; // We only support 1 speaker right now
   console.log("Transcript Reducer, receiving dispatch", action);
   switch (action.type) {
      case 'transcript/new_final_block':
         // Append a new final block to the transcript
         console.log("Transcript Reducer, new final transcript block added", action.payload.block);
         transcript.addFinalBlock(action.payload);
         return copyState;
      case 'transcript/update_in_progress_block':
         // Modify in-progress block of the transcript
         console.log("Transcript Reducer, in-progress block updated", action.payload.block);
         transcript.inProgressBlock = action.payload;
         return copyState;
      case 'RESET_TRANSCRIPT':
         transcript = new Transcript
         return copyState;
      case 'AZ_CONVO_RECOGNIZED':
         // for (let i = 0; i < state.speakerNum; i++) {
         //    copyState.currentTranscript[i] += ' ' + copyState.currentTranscript[i];
         // }
         throw new Error('Convo Not implemented');
         break;
      case 'RESET_SPEAKER':
         throw new Error('RESET_SPEAKER Not implemented');
      case 'SET_MAX_SPEAKER':
         return {...state, maxSpeaker: action.payload};
      case 'ADD_SPEAKER':
         throw new Error('ADD_SPEAKER Not implemented');
         // for (let i = 0; i < action.payload.length; i++) {}
      case 'REMOVE_SPEAKER':
         throw new Error('REMOVE_SPEAKER Not implemented');
      default:
         return state;
         // throw new Error('Default Not implemented');
         break;

   }

}
