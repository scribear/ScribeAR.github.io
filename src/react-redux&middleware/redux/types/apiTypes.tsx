import { ApiType, StatusType } from './apiEnums';
import sdk from 'microsoft-cognitiveservices-speech-sdk';


// we might merge PhraseListStatus with AzureStatus


/**
 * Interface for each API's status's
 * @field currentApi: an enum of WEBSPEECH, AZURE (our 2 current available API's)
 * @field webspeechStatus,
 * @field azureTranslStatus,
 * @field azureConvoStatus,
 */
export type ApiStatus = {
   currentApi: ApiType;
   webspeechStatus: StatusType;
   azureTranslStatus: StatusType;
   azureConvoStatus: StatusType;
}
/**
 * AzureStatus currently has only the login information.
 * This should be expanded to include Azure specific issues
 * @field key: users azure key
 * @field region: users region
 */
export type AzureStatus = {
   azureKey: string
   azureRegion: string
   phrases: string[]
}

/**
 * We save an array of phraseLists so the user can choose what phrase list they want to use
 */
export type PhraseList = {
   phrases: string[]
   name: string
   availableSpace: number
}

export type PhraseListStatus = {
   currentPhraseList: PhraseList
   phraseListMap: Map<string, PhraseList>
}