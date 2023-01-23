import React, { useCallback, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { ControlStatus, AzureStatus, ApiStatus, PhraseList } from '../../../react-redux&middleware/redux/typesImports';

import * as speechSDK from 'microsoft-cognitiveservices-speech-sdk';


/**
 * 
 * @param control 
 * @param azureStatus 
 * @param mic 
 * @returns 
 */
export const getAzureTranslRecog = async (control: ControlStatus, azureStatus: AzureStatus, mic : number = 0) => new Promise<speechSDK.TranslationRecognizer>((resolve, reject) => {  
  try {
    const speechConfig = speechSDK.SpeechTranslationConfig.fromSubscription(azureStatus.azureKey, azureStatus.azureRegion)
    speechConfig.speechRecognitionLanguage = control.speechLanguage.CountryCode;
    speechConfig.addTargetLanguage(control.textLanguage.CountryCode);
    // console.log("Speech: ", speechConfig.speechRecognitionLanguage, "; Text: ", speechConfig.targetLanguages);
    speechConfig.setProfanity(2);
    let recognizer
    if (mic === 0) {
      const audioConfig = speechSDK.AudioConfig.fromDefaultMicrophoneInput();
      const recognizer : speechSDK.TranslationRecognizer = new speechSDK.TranslationRecognizer(speechConfig, audioConfig);
      resolve(recognizer);
    } else {
      reject(`Custom Mic (${mic}) Not Implemented!`);
    }
  } catch (e : any) {
    const error_str : string = `Failed to Make Azure TranslationRecognizer, error: ${e}`;
    reject(error_str);
  }
});

/**
 * Used in Azuredropdown.tsx; return a TranslationRecognizer is no error
 * 
 * @param control type of ControlStatus
 * @param azure type of AzureStatus
 * @returns a TranslationRecognizer
 */
export const testAzureTranslRecog = async (control: ControlStatus, azure: AzureStatus) => new Promise<speechSDK.TranslationRecognizer>((resolve, reject) => {
  getAzureTranslRecog(control, azure).then((recognizer : speechSDK.TranslationRecognizer) => {
    try {
      recognizer.canceled = (s, e) => {
        console.log(`CANCELED: Reason=${e.reason}`);
        let error_str : string = `Did you update the subscription info?`;
        if (e.reason === speechSDK.CancellationReason.Error) {
          console.log(`CANCELED: ErrorCode=${e.errorCode}; ErrorDetails=${e.errorDetails}`);
          error_str = `${e.errorDetails}.\nDid you update the subscription info?`;
        }
        reject(error_str);
      };
      recognizer.sessionStarted = () => {
        resolve(recognizer);
      };
      recognizer.recognizeOnceAsync();
    } catch (e : any) {
      const error_str : string = `Failed to Add Callbacks to Azure TranslationRecognizer, error: ${e}`;
      reject(error_str);
    }
  }, (error_str : string) => {
    reject(error_str);
  });
});

/**
 * @param recognizer speechSDK.TranslationRecognizer
 * @returns [string[], recognizer, start function]
 */
export const useAzureTranslRecog = (recognizer : speechSDK.TranslationRecognizer) => {
  let transcript = "";
  const [azureTranscripts, setTranscripts] = React.useState<string[]>([]);
  const azureListen = useCallback(
    async (transcriptsFull: string, control: React.MutableRefObject<ControlStatus>, azureStatus: React.MutableRefObject<AzureStatus>, currentApi: React.MutableRefObject<ApiStatus>) =>
      new Promise<string>((resolve, reject) => {
        try {
          // add phrase list to recognizer
          let phraseList = speechSDK.PhraseListGrammar.fromRecognizer(recognizer);
          for (let i = 0; i < azureStatus.current.phrases.length; i++) {
            phraseList.addPhrase(azureStatus.current.phrases[i]);
          }
          
          const lastStartedAt = new Date().getTime();
          const textLanguage = control.current.textLanguage;
          if (control.current.listening == false || currentApi.current.currentApi != 1) {
            console.log("STOPPED AZURE RECOG");
            recognizer.stopContinuousRecognitionAsync();
            resolve(transcriptsFull);
          }
          let lastRecognized = "";
          recognizer.startContinuousRecognitionAsync();
          recognizer.recognizing = (s, e) => {
            if (control.current.listening == false || currentApi.current.currentApi != 1) {
              console.log("STOPPED");
              recognizer.stopContinuousRecognitionAsync();
              resolve(transcriptsFull);
            } else {
              transcript = lastRecognized + e.result.translations.get(textLanguage.CountryCode);
              setTranscripts([...azureTranscripts, transcript]);
              transcriptsFull = transcript;
            }
          };
          recognizer.recognized = (s, e) => {
            if (control.current.listening == false || currentApi.current.currentApi != 1) {
              recognizer.stopContinuousRecognitionAsync();
              resolve(transcriptsFull);
            } else {
              lastRecognized += e.result.translations.get(textLanguage.CountryCode) + " ";
              transcript = lastRecognized;
              setTranscripts([...azureTranscripts, transcript]);
              transcriptsFull = transcript;
            }
          };
          recognizer.sessionStarted = (s, e) => {
          }
          recognizer.sessionStopped = (s, e) => {
            const timeSinceStart = new Date().getTime() - lastStartedAt;
            if (control.current.listening == false || currentApi.current.currentApi != 1) {
              resolve(transcriptsFull);
            } else {
              if (timeSinceStart > 1000) {
                recognizer.startContinuousRecognitionAsync();
              }
            }
          }
        } catch (e) {
          const error_str : string = `Failed to Add Callbacks to Azure TranslationRecognizer, error: ${e}`;
          reject(error_str);
        }
      }),
    [setTranscripts]
  );
  return useMemo(() => ({ azureTranscripts, recognizer, azureListen }), [azureTranscripts]);
};