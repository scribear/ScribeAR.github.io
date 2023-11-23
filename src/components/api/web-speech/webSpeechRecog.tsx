import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import util from 'util';

import { makeEventBucket } from '../../../react-redux&middleware/react-middleware/thunkMiddleware';
import { 
   ControlStatus, ApiStatus, SRecognition,
   API, ApiType, STATUS, StatusType,
} from '../../../react-redux&middleware/redux/typesImports';


/**
 * Instantiates an async Webspeech recognizer using given parameters
 * The async recognizer recognizes continously, yields incomplete results, and is set to recognize the current language
 * 
 * @param {ControlStatus} control Global parameters of ScribeAR, see ControlStatus for more info 
 * @returns {Promise<SpeechRecognition>}
 */
export const getWebSpeechRecog = (control : ControlStatus) => new Promise<SpeechRecognition>((resolve, reject) => {
   try {
      if (!window || !(window as any).webkitSpeechRecognition) {
         reject('Your browser does not support web speech recognition');
      }
      const speechRecognition : SpeechRecognition = new (window as any).webkitSpeechRecognition();
      speechRecognition.continuous = true;
      speechRecognition.interimResults = true;
      speechRecognition.lang = control.speechLanguage.CountryCode;
      resolve(speechRecognition);
   } catch (e) {
      const error_str : string = `Failed to Make WebSpeech SpeechRecognition, error: ${e}`;
      reject(error_str);
   }
});

/**
 * Subscribing to Webspeech recognizer's incomplete result, complete result, start, and stop event
 * To dispatch transcript and status updates to the redux store 
 * 
 * Assume control.listening=true and api=API.WEBSPEECH. (Why?)
 * 
 * @param {SpeechRecognition} recognizer Webspeech recognizer to subscribe to
 * @param {React.Dispatch} dispatch 
 * @return {Promise<void>}
 */
export const useWebSpeechRecog = (recognizer : SpeechRecognition, dispatch : React.Dispatch<any>) => new Promise<void>((resolve, reject) => {
   // Webspeech also recognizes speech in "paragraphs," defined as continuous speech with short pauses.
   // When it detects a long enough pause, it stops the current paragraph and starts a new paragraph
   try {
      recognizer.onresult = (event: SpeechRecognitionEvent) => {
         // Signals that more transcript is available
         // Event.results is a list of transcripts, each corresponding to a paragraph
         console.log(`WebSpeech, onresult`, event.results);
         const eventBucketThunk = makeEventBucket({ stream: 'html5', value: event.results });
         dispatch(eventBucketThunk);
      };
      recognizer.onend = (event: any) => { 
         // Signals that the recognizer has stopped accepting and processing speech
         console.log(`WebSpeech, onend, event: ${JSON.stringify(event)}`);
         dispatch({ type: 'transcript/end' });
         dispatch({ type: 'sRecog/set_status', payload: {status: STATUS.ENDED} });
      }
      recognizer.onspeechstart = (event: any) => {
         // Signals that speech is detected and being processed
         console.log(`WebSpeech, onspeechstart, event: ${JSON.stringify(event)}`);
      }
      recognizer.onspeechend = (event: any) => {
         // Signals that speech has ended (How is this determined? Long pause?)
         console.log(`WebSpeech, onspeechend, event: ${JSON.stringify(event)}`);
      }
      recognizer.onstart = (event: any) => {
         // Signals that the recognizer has started accepting and processing speech
         console.log(`WebSpeech, onstart, event: ${JSON.stringify(event)}`);
         dispatch({ type: 'sRecog/set_status', payload: {status: STATUS.TRANSCRIBING} });
      }
      recognizer.onerror = (event: SpeechRecognitionErrorEvent) => {
         // Signals that the recognizer has encountered an error of some kind
         console.log(`WebSpeech, onerror, event: ${JSON.stringify(event)}`);
         if (event.error !== 'no-speech') {
            console.log('error not no-speech');
            dispatch({ type: 'transcript/end' });
            dispatch({ type: 'sRecog/set_status', payload: {status: STATUS.ERROR} });
         }
      }
      resolve();
   } catch (e) {
      const error_str : string = `Failed to Add Callbacks to WebSpeech SpeechRecognition, error: ${e}`;
      reject(error_str);
   };
})
