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
    // console.log("computed: ", [getComputedStyle(draggableElem).getPropertyValue('left'), getComputedStyle(draggableElem).getPropertyValue('right'), getComputedStyle(draggableElem).getPropertyValue('top'), getComputedStyle(draggableElem).getPropertyValue('bottom')])
    // console.log(window)
    // corner cases
    // console.log(window.screen)
    var newLeft = (event.clientX + parseInt(offset[0], 10));
    var newRight = newLeft + parseInt(style.getPropertyValue('width'), 10);
    // var newRight = newLeft + parseInt(draggableElem.style.width, 10);
    var newTop = (event.clientY + parseInt(offset[1], 10));
    var newBottom = newTop + parseInt(style.getPropertyValue('height'), 10);
    // var newBottom = newTop + parseInt(draggableElem.style.height, 10);
    // console.log('new: ', [newLeft, newRight, newTop, newBottom])

    // const dimension = fitInnerWindow(newLeft, newRight, newTop, newBottom)
    // // console.log('fit new: ', dimension)
    // // draggableElem.style.left = newLeft + 'px';
    // // draggableElem.style.top = newTop + 'px';
    // draggableElem.style.left = dimension[0];
    // draggableElem.style.right = dimension[1];
    // draggableElem.style.top = dimension[2];
    // draggableElem.style.bottom = dimension[3];

    draggableElem.style.left = `${Math.max(0, newLeft)}px`;
    draggableElem.style.right = `${Math.min(1440, newRight)}px`;
    draggableElem.style.top = `${Math.max(0, newTop)}px`
    draggableElem.style.bottom = `${Math.min(900, newBottom)}px`


    // console.log(draggableElem.style)

    event.preventDefault();
    return false;
} 

const fitInnerWindow = (newLeft : number, newRight : number, newTop : number, newBottom: number) => {
    if (newLeft < 0) { // left
        if (newTop < 0) { // top left corner
            return ['0px', 'auto', '0px', 'auto']
        } else if (newTop > window.screen.availHeight) { // bottom left corner
            return ['0px', 'auto', 'auto', `${window.screen.availWidth}px`]
        }

        // simply on the left
        return ['0px', 'auto', `${newTop}px`, 'auto']
    } else if (newBottom < 0) { // bottom
        if (newTop < 0) { // top right corner
            // left: auto; right: availWidth; Top: 0px; bottom: auto
            return ['auto', `${window.screen.availWidth}px`, '0px', 'auto']
        } else if (newRight > window.screen.availWidth) { // bottom right corner
            return ['auto', `${window.screen.availWidth}px`, 'auto', '0px']
        }

        // simply on the bottom
        return [`${newLeft}px`, 'auto', 'auto', '0px']
    }

    return [`${newLeft}px`, 'auto', `${newTop}px`, 'auto']
}

const setDraggable = (id) => {
    draggableElem = document.getElementById(id)
    // draggableElem?.addEventListener('dragstart', drag_start, false)
    document.body.addEventListener('dragover', drag_over, false)
    document.body.addEventListener('drop', drop, false)
    document.body.addEventListener('mousemove', (event) => {
        console.log('mouse client: ', [event.clientX, event.clientY])
        console.log('mouse screen : ', [event.screenX, event.screenY])
    },)
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
