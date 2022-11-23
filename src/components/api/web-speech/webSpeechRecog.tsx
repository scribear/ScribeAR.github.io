import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { ControlStatus, ApiStatus } from '../../../react-redux&middleware/redux/types';
import { useDispatch } from 'react-redux';
import { makeEventBucket } from '../../../react-redux&middleware/react-middleware/thunkMiddleware';


export const getWebSpeechRecog = (control : ControlStatus) => new Promise<SpeechRecognition> ((resolve, reject) => {
  try {
    if (!window || !(window as any).webkitSpeechRecognition) {
      throw new Error('Your browser does not support web speech recognition');
    }
    const speechRecognition : SpeechRecognition = new (window as any).webkitSpeechRecognition();
    console.log(typeof speechRecognition);
    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.lang = control.speechLanguage.CountryCode;
    // speechRecognition.lang = 'pl-PL';
    resolve(speechRecognition);
  } catch (e) {
    const error_str : string = `Failed to Make WebSpeech SpeechRecognition, error: ${e}`;
    reject(error_str);
  }
});

export const useWebSpeechRecog = (speechRecognition : SpeechRecognition) => {
  const dispatch = useDispatch();
  let transcript="";
  const [transcripts, setTranscripts] = React.useState<string[]>([]);
  const listen = useCallback(
    async (transcriptsFull: string, control: React.MutableRefObject<ControlStatus>,  currentAPI: React.MutableRefObject<ApiStatus>) =>
      new Promise((resolve, reject) => {
        try {
          const lastStartedAt = new Date().getTime();
          speechRecognition.onresult = (event: SpeechRecognitionEvent) => {
            if (control.current.listening == false || currentAPI.current.currentAPI != 0) {
              speechRecognition.stop()
              resolve(transcriptsFull);
            } else {
              // console.log(event.results);
              const makeEventBucketThunk = makeEventBucket({stream: 'html5', value: event.results});
              dispatch(makeEventBucketThunk);
              const finalResult = Array.from(event.results)
              .map(result => result[0])
              .map(result => result.transcript)
              .join('');
              transcript = finalResult;

              if (event.results[0].isFinal) {
                console.log(finalResult);
              }    
              setTranscripts([...transcripts, transcript]);
              transcriptsFull = transcript;
            }
          };
    
          speechRecognition.onend = () => { 
            const timeSinceStart = new Date().getTime() - lastStartedAt;
            if (control.current.listening && currentAPI.current.currentAPI === 0) {
              if (timeSinceStart > 1000) {
                speechRecognition.start();
              }
            } else {
              resolve(transcriptsFull);   
            }
          }

          speechRecognition.start();
        } catch (e) {
          const error_str : string = `Failed to Add Callbacks to WebSpeech SpeechRecognition, error: ${e}`;
          reject(error_str);
        }
      }),
    [setTranscripts]
  );

  return useMemo(() => ({ transcripts, speechRecognition, listen }), [transcripts]);
};