import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import ToggleButton from './toggleButton'

export default function Listening() {

     //const switchToAzure = (state) => state.switchToAzure

     //const settingSwitchToAzure = useSelector(switchToAzure)// Get current value of recording.
     // useDispatch returns the state modifying function, invoked below.

     // record-btn-wrapper toggles between the two buttons using the TopSpace
     // hidden/shown CSS.

     const renderPart = (content,play) => {

               return (
                    <div>
 
                         <ToggleButton type='Icon' className = "Play" color= "inherit" size = "large">
                              {play === false ? <PlayCircleFilledIcon /> : <PauseCircleFilledIcon />}
                         </ToggleButton>
                     </div>
               )
          

        
     }
     return(
          <>
               {renderPart("Listening",true)}
          </>
        )
}
