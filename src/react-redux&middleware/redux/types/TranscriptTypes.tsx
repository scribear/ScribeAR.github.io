import { InvalidOperationError } from 'microsoft-cognitiveservices-speech-sdk/distrib/lib/src/common/Error';
import { STATUS, API, ApiType } from './apiEnums';
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
 * A segment of a transcript, representing a continuous segment of speech
 */
export class TranscriptBlock {
   /**
    * Transcript text
    */
   text: string = "";
   // TODO: add more fields - confidence, which API recognized this block, etc
}

/**
 * A transcript of a single speaker's speech, containing a list of finalized transcript blocks
 * and a single in-progress transcript block, in chronological order.
 * 
 * We assume that once a block is finalized it cannot be un-finalized, but the in-progress block
 * can be modified freely. This means that the final block list is append-only, whereas the in-progress
 * block is public.
 * 
 * Furthermore, we assume that a recognizer finalizes the in-progress block before it stops -
 * thus no transcript is lost when a different recognizer takes over the in-progress block.
 * 
 * This protocol allowing aggregating transcript from multiple APIs, while still allowing revising
 * recent transcript based on new information (e.g. as done by Azure recognizer)
 */
export class Transcript {
   /**
    * ID of the speaker that this transcript corresponds to
    */
   speakerIDs: string = "Unnamed";
   
   /**
    * Finalized transcript blocks in chronological order. Can only be appended to at the end.
    */
   _finalBlocks: Array<TranscriptBlock> = [];
   set finalBlocks(value) {
      throw new Error("Final blocks cannot be directly modified!")
   }
   get finalBlocks() {
      return this._finalBlocks
   }

   /**
    * In progress transcript block
    */
   inProgressBlock: TranscriptBlock = new TranscriptBlock();

   /**
    * Append a new transcript block to the end of the final list
    * @param block Transcript block to be appended
    */
   addFinalBlock(toAdd: TranscriptBlock): void {
      this.finalBlocks.push(toAdd);
   }

   /**
    * Returns the full text of the transcript.
    */
   toString(): string {
      // Join all final blocks followed by in-progress block
      return this.finalBlocks.map((block) => block.text).join(' ') + ' ' + this.inProgressBlock.text 
   }
}

/**
 * A collection of single-speaker transcripts, used to transcribe multi-speaker speech.
 * 
 * Currently only supports one speaker at transcripts[0]
 */
export class MultiSpeakerTranscript {
   /**
    * Maximum number of speakers this transcript expects
    */
   maxSpeakers: number = 4;
   /**
    * A list of single-speaker transcripts
    */
   transcripts: Array<Transcript> = [new Transcript];
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
