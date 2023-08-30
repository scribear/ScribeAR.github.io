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

import { Word, Sentence, Transcript } from "../typesImports";


// type TranscriptPayLoad = {
//    fArr : string[],
//    nfArr : string[],
//    transcript : SpeechRecognitionResultList,
// } | {}

const defaultWord = () : Word => {
   return {
      value: '',
      pitch: -1,
      volume: -1,
   }
}

const defaultSentence = () : Sentence => {
   return {
      text: [defaultWord()],
      intent: '',
      avgVolume: -1,
      avgPitch: -1,
      confidence: -1,
   }
}

const defaultTranscript = () : Transcript => {
   // const num : number = 4;
   return {
      speakerNum: 1,
      maxSpeaker: 4,
      previousTranscript: [''],
      currentTranscript: [''],
      speakerIDs: ['Unamed 1'],
  }
}

export const TranscriptReducer = (state = defaultTranscript(), action : {type: string; payload: any;}) => {
   let copyState : Transcript = Object.assign({}, state);
   
   switch (action.type) {
      case 'transcript/recognized':
         // console.log(`line ${39} transcript/recognized reducer`);
         const fTranscript = action.payload.fArr.map((result : SpeechRecognitionAlternative) => result.transcript).join('');
         const nfTranscript = action.payload.nfArr.map((result : SpeechRecognitionAlternative) => result.transcript).join('');
         copyState.currentTranscript[0] = fTranscript + ' ' + nfTranscript;
         return copyState;
      case 'transcript/end':
         // append current to previos
         console.log(`line ${46} transcript/end reducer`);
         for (let i = 0; i < state.speakerNum; i++) {
            const curTranscript : string  = copyState.currentTranscript[i];
            if (curTranscript !== '') {
               copyState.previousTranscript[i] += ' ' + curTranscript;
               copyState.currentTranscript[i] = '';
            }
         }

         return copyState;
      case 'transcript/azure/recognized':
         if (action.payload.newTranscript === undefined) { return state; }
         copyState.currentTranscript[0] = action.payload.newTranscript;
         
         for (let i = 0; i < state.speakerNum; i++) {
            const curTranscript : string  = copyState.currentTranscript[i];
            if (curTranscript !== '') {
               copyState.previousTranscript[i] += ' ' + curTranscript;
               copyState.currentTranscript[i] = '';
            }
         }

         return copyState;
      case 'AZ_CONVO_RECOGNIZED':
         // for (let i = 0; i < state.speakerNum; i++) {
         //    copyState.currentTranscript[i] += ' ' + copyState.currentTranscript[i];
         // }
         throw new Error('Convo Not implemented');
         break;
      case 'RESET_TRANSCRIPT':
         return {...state, previousTranscript: [], currentTranscript: []};
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
