import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { DisplayStatus, ControlStatus } from '../../../react-redux&middleware/redux/typesImports';
import { RootState } from '../../../store';
import Meyda from 'meyda';
import { MeydaAnalyzer } from 'meyda/dist/esm/meyda-wa';

const LOUDNESS_THRESHOLD = 15;
const HISTORY_LENGTH = 80;
const MFCC_COEFFICIENTS = 25;
const FFT_SIZE = 512;

class Moment {
  mfcc: Float32Array;
  centroid: number;

  constructor() {
    this.mfcc = new Float32Array(MFCC_COEFFICIENTS);
    this.centroid = 0;
  }
}

let audioContext: AudioContext;
let analyser: MeydaAnalyzer;
let source: MediaStreamAudioSourceNode;
let rafId: number;

const history: Moment[] = Array.from({ length: HISTORY_LENGTH }, () => new Moment());
let history_write_index = 0;

export function MFCCVisual(props: any) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const theme = useSelector((state: RootState) => state.DisplayReducer as DisplayStatus);
  const listening = useSelector((state: RootState) => (state.ControlReducer as ControlStatus).listening);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let mounted = true;

    const setupAudio = async () => {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();

      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      source = audioContext.createMediaStreamSource(mediaStreamRef.current);

      analyser = Meyda.createMeydaAnalyzer({
        audioContext,
        source,
        bufferSize: FFT_SIZE,
        numberOfMFCCCoefficients: MFCC_COEFFICIENTS,
        featureExtractors: ['loudness', 'spectralCentroid', 'mfcc'],
        callback: (features) => {
          if (features.loudness.total >= LOUDNESS_THRESHOLD) {
            history[history_write_index].mfcc.set(features.mfcc);
            history[history_write_index].centroid = features.spectralCentroid;
            history_write_index = (history_write_index + 1) % HISTORY_LENGTH;
          }
        },
      });

      if (listening && mounted) {
        analyser.start();
        rafId = requestAnimationFrame(draw);
      }
    };

    setupAudio();

    return () => {
      mounted = false;
      cancelAnimationFrame(rafId);
      if (analyser) analyser.stop();
      if (source) source.disconnect();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Toggle visualizer on/off based on Redux `listening` state
  useEffect(() => {
    if (!analyser) return;

    if (listening) {
      analyser.start();
      rafId = requestAnimationFrame(draw);
    } else {
      analyser.stop();
      cancelAnimationFrame(rafId);
    }
  }, [listening]);

  const draw = () => {
    rafId = requestAnimationFrame(draw);

    const canvas = canvasRef.current!;
    const canvasCtx = canvas.getContext('2d')!;

    // Set dull white background
    canvasCtx.fillStyle = '#D3D3D3';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    const sliceWidth = canvas.width / HISTORY_LENGTH;
    const sliceHeight = canvas.height / MFCC_COEFFICIENTS;

    for (let i = 0; i < HISTORY_LENGTH; i++) {
      const historyIndex = (history_write_index - i + HISTORY_LENGTH) % HISTORY_LENGTH;
      const x = canvas.width - sliceWidth * (i + 1);
      const moment = history[historyIndex];

      moment.mfcc.forEach((data, row) => {
        const intensity = data / 255;
        const centroid = Math.round((720 * moment.centroid) / FFT_SIZE);
        canvasCtx.fillStyle = `hsl(${centroid}deg 100% 60% / ${Math.min(intensity * 10, 1)})`;

        canvasCtx.fillRect(
          x,
          row * sliceHeight,
          sliceWidth,
          sliceHeight
        );
      });
    }
  };

  return <canvas width={props.visualWidth} height={props.visualHeight} ref={canvasRef} />;
}
