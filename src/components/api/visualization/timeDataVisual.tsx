import React, { useEffect, useRef } from 'react';
import { DisplayStatus, ControlStatus } from '../../../react-redux&middleware/redux/typesImports';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

let audioContext: AudioContext;
let analyser: AnalyserNode;
let dataArray: Uint8Array;
let source: MediaStreamAudioSourceNode;
let rafId: number;

let canvas: HTMLCanvasElement;
let canvasCtx: CanvasRenderingContext2D | null;
let color: string;
let mediaStream: MediaStream;

const setupSource = async () => {
  mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  source = audioContext.createMediaStreamSource(mediaStream);
  source.connect(analyser);
};

export function TimeDataVisual(props: any) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const theme = useSelector((state: RootState) => state.DisplayReducer as DisplayStatus);
  const listening = useSelector((state: RootState) => (state.ControlReducer as ControlStatus).listening);

  color = theme.textColor;

  useEffect(() => {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    canvas = canvasRef.current!;
    canvasCtx = canvas.getContext('2d');

    setupSource().then(() => {
      if (listening) {
        rafId = requestAnimationFrame(draw);
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
      analyser.disconnect();
      source.disconnect();
      mediaStream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (!analyser || !source) return;

    if (listening) {
      rafId = requestAnimationFrame(draw);
    } else {
      cancelAnimationFrame(rafId);
    }
  }, [listening]);

  const draw = () => {
    rafId = requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    if (!canvasCtx) return;

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = color;
    canvasCtx.beginPath();
    
    const sliceWidth = canvas.width / dataArray.length;
    let x = 0;
    
    dataArray.forEach((data, i) => {
      const v = data / 128;
      const y = (v * canvas.height) / 2;
    
      if (i === 0) {
        canvasCtx!.moveTo(x, y);
      } else {
        canvasCtx!.lineTo(x, y);
      }
    
      x += sliceWidth;
    });
    
    canvasCtx.stroke();
  };

  return <canvas width={props.visualWidth} height={props.visualHeight} ref={canvasRef} />;
}

