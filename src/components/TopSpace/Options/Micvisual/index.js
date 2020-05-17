import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './index.css'
import { flip_micVisual } from '../../../../redux/actions'
import { Button } from "@material-ui/core"


// This code only works if the initial state is Off. It's surprisingly way harder
// to get this to work if you want the inital state of the checkbox to be checked.

export default function Micvisual(props) {

    const mic = (state) => state.mic
    const setting = useSelector(mic) // Get current value of recording.
    // useDispatch returns the state modifying function, invoked below.
    const dispatch = useDispatch()
    let result = ""
    let text = ""

    // flip recording when space bar is pressed

     //const setting = useSelector(props.setting)
     // useDispatch returns the state modifying function, invoked below.

     if (setting == 0){
         result = "No Visualization"
         text = "None"
     }else if (setting == 1){
         result = "Line Visualization"
         text = "Line"
     }else if (setting == 2){
         result = "Spectrum Visualization"
         text = "Spectrum"
     }else{
         result = "Circular Visualization"
         text = "Circular"
     }

     return (
          <div>
              {result}
               <div className="audio_visual">
                    <Button className="audio_plus" color = "primary" variant = "outlined"
                         onClick={() => dispatch(flip_micVisual())} >{text}
                    </Button>

               </div>
          </div>
     )
}

