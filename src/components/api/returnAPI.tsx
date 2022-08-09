import * as React from 'react';
import * as speechSDK from 'microsoft-cognitiveservices-speech-sdk'
import { getSpeechRecognition, useRecognition } from './webspeech/recognition';

import { GetAzure, AzureRecognition } from './azure/azureRecognition';
import { DisplayStatus, AzureStatus, StreamTextStatus, ControlStatus, ApiStatus } from '../../redux/types'
import { RootState } from '../../store';
import { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';

// controls what api to send and what to do when error handling.

// NOTES: this needs to do everything I think. Handler should be returned which allows
//        event call like stop and the event should be returned... (maybe the recognition? idk.)

export const ReturnAPI = (props) => {
    const apiStatus = useSelector((state: RootState) => {
      return state.APIStatusReducer as ApiStatus
    })
    const control = useSelector((state: RootState) => {
      return state.ControlReducer as ControlStatus;
    });
    const azureStatus = useSelector((state: RootState) => {
      return state.AzureReducer as AzureStatus
    })
    const recognition = Recognition(apiStatus.currentAPI, azureStatus, control)
    const handler = Handler(apiStatus.currentAPI, recognition) 
    const recognitionBuff = RecognitionBuff(apiStatus.currentAPI)



    
return ({handler, recognition, recognitionBuff})
}

//Functions for controlling each API as they will be saved to this file.
export const Handler = (currentApi: number, speechRecognition: any) => {
  if (currentApi == 0) {
        //current api is webspeech (speechRecognition is webspeech)
  return useCallback((action) => {
    switch (action.type) {
      case 'STOP':
        speechRecognition!.stop()
        break
      case 'START':
        speechRecognition!.start()
        break
      case 'ABORT':
        speechRecognition!.abort()
        break
      case 'CHANGE_LANGUAGE':
        speechRecognition.lang = action.payload
        break
    default:
    return "poggers";
    }
},[])
  } else if (currentApi == 1) {
    //current api is azure (speechRecognition is azure)
return useCallback((action) => {
  switch (action.type) {
    case 'STOP':
      speechRecognition!.stopContinuousRecognitionAsync()
      break
    case 'START':
      speechRecognition!.startContinuousRecognitionAsync()
      break
    case 'ABORT':
      speechRecognition!.close()
      break
    case 'CHANGE_LANGUAGE':
      speechRecognition!.addTargetLanguage(action.payload)
      break
  default:
  return "poggers";
  }    
},[])
} else {
 const streamtextHandler = () => {
    //nothing so far
  }
}
}

export const Recognition = (currentApi: number, azure: AzureStatus, control: ControlStatus) => {
  if (currentApi == 0) {
    // return webspeech recognition
    return useMemo(() =>  getSpeechRecognition(),[])
  } else if (currentApi == 1) {
    // return azure recognition
    return useMemo(() =>  GetAzure(control, azure),[])
  } else {

    return useMemo(() =>  getSpeechRecognition(),[])
  }
}

export const RecognitionBuff = (currentApi: number) => {
  if (currentApi == 0) {
      // returns webspeech recognition event controller
    return {useRecognition}
  } else {
      // returns azure recognition event controller
    return {AzureRecognition}
  }
}

