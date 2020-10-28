import React from 'react'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import {Button,IconButton, Icon} from '@material-ui/core'
import {useDispatch} from 'react-redux'
import '../Save/Save.css'

export default function GotoButton(props){
    const dispatch = useDispatch()
    return (
        <div>
            {props.title}
            <IconButton onClick = {props.action}>
                <ArrowForwardIosIcon />
            </IconButton>
        </div>
    )
}