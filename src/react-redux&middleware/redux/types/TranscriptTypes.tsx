import { STATUS, API } from './apiEnums';
import sdk from 'microsoft-cognitiveservices-speech-sdk';


/**
 * Called in sttRenderer.tsx 
 * 
 * The full displayed transcript is always previousTranscript + currentTranscript
 * 
 * SpeakerID at index i has fullTranscript at index i; array length = num speakers
 * 
 * @field previousTranscript
 * @field currentTranscript
 * @field speakerIDs : default to i
 */
export type Transcript = {
   speakerNum: number;
   maxSpeaker: number;
   previousTranscript: string[];
   currentTranscript: string[];
   speakerIDs: string[]; // SpeakerID at index i has fullTranscript at index i
}




/**
 * The data structure for each speaker
 * @field speakerId: a unique identificaion for the speaker
 * @field status: 0: normal (unmuted & connected); 1: muted but connected; 2: disconnected; 3: low internet speed
 * @field role: e.g. "host", "guest" ...
 */
export type Speaker = {
   speakerId: string;
   status: number; // maybe we can use char
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
