import { STATUS, API } from './apiEnums';
import sdk from 'microsoft-cognitiveservices-speech-sdk';


export type Word = {
   value: string;
   volume: number;
   pitch: number;
}

export type Sentence = {
   text: Word[],
   intent: String,
   avgVolume: number,
   avgPitch: number,
   confidence: number,
}

// TODO: Consider adding Paragraph, which has an AI-generated summary

/**
 * Used in sttRenderer.tsx 
 * 
 * The full displayed transcript is always previousTranscript + currentTranscript
 * 
 * SpeakerID at index i has fullTranscript at index i; array length = num speakers
 */
export type Transcript = {
   speakerNum: number;
   maxSpeaker: number;
   previousTranscript: string[];
   currentTranscript: string[];
   speakerIDs: string[];
}



// TODO: deprecate Speaker, OldTranscript, and AllSpeakerTranscript
/**
 * The data structure for each speaker
 */
export type Speaker = {
   /** unique identification for the speaker */
   speakerId: string;
   /**
    * 0: normal (unmuted & connected); 
    * 1: muted but connected; 
    * 2: disconnected; 
    * 3: low internet speed
    */
   status: number;
   /** e.g. "host", "guest" ... */
   role: number;
}


/*
// @text: A Map: <timestamp(number), text(string)>
@text: A 2D array: [[timestamp, text(string)], [timestamp, text(string)]]
@lastTime: last time that we append transcript
*/
export type OldTranscript = {
   text: Array<[number, string]>;
   lastTime: number;
}

/*
   Represents speakers and their transcripts
   @allSpeakers: an array of all speakers
   @maxSpeaker: the maximum amount of speakers, defaults to 2 for the moment
   @speakerTranscript: a Map. <speaker id, transcript text>
*/
export type AllSpeakerTranscript = {
   allSpeakers: Speaker[];
   maxSpeaker: number;
   lastUpdateTime: number;
   // curSpeakerNum: number;

   speakerTranscript: Map<Speaker["speakerId"], OldTranscript>
   // transcript: Transcript;
   // speakerTranscripts: Map<string, Transcript>;
}
