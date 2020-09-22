import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import store from '../../../../store'
import styles from './index.module.css'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import ToggleButton from "../../../ToggleButton";
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import { flip_recording, flip_recording_azure } from '../../../../redux/actions'


export default function Record(props) {
     const recording = (state) => state.recording
     const recordingAzure = (state) => state.recordingAzure
     //const switchToAzure = (state) => state.switchToAzure
     const setting = useSelector(recording)
     const settingAzure = useSelector(recordingAzure)
     //const settingSwitchToAzure = useSelector(switchToAzure)// Get current value of recording.
     // useDispatch returns the state modifying function, invoked below.
     const dispatch = useDispatch()
     // record-btn-wrapper toggles between the two buttons using the TopSpace
     // hidden/shown CSS.

     const renderPart = (func=undefined,content,play) => {
          if (func === undefined){
               return (
                    <div className={styles.wrapper}>
                         <div className={styles.content}>
                              {content}
                         </div>
                         <ToggleButton type='Icon' className = "Play" color= "inherit" size = "large">
                              {play === false ? <PlayCircleFilledIcon className = {styles.icon}/> : <PauseCircleFilledIcon className = {styles.icon}/>}                         
                         </ToggleButton>
                     </div>
               )
          }

          return (
               <div className={styles.wrapper}>
                    <div className={styles.content}>
                         {content}
                    </div>
                    <ToggleButton type='Icon' className = "Play" color= "inherit" size = "large" onClick={() => dispatch(func())} >
                         {play === false ? <PlayCircleFilledIcon className = {styles.icon}/> : <PauseCircleFilledIcon className = {styles.icon}/>}                         
                    </ToggleButton>
               </div>
          )
     }


     if (store.isSuccessReducer === 'inProgress') {
       return(
            <>
               {renderPart("Listening",true)}
            </>
       )
     } else if (store.desiredAPI === 'azure') {
          if (settingAzure === true){
               return(
                    <>
                          {renderPart(flip_recording_azure,"Listening",true)}
                    </>
               )
          }else{
               return(
                    <>
                          {renderPart(flip_recording_azure,"To Start",false)}
                    </>
               )
          }
     } else {
       if (setting === true){
             return(
               <>
                    {renderPart(flip_recording,"Listening",true)}
               </>
             )
        } else{
             return(
               <>
                    {renderPart(flip_recording,"To Start",false)}
               </>
             )
        }
   }
}
