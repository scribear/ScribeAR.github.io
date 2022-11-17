import React, { useEffect, useRef } from 'react'
import { DisplayStatus, ControlStatus } from '../../../react-redux&middleware/redux/types';
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

export function TimeDataVisual(props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const theme = useSelector((state: RootState) => {
        return state.DisplayReducer as DisplayStatus;
    });

    // const control = useSelector((state: RootState) => {
    //     return state.ControlReducer as ControlStatus;
    // })

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
        analyser.getByteTimeDomainData(dataArray);

        // How much data should we collect
        analyser.fftSize = 2 ** 8; // 512

        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);





        // now that we have the data, lets turn it into something visual
        // 1. Clear the canvas TODO
        // 2. setup some canvas drawing
        canvasCtx.lineWidth = 2;
        // canvasCtx.strokeStyle = "#ffc600";
        canvasCtx.strokeStyle = color;
        canvasCtx.beginPath();
        const sliceWidth = canvas.width / analyser.frequencyBinCount;
        let x = 0;
        dataArray.forEach((data, i) => {
            const v = data / 128;
            const y = (v * canvas.height) / 2;
            // draw our lines
            if (i === 0) {
            canvasCtx.moveTo(x, y);
            } else {
            canvasCtx.lineTo(x, y);
            }
            x += sliceWidth;
        });
        canvasCtx.stroke();








        // var x = 0;
        // const width = canvas.width;
        // const height = canvas.height;
        // // console.log("drawing line")

        // const sliceWidth = (width * 1.0) / dataArray.length;
        // // console.log(sliceWidth)
        // canvasCtx.lineWidth = 2;
        // canvasCtx.beginPath();
        // // canvasCtx.moveTo(0, height / 2);
        // dataArray.forEach((data, i) => {
        //     // const y = (data / 255.0) * height;
        //     // canvasCtx.lineTo(x, y);
        //     // x += sliceWidth;

        //     const v = data / 128;
        //     const y = (v * canvas.height) / 2;
        //     // draw our lines
        //     if (i === 0) {
        //         canvasCtx.moveTo(x, y);
        //     } else {
        //         canvasCtx.lineTo(x, y);
        //     }
        //     x += sliceWidth;
        // });
        // // for (const item of dataArray) {
        // //     const y = (item / 255.0) * height * (1 / 1); // positive value
        // //     canvasCtx.lineTo(x, y);
        // //     x += sliceWidth;
        // // }
        // canvasCtx.lineTo(x, height / 2);
        // canvasCtx.strokeStyle = color;
        // canvasCtx.stroke();
    }

    return <canvas width={props.visualWidth} height={props.visualHeight} ref={canvasRef} />
}
