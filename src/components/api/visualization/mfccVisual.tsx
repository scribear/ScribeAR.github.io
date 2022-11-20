import React, { useEffect, useRef } from 'react'
import { DisplayStatus } from '../../../redux/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import Meyda from 'meyda';
import { MeydaAnalyzer } from 'meyda/dist/esm/meyda-wa';

var audioContext: AudioContext;
var analyser: MeydaAnalyzer;
var dataArray: number[];
var source: MediaStreamAudioSourceNode;
var rafId: number;
var canvas: HTMLCanvasElement;
var canvasCtx: CanvasRenderingContext2D;

var color: string | CanvasGradient | CanvasPattern;

export function MFCCVisual(props: any) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const theme = useSelector((state: RootState) => {
    return state.DisplayReducer as DisplayStatus;
  });

  color = theme.textColor;

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
	  dataArray = features.mfcc;
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

    if (dataArray.length == 0) return;

    const sliceWidth = canvas.width / dataArray.length;
    dataArray.forEach((data, i) => {
      if (data > 0) {
	canvasCtx.fillStyle = 'ForestGreen';
      } else {
	canvasCtx.fillStyle = 'Maroon';
      }
      canvasCtx.fillRect(i * sliceWidth, canvas.height / 2, sliceWidth, -data);
    });
  }

  return <canvas width={props.visualWidth} height={props.visualHeight} ref={canvasRef} />
}
