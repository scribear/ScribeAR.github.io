import React, { useEffect, useRef, useState } from 'react';
import { RootState } from '../../../store';
import { DisplayStatus, ControlStatus } from '../../../react-redux&middleware/redux/typesImports';
import { useSelector } from 'react-redux';

import './canvasFonts.css';

let audioContext;
let analyser;
let dataArray;
let source;
let rafId;
let canvas;
let canvasCtx;

let color;
let showLabels: boolean;

const font = 'Orbitron';

export const LoungeVisual = (props) => {
  const [sLabel, setSLabel] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const theme = useSelector((state: RootState) => state.DisplayReducer as DisplayStatus);
  const listening = useSelector((state: RootState) => (state.ControlReducer as ControlStatus).listening);

  color = theme.textColor;
  showLabels = sLabel;

  const setupAudio = async () => {
    audioContext = new (window.AudioContext || window.webkitAudioContext)({ latencyHint: 'interactive' });

    const analyserOptions: AnalyserOptions = {
      fftSize: 512,
      maxDecibels: -30,
      minDecibels: -70,
      smoothingTimeConstant: 0.8,
    };
    analyser = new AnalyserNode(audioContext, analyserOptions);
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    source = audioContext.createMediaStreamSource(mediaStreamRef.current);
    source.connect(analyser);

    canvas = canvasRef.current;
    if (!canvas) return;
    canvasCtx = canvas.getContext('2d');

    rafId = requestAnimationFrame(draw);
  };

  useEffect(() => {
    if (listening) {
      setupAudio();
    } else {
      cancelAnimationFrame(rafId);
      if (analyser) analyser.disconnect();
      if (source) source.disconnect();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    }

    return () => {
      cancelAnimationFrame(rafId);
      if (analyser) analyser.disconnect();
      if (source) source.disconnect();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [listening]);

  const draw = () => {
    rafId = requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    renderByStyleType();
  };

  const renderByStyleType = () => {
    renderLounge();
  };

  const renderLounge = () => {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 2.5;
    const barNum = 128;
    const maxBarNum = 128 / 0.75;
    const barHeight = 2;
    const barSpacing = 4;
    const barWidth = (1 / maxBarNum) * (2 * Math.PI * radius) / 2;
    const freqArrIdxJump = 2;
    const eachDataFreq = audioContext.sampleRate / 2 / dataArray.length;
    const hypotenuseLength = canvas.width / 4;

    canvasCtx.font = `${canvas.width / 10}px ${font}`;
    canvasCtx.textAlign = 'center';
    canvasCtx.textBaseline = 'middle';
    if (showLabels) {
      canvasCtx.fillText('kHz', cx, cy + hypotenuseLength);
    }

    canvasCtx.fillStyle = color;
    for (let i = 0; i <= barNum; i++) {
      const amplitude = dataArray[Math.floor(i * freqArrIdxJump)];
      const alfa = (2 * Math.PI * i) / maxBarNum;
      const beta = (3 * 45 - barWidth) * Math.PI / 180;
      const y = 1 - radius - (amplitude / 6 - barHeight);
      const w = barWidth;
      const h = amplitude / 3 + barHeight;

      canvasCtx.save();
      canvasCtx.translate(cx, cy);
      canvasCtx.save();
      const rotate = (alfa - beta);
      canvasCtx.rotate(rotate);
      canvasCtx.fillRect(0, y, w, h);

      if (showLabels) {
        if (i % 16 === 0) {
          canvasCtx.fillRect(0, -1.2 * hypotenuseLength, w, -0.2 * hypotenuseLength);
          canvasCtx.restore();

          const roundFreq = Math.round(eachDataFreq * Math.floor(i * freqArrIdxJump) / 100) * 100;
          const freqText = `${roundFreq >= 1000 ? `${roundFreq / 1000}` : roundFreq}`;
          const angle = -1 * rotate;
          const textX = Math.sin(angle) * hypotenuseLength;
          const textY = Math.cos(angle) * hypotenuseLength;

          canvasCtx.font = `${canvas.width / 18}px ${font}`;
          canvasCtx.fillText(freqText, -textX, -textY);
        } else {
          canvasCtx.restore();
        }
      } else {
        canvasCtx.restore();
      }
      canvasCtx.restore();
    }
  };

  return (
    <canvas
      onClick={() => setSLabel(!sLabel)}
      width={props.visualWidth}
      height={props.visualHeight}
      ref={canvasRef}
    />
  );
};