import React, { useEffect, useRef } from 'react'
import { DisplayStatus, ControlStatus } from '../../../redux/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

var audioContext; // reusable; only initialize it once
var analyser; // an AnylyserNode : provide real-time frequency and time-domain analysis information
var dataArray;
var source;
var rafId;
var canvas;
var canvasCtx;

var color;

const setSource = async () => {
    const newMediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
    })

    await (source = audioContext.createMediaStreamSource(newMediaStream))
    await (source.connect(analyser))
};

export function RealFreqVisual() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const theme = useSelector((state: RootState) => {
        return state.DisplayReducer as DisplayStatus;
    });

    const control = useSelector((state: RootState) => {
        return state.ControlReducer as ControlStatus;
    })

    color = theme.textColor;

    useEffect(() => {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        dataArray = new Uint8Array(analyser.frequencyBinCount); // data for visualization

        // connect the source to be analysed
        setSource();
        rafId = requestAnimationFrame(draw); // draw is called before each repaint; // rafId : unique id for the callback funciton draw()

        // setup canvas
        canvas = canvasRef.current;
        if (!canvas) {
            return;
        }
        canvasCtx = canvas.getContext('2d')

        return () => { // clean up funciton
            cancelAnimationFrame(rafId);
            analyser.disconnect();
            source.disconnect();
        }
    }, [])

    const draw = () => { // the draw function
        requestAnimationFrame(draw);

        // get data into dataArray
        analyser.getByteFrequencyData(dataArray);

        // How much data should we collect
        analyser.fftSize = 2 ** 8;

        const height = canvas.height;
        const width = canvas.width;
        const barWidth = (width / analyser.frequencyBinCount) * 0.5; // analyser.frequencyBinCount := how many pieces of data are there.
        canvasCtx.clearRect(0, 0, width, height);

        var x = 0;
        dataArray.forEach((datum) => { // datum is from 0 to 255
            const percent = datum / 255;
            const barHeight = height * percent;
            // convert the color to HSL TODO
            canvasCtx.fillStyle = color;
            canvasCtx.fillRect(x, height - barHeight, barWidth, barHeight);
            x += barWidth + 2;
        });
    }

    return <canvas width={"400vw"} height="300vh" ref={canvasRef} />
}
