import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
   DisplayStatus, AzureStatus, ControlStatus, 
   ApiStatus, SRecognition, Transcript,
   ScribeRecognizer, ScribeHandler, } from '../../react-redux&middleware/redux/typesImports';
import { API, STATUS } from '../../react-redux&middleware/redux/enumsImports';
import { RootState } from '../../store';

import * as sdk from 'microsoft-cognitiveservices-speech-sdk'
import  { getWebSpeechRecog, useWebSpeechRecog } from './web-speech/webSpeechRecog';
import { getAzureTranslRecog, testAzureTranslRecog, useAzureTranslRecog } from './azure/azureTranslRecog';
import { ControlPointOutlined } from '@material-ui/icons';


// controls what api to send and what to do when error handling.

// NOTES: this needs to do everything I think. Handler should be returned which allows
//        event call like stop and the event should be returned... (maybe the recognition? idk.)

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

// /**
//  * Functions for controlling each API as they will be saved to this file.
//  * 
//  * @param currentApi 
//  * @returns a handler function for the recognizer
//  */
// export const getHandler = (currentApi : number, recognizer : ScribeRecognizer) : ScribeHandler => {
//    if (currentApi === API.WEBSPEECH) { // webspeech
//       return useCallback((action) => {
//          recognizer = recognizer as SpeechRecognition;
//          switch (action.type) {
//          case 'STOP':
//             recognizer!.stop()
//             break
//          case 'START':
//             recognizer!.start()
//             break
//          case 'ABORT':
//             recognizer!.abort()
//             break
//          case 'CHANGE_LANGUAGE':
//             recognizer.lang = action.payload
//             break
//          default:
//             return "poggers";
//          }
//       }, [])
//    } else if (currentApi === API.AZURE_TRANSLATION) { // azure TranslationRecognizer
//       return useCallback((action) => {
//          recognizer = recognizer as sdk.TranslationRecognizer;
//          switch (action.type) {
//          case 'STOP':
//             recognizer!.stopContinuousRecognitionAsync()
//             break
//          case 'START':
//             recognizer!.startContinuousRecognitionAsync()
//             break
//          case 'ABORT':
//             recognizer!.close()
//             break
//          case 'CHANGE_LANGUAGE':
//             recognizer!.addTargetLanguage(action.payload)
//             break
//          default:
//                return "poggers";
//          }    
//       }, [])
//    } else if (currentApi === API.AZURE_CONVERSATION) { // azure ConversationRecognizer
//       throw new Error("Handler for ConversationTranscriber Not implemented");
//    }
//    else {
//       throw new Error(`Unexpcted API: ${currentApi}`);
//    }
// }

/**
 * Functions for controlling each API as they will be saved to this file.
 * 
 * @param currentApi 
 * @returns a handler function for the recognizer
 */
 export const getHandler = (currentApi : number, recognizer : ScribeRecognizer) : ScribeHandler => {
   if (currentApi === API.WEBSPEECH) { // webspeech
      return (action) => {
         console.log(103, recognizer, action);
         recognizer = recognizer as SpeechRecognition;
         switch (action.type) {
         case 'STOP':
            recognizer!.stop()
            break
         case 'START':
            recognizer!.start()
            break
         case 'ABORT':
            recognizer!.abort()
            break
         case 'CHANGE_LANGUAGE':
            recognizer.lang = action.payload
            break
         default:
            return "poggers";
         }
      }
   } else if (currentApi === API.AZURE_TRANSLATION) { // azure TranslationRecognizer
      return (action) => {
         recognizer = recognizer as sdk.TranslationRecognizer;
         switch (action.type) {
         case 'STOP':
            recognizer!.stopContinuousRecognitionAsync()
            break
         case 'START':
            recognizer!.startContinuousRecognitionAsync()
            break
         case 'ABORT':
            recognizer!.close()
            break
         case 'CHANGE_LANGUAGE':
            recognizer!.addTargetLanguage(action.payload)
            break
         default:
               return "poggers";
         }    
      }
   } else if (currentApi === API.AZURE_CONVERSATION) { // azure ConversationRecognizer
      throw new Error("Handler for ConversationTranscriber Not implemented");
   }
   else {
      throw new Error(`Unexpcted API: ${currentApi}`);
   }
}





// export const testRecognition = (control: ControlStatus, azure: AzureStatus, currentApi: number) => {
//     if (currentApi == 0) { // webspeech
//         // return getWebSpeechRecognition();
//         throw new Error("Not implemented");
//     } else if (currentApi == 1) { // azure translation
//         testAzureTranslRecog(control, azure).then((result) => {
//             console.log(result);
//         });

//         // getAzureTranslRecog(control, azure).then((recognizer : sdk.TranslationRecognizer) => {
//         //     testAzureTranslRecog(recognizer);
//         // }, (error_str : string) => {
//         //     reject(error_str);
//         // });
//     } else {
//         throw(`Unexpcted API: ${currentApi}`);
//     }
// }

