import React, { useCallback, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { ControlStatus, AzureStatus, ApiStatus, PhraseList } from '../../../react-redux&middleware/redux/types';

import * as speechSDK from 'microsoft-cognitiveservices-speech-sdk';

export const testAzure = (azure : AzureStatus, control : ControlStatus, mic : number = 0) => new Promise((resolve, reject) => {
  try {
    const speechConfig = speechSDK.SpeechTranslationConfig.fromSubscription(azure.azureKey, azure.azureRegion);
    speechConfig.speechRecognitionLanguage = control.speechLanguage.CountryCode;
    speechConfig.addTargetLanguage(control.textLanguage.CountryCode);
    let audioConfig : speechSDK.AudioConfig;
    if (mic === 0) {
      audioConfig = speechSDK.AudioConfig.fromDefaultMicrophoneInput();
    } else {
      throw("Custom Mic Not Implemented!");
    }
    const recognizer = new speechSDK.TranslationRecognizer(speechConfig, audioConfig);
    recognizer.recognized = () => {
      // if (e.result.reason === speechSDK.ResultReason.RecognizedSpeech) {
      //   console.log(`RECOGNIZED: Text=${e.result.text}`);
      // } else if (e.result.reason === speechSDK.ResultReason.NoMatch) {
      //   console.log('NOMATCH: Speech could not be recognized.');
      // }
      resolve(true);
    };
    recognizer.canceled = () => {
      // console.log(`CANCELED: Reason=${e.reason}`);
      // if (e.reason === speechSDK.CancellationReason.Error) {
      //   console.log(`"CANCELED: ErrorCode=${e.errorCode}`);
      //   console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`);
      //   console.log('CANCELED: Did you update the subscription info?');
      // }
      resolve(false);
    };
    // recognizer.sessionStopped = (s, e) => {
    //   console.log('\n    Session stopped event.');
    //   resolve(false);
    // };
    recognizer.sessionStarted = () => {
      resolve(true);
    };
    recognizer.recognizeOnceAsync();
  } catch (e) {
    console.log(e);
    reject(e);
  }
});

export const GetuseAzureTranslRecog = () => {
  const pog = "hi"
  const test = useCallback(
    async (control: ControlStatus, azureStatus: AzureStatus) => new Promise((resolve, reject) => {
      try {
        let azureSpeech = speechSDK.SpeechTranslationConfig.fromSubscription(azureStatus.azureKey, azureStatus.azureRegion)
        azureSpeech.speechRecognitionLanguage = control.speechLanguage.CountryCode;
        azureSpeech.addTargetLanguage(control.textLanguage.CountryCode)
        let azureAudioConfig = speechSDK.AudioConfig.fromDefaultMicrophoneInput();
        let reco = new speechSDK.TranslationRecognizer(azureSpeech, azureAudioConfig);
        reco.canceled = () => {
          resolve(false);
        }
        reco.sessionStarted = () => {
          resolve(true);
        }
        reco.recognizeOnceAsync();
      } catch (error) {
        resolve(false)
      }
    }),
    [pog]
  )
  return useMemo(() => ({ pog, test }), [pog]);
};

export const getAzureTranslRecog = async (control: ControlStatus, azureStatus: AzureStatus) => new Promise((resolve, reject) => {
  let speechConfig = speechSDK.SpeechTranslationConfig.fromSubscription(azureStatus.azureKey, azureStatus.azureRegion)
  speechConfig.speechRecognitionLanguage = control.speechLanguage.CountryCode;
  speechConfig.addTargetLanguage(control.textLanguage.CountryCode)
  let audioConfig = speechSDK.AudioConfig.fromDefaultMicrophoneInput();
  let reco = new speechSDK.TranslationRecognizer(speechConfig, audioConfig);
  reco.canceled = () => {
    resolve(false);
  }
  reco.sessionStarted = () => {
    resolve(reco);
  }
  reco.recognizeOnceAsync();
})

export const useAzureTranslRecog = () => {
  // const controlStatus = useSelector((state: RootState) => {
  //   return state.ControlReducer as ControlStatus;
  // })
  let transcript = ""
  const [azureTranscripts, setTranscripts] = React.useState<string[]>([]);
  // const [stopThis] = React.useState<Function>()
  const azureListen = useCallback(
    async (transcriptsFull: string, control: React.MutableRefObject<ControlStatus>, azureStatus: React.MutableRefObject<AzureStatus>, currentAPI: React.MutableRefObject<ApiStatus>) =>
      new Promise((resolve, reject) => {
        try {
          let STOPAW = false;
          let lastStartedAt = new Date().getTime();
          let textLanguage = control.current.textLanguage
          let azureSpeech = speechSDK.SpeechTranslationConfig.fromSubscription(azureStatus.current.azureKey, azureStatus.current.azureRegion)
          azureSpeech.speechRecognitionLanguage = control.current.speechLanguage.CountryCode;
          azureSpeech.addTargetLanguage(control.current.textLanguage.CountryCode)
          console.log("Speech: ", azureSpeech.speechRecognitionLanguage, "; Text: ", azureSpeech.targetLanguages);
          azureSpeech.setProfanity(2);
          
          let azureAudioConfig = speechSDK.AudioConfig.fromDefaultMicrophoneInput();
          let speechRecognition = new speechSDK.TranslationRecognizer(azureSpeech, azureAudioConfig);
          let phraseList = speechSDK.PhraseListGrammar.fromRecognizer(speechRecognition)
          for (let i = 0; i < azureStatus.current.phrases.length; i++) {
            phraseList.addPhrase(azureStatus.current.phrases[i])

          }
          if (control.current.listening == false || currentAPI.current.currentAPI != 1) {
            console.log("STOPPED AZURE RECOG");
            
            speechRecognition.stopContinuousRecognitionAsync();
            STOPAW = true;
            resolve(transcriptsFull);
          }
          let lastRecognized = ""
          speechRecognition.startContinuousRecognitionAsync();
          speechRecognition.recognizing = (s, e) => {
            if (control.current.listening == false || currentAPI.current.currentAPI != 1) {
              console.log("STOPPED")
              speechRecognition.stopContinuousRecognitionAsync()
              resolve(transcriptsFull);
            } else {
              transcript = lastRecognized + e.result.translations.get(textLanguage.CountryCode);
              setTranscripts([...azureTranscripts, transcript]);
              transcriptsFull = transcript
            }
          };
          speechRecognition.recognized = (s, e) => {
            if (control.current.listening == false || currentAPI.current.currentAPI != 1) {
              speechRecognition.stopContinuousRecognitionAsync()
              resolve(transcriptsFull);
            } else {
              lastRecognized += e.result.translations.get(textLanguage.CountryCode) + " ";
              transcript = lastRecognized
              setTranscripts([...azureTranscripts, transcript]);
              transcriptsFull = transcript
            }
          };
          speechRecognition.sessionStarted = (s, e) => {
            STOPAW = false;
          }
          speechRecognition.sessionStopped = (s, e) => {
            const timeSinceStart = new Date().getTime() - lastStartedAt;
            if (STOPAW == true || control.current.listening == false || currentAPI.current.currentAPI != 1) {
              resolve(transcriptsFull);
            } else if (timeSinceStart > 1000) {
              speechRecognition.startContinuousRecognitionAsync()
            }
          }
          // const stopThis = () => {
          //   speechRecognition.stopContinuousRecognitionAsync()
          //   STOPAW = true;
          // }
        } catch (error) {
          resolve(false)
        }
      }),
    [setTranscripts]
  );
  return useMemo(() => ({ azureTranscripts, azureListen }), [azureTranscripts]);
};