import React from 'react'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import {IconButton} from '@material-ui/core'
import {useDispatch} from 'react-redux'
import PopMenu from '../../PopMenu'
import PropTypes from 'prop-types'


MenuSwitch.defaultProps = {
    isMainMenu: 'false'
}

export default function MenuSwitch(props){
    const dispatch = useDispatch()
    const isMainMenu = props.submenu
    if (isMainMenu){
        return (<div>
            <IconButton color = 'inherit' onClick = {()=>(dispatch(props.left()))}>
                    <ArrowBackIosIcon />
            </IconButton>
                <PopMenu title = {props.title} />
            <IconButton color = 'inherit' onClick = {()=>(dispatch(props.right()))}>
                    <ArrowForwardIosIcon />
            </IconButton>
        </div>)
    }else{
        return (
            <div>
                <IconButton color = 'inherit' onClick = {()=>(dispatch(props.left()))}>
                    <ArrowBackIosIcon />
                </IconButton>
                {props.title}
                <IconButton color = 'inherit' onClick = {()=>(dispatch(props.right()))}>
                    <ArrowForwardIosIcon />
                </IconButton>
            </div>
        )
    }
}