export const getRecognition = (currentApi: number, control: ControlStatus, azure: AzureStatus) => {

   // https://reactjs.org/docs/hooks-reference.html#usecallback
   // quote: "useCallback(fn, deps) is equivalent to useMemo(() => fn, deps)."

   if (currentApi === API.WEBSPEECH) { // webspeech recognition
      return getWebSpeechRecog(control);
      // return useMemo(() => getWebSpeechRecog(control), []);
   } else if (currentApi === API.AZURE_TRANSLATION) { // azure TranslationRecognizer
      return getAzureTranslRecog(control, azure);
      // return useMemo(() => getAzureTranslRecog(control, azure), []);
   } else if (currentApi === API.AZURE_CONVERSATION) { // azure ConversationTranscriber
      throw new Error("Not implemented");
   } else {
      throw new Error(`Unexpcted API_CODE: ${currentApi}`);
      // return useMemo(() => getWebSpeechRecog(control), []);
   }
}

export const makeRecognition = (currentApi: number) => {
   if (currentApi === 0) { // webspeech recognition event controller
      return { useWebSpeechRecog };
   } else if (currentApi === 1) { // azure recognition event controller
      return { useAzureTranslRecog };
   } else {
      throw new Error(`Unexpcted API_CODE: ${currentApi}`);
   }
}

// /**
//  * 
//  * @param currentApi 
//  * @returns a hook that returns {transcript, resetTranscript}
//  */
// export const useRecognition = (currentApi: number) => {
//    if (currentApi === 0) { // webspeech recognition event controller
//       return { useWebSpeechRecog };
//    } else if (currentApi === 1) { // azure recognition event controller
//       return { useAzureTranslRecog };
//    } else {
//       throw new Error(`Unexpcted API_CODE: ${currentApi}`);
//    }
// }

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


   let recognizer : ScribeRecognizer = sRecog.recognizer;
   const [sRecognizer, setSRecognizer] = useState<ScribeRecognizer>();
   const [recogHandler, setRecogHandler] = useState<ScribeHandler>(() => getHandler(api.currentApi, recognizer));
   const [reseatTranscript, setResetTranscript] = useState<() => string>(() => () => dispatch('RESET_TRANSCRIPT'));
   const dispatch = useDispatch();


   useEffect(() => {
      getRecognition(api.currentApi, control, azure).then((result : ScribeRecognizer) => {
         setSRecognizer(result);
         setRecogHandler(() => getHandler(api.currentApi, result));
         copy_sRecog.recognizer = result;
         copy_sRecog.status = STATUS.AVAILABLE;
         copy_sRecog.api = api.currentApi;
         dispatch({ type: 'SET_RECOG', payload: copy_sRecog }); // only dispatch if it is fullfilled
      }, (error_str : string) => {
         console.log(error_str);
      });
      // setRecogHandler(() => getHandler(api.currentApi, recognizer));
   }, [api.currentApi]);

   useEffect(() => {
      if (control.listening) {
         recogHandler('START');
      } else if (!control.listening) {
         recogHandler('STOP');
      }
   }, [control.listening]);

   useEffect(() => {
      // change handler
      setRecogHandler(() => getHandler(api.currentApi, sRecognizer!));

      console.log('recog changed', (sRecog.status === STATUS.NULL), (sRecog.status === STATUS.AVAILABLE), (control.listening));
      if (sRecog.status === STATUS.AVAILABLE && control.listening) {
         console.log(259, 'start recognition');
         recogHandler('START');
         dispatch({ type: 'sRecog/set_status', payload: STATUS.INPROGRESS });
      }
   }, [sRecognizer]);


   let copy_sRecog : SRecognition = Object.assign({}, sRecog);


   if (sRecog.status === STATUS.NULL) { // initialize recognizer
      if (recognizer !== null) throw new Error("recognizer is not null");
      // console.log('recognizer null, initialize it');

      getRecognition(api.currentApi, control, azure).then((result : ScribeRecognizer) => {
         setSRecognizer(result);
         // recognizer = result;
         copy_sRecog.recognizer = result;
         copy_sRecog.status = STATUS.AVAILABLE;
         copy_sRecog.api = api.currentApi;
         dispatch({ type: 'SET_RECOG', payload: copy_sRecog }); // only dispatch if it is fullfilled
      }, (error_str : string) => {
         console.log(error_str);
      });
   }



   const transcript : string = useSelector((state: RootState) => {
      const fullTranscript : string = state.TranscriptReducer.previousTranscript[0] 
                                       + ' ' + state.TranscriptReducer.currentTranscript[0];
      return fullTranscript;
   });






   return {transcript};
}
