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
    // console.log(45, "target: ", event.target);
    // console.log(46, "event: ", event)
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

    /**
     * @description
     * Render audio author and title.
     */
const renderText = () => {
    var cx = canvas.width / 2;
    var cy = canvas.height / 2;
    var correction = 10;

    var title = ""
    var author = "Unamed"
    var font = ['12px', 'Helvetica']

    canvasCtx.fillStyle = color;

    canvasCtx.textBaseline = 'top';
    canvasCtx.fillText(author, cx + correction, cy);
    canvasCtx.font = parseInt(font[0], 10) + 8 + 'px ' + font[1];
    canvasCtx.textBaseline = 'bottom';
    canvasCtx.fillText(title, cx + correction, cy);
    canvasCtx.font = font.join(' ');
};

/**
 * @description
 * Render audio time.
 */
const renderTime = () => {
    // var time = this.minutes + ':' + this.seconds;
    // canvasCtx.fillText(time, canvas.width / 2 + 10, canvas.height / 2 + 40);
};

/**
 * @description
 * Render frame by style type.
 *
 * @return {Function}
 */
const renderByStyleType = () => {
    // return this[TYPE[this.style]]();
    renderLounge();
};

/**
 * @description
 * Render lounge style type.
 */
const renderLounge = () => {
    var barWidth = 2;
    var barHeight = 2;
    var barSpacing = 7;

    // const height = canvas.height;
    // const width = canvas.width;
    // canvasCtx.clearRect(0, 0, width, height);

    var cx = canvas.width / 2;
    var cy = canvas.height / 2;
    var radius = 140; // how large is the circle
    var maxBarNum = Math.floor((radius * 2 * Math.PI) / (barWidth + barSpacing)); // control max number of bars
    var slicedPercent = Math.floor((maxBarNum * 25) / 100);
    var barNum = maxBarNum - slicedPercent;
    var freqJump = Math.floor(dataArray.length / maxBarNum); // gap (of frequency) for each bar 

    canvasCtx.fillStyle = color;
    for (var i = 0; i < barNum; i++) {
        var amplitude = dataArray[i * freqJump];
        var alfa = (i * 2 * Math.PI ) / maxBarNum;
        var beta = (3 * 45 - barWidth) * Math.PI / 180;
        var x = 0;
        // var y = 1 - radius - (amplitude / 12 - barHeight); // flipped
        // var y = (amplitude / 12 - barHeight) - radius; // inverted
        var y = 1 - radius - (amplitude / 12 - barHeight);
        var w = barWidth;
        var h = amplitude / 6 + barHeight;

        canvasCtx.save();
        canvasCtx.translate(cx + barSpacing, cy + barSpacing);
        canvasCtx.rotate(alfa - beta);
        canvasCtx.fillRect(x, y, w, h);
        canvasCtx.restore();
    }
};

export function LoungeVisual() {
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
        rafId = requestAnimationFrame(draw);

        // get data into dataArray
        analyser.getByteFrequencyData(dataArray);

        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        // renderTime();
        // renderText();
        renderByStyleType();
    }
    
    return <canvas width={"400vw"} height="300vh" ref={canvasRef} />
}
