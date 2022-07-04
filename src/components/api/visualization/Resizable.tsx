import React, { useEffect, useState } from 'react';
import { DisplayStatus, ControlStatus } from '../../../redux/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

import './resizable.css'

// var resizableElem: HTMLElement | null;

var startingX : number;
var startingY : number;

// export const Resizable : React.FC = (props) => {
export function Resizable (props) {

    const theme = useSelector((state: RootState) => {
        return state.DisplayReducer as DisplayStatus;
    });

    // starting coordinates for mouse down event; useState does not update immediately
    // const [startingCoord, setStartingCoord] = useState({
    //     x: 0,
    //     y: 0, 
    // })

    const [style, setStyle] = useState({
        // width: '280px', // also the width for audio visual
        // height: '280px', // also the height for audio visual
        width: props.size,
        height: props.size,
        border: '',
    })

    const [borderStyle, setBorderStyle] = useState({
        border: ''
    })

    // Handle the mousedown event
    // that's triggered when user drags the resizer
    const mouseDownHandler = function (event) {
        event.preventDefault()

        // Get/Save the current mouse position
        // Cannot use dataTransfer to save starting X, Y: Only for drag-related event
        startingX = event.clientX;
        startingY = event.clientY;


        // Attach the listeners to `document`
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = function (event) {
        // event.stopPropagation()
        event.preventDefault()

        // Get chage in mouse move
        const dx : number = event.clientX - startingX;
        const dy : number = event.clientY - startingY;

        // Get the element style
        var resizable = document.getElementsByClassName('resizable');
    
        // Adjust the dimension of the visual element
        const original_width : number = parseFloat(style.width); // 'px' are parsed automatically
        const original_height : number = parseFloat(style.height); // 'px' are parsed automatically
        const newWidth : number = Math.max(original_width + dx, 100);
        const newHeight : number = Math.max(original_height + dy, 100);
        // console.log( "start: ", [startingX, startingY], "move to: ", [event.clientX, event.clientY], "; d: ", [dx, dy])
        // console.log("original: ", [original_width, original_height], "; new: ", [newWidth, newHeight])
        const min : string = `${Math.min(newWidth, newHeight)}px`; // stays a square
        setStyle({...style, width: min, height: min});
        return false
    };
    
    const mouseUpHandler = function () {
        // Remove the handlers of `mousemove` and `mouseup`
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    const mouseEnter = (event) => {
        setBorderStyle({...borderStyle, border: `3px dotted ${theme.textColor}`});
        setStyle({...style, border: `3px dotted ${theme.textColor}`});
        // event.stopPropagation();
    }

    const mouseLeave = (event) => {
        setBorderStyle({...borderStyle, border: ''})
        setStyle({...style, border: ''})
        event.stopPropagation();
    }

    const renderChildren = (additionalProps : Object | null = null) => {
        if (!additionalProps) {
            return props.children;
        }

        return React.Children.map(props.children, (child) => {
            return React.cloneElement(child, additionalProps, null)
        })
    }

    return (
        <div className='resizable' onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} style={style}>
            <div className='resizer top-left' onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} onMouseDown={mouseDownHandler} style={borderStyle}></div>
            <div className='resizer top-right' onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} onMouseDown={mouseDownHandler} style={borderStyle}></div>
            {renderChildren({visualWidth: style.width, visualHeight: style.height})}
            <div className='resizer bottom-left' onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} onMouseDown={mouseDownHandler} style={borderStyle}></div>
            <div className='resizer bottom-right' onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} onMouseDown={mouseDownHandler} style={borderStyle}></div>
        </div>
    );
}
