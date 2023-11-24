import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { 
   DisplayStatus, AzureStatus, ControlStatus, 
   ApiStatus, SRecognition,
   ScribeRecognizer, ScribeHandler, } from '../../react-redux&middleware/redux/typesImports';
import { API, ApiType, STATUS, StatusType } from '../../react-redux&middleware/redux/typesImports';
import { RootState } from '../../store';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk'

import  { getWebSpeechRecog, useWebSpeechRecog } from './web-speech/webSpeechRecog';
import { getAzureTranslRecog, testAzureTranslRecog, useAzureTranslRecog } from './azure/azureTranslRecog';
import { loadTokenizer } from '../../ml/bert_tokenizer';

import { intent_inference } from '../../ml/inference';
import { TranscriptReducer } from '../../react-redux&middleware/redux/reducers/transcriptReducers';
import { Recognizer } from './recognizer';
import { AzureRecognizer } from './azure/azureRecognizer';
import { TranscriptBlock } from '../../react-redux&middleware/redux/types/TranscriptTypes';
import { Dispatch } from 'redux';


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

/**
 * 
 * @param recognition 
 * @returns 
 */
const makeWebSpeechHandler = (recognition : ScribeRecognizer) : ScribeHandler => {
   const handler : ScribeHandler = (action) => {
      try {
         // console.log(103, recognition, action);
         recognition = recognition as SpeechRecognition;
         switch (action.type) {
            case 'STOP':
               recognition!.stop();
               break
            case 'START':
               recognition!.start();
               break
            case 'ABORT':
               recognition!.abort();
               break
            case 'CHANGE_LANGUAGE':
               recognition.lang = action.payload!;
               break
            default:
               return "poggers";
         }
      } catch (e : any) {
         console.log(`While trying to ${action.type} WebSpeech, an error occurred`, e);
      }
   }
   return handler;
}

const getRecognition = (currentApi: number, control: ControlStatus, azure: AzureStatus) => {
   // https://reactjs.org/docs/hooks-reference.html#usecallback
   // quote: "useCallback(fn, deps) is equivalent to useMemo(() => fn, deps)."

   if (currentApi === API.WEBSPEECH) { // webspeech recognition
      return getWebSpeechRecog(control);
      // return useMemo(() => getWebSpeechRecog(control), []);
   } else if (currentApi === API.AZURE_TRANSLATION) { // azure TranslationRecognizer
      return getAzureTranslRecog(control, azure);
      // return useMemo(() => getAzureTranslRecog(control, azure), []);
   } 
   else if (currentApi === API.AZURE_CONVERSATION) { // azure ConversationTranscriber
      throw new Error("Not implemented");
   } else {
      throw new Error(`Unexpcted API_CODE: ${currentApi}`);
      // return useMemo(() => getWebSpeechRecog(control), []);
   }
}

const getRecognizer = (currentApi: number, control: ControlStatus, azure: AzureStatus): Recognizer => {

   if (currentApi === API.WEBSPEECH) {
      // TODO
      throw new Error("Not implemented");
   } else if (currentApi === API.AZURE_TRANSLATION) {
      return new AzureRecognizer(null, control.speechLanguage.CountryCode, azure)
   } 
   else if (currentApi === API.AZURE_CONVERSATION) {
      throw new Error("Not implemented");
   } else {
      throw new Error(`Unexpcted API_CODE: ${currentApi}`);
   }
}

/**
 * Connect the recognizer to the event handler
 * @param currentApi 
 * @param recognizer 
 * @returns Promsie<ScribeHandler>
 */
