import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './index.css'
import {forward_stereoVisual, backward_stereoVisual} from '../../../../redux/actions'
import {Button, IconButton} from "@material-ui/core"
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";


// This code only works if the initial state is Off. It's surprisingly way harder
// to get this to work if you want the inital state of the checkbox to be checked.

export default function Stereovisual(props) {

    const mic = (state) => state.steromic
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
         result = "Circular Visualization"
         text = "Circular"
     }else if (setting == 2){
         result = "Rectangular Visualization"
         text = "Rectangular"
     }else{
         result = "Spectrum Visualization"
         text = "Spectrum"
     }

     return (
         <div className="stereo_result">
             STEREO
             <div className="stereo_visual">
                 <IconButton color = 'inherit' onClick = {()=>(dispatch(backward_stereoVisual()))}>
                     <ArrowBackIosIcon />
                 </IconButton>
                 {text}
                 <IconButton color = 'inherit' onClick = {()=>(dispatch(forward_stereoVisual()))}>
                     <ArrowForwardIosIcon />
                 </IconButton>
             </div>
        </div>
          // <div>
          //     {result}
          //      <div className="stereo_visual">
          //           <Button className="stereo_plus" color = "inherit"  variant = "outlined" size = "large"
          //                onClick={() => dispatch(flip_stereoVisual())} >{text}
          //           </Button>
          //
          //
          //      </div>
          // </div>
     )
}