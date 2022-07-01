import React, { useEffect, useRef, useState } from 'react'
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

export function LoungeVisual(props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const theme = useSelector((state: RootState) => {
        return state.DisplayReducer as DisplayStatus;
    });

    // const control = useSelector((state: RootState) => {
    //     return state.ControlReducer as ControlStatus;
    // })

    color = theme.textColor;

    const setSource = async () => {
        const newMediaStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
        })
    
        await (source = audioContext.createMediaStreamSource(newMediaStream))
        await (source.connect(analyser))
    };
    
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
    
        var cx = canvas.width / 2;
        var cy = canvas.height / 2;
        // console.log("canvas: ", canvas.width, canvas.height)
        var radius = Math.min(canvas.width, canvas.height) / 2.5; // determined by the smaller of width or height
        var maxBarNum = Math.floor((2 * Math.PI * radius) / (barWidth + barSpacing)); // control max (total possible) number of bars: circumference / (width + spacing)
        // var slicedPercent = Math.floor(maxBarNum * 0.25); // only 0.25% of bars will be deleted
        // var barNum = maxBarNum - slicedPercent;
        var barNum = maxBarNum * 0.75; // controls how much frequency are shown
        var freqJump = Math.floor(dataArray.length / maxBarNum); // gap of index (of frequency array) for each bar 
        var eachDataFreq = audioContext.sampleRate / 2 / dataArray.length; // Nyquist Rate Theroem: 2x the range of sampling rate to capture the range.
        // console.log(eachDataFreq);
        // console.log("jump: ", freqJump);

        const hypotenuseLength = (canvas.width / 4);

        canvasCtx.fillStyle = color;
        for (var i = 0; i < barNum; i++) {
            var amplitude = dataArray[i * freqJump]
            var alfa = (2 * Math.PI * i) / maxBarNum; // (2 pi i) / (2 pi r / width) => (i * width) / r
            var beta = (3 * 45 - barWidth) * Math.PI / 180; // pi * 0.75
            // var beta = Math.PI * 0.75;
            var x = 0;
            // var y = 1 - radius - (amplitude / 12 - barHeight); // flipped
            // var y = (amplitude / 12 - barHeight) - radius; // inverted
            var y = 1 - radius - (amplitude / 6 - barHeight);
            var w = barWidth;
            var h = amplitude / 3 + barHeight;
            // Maybe Relationship: 2 * 6 = 12

    
            canvasCtx.save();
            // canvasCtx.translate(cx + barSpacing, cy + barSpacing);
            canvasCtx.translate(cx, cy); // doesn't need to + barSpacing

            // canvasCtx.fillRect(-hypotenuseLength, 0, 2 * hypotenuseLength, 1);
            // canvasCtx.fillRect(0, -hypotenuseLength, 1, 2 * hypotenuseLength);

            canvasCtx.save(); // right before rotation
            const rotate = (alfa - beta) * 1;
            canvasCtx.rotate(rotate); // controls starting bar (how much to rotate)
            canvasCtx.fillRect(x, y, w, h);
            // canvasCtx.fillRect(0, 0, w, hypotenuseLength)
            canvasCtx.restore() // rotate back so that text can be displayed normally
            if (i % 10 == 0) {
                const freqText = `${Math.round(eachDataFreq * (i  * freqJump))} hz`;
                // const freqText = `${20 + eachDataFreq * (i  * freqJump)} hz`;
                const canvasRotateAngle = rotate;
                var angle = -1 * canvasRotateAngle;
                const textX = Math.sin(angle) * hypotenuseLength;
                const textY = Math.cos(angle) * hypotenuseLength;

                canvasCtx.textAlign = 'center';
                canvasCtx.fillText(`${freqText}`, -textX, -textY); // the x and y might should be determined by cavnas width and height
            }
            canvasCtx.restore();
        }
    };

    useEffect(() => {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        var analyserOptions : AnalyserOptions = { // visual largely affected by fftSize and minDecibels. Roughly direct relationship 
            "fftSize": 512, // fftSize / 2 is the length of the dataArray. Less: Data are Crunched: Large: the Opposite
            "maxDecibels": -30,
            "minDecibels": -70, // lowest volume to pick up
            "smoothingTimeConstant": 0.8, // lower: less smooth
        };
        // analyser = audioContext.createAnalyser();
        analyser = new AnalyserNode(audioContext, analyserOptions); // for AnalyserOptions

        dataArray = new Uint8Array(analyser.frequencyBinCount); // get data for visualization. frequencyBinCount = fftSize / 2

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
    
    // return <canvas width={"400vw"} height="300vh" ref={canvasRef} />
    return <canvas width={props.visualWidth} height={props.visualHeight} ref={canvasRef} />
}
