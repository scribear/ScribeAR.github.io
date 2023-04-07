import { MainStream } from "./types/bucketStreamTypes";
import { ApiStatus, AzureStatus, PhraseList, PhraseListStatus, WhisperStatus } from './types/apiTypes';
import { ControlStatus, LanguageList } from "./types/controlStatus";
import { DisplayStatus } from "./types/displayStatus";
import { SRecognition, ScribeRecognizer, ScribeHandler } from "./types/sRecognition";
import { Word, Sentence, Transcript } from "./types/TranscriptTypes";

import { API, ApiType, STATUS, StatusType } from './types/apiEnums';

export type {
   ApiStatus,
   AzureStatus,
   PhraseList,
   PhraseListStatus,
   WhisperStatus,
   ControlStatus,
   LanguageList,
   DisplayStatus,
   SRecognition,
   Word,
   Sentence,
   Transcript,

   // alias
   ScribeRecognizer,
   ScribeHandler,

   // javascript enums
   ApiType,
   StatusType,
}

export { API, STATUS }

/*
   All above reducer interfaces together
*/
export type RootState = {
   DisplayReducer: DisplayStatus
   APIStatusReducer: ApiStatus
   AzureReducer: AzureStatus
   ControlReducer: ControlStatus
   PhraseListReducer: PhraseListStatus
   initialStreams : MainStream
   WhisperReducer: WhisperStatus
}