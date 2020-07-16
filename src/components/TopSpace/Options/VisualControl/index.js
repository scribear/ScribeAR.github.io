import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './index.css'
import {flip_stereo} from '../../../../redux/actions'
import { Button } from "@material-ui/core"


// This code only works if the initial state is Off. It's surprisingly way harder
// to get this to work if you want the inital state of the checkbox to be checked.

export default function VisualControl(props) {

    const vis = (state) => state.stereo
    const setting = useSelector(vis) // Get current value of recording.
    // useDispatch returns the state modifying function, invoked below.
    const dispatch = useDispatch()
    let result = ""
    let text = ""

    // flip recording when space bar is pressed

     //const setting = useSelector(props.setting)
     // useDispatch returns the state modifying function, invoked below.

     if (setting == 0){
         result = "Mono Visualization"
         text = "Mono"
     }else{
         result = "Stereo Visualization"
         text = "Stereo"
     }

     return (
          <div className="control_result">
              {result}
               <div className="control_visual">
                    <Button className="control_plus" color = "inherit"  variant = "outlined" size = "large"
                         onClick={() => dispatch(flip_stereo())} >{text}
                    </Button>


               </div>
          </div>
     )
}