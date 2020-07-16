import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import store from '../../../../store'
import './index.css'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import IconButton from '@material-ui/core/IconButton';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import { flip_recording, flip_recording_azure } from '../../../../redux/actions'

export default function Record(props) {
     const recording = (state) => state.recording
     const recordingAzure = (state) => state.recordingAzure
     const switchToAzure = (state) => state.switchToAzure
     const setting = useSelector(recording)
     const settingAzure = useSelector(recordingAzure)
     const settingSwitchToAzure = useSelector(switchToAzure)// Get current value of recording.
     // useDispatch returns the state modifying function, invoked below.
     const dispatch = useDispatch()
     // record-btn-wrapper toggles between the two buttons using the TopSpace
     // hidden/shown CSS.
     if (store.isSuccessReducer == 'inProgress') {
       return(
            <div className="item-wrapper-record">
                 Listening
                 <IconButton className = "Play" color= "inherit" size = "large"  >
                      <PauseCircleFilledIcon className = "pause"/>
                 </IconButton>
            </div>
       )
     } else if (store.isSuccessReducer == 'success') {
       if (settingAzure == true){
          return(
               <div className="item-wrapper-record">
                    Listening
                    <IconButton className = "Play" color= "inherit" size = "large" onClick={() => dispatch(flip_recording_azure())} >
                         <PauseCircleFilledIcon className = "pause"/>
                    </IconButton>
               </div>
          )
     } else{
          return(
               <div className="item-wrapper-record">
                    To Start
                    <IconButton className = "Play" color= "inherit" size = "large" onClick={() => dispatch(flip_recording_azure())}>
                         <PlayCircleFilledIcon className = "start"/>
                    </IconButton>
               </div>
          )
     }
     } else {
       
       if (setting == true){
             return(
                  <div className="item-wrapper-record">
                       Listening
                       <IconButton className = "Play" color= "inherit" size = "large" onClick={() => dispatch(flip_recording())} >
                            <PauseCircleFilledIcon className = "pause"/>
                       </IconButton>
                  </div>
             )
        } else{
             return(
                  <div className="item-wrapper-record">
                       To Start
                       <IconButton className = "Play" color= "inherit" size = "large" onClick={() => dispatch(flip_recording())}>
                            <PlayCircleFilledIcon className = "start"/>
                       </IconButton>
                  </div>
             )
        }
   }
}
