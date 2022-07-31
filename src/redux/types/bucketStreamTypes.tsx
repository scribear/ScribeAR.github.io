/* 
Stream has arrays of buckets

different buckets may have different interval of time (endTime - startTime):
e.g. audio bucket's interval of time may be shorter than that of HTML5 STT

localStorage can be a clientto this stream
*/



export interface UniversalEventBucket {
    startTime: number,
    endTime: number,
    eventType: string, // "Audio" | "AzureSTT" | "HTML5STT" | "UserAction"
}

export interface STTEVENTBucket extends UniversalEventBucket {
    // transcript: string,
    // confidence: number,
    // isFinal: boolean,
}

export type TranscriptConfidence = { 
    transcript: string, 
    confidence: number,
}

export interface HTML5STTEventBucket extends STTEVENTBucket {
    finalTranscript: Array<SpeechRecognitionAlternative>,
    notFinalTranscript: Array<SpeechRecognitionAlternative>,
}
export interface AzureSTTEventBucket extends STTEVENTBucket {}
export interface AudioEventBucket extends UniversalEventBucket {
    volume: number,
    dataArray: Array<number>,
    typeOfData: string // frequency or waveform
}
export interface UserActionEventBucket extends UniversalEventBucket {
    targetElem: HTMLElement,
    action: Event,
}

export type AudioStream = Array<AudioEventBucket>;
export type HTML5STTStream = Array<HTML5STTEventBucket>;
export type AzureSTTStream = Array<AzureSTTEventBucket>;
export type UserActionStream = Array<UserActionEventBucket>;

export interface Streams {
    AudioStream?: AudioStream,
    HTML5STTStream?: HTML5STTStream,
    AzureSTTStream?: AzureSTTStream,
    UserActionStream?: UserActionStream,
}
