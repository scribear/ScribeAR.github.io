import * as React from 'react';
import { useCallback, useMemo, useEffect } from 'react';
import { ControlStatus, ApiStatus, TextNode } from '../../../redux/types';

export const getSpeechRecognition = () => {
  if (!window || !(window as any).webkitSpeechRecognition) {
    throw new Error('Your browser does not support web speech recognition');
  }
  const speechRecognition = new (window as any).webkitSpeechRecognition();
  speechRecognition.continuous = true;
  speechRecognition.interimResults = true;
  return speechRecognition as SpeechRecognition;
};

export const useRecognition = (props) => {
  let transcript = ""
  let numb = 0;

  const [transcripts, setTranscripts] = React.useState<TextNode[]>([]);
  const [newTranscript, setNewTranscript] = React.useState<string>();

  const listen = useCallback(
    async (transcriptsFull: string, control: React.MutableRefObject<ControlStatus>,  currentAPI: React.MutableRefObject<ApiStatus>) =>
      new Promise((resolve, reject) => {
        var lastStartedAt = new Date().getTime();

        const speechRecognition = getSpeechRecognition();
        speechRecognition.onresult = (event: SpeechRecognitionEvent) => {
          if (control.current.listening == false || currentAPI.current.currentAPI != 0) {
              speechRecognition.stop()
              resolve(transcripts);   
          } else {
          if (event.results[numb].isFinal) {
            let yo = new Date().getMinutes()
            yo*=100
            let yo2 = new Date().getSeconds()
            yo+=yo2
            let node:TextNode = {
              time: yo,
              transcript: event.results[numb][0].transcript,
          }

            setTranscripts(transcripts => [...transcripts, node]);
            numb++ 
          }
          let currTranscript = ""
          for (let i = numb; event.results[i]; i++) {
            currTranscript+=event.results[i][0].transcript
          }
          setNewTranscript(currTranscript);
        }
        };
        // ends after 1000 milliseconds of no speaking. Will potentially reset our values
        speechRecognition.onend = () => { 
          var timeSinceStart = new Date().getTime() - lastStartedAt;
          if (control.current.listening && currentAPI.current.currentAPI === 0) {
            if (timeSinceStart > 1000) {
              console.log("hsi", transcript)
            speechRecognition.start()
            }
          } else {
            resolve(transcripts);   
          }
        
        }
         speechRecognition.start();
      }),
    [setTranscripts]
  );

  return useMemo(() => ({ transcripts, newTranscript, listen }), [transcripts, newTranscript]);
};