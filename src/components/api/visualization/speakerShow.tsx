import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../../store';
import { 
   DisplayStatus
} from '../../../react-redux&middleware/redux/typesImports';
// import { computeMelLogSpectrogram } from '../../../ml/mel_log_spectrogram';
import { gruInference } from '../../../ml/inference';
import LinksCluster from '../../../ml/online_links';
const { computeMelLogSpectrogram } = require('../../../ml/mel_log_spectrogram');


const FFT_SIZE = 1024;
// const HOP_LENGTH = 256;
// const WIN_LENGTH = 1024;
// const N_MEL_CHANNELS = 80;
const SAMPLING_RATE = 22050;
// const MEL_FMIN = 0;
// const MEL_FMAX = 8000.0;
// const MAX_WAV_VALUE = 32768.0;
// const MIN_LOG_VALUE = -11.52;
// const MAX_LOG_VALUE = 1.2;
// const SILENCE_THRESHOLD_DB = -10;
const N_FRAMES = 40;

const audioContext = new (window.AudioContext || window.webkitAudioContext) ({
   latencyHint: 'interactive',
   sampleRate: SAMPLING_RATE // 16000 max
});
const analyser = new AnalyserNode(audioContext, { "fftSize": FFT_SIZE, "smoothingTimeConstant": 0.8 }); // for AnalyserOptions
let dataArray = new Float32Array(FFT_SIZE / 2); // FFT_SIZE / 2 = analyser.frequencyBinCount;
const getAudioData = () => {
   const freqDataQueue : any = [];
   let currentFrames = 0;
   return new Promise((resolve, reject) => {
      const intervalID = setInterval(() => {
         const dArray = new Uint8Array(analyser.frequencyBinCount);
         analyser.getByteFrequencyData(dArray);
         dataArray = new Float32Array(dArray);
         if (dataArray[0] === -Infinity) {
            clearInterval(intervalID);
            resolve(freqDataQueue);
         }
         freqDataQueue.push(dataArray);

         if (++currentFrames === N_FRAMES) {
            clearInterval(intervalID);
            resolve(freqDataQueue);
         }
      }, FFT_SIZE / SAMPLING_RATE * 1000);
   });
}

const SpeakerShow: React.FC = (props) => {

   const displayStatus = useSelector((state: RootState) => {
      return state.DisplayReducer as DisplayStatus;
   });

   const [audioRunning, setAudioRunning] = React.useState(false);
   const btnRef = useRef<any>(null);
   // const [cluster, setCluster] = React.useState(new LinksCluster(0.1, 0.4, 0.5)); // bounced off to 4 or 5
   const [cluster0, setCluster0] = React.useState(new LinksCluster(0.1, 0.5, 0.5)); // was largely able to restrain to 0, 1, 2 for (silent, high, low), but seems not sensitive. Unstable if there is a pause
   // const [cluster1, setCluster1] = React.useState(new LinksCluster(0.3, 0.3, 0.5)); // bounced off to 8 or 9.
   // const [cluster2, setCluster2] = React.useState(new LinksCluster(0.3, 0.5, 0.5)); // bounced off to 8 or 9.
   const curSpeaker = useRef('silence');

   useEffect(() => {
      btnRef.current.addEventListener('click', () => {
         audioContext.resume().then(() => {
            console.log('Playback resumed successfully');
            if (audioContext.state === 'running') {
               console.log(113, 'running');
               setAudioRunning(true);

               navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
                  const source = audioContext.createMediaStreamSource(stream);
                  source.connect(analyser);
                  const next = () => {
                     getAudioData().then((freqDataQueue) => { 
                        // console.log('frequency data: ', freqDataQueue[0][0], freqDataQueue.length, freqDataQueue[0].length);
                        // 2-norm
                        // for (let i = 0; i < freqDataQueue.length; i++) {
                        //    const norm = Math.sqrt(freqDataQueue[i].reduce((acc, cur) => acc + cur * cur, 0));
                        //    console.log(134, norm);
                        //    freqDataQueue[i] = freqDataQueue[i].map(data => data / norm);
                        // }
                        // console.log('frequency data: ', freqDataQueue[0][0], freqDataQueue.length, freqDataQueue[0].length);
                        computeMelLogSpectrogram(freqDataQueue).then((melLogSpectrogram) => {
                           // console.log(68, `mel log shape: (${melLogSpectrogram.length}, ${melLogSpectrogram[0].length})`);
                           gruInference(melLogSpectrogram)
                              .then(
                                 (gruEmbedding : any) => {
                                    // console.log(83, `gru embedding shape: (${gruEmbedding.output.dims}), ${gruEmbedding}`);
                                    // console.log(
                                    //    // cluster.predict(gruEmbedding.output.data),
                                    //    cluster0.predict(gruEmbedding.output.data),
                                    //    // cluster1.predict(gruEmbedding.output.data),
                                    //    // cluster2.predict(gruEmbedding.output.data),
                                    // );
                                    const speaker = cluster0.predict(gruEmbedding.output.data);
                                    // console.log(102, speaker);
                                    if (speaker === 0) {
                                       curSpeaker.current = 'silence';
                                    } else {
                                       curSpeaker.current = `speaker ${speaker}`;
                                    }
                                 }
                              );
                        });
                        next();
                     });
                  };
                  next();
               });
            }
         });
      });
   }, []);
   
   return (
      <div 
         style={{
            color: displayStatus.textColor
         }}
      >
         <button ref={ btnRef }>Start</button>
         {curSpeaker.current}
      </div>
   )
}

export default SpeakerShow;
