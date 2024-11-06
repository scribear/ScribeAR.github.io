import { StatusType } from './apiEnums';
import sdk from 'microsoft-cognitiveservices-speech-sdk';

export type ScribeRecognizer = null | SpeechRecognition | sdk.TranslationRecognizer | sdk.ConversationTranscriber;
export type ScribeHandler = ((action: {type: string, payload?: any}) => "poggers" | undefined);
 

/**
 * For ease of new development, it is mostly a duplicate of the ApiStatus. 
 * 
 * Maybe we can call it "SRecognition" as in "ScribeAR Recognition".
 * 
 */
export type SRecognition = {
   recognizer: ScribeRecognizer;
   // handler: ScribeHandler;
   // resetTranscript: () => string;
   status: StatusType;
}