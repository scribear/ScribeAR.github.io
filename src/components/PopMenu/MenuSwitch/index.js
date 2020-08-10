import React from 'react'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import {IconButton} from '@material-ui/core'
import {useDispatch} from 'react-redux'
import {prev_page, next_page} from '../../../redux/actions'

export default function MenuSwitch(props){
    const dispatch = useDispatch()
    return (
        <div>
            <IconButton color = 'inherit' onClick = {()=>(dispatch(prev_page()))}>
                <ArrowBackIosIcon />
            </IconButton>
            {props.title}
            <IconButton color = 'inherit' onClick = {()=>(dispatch(next_page()))}>
                <ArrowForwardIosIcon />
            </IconButton>
        </div>
    )
}