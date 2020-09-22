import React from 'react'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import {IconButton,} from '@material-ui/core'
import '../Save/index.css'

export default function GotoButton(props){
    return (
        <div>
            {props.title}
            <IconButton onClick = {props.action}>
                <ArrowForwardIosIcon />
            </IconButton>
        </div>
    )
}