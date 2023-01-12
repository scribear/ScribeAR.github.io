import React, { useEffect, useRef } from 'react'
import { DisplayStatus } from '../../../redux/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import Meyda from 'meyda';
import { MeydaAnalyzer } from 'meyda/dist/esm/meyda-wa';

var audioContext: AudioContext;
var analyser: MeydaAnalyzer;
var source: MediaStreamAudioSourceNode;
var rafId: number;
var canvas: HTMLCanvasElement;
var canvasCtx: CanvasRenderingContext2D;

const LOUDNESS_THRESHOLD = 15;
const HISTORY_LENGTH = 80;
const MFCC_COEFFICIENTS = 25;
const FFT_SIZE = 512;
var history_write_index = 0;

class Moment {
  mfcc: Float32Array;
  centroid: number;

  constructor() {
    this.mfcc = new Float32Array(MFCC_COEFFICIENTS);
    this.centroid = 0;
  }
}

var history: Moment[] = new Array(HISTORY_LENGTH);
for (var i = 0; i < HISTORY_LENGTH; i++) {
  history[i] = new Moment();
}

var theme: DisplayStatus;

export function MFCCVisual(props: any) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  theme = useSelector((state: RootState) => {
    return state.DisplayReducer as DisplayStatus;
  });

  useEffect(() => {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    }).then(newMediaStream => {
      source = audioContext.createMediaStreamSource(newMediaStream);

      analyser = Meyda.createMeydaAnalyzer({
        audioContext: audioContext,
        source: source,
        bufferSize: FFT_SIZE,
        numberOfMFCCCoefficients: MFCC_COEFFICIENTS,
        featureExtractors: [
          'loudness',
          'spectralCentroid',
          'mfcc',
        ],
        callback: (features: {
          loudness: { specific: Float32Array, total: number },
          spectralCentroid: number,
          mfcc: Float32Array,
        }) => {
          if (features.loudness.total >= LOUDNESS_THRESHOLD) {
            history[history_write_index].mfcc.set(features.mfcc);
            history[history_write_index].centroid = features.spectralCentroid;
            history_write_index = (history_write_index + 1) % HISTORY_LENGTH;
          }
        }
      });

      analyser.start();
    });

    rafId = requestAnimationFrame(draw);

    // setup canvas
    canvas = canvasRef.current!;
    canvasCtx = canvas.getContext('2d')!;

    return () => {
      cancelAnimationFrame(rafId);
      analyser.stop();
      source.disconnect();
    }
  }, []);

  const draw = () => { // the draw function
    requestAnimationFrame(draw);

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    const sliceWidth = canvas.width / MFCC_COEFFICIENTS;
    const sliceHeight = canvas.height / HISTORY_LENGTH;
    history.forEach((moment, index) => {
      const row = (HISTORY_LENGTH - history_write_index + index) % HISTORY_LENGTH;
      const centroid = Math.round(720 * moment.centroid / FFT_SIZE);
      moment.mfcc.forEach((data, col) => {
        const intensity = data / 255;
        canvasCtx.fillStyle = `hsl(${centroid}deg 100% 50% / ${intensity})`;
        canvasCtx.fillRect(
          col * sliceWidth,
          row * sliceHeight,
          sliceWidth,
          sliceHeight
        );
      });
    });
  }

  return <canvas width={props.visualWidth}
    height={props.visualHeight}
    ref={canvasRef} />
}
