import { Streams } from "./types/bucketStreamTypes"

/*
    The data structure for each speaker
    @speakerId: a unique identificaion for the speaker
    @status: 0: normal (unmuted & connected); 1: muted but connected; 2: disconnected; 3: low internet speed
    @role: e.g. "host", "guest" ...
*/
export type Speaker = {
    speakerId: string
    status: number // maybe we can use char
    role: number
}

export type LanguageList = {
    label: string
    CountryCode: string
}

/*
    // @text: A Map: <timestamp(number), text(string)>
    @text: A 2D array: [[timestamp, text(string)], [timestamp, text(string)]]
    @lastTime: last time that we append transcript
*/
export type Transcript = {
    text: Array<[number, string]>,
    lastTime: number
}


/*
    Represents speakers and their transcripts
    @allSpeakers: an array of all speakers
    @maxSpeaker: the maximum amount of speakers, defaults to 2 for the moment
    @speakerTranscript: a Map. <speaker id, transcript text>
*/
export type AllSpeakerTranscript = {
    allSpeakers: Speaker[]
    maxSpeaker: number
    lastUpdateTime: number
    // curSpeakerNum: number

    speakerTranscript: Map<Speaker["speakerId"], Transcript>
    // transcript: Transcript
    // speakerTranscripts: Map<string, Transcript>

}

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


export interface PhraseList {
    phrases: string[]
    name: string
    availableSpace: number
}

export interface PhraseListStatus {
    currentPhraseList: PhraseList
    phraseListMap: Map<string, PhraseList>
}

export interface AzureStatus {
    azureKey: string
    azureRegion: string
    phrases: string[]
}

/*
    Streamtextstatus currently has only the login information.
    This should be expanded to include Streamtext specific issues
    @key: users streamtext event key
*/
export interface StreamTextStatus {
    streamTextKey: string
}
/*
    Control interface represents function related aspects the user can change
    @listening: boolean dictating if the mic is on and outputting text
*/
export interface ControlStatus {
    listening: boolean
    speechLanguage: LanguageList
    textLanguage: LanguageList
    showFrequency: boolean
    showTimeData: boolean

}
/*
    Relating to visual aspects of the website the user can change
    @textSize: textSize of text from speech to text (i couldnt think of a way to say this without saying text 3 times)
    @color: theme of website

*/
export interface DisplayStatus {
    textSize: number
    primaryColor: string // background
    secondaryColor: string // header, sidebar
    textColor: string
    menuVisible: boolean
}
/*
    All above reducer interfaces together
*/
export interface RootState {
    DisplayReducer: DisplayStatus
    APIStatusReducer: ApiStatus
    AzureReducer: AzureStatus
    StreamTextReducer: StreamTextStatus
    ControlReducer: ControlStatus
    PhraseListReducer: PhraseListStatus
    initialStreams : Streams
}