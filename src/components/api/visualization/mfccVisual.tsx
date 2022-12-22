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

const HISTORY_LENGTH = 30;
var history_write_index = 0;
var history: number[][] = [];

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
        numberOfMFCCCoefficients: 40,
        featureExtractors: ['mfcc'],
        callback: (features: { mfcc: number[]; }) => {
          if (history.length === HISTORY_LENGTH) {
            history[history_write_index] = features.mfcc;
            history_write_index = (history_write_index + 1) % HISTORY_LENGTH;
          } else {
            history.push(features.mfcc);
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

    const sliceWidth = canvas.width / history[0].length;
    const sliceHeight = canvas.height / HISTORY_LENGTH;
    history.forEach((mfccArray, row) => {
      const actual_row = (HISTORY_LENGTH - history_write_index + row) % HISTORY_LENGTH;
      mfccArray.forEach((data, col) => {
        canvasCtx.fillStyle = `rgba(255, 255, 255, ${data})`;
        canvasCtx.fillRect(
          col * sliceWidth,
          actual_row * sliceHeight,
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
