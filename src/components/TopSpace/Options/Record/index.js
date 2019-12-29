import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './index.css'
import { flip_recording } from '../../../../redux/actions'

export default function Record(props) {
     const recording = (state) => state.recording
     const setting = useSelector(recording) // Get current value of recording.
     // useDispatch returns the state modifying function, invoked below.
     const dispatch = useDispatch()

     // flip recording when space bar is pressed
     document.body.onkeyup = function(e) { // run function when any key is pressed
          if (e.keyCode === 32) // keyCode 32 is the space bar
               dispatch(flip_recording())
     }
     // record-btn-wrapper toggles between the two buttons using the TopSpace
     // hidden/shown CSS.
     return (
          <div>
               {setting ? "Recording" : "Record"}
               <div className="record-btn-wrapper">
                    <div className={setting ? "record-btn hidden" : "record-btn shown"}
                         onClick={() => dispatch(flip_recording())} />
                    <div className={setting ? "stop-btn shown" : "stop-btn hidden"}
                         onClick={() => dispatch(flip_recording())} />
               </div>
          </div>
     )
}
