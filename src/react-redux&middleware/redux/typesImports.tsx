import { MainStream } from "./types/bucketStreamTypes";
import { ApiStatus, AzureStatus, PhraseList, PhraseListStatus } from './types/apiTypes';
import { ControlStatus, LanguageList } from "./types/controlStatus";
import { DisplayStatus } from "./types/displayStatus";
import { SRecognition, ScribeRecognizer, ScribeHandler } from "./types/recogStatus";
import { Transcript } from "./types/TranscriptTypes";

import { API, STATUS } from './types/apiEnums';

export type {
   ApiStatus,
   AzureStatus,
   PhraseList,
   PhraseListStatus,
   ControlStatus,
   LanguageList,
   DisplayStatus,
   SRecognition,
   Transcript,


   // alias
   ScribeRecognizer,
   ScribeHandler,
}

export { API, STATUS}

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
}