const runRecognition = (currentApi: number, recognizer : ScribeRecognizer, dispatch : React.Dispatch<any>) => new Promise<ScribeHandler>((resolve, reject) => {
   if (currentApi === API.WEBSPEECH) { // webspeech recognition event controller
      useWebSpeechRecog(recognizer as SpeechRecognition, dispatch)
         .then(() => {
            resolve(makeWebSpeechHandler(recognizer));            
         })
         .catch((error_str : string) => {
            reject(error_str);
         });
   } else if (currentApi === API.AZURE_TRANSLATION) { // azure recognition event controller
      useAzureTranslRecog(recognizer as sdk.TranslationRecognizer, dispatch)
         .then(() => {
            console.log(163, 'Azure recog initiated');
            resolve(makeAzureTranslHandler(recognizer));
         })
         .catch((error_str : string) => {
            console.log(167, error_str);
            reject(error_str);
         });
   } else {
      reject(`Unexpcted API_CODE: ${currentApi}`);
   }
});

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
 * Called when the compoenent rerender.
 * Check current state, setup/start the recognizer if needed.
 * Always return the full transcripts, a function to reset the transcript,
 * and a function to change/handle recognizer (called in useEffect; when a api/listening change happens.).
 * 
 * Possible permutations of [ApiStatus, SRecognition, AzureStatus, ControlStatus]:
 * change can be monitored using useEffect or useCallback.
 * 1. first time call (recogStatus === null)
 *    - listening=false -> do nothing
 *    - listening=true -> start recognizer
 * 2. api change (called within a useEffect)
 *    - change recognizer and recogHandler, keep listening the same
 * 3. only listening change (called within a useEffect)
 *   - stop/pause recognizer
 * 
 * @param recog
 * @param api 
 * @param control 
 * @param azure 
 * 
 * @return transcripts, resetTranscript, recogHandler
 */
export const useRecognition = (sRecog : SRecognition, api : ApiStatus, control : ControlStatus, azure : AzureStatus) => {


   const [recognizer, setRecognizer] = useState<Recognizer>();
   // TODO: Add a reset button to utitlize resetTranscript
   // const [resetTranscript, setResetTranscript] = useState<() => string>(() => () => dispatch('RESET_TRANSCRIPT'));
   const [lastChangeApiTime, setLastChangeApiTime] = useState<number>(Date.now());
   const dispatch = useDispatch();

   // Change recognizer, if api changed
   // TODO: currently we store the recognizer to redux, but never use it.
   useEffect(() => {
      // Stop existing recognizer
      if (recognizer) recognizer.stop();
      try{
         // Create new recognizer, and subscribe to its events
         let newRecognizer = getRecognizer(api.currentApi, control, azure);
         newRecognizer.onTranscribed(updateTranscript(dispatch));
         setRecognizer(newRecognizer)
      } catch (e) {
         console.log("UseRecognition, failed to get new recognizer: ", e);
      }
      // Start new recognizer if necessary
      if (control.listening) recognizer?.start()
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

   // Webspeech recognizer stops itself after not detecting speech for a while, needs to be restarted
   // restart recognizer, if status not ERROR
   // useEffect(() => {
   //    if (!recogHandler) { // whipser won't have recogHandler
   //       return;
   //    }
   //    // console.log('change recog status: ', sRecog.status);
   //    if (sRecog.status === STATUS.ENDED) {
   //       const curTime = Date.now();
   //       const timeSinceStart = curTime - lastChangeApiTime;
   //       // console.log(curTime, timeSinceStart);
   //       if (timeSinceStart > 1000 && control.listening) {
   //          // console.log(timeSinceStart, control.listening);
   //          if (recogHandler) recogHandler({type: 'START'});
   //          setLastChangeApiTime(curTime);
   //       }
   //    } else if (sRecog.status === STATUS.ERROR) {
   //       if (recogHandler) recogHandler({type: 'STOP'});
   //    }
   // }, [sRecog.status]);

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
   if (api.currentApi === API.WHISPER) { 
      // TODO: inefficient to get it from sessionStorage everytime
      // TODO: add whisper_transcript to redux store after integrating "whisper" folder (containing stream.js) into ScribeAR
      transcript = sessionStorage.getItem('whisper_transcript') || '';
      return transcript;
   }

   return transcript;
}
