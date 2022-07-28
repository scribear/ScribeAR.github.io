/* 
Stream has arrays of buckets

different buckets may have different interval of time (endTime - startTime):
e.g. audio bucket's interval of time may be shorter than that of HTML5 STT

localStorage can be a clientto this stream
*/



export interface UniversalEventBucket {
    startTime: number,
    endTime: number,
    eventType: string,
}

export interface STTEVENTBucket extends UniversalEventBucket {
    transcript: string,
    confidence: number,
    isFinal: boolean,
}

export interface HTML5STTEventBucket extends STTEVENTBucket {}

export interface AzureSTTEventBucket extends STTEVENTBucket {}

export interface AudioEventBucket extends UniversalEventBucket {
    volume: number,
    dataArray: Array<number>,
    typeOfData: string // frequency or waveform
}

export interface UserActionsEventBucket extends UniversalEventBucket {
    targetElem: HTMLElement,
    action: Event,
}

export interface Streams {
    AudioStream?: Array<AudioEventBucket>,
    HTML5STTStream?: Array<HTML5STTEventBucket>,
    AzureSTTStream?: Array<AzureSTTEventBucket>,
    UserActionsStream?: Array<UserActionsEventBucket>,
}
