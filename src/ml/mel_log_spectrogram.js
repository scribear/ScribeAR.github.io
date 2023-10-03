const math = require("mathjs");
const linspace = require("linspace");

const filterLength = 1024;
const hopLength = 256;
const winLength = 1024;
const nMelChannels = 80;
const samplingRate = 22050;
const melFmin = 0;
const melFmax = 8000.0;
const maxWavValue = 32768.0;
const minLogValue = -11.52;
const maxLogValue = 1.2;
const silenceThresholdDb = -10;

const frameSize = 512;
const hopSize = 256;


const matrixMultiplication = (A, B) => {
   let C = [];
   for (let i = 0; i < A.length; i++) {
      C[i] = [];
      for (let j = 0; j < B[0].length; j++) {
         let sum = 0;
         for (let k = 0; k < A[0].length; k++) {
            sum += A[i][k] * B[k][j];
         }
         C[i][j] = sum;
      }
   }
   return C;
}

// Calculate mel-filterbank
// spectrogram is like pow_frames
function getFilterBank(spectrogram, nFilt=nMelChannels, NFFT=filterLength, sample_rate=samplingRate, melMin=melFmin, melMax=melFmax) {
   let low_freq_mel = 2595 * Math.log10(1 + melMin / 700);
   let high_freq_mel = 2595 * Math.log10(1 + melMax / 700);
   let mel_points = linspace(low_freq_mel, high_freq_mel, nFilt + 2);
   let hz_points = mel_points.map(mel_p => 700 * (Math.pow(10, mel_p / 2595) - 1));
   let bin = hz_points.map(hz_p => Math.floor((NFFT + 1) * hz_p / sample_rate));

   let fbank = new Array(nFilt).fill(0).map(() => new Array(Math.floor(NFFT / 2 + 1)).fill(0));

   for (let m = 1; m < nFilt + 1; m++) {
      let f_m_minus = Math.floor(bin[m - 1]);
      let f_m = Math.floor(bin[m]);
      let f_m_plus = Math.floor(bin[m + 1]);
   
      for (let k = f_m_minus; k < f_m; k++) {
         fbank[m - 1][k] = (k - bin[m - 1]) / (bin[m] - bin[m - 1]);
      }
      for (let k = f_m; k < f_m_plus; k++) {
         fbank[m - 1][k] = (bin[m + 1] - k) / (bin[m + 1] - bin[m]);
      }
   }
   
   const truncTransFbank = (math.transpose(fbank)).slice(0, filterLength/2);
   return truncTransFbank;
}

const applyMelFilter = (spectrogram, fBank) => {
   // console.log('spectrogram: ', `(${spectrogram.length}, ${spectrogram[0].length})`, spectrogram.map(row => row.reduce((a, b) => a + b, 0)));
   let mel_filter_banks = matrixMultiplication(spectrogram, fBank);
   // console.log('mel_filter_banks: ', `(${mel_filter_banks.length}, ${mel_filter_banks[0].length})`, mel_filter_banks.map(row => row.reduce((a, b) => a + b, 0)));

   for (let i = 0; i < mel_filter_banks.length; i++) {
      for (let j = 0; j < mel_filter_banks[i].length; j++) {
         mel_filter_banks[i][j] = Math.max(mel_filter_banks[i][j], Number.EPSILON);
      }
   }
   // console.log('mel_filter_banks: ', `(${mel_filter_banks.length}, ${mel_filter_banks[0].length})`, mel_filter_banks.map(row => row.reduce((a, b) => a + b, 0)));
   mel_filter_banks = mel_filter_banks.map(row => row.map(value => 20 * Math.log10(value)));
   // console.log('mel_filter_banks: ', `(${mel_filter_banks.length}, ${mel_filter_banks[0].length})`, mel_filter_banks.map(row => row.reduce((a, b) => a + b, 0)));
   return mel_filter_banks;
}

const meanNormalization = (mel_filter_banks) => {
   let mean = mel_filter_banks.map(row => row.reduce((a, b) => a + b, 0) / row.length);
   // console.log('mean: ', mean);
   // let std = mel_filter_banks.map(row => Math.sqrt(row.map(value => Math.pow(value - mean[row.indexOf(value)], 2)).reduce((a, b) => a + b, 0) / row.length));
   // console.log('std: ', std);
   let normalized_mel_filter_banks = mel_filter_banks.map((row, i) => row.map(value => (value - mean[i] + 1e-8)));

   return normalized_mel_filter_banks;
}

async function computeMelLogSpectrogram(audioData) {
   const fBank = getFilterBank(audioData, nMelChannels, filterLength, samplingRate, melFmin, melFmax);
   // console.log('audioData: ', `(${audioData.length}, ${audioData[0].length})`, audioData.map(row => row.reduce((a, b) => a + b, 0)));
   // console.log('fbank: ', `(${fBank.length}, ${fBank[0].length})`, fBank.map(row => row.reduce((a, b) => a + b, 0)));
   const spectrogram = applyMelFilter(audioData, fBank);
   // console.log('spectrogram: ', `(${spectrogram.length}, ${spectrogram[0].length})`, spectrogram.map(row => row.reduce((a, b) => a + b, 0)));
   const logMelSpectrogram = meanNormalization(spectrogram); // melFBank
   // console.log('melFBank: ', `(${melFBank.length}, ${melFBank[0].length})`, melFBank.map(row => row.reduce((a, b) => a + b, 0)));
   // console.log('logMelSpectrogram: ', `(${logMelSpectrogram.length}, ${logMelSpectrogram[0].length})`, logMelSpectrogram[0]);
   
   return logMelSpectrogram;
}
  
export default computeMelLogSpectrogram
//module.exports = { computeMelLogSpectrogram }
