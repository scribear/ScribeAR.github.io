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
const HISTORY_LENGTH = 40;
const MFCC_COEFFICIENTS = 40;
var history_write_index = 0;
var history: Float64Array = new Float64Array(HISTORY_LENGTH * MFCC_COEFFICIENTS);

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
        bufferSize: 512,
        numberOfMFCCCoefficients: MFCC_COEFFICIENTS,
        featureExtractors: ['loudness', 'mfcc'],
        callback: (features: { loudness: any, mfcc: number[]; }) => {
          if (features.loudness.total >= LOUDNESS_THRESHOLD) {
            const begin = history_write_index * MFCC_COEFFICIENTS;
            const end = begin + MFCC_COEFFICIENTS;
            history.subarray(begin, end).set(features.mfcc);
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

    if (history.length === 0) return;

    const sliceWidth = canvas.width / MFCC_COEFFICIENTS;
    const sliceHeight = canvas.height / HISTORY_LENGTH;
    for (var row = 0; row < HISTORY_LENGTH; row ++) {
      const display_row = (HISTORY_LENGTH - history_write_index + row) % HISTORY_LENGTH;
      const begin = row * MFCC_COEFFICIENTS;
      const end = begin + MFCC_COEFFICIENTS;
      history.subarray(begin, end).forEach((data, col) => {
        canvasCtx.fillStyle = `rgba(255, 255, 255, ${data})`;
        canvasCtx.fillRect(
          col * sliceWidth,
          display_row * sliceHeight,
          sliceWidth,
          sliceHeight
        );
      });
    }
  }

  return <canvas width={props.visualWidth}
                 height={props.visualHeight}
                 ref={canvasRef} />
}
