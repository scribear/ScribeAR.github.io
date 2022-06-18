import React, { useEffect, useRef } from 'react'

var rafId;
var canvas;
var canvasCtx;

export function TestVisual() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        rafId = requestAnimationFrame(draw); // draw is called before each repaint; // rafId : unique id for the callback funciton draw()

        // setup canvas
        canvas = canvasRef.current;
        if (!canvas) {
            return;
        }
        canvasCtx = canvas.getContext('2d')

        return () => { // clean up funciton
            cancelAnimationFrame(rafId);
        }
    }, [])

    const draw = () => { // the draw function
        requestAnimationFrame(draw);

        const height = canvas.height;
        const width = canvas.width;
        canvasCtx.clearRect(0, 0, width, height);
        canvasCtx.fillStyle = "rgba(255, 255, 255, 0.2)"
        canvasCtx.fillRect(0, 0, width, height);
    }
    
    return <canvas width={"300vw"} height="300vh" ref={canvasRef} />
}
