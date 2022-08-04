import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { ControlStatus, ApiStatus } from '../../../redux/types';

export const GetSpeechRecognition = (control: ControlStatus) => {
  if (!window || !(window as any).webkitSpeechRecognition) {
    throw new Error('Your browser does not support web speech recognition');
  }
  const speechRecognition = new (window as any).webkitSpeechRecognition();
  speechRecognition.continuous = true;
  speechRecognition.interimResults = true;
  speechRecognition.lang = 'hr-HR';
  return speechRecognition as SpeechRecognition;
};

const language = {
  'French': 'FR',
  'German': 'DE',
  'English': 'EN',
  'Spanish': 'ES',
  'Hindi': 'IN',
}

export const useRecognition = () => {
  var transcript=""
  var finalTranscript=""
  const [transcripts, setTranscripts] = React.useState<string[]>([]);
  let k = useSelector((state: RootState) => state.ControlReducer as ControlStatus);
  // React.useEffect(() => {
  //   console.log(`k changed to be (${k.textLanguage.label}) ${k.textLanguage.CountryCode}-${language[k.textLanguage.label]}`);
  // }, [k]);
  for (let i = 0; i < 10000000; i++) {
    console.log(`k changed to be (${k.textLanguage.label}) ${k.textLanguage.CountryCode}-${language[k.textLanguage.label]}`);
  }
  const speechRecognition = GetSpeechRecognition(k);
  React.useEffect(() => {
    speechRecognition.lang = `${k.textLanguage.label}-${language[k.textLanguage.label]}`;
  }, [k]);
  const listen = useCallback(
  

    async (transcriptsFull: string, control: React.MutableRefObject<ControlStatus>,  currentAPI: React.MutableRefObject<ApiStatus>) =>
      new Promise((resolve, reject) => {
        var lastStartedAt = new Date().getTime();
        console.log(`Yoo ${k.textLanguage.label}-${k.textLanguage.CountryCode}`);
        speechRecognition.onresult = (event: SpeechRecognitionEvent) => {
          if (control.current.listening == false || currentAPI.current.currentAPI != 0) {
              speechRecognition.stop()
              resolve(transcriptsFull);   
          } else {
            console.log(event.results)
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
          var timeSinceStart = new Date().getTime() - lastStartedAt;
          if (control.current.listening && currentAPI.current.currentAPI === 0) {
            if (timeSinceStart > 1000) {

            speechRecognition.start()
            }
          } else {
            resolve(transcriptsFull);   
          }
        
        }
         speechRecognition.start();
      }),
    [setTranscripts]
  );

  return useMemo(() => ({ transcripts, listen }), [transcripts]);
};