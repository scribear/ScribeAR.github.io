import * as sdk from 'microsoft-cognitiveservices-speech-sdk'
import installCOIServiceWorker from './coi-serviceworker'
import { API, ApiType, STATUS, StatusType } from '../../react-redux&middleware/redux/typesImports';
import {
   ApiStatus,
   AzureStatus,
   ControlStatus,
   DisplayStatus,
   SRecognition,
   ScribeHandler,
   ScribeRecognizer,
   StreamTextStatus,
} from '../../react-redux&middleware/redux/typesImports';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { getAzureTranslRecog, testAzureTranslRecog, useAzureTranslRecog } from './azure/azureTranslRecog';
import  { getWebSpeechRecog, useWebSpeechRecog } from './web-speech/webSpeechRecog';

import { AzureRecognizer } from './azure/azureRecognizer';
import { Dispatch } from 'redux';
import { Recognizer } from './recognizer';
import { RootState } from '../../store';
import { StreamTextRecognizer } from './streamtext/streamTextRecognizer';
import { TranscriptBlock } from '../../react-redux&middleware/redux/types/TranscriptTypes';
import { TranscriptReducer } from '../../react-redux&middleware/redux/reducers/transcriptReducers';
import { WebSpeechRecognizer } from './web-speech/webSpeechRecognizer';
import { WhisperRecognizer } from './whisper/whisperRecognizer';
import { intent_inference } from '../../ml/inference';
import { loadTokenizer } from '../../ml/bert_tokenizer';

// controls what api to send and what to do when error handling.

// NOTES: this needs to do everything I think. Handler should be returned which allows
//        event call like stop and the event should be returned... (maybe the recognition? idk.)

/*
* === * === *   DO NOT DELETE IN ANY CIRCUMSTANCE   * === * === *
* === * TRIBUTE TO THE ORIGINAL AUTHOR OF THIS CODE: Will * === *
DO NOT DELETE IN ANY CIRCUMSTANCE
export const returnRecogAPI = (api : ApiStatus, control : ControlStatus, azure : AzureStatus) => {
   // const apiStatus = useSelector((state: RootState) => {
   //    return state.APIStatusReducer as ApiStatus;
   // })
   // const control = useSelector((state: RootState) => {
   //    return state.ControlReducer as ControlStatus;
   // });
   // const azureStatus = useSelector((state: RootState) => {
   //    return state.AzureReducer as AzureStatus;
   // })
   const recognition : Promise<any> = getRecognition(api.currentApi, control, azure);
   const useRecognition : Object = makeRecognition(api.currentApi);
   // const recogHandler : Function = handler(api.currentApi);


   return ({ useRecognition, recognition });
}
* === * === *   DO NOT DELETE IN ANY CIRCUMSTANCE   * === * === *
* === * TRIBUTE TO THE ORIGINAL AUTHOR OF THIS CODE: Will * === *
*/


const getRecognizer = (currentApi: number, control: ControlStatus, azure: AzureStatus, streamTextConfig: StreamTextStatus): Recognizer => {

   if (currentApi === API.WEBSPEECH) {
      return new WebSpeechRecognizer(null, control.speechLanguage.CountryCode);
   } else if (currentApi === API.AZURE_TRANSLATION) {
      return new AzureRecognizer(null, control.speechLanguage.CountryCode, azure);
   } 
   else if (currentApi === API.AZURE_CONVERSATION) {
      throw new Error("Not implemented");
   }
   else if (currentApi === API.STREAM_TEXT) {
      // Placeholder - this is just WebSpeech for now
      return new StreamTextRecognizer(streamTextConfig.streamTextEvent, 'en', streamTextConfig.startPosition);
   } else if (currentApi === API.WHISPER) {
      let recog = new WhisperRecognizer(null, control.speechLanguage.CountryCode, 4);
      recog.load_whisper();
      return recog;
   } else {
      throw new Error(`Unexpcted API_CODE: ${currentApi}`);
   }
}

