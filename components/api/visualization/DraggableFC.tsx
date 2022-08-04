import React, { useEffect } from 'react';

var draggableElem: HTMLElement | null;

function drag_start(event) {
    var style = window.getComputedStyle(event.target, null);
    event.dataTransfer.setData("text/plain",
    (parseInt(style.getPropertyValue("left"), 10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY));
} 

function drag_over(event) {
    event.preventDefault(); 
    return false; 
} 

function drop(event) {
    var offset = event.dataTransfer.getData("text/plain").split(',');
    if (!draggableElem) return

    const style = getComputedStyle(draggableElem);
    // console.log(window.screen.availWidth, window.screen.availHeight, window.innerWidth, window.innerHeight);
    // console.log("Before, computed: ", {left: getComputedStyle(draggableElem).getPropertyValue('left'), right: getComputedStyle(draggableElem).getPropertyValue('right'), top: getComputedStyle(draggableElem).getPropertyValue('top'), bottom: getComputedStyle(draggableElem).getPropertyValue('bottom')});
    var newLeft = (event.clientX + parseInt(offset[0], 10));
    var newTop = (event.clientY + parseInt(offset[1], 10));

    // make sure cannot be dragged outside of the inner screen
    fitInnerWindow(newLeft, style.getPropertyValue('width'), newTop, style.getPropertyValue('height'))

    // console.log("After, computed: ", {left: getComputedStyle(draggableElem).getPropertyValue('left'), right: getComputedStyle(draggableElem).getPropertyValue('right'), top: getComputedStyle(draggableElem).getPropertyValue('top'), bottom: getComputedStyle(draggableElem).getPropertyValue('bottom')})
    event.preventDefault();
    return false;
} 

const fitInnerWindow = (newLeft : number, elemWidth : string, newTop : number, elemHeight : string) => {
    if (!draggableElem) return -1;

    if (newLeft < 0) {
        draggableElem.style.left = "0px";
    } else if ((newLeft + parseInt(elemWidth, 10)) > window.innerWidth) {
        draggableElem.style.left = `${window.innerWidth - parseInt(elemWidth, 10)}px`;
    } else {
        draggableElem.style.left = `${newLeft}px`;
    }

    if (newTop < 0) {
        draggableElem.style.top = "0px";
    } else if ((newTop + parseInt(elemHeight, 10))> window.innerHeight) {
        draggableElem.style.top = `${window.innerHeight - parseInt(elemHeight, 10)}px`;
    } else {
        draggableElem.style.top = `${newTop}px`;
    }

    return 0;
}

const setDraggable = (id) => {
    draggableElem = document.getElementById(id)
    // draggableElem?.addEventListener('dragstart', drag_start, false)
    document.body.addEventListener('dragover', drag_over, false)
    document.body.addEventListener('drop', drop, false)
    // document.body.addEventListener('mousemove', (event) => {
    //     console.log('mouse client: ', [event.clientX, event.clientY])
    //     console.log('mouse screen : ', [event.screenX, event.screenY])
    // },)
}

export function Draggable (props) {
    useEffect(() => {
        setDraggable(props.id)
    }, [])

    return (
        <div id={props.id} draggable='true' onDragStart={drag_start} style={{position: 'absolute', left: '100px', top: '100px', zIndex: 1}}>
            {props.children}
        </div>
    )
}
