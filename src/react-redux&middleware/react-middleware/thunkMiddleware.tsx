import { batch } from "react-redux";

import { MainStreamMap } from "../redux/types/bucketStreamTypes";
import { ControlStatus, STATUS, StatusType } from "../redux/typesImports";
import { loadTokenizer } from '../../ml/bert_tokenizer';
import { intent_inference } from '../../ml/inference';
import { Configuration, OpenAIApi } from 'openai';

const ort = require('onnxruntime-web');


const SentimentToEmojis : { [index: string]: string } = {
   "admiration": "👏", "amusement": "😂", "anger": "😡", "annoyance": "😒",
   "approval": "👍", "caring": "🤗", "confusion": "😕", "curiosity": "🤔",
   "desire": "😍", "disappointment": "😞", "disapproval": "👎", "disgust": "🤮",
   "embarrassment": "😳", "excitement": "🤩", "fear": "😨", "gratitude": "🙏",
   "grief": "😢", "joy": "😃", "love": "❤️", "nervousness": "😬",
   "optimism": "🤞", "pride": "😌", "realization": "💡", "relief": "😅",
   "remorse": "😞",  "sadness": "😞", "surprise": "😲", "neutral": "😐",
};
const sentimentPrompt = "Decide whether the sentence is admiration amusement anger annoyance approval caring confusion curiosity desire disappointment disapproval disgust embarrassment excitement fear gratitude grief joy love nervousness optimism pride realization relief remorse sadness surprise, or neutral:";

/* Save to sessionStorage so that it is cleared when refreshed */
const saveSessionly = (varName: string, value: any) => {
   sessionStorage.setItem(varName, JSON.stringify(value));
   // if (varName === 'audio') {

   // } else if (varName === 'html5STT') {

   // } else if (varName === 'AzureSTT') {

   // } else if (varName === 'UserAction') {

   // }
}

const getSessionState = (varName: string) => {
   let checkNull = sessionStorage.getItem(varName)
   if (checkNull) {
      return JSON.parse(checkNull);
   } else {
      // if (varName === "streams") {
      //     const mainStreamMap = defaultMainStreamMap();
      //     saveSessionly("streams", mainStreamMap);
      //     return mainStreamMap;
      // }
   }
};
type BucketArgs = {
   stream: string,
   value: any | SpeechRecognitionResultList,
}

const getSentiment = async (sentence: string) : Promise<string> => {
   try {
      const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
      const url = 'https://api.openai.com/v1/completions';

      if (!openaiApiKey) {
         return '';
      }

      const res = await fetch(url, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiApiKey}`
         },
         body: JSON.stringify({
            model: 'text-davinci-003',
            prompt: sentimentPrompt + sentence,
            temperature: 0.0,
            max_tokens: 10,
            top_p: 1.0,
            n: 1,
            echo: false,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
            logit_bias: {"198": -100}, // Only for GPT-3: '\n' and <|endoftext|>
         })
      });
      const completion = await res.json();
      let interim = ((completion.choices[0].text).trim()).split('\n');
      let interim2 = interim[interim.length - 1].split(' ');
      const sentiment = interim2[interim2.length - 1].toLowerCase();
      // console.log(101, sentiment);

      const emoji = sentiment ? SentimentToEmojis[sentiment] : SentimentToEmojis["neutral"];
      return emoji;
   } catch (err) {
      console.log(87, err);
      return '';
   }
}

/**
 * Write a synchronous outer function that receives the `text` parameter:
 * @param object 
 * @returns 
 */
export function makeEventBucket(object: BucketArgs) {
   const stream = object.stream;
   const value = object.value;

   // And then creates and returns the async thunk function:
   return async function makeEventBucketThunk(dispatch : React.Dispatch<any>, getState) {
      // ✅ Now we can use the stream value
      if (stream === 'audio') { 
         const curTime = Date.now();
      } else if (stream === 'html5') {
         // console.log("haha, wee?~!", value.length);
         const curTime = Date.now();

         // let finalArr = Array<SpeechRecognitionAlternative>();
         // let notFinalArr = Array<SpeechRecognitionAlternative>();
         let finalArr = Array<{ confidence : number, transcript : string }>();
         let notFinalArr = Array<{ confidence : number, transcript : string }>();
         for (let i = 0; i < (value as SpeechRecognitionResultList).length; i++) {
            const speechResult : SpeechRecognitionResult = value[i];
            // const intent : string = (await intent_inference(speechResult[0].transcript))[1][1][0];
            // const intent : string = await getSentiment(speechResult[0].transcript);
            // console.log(intent);
            // const result = { confidence: speechResult[0].confidence, transcript: speechResult[0].transcript + ' (' + intent + ')' };
            if (speechResult.isFinal) {
               const intent : string = await getSentiment(speechResult[0].transcript);
               console.log(intent);
               const result = { confidence: speechResult[0].confidence, transcript: speechResult[0].transcript + ' (' + intent + ')' };
               finalArr.push(result);
            } else {
               const result = { confidence: speechResult[0].confidence, transcript: speechResult[0].transcript };
               notFinalArr.push(result);
            }
         }

         const streamMap : MainStreamMap = await getState().BucketStreamReducer;
         let newMainStream : boolean = false;
         // If elapsed
         if (streamMap.curMSST + streamMap.timeInterval <= curTime) {
            newMainStream = true;

            // Also append final transcripts to sessionStorage

            // const curSessionSpeech = getSessionState('html5STT');
            // const finalSpeech = finalArr.map(fSpeech => fSpeech.transcript).join('');
            // saveSessionly('html5STT', curSessionSpeech + finalSpeech);
            console.log("New html5 stream created; sessionStorage updated!");
         }

         // console.log({
         //     type: 'APPEND_HTML5_STT_STREAM', 
         //     payload: {curTime: curTime, fArr: finalArr, nfArr: notFinalArr}, 
         //     newMainStream: newMainStream
         // });
         batch(() => {
            dispatch({
               type: 'APPEND_HTML5_STT_STREAM', 
               payload: {curTime: curTime, fArr: finalArr, nfArr: notFinalArr}, 
               newMainStream: newMainStream,
            });
            dispatch({
               type: 'transcript/recognized',
               payload: {fArr: finalArr, nfArr: notFinalArr},
            });
         });
      } else if (stream === 'azure') {
   
      } else if (stream === 'userAction') {
   
      }
   }
}
