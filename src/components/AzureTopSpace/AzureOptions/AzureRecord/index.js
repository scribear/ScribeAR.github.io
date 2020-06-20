
import React from 'react'
import './index.css'
import {useSelector, useDispatch } from 'react-redux'
import {flip_recording_azure} from '../../../../redux/actions'

// This code only works if the initial state is Off. It's surprisingly way harder
// to get this to work if you want the inital state of the checkbox to be checked.

export default function AzureRecord(props) {
     const recordingAzure = (state) => state.recordingAzure
     const setting = useSelector(recordingAzure)
     // useDispatch returns the state modifying function, invoked below.
     const dispatch = useDispatch()

   // flip recording when space bar is pressed
   document.body.onkeyup = function(e) { // run function when any key is pressed
     if (e.keyCode === 32) // keyCode 32 is the space bar
          dispatch(flip_recording_azure())
}
// record-btn-wrapper toggles between the two buttons using the TopSpace
// hidden/shown CSS.
return (
     <div>
          {setting ? "Recording" : "Record"}
          <div className="record-btn-wrapper">
               <div className={setting ? "record-btn hidden" : "record-btn shown"}
                    onClick={() => dispatch(flip_recording_azure())} />
               <div className={setting ? "stop-btn shown" : "stop-btn hidden"}
                    onClick={() => dispatch(flip_recording_azure())} />
          </div>
     </div>
)
}
