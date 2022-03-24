import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { ControlStatus, AzureStatus, ApiStatus, PhraseList } from '../../../redux/types';
import * as speechSDK from 'microsoft-cognitiveservices-speech-sdk'
export const GetAzureRecognition = () => {
  const pog = "hi"
  const test = useCallback(
    async (control: ControlStatus, azureStatus: AzureStatus) => new Promise((resolve, reject) => {
      try {
        let azureSpeech = speechSDK.SpeechTranslationConfig.fromSubscription(azureStatus.azureKey, azureStatus.azureRegion)
        azureSpeech.speechRecognitionLanguage = control.speechLanguage;
        azureSpeech.addTargetLanguage(control.textLanguage)
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

export const AzureRecognition = () => {
  var transcript = ""
  const [azureTranscripts, setTranscripts] = React.useState<string[]>([]);
  const azureListen = useCallback(
    async (transcriptsFull: string, control: React.MutableRefObject<ControlStatus>, azureStatus: React.MutableRefObject<AzureStatus>, currentAPI: React.MutableRefObject<ApiStatus>) =>
      new Promise((resolve, reject) => {
        try {
          var lastStartedAt = new Date().getTime();
          let textLanguage = control.current.textLanguage
          let azureSpeech = speechSDK.SpeechTranslationConfig.fromSubscription(azureStatus.current.azureKey, azureStatus.current.azureRegion)
          azureSpeech.speechRecognitionLanguage = control.current.speechLanguage;
          azureSpeech.addTargetLanguage(control.current.textLanguage)
          azureSpeech.setProfanity(2);
          
          let azureAudioConfig = speechSDK.AudioConfig.fromDefaultMicrophoneInput();
          let speechRecognition = new speechSDK.TranslationRecognizer(azureSpeech, azureAudioConfig);
          let phraseList = speechSDK.PhraseListGrammar.fromRecognizer(speechRecognition)
          console.log(azureStatus.current.phrases[0])
          for (let i = 0; i < azureStatus.current.phrases.length; i++) {
            phraseList.addPhrase(azureStatus.current.phrases[i])
            console.log(azureStatus.current.phrases[i])

          }
          
          let lastRecognized = ""
          speechRecognition.startContinuousRecognitionAsync();
          speechRecognition.recognizing = (s, e) => {
            if (control.current.listening == false || currentAPI.current.currentAPI != 1) {
              speechRecognition.stopContinuousRecognitionAsync()
              resolve(transcriptsFull);
            } else {
              
              transcript = lastRecognized + e.result.translations.get(textLanguage);

              setTranscripts([...azureTranscripts, transcript]);
              transcriptsFull = transcript
            }
          };
          speechRecognition.recognized = (s, e) => {
            if (control.current.listening == false || currentAPI.current.currentAPI != 1) {
              speechRecognition.stopContinuousRecognitionAsync()
              resolve(transcriptsFull);
            } else {
              lastRecognized += e.result.translations.get(textLanguage) + " ";
              transcript = lastRecognized
              setTranscripts([...azureTranscripts, transcript]);
              transcriptsFull = transcript
            }
          };
          speechRecognition.sessionStopped = (s, e) => {
            var timeSinceStart = new Date().getTime() - lastStartedAt;
            if (control.current.listening == false || currentAPI.current.currentAPI != 1) {
              resolve(transcriptsFull);
            } else if (timeSinceStart > 1000) {
              speechRecognition.startContinuousRecognitionAsync()
            }
          }
        } catch (error) {
          resolve(false)
        }
      }),
    [setTranscripts]
  );
  return useMemo(() => ({ azureTranscripts, azureListen }), [azureTranscripts]);
};