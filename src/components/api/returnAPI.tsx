import React, { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { DisplayStatus, AzureStatus, StreamTextStatus, ControlStatus, ApiStatus } from '../../react-redux&middleware/redux/types';
import { RootState } from '../../store';

import * as speechSDK from 'microsoft-cognitiveservices-speech-sdk'
import  { getWebSpeechRecog, useWebSpeechRecog } from './web-speech/webSpeechRecog';
import { getAzureTranslRecog, testAzureTranslRecog, useAzureTranslRecog } from './azure/azureTranslRecog';


// controls what api to send and what to do when error handling.

// NOTES: this needs to do everything I think. Handler should be returned which allows
//        event call like stop and the event should be returned... (maybe the recognition? idk.)

export const returnRecogAPI = (api : ApiStatus, control : ControlStatus, azure : AzureStatus) => {
    // const apiStatus = useSelector((state: RootState) => {
    //     return state.APIStatusReducer as ApiStatus;
    // })
    // const control = useSelector((state: RootState) => {
    //     return state.ControlReducer as ControlStatus;
    // });
    // const azureStatus = useSelector((state: RootState) => {
    //     return state.AzureReducer as AzureStatus;
    // })
    const recognition = getRecognition(api.currentAPI, control, azure);
    const useRecognition = makeRecognition(api.currentAPI);
    const recogHandler = handler(api.currentAPI);


    return ({ useRecognition, recognition, recogHandler });
}

/**
 * Functions for controlling each API as they will be saved to this file.
 * 
 * @param currentApi 
 * @returns a handler function for the recognizer
 */
export const handler = (currentApi: number) => {
    if (currentApi == 0) { // webspeech
        return useCallback((speechRecognition: any, action) => {
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
        }, [])
    } else if (currentApi == 1) { // azure TranslationRecognizer
        return useCallback((speechRecognition: any, action) => {
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
        }, [])
    } else {
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

//         // getAzureTranslRecog(control, azure).then((recognizer : speechSDK.TranslationRecognizer) => {
//         //     testAzureTranslRecog(recognizer);
//         // }, (error_str : string) => {
//         //     reject(error_str);
//         // });
//     } else {
//         throw(`Unexpcted API: ${currentApi}`);
//     }
// }

export const getRecognition = (currentApi: number, control: ControlStatus, azure: AzureStatus) => {
    if (currentApi === 0) { // webspeech recognition
        return useMemo(() => getWebSpeechRecog(control), []);
    } else if (currentApi === 1) { // azure TranslationRecognizer
        return useMemo(() => getAzureTranslRecog(control, azure), []);
    } else {
        return useMemo(() => getWebSpeechRecog(control), []);
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