/**
 * Make a callback function that updates the Redux transcript using new final blocks and new
 * in-progress block
 * 
 * We have to do things in this roundabout way to have access to dispatch in a callback function,
 * see https://stackoverflow.com/questions/59456816/how-to-call-usedispatch-in-a-callback
 * @param dispatch A Redux dispatch function
 */
const updateTranscript = (dispatch: Dispatch) => (newFinalBlocks: Array<TranscriptBlock>, newInProgressBlock: TranscriptBlock): void => {
   console.log(`Updating transcript using these blocks: `, newFinalBlocks, newInProgressBlock)
   // batch makes these dispatches only cause one re-rendering
   batch(() => {
      for (const block of newFinalBlocks) {
         dispatch({type: "transcript/new_final_block", payload: block});
      }
      dispatch({type: 'transcript/update_in_progress_block', payload: newInProgressBlock});
   })
}

/**
 * Syncs up the recognizer with the API selection and listening status
 * - Creates new recognizer and stop old ones when API is changed
 * - Start / stop recognizer as listening changes
 * - Feed any phrase list updates to azure recognizer
 * 
 * @param recog
 * @param api 
 * @param control 
 * @param azure 
 * 
 * @return transcripts, resetTranscript, recogHandler
 */
export const useRecognition = (sRecog : SRecognition, api : ApiStatus, control : ControlStatus, azure : AzureStatus, streamTextConfig : StreamTextStatus) => {

   const [recognizer, setRecognizer] = useState<Recognizer>();
   // TODO: Add a reset button to utitlize resetTranscript
   // const [resetTranscript, setResetTranscript] = useState<() => string>(() => () => dispatch('RESET_TRANSCRIPT'));
   const dispatch = useDispatch();

   // Register service worker for whisper on launch 
   useEffect(() => {
      installCOIServiceWorker();
   }, [])

   // Change recognizer, if api changed
   useEffect(() => {
      console.log("UseRecognition, switching to new recognizer: ", api.currentApi);

      let newRecognizer: Recognizer | null;
      try{
         // Create new recognizer, and subscribe to its events
         newRecognizer = getRecognizer(api.currentApi, control, azure, streamTextConfig);
         newRecognizer.onTranscribed(updateTranscript(dispatch));
         setRecognizer(newRecognizer)

         // Start new recognizer if necessary
         if (control.listening) {
            console.log("UseRecognition, attempting to start recognizer after switching")
            newRecognizer.start()
         }
      } catch (e) {
         console.log("UseRecognition, failed to switch to new recognizer: ", e);
      }

      return () => {
         // Stop current recognizer when switching to another one, if possible
         newRecognizer?.stop();
      }
   }, [api.currentApi]);

   // Start / stop recognizer, if listening toggled
   useEffect(() => {
      if (!recognizer) { // whipser won't have recogHandler
         return;
      }
      if (control.listening) {
         console.log("UseRecognition, sending start signal to recognizer")
         recognizer.start();
      } else if (!control.listening) {
         console.log("UseRecognition, sending stop signal to recognizer")
         recognizer.stop();
      }
   }, [control.listening]);

   // Update domain phrases for azure recognizer
   useEffect(() => {
      console.log("UseRecognition, changing azure phrases", azure.phrases);
      if (api.currentApi === API.AZURE_TRANSLATION && recognizer) {
         (recognizer as AzureRecognizer).addPhrases(azure.phrases);
      }
   }, [azure.phrases]);

   // TODO: whisper's transcript is not in redux store but only in sessionStorage at the moment.
   let transcript : string = useSelector((state: RootState) => {
      return state.TranscriptReducer.transcripts[0].toString()
   });
   // if (api.currentApi === API.WHISPER) { 
   //    // TODO: inefficient to get it from sessionStorage everytime
   //    // TODO: add whisper_transcript to redux store after integrating "whisper" folder (containing stream.js) into ScribeAR
   //    transcript = sessionStorage.getItem('whisper_transcript') || '';
   //    return transcript;
   // }

   return transcript;
}
