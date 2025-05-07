import { API, ApiType, STATUS, StatusType } from './types/apiEnums';
import {
   ApiStatus, AzureStatus, PhraseList, PhraseListStatus,
   StreamTextStatus, WhisperStatus, ScribearServerStatus, PlaybackStatus
} from './types/apiTypes';
import { ControlStatus, LanguageList } from "./types/controlStatus";
import { SRecognition, ScribeHandler, ScribeRecognizer } from "./types/sRecognition";
import { Sentence, Word } from "./types/TranscriptTypes";

import { DisplayStatus } from "./types/displayStatus";
import { MainStream } from "./types/bucketStreamTypes";
import type { ModelSelection } from './types/modelSelection';

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
   StreamTextStatus,
   ScribearServerStatus,
   PlaybackStatus,

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
   initialStreams: MainStream
   WhisperReducer: WhisperStatus
   StreamTextReducer: StreamTextStatus
   ScribearServerReducer: ScribearServerStatus
   PlaybackReducer: PlaybackStatus,
   ModelSelectionReducer: ModelSelection
}