/*
    Interface for each API's status's
    @currentAPI: an enum of WEBSPEECH, AZURE, STREAMTEXT (our 3 current available API's)
    @webspeechStatus,
    @azureStatus,
    @streamTextStatus: an enum of AVAILABLE, NULL, UNAVAILABLE, INPROGRESS
*/
export type ApiStatus = {
    currentAPI: number
    webspeechStatus: number
    azureStatus: number
    streamtextStatus: number
}
/*
    AzureStatus currently has only the login information.
    This should be expanded to include Azure specific issues
    @key: users azure key
    @region: users region
*/

/*
    We save an array of phraseLists so the user can choose what phrase list they want to use
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

export type AzureStatus = {
    azureKey: string
    azureRegion: string
    phrases: string[]
}

/*
    Streamtextstatus currently has only the login information.
    This should be expanded to include Streamtext specific issues
    @key: users streamtext event key
*/
export type StreamtextStatus = {
    key: string
}
/*
    Control interface represents function related aspects the user can change
    @listening: boolean dictating if the mic is on and outputting text
*/
export type ControlStatus = {
    listening: boolean
    speechLanguage: string
    textLanguage: string
}
/*
    Relating to visual aspects of the website the user can change
    @textSize: textSize of text from speech to text (i couldnt think of a way to say this without saying text 3 times)
    @color: theme of website

*/
export type DisplayStatus = {
    textSize: number
    primaryColor: string
    secondaryColor: string
    textColor: string
    menuVisible: boolean
}
/*
    All above reducer interfaces together
*/
export type RootState = {
    DisplayReducer: DisplayStatus
    APIStatusReducer: ApiStatus
    AzureReducer: AzureStatus
    StreamTextReducer: StreamtextStatus
    ControlReducer: ControlStatus
    PhraseListReducer: PhraseListStatus
}