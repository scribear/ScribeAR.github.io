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

var circular_visual: HTMLElement | null;

const setSource = async () => {
    const newMediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
    })

    await (source = audioContext.createMediaStreamSource(newMediaStream))
    await (source.connect(analyser))
};

function drag_start(event) {
    console.log(29, "target: ", event.target);
    console.log(30, "event: ", event)
    var style = window.getComputedStyle(event.target, null);
    event.dataTransfer.setData("text/plain",
    (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY));
} 

function drag_over(event) {
    event.preventDefault(); 
    return false; 
} 

function drop(event) {
    var offset = event.dataTransfer.getData("text/plain").split(',');
    // console.log(20, 'drop')
    // console.log(44, "currentTarget: ", event.currentTarget);
    console.log(45, "target: ", event.target);
    console.log(46, "event: ", event)
    if (!circular_visual) return
    circular_visual.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
    circular_visual.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
    event.preventDefault();
    return false;
} 

const setVisual = () => {
    circular_visual = document.getElementById('circular_visual')

    circular_visual?.addEventListener('dragstart', drag_start, false)
    document.body.addEventListener('dragover', drag_over, false)
    document.body.addEventListener('drop', drop, false)
}

export function NoFreqVisual() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const theme = useSelector((state: RootState) => {
        return state.DisplayReducer as DisplayStatus;
    });

    const control = useSelector((state: RootState) => {
        return state.ControlReducer as ControlStatus;
    })

    color = theme.textColor;

    useEffect(() => {
        // connect related dragging functions to html element
        setVisual()

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

        const height = canvas.height;
        const width = canvas.width;
        canvasCtx.clearRect(0, 0, width, height);
        const RADIUS = 80;
        const POINTS = 360;
        let sum = dataArray.reduce((previous, current) => current += previous);
        let avg = sum / dataArray.length;

        for (let i = 0; i < POINTS; i++) {
            let rel = ~~(i * (POINTS / dataArray.length));
            let x = width / 2 + RADIUS * Math.cos((i * 2 * Math.PI) / POINTS);
            let y = height / 2 + RADIUS * -Math.sin((i * 2 * Math.PI) / POINTS);
            var x_2 = x + (dataArray[rel] / (8 / 1)) * Math.cos((i * 2 * Math.PI) / POINTS); // 8 takes any positive value
            let y_2 = y + (dataArray[rel] / (8 / 1)) * -Math.sin((i * 2 * Math.PI) / POINTS);// 8 takes any positive value
            let x_3 = width / 2 + (1) * avg * Math.cos((i * 2 * Math.PI) / POINTS);// 1 takes any positive value
            let y_3 = height / 2 + (1) * avg * -Math.sin((i * 2 * Math.PI) / POINTS); // 1 takes any positive value
            let x_4 = x_3 - 0.5 * avg * Math.cos((i * 2 * Math.PI) / POINTS);
            let y_4 = y_3 - 0.5 * avg * -Math.sin((i * 2 * Math.PI) / POINTS);
            let x_5 = x - 0.3 * Math.cos((i * 2 * Math.PI) / POINTS);
            let y_5 = y - 0.3 * -Math.sin((i * 2 * Math.PI) / POINTS);

            //draw the circular spectrum
            canvasCtx.beginPath();
            canvasCtx.moveTo(x, y);
            canvasCtx.lineTo(x_2, y_2);
            canvasCtx.strokeStyle = color;
            canvasCtx.stroke();
            //draw the margin circle
            canvasCtx.beginPath();
            canvasCtx.moveTo(x, y);
            canvasCtx.lineTo(x_5, y_5);
            canvasCtx.stroke();

            //draw the inner circle
            // canvasCtx.beginPath();
            // canvasCtx.moveTo(x_4, y_4);
            // canvasCtx.lineTo(x_3, y_3);
            // if (y_4 - y_3 > 10) {
            //     canvasCtx.strokeStyle = '#ff0000';
            // }
            // canvasCtx.stroke();
        }
    }
    
    return <canvas width={"400vw"} height="300vh" ref={canvasRef} />
}
