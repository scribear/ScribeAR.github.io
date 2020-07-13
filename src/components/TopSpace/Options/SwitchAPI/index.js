import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import store from '../../../../store'
import './index.css'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import IconButton from '@material-ui/core/IconButton';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import { flip_on_webspeech } from '../../../../redux/actions'

export default function SwitchAPI(props) {
     const onWebspeech = (state) => state.onWebspeech
     const wantsWebspeech = useSelector(onWebspeech)// Get current value of recording.
     // useDispatch returns the state modifying function, invoked below.
     const dispatch = useDispatch()
     // record-btn-wrapper toggles between the two buttons using the TopSpace
     // hidden/shown CSS.
     if (wantsWebspeech == false) {
        return(
            <div>
                Switch To Webspeech
                  <IconButton className = "Switch" color= "inherit" size = "large" onClick={() => dispatch(flip_on_webspeech())} >
                        <PauseCircleFilledIcon className = "pause"/>
                  </IconButton>
            </div>
        )
     } else {
        return(
            <div>
                Switch to Azure
                  <IconButton className = "Switch" color= "inherit" size = "large" onClick={() => dispatch(flip_on_webspeech())}>
                         <PlayCircleFilledIcon className = "start"/>
                  </IconButton>
            </div>
        )
    }
}
