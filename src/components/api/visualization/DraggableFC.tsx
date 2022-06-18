import React, { useEffect } from 'react';

var draggableElem: HTMLElement | null;

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
    if (!draggableElem) return
    draggableElem.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
    draggableElem.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
    event.preventDefault();
    return false;
} 

const setVisual = (id) => {
    draggableElem = document.getElementById(id)
    // draggableElem?.addEventListener('dragstart', drag_start, false)
    document.body.addEventListener('dragover', drag_over, false)
    document.body.addEventListener('drop', drop, false)
}

export function Draggable (props) {
    useEffect(() => {
        setVisual(props.id)
    }, [])

    return (
        <div id={props.id} draggable='true' onDragStart={drag_start} style={{position: 'absolute', left: '0', top: '0', zIndex: 1, paddingTop: '5%', paddingLeft: '5%', right: '90'}}>
            {props.children}
        </div>
    )
}
