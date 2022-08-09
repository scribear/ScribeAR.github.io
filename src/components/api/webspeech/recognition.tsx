import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { ControlStatus, ApiStatus } from '../../../redux/types';

export const getSpeechRecognition = () => {
  if (!window || !(window as any).webkitSpeechRecognition) {
    throw new Error('Your browser does not support web speech recognition');
  }
  const speechRecognition = new (window as any).webkitSpeechRecognition();
  speechRecognition.continuous = true;
  speechRecognition.interimResults = true;
  // speechRecognition.lang = 'pl-PL';
  return speechRecognition as SpeechRecognition;
};

export const useRecognition = (speechRecognition: SpeechRecognition) => {
  var transcript=""
  var finalTranscript=""
  const [transcripts, setTranscripts] = React.useState<string[]>([]);
  const listen = useCallback(

    async (transcriptsFull: string, control: React.MutableRefObject<ControlStatus>,  currentAPI: React.MutableRefObject<ApiStatus>) =>
      new Promise((resolve, reject) => {
        var lastStartedAt = new Date().getTime();
        speechRecognition.onstart = () => {
          console.log("STARETD")
        }
        speechRecognition.onresult = (event: SpeechRecognitionEvent) => {
          if (control.current.listening == false || currentAPI.current.currentAPI != 0) {
              speechRecognition.stop()
              resolve(transcriptsFull);
          } else {
          const finalResult = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
          transcript =  finalResult;

          if (event.results[0].isFinal) {
            console.log(finalResult)

          }    
          setTranscripts([...transcripts, transcript]);
          transcriptsFull = transcript
        }
        };
  
        speechRecognition.onend = () => { 
          console.log("ENDED")

            resolve(transcriptsFull);   
        
        }
      }),
    [setTranscripts]
  );

  return useMemo(() => ({ transcripts, listen }), [transcripts]);
};