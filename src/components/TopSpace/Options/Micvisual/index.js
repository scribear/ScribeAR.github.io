import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './index.css'
import { flip_micVisual } from '../../../../redux/actions'

// This code only works if the initial state is Off. It's surprisingly way harder
// to get this to work if you want the inital state of the checkbox to be checked.

export default function Micvisual(props) {

    const mic = (state) => state.mic
    const setting = useSelector(mic) // Get current value of recording.
    // useDispatch returns the state modifying function, invoked below.
    const dispatch = useDispatch()

    // flip recording when space bar is pressed

     //const setting = useSelector(props.setting)
     // useDispatch returns the state modifying function, invoked below.


     return (
          <div>
               {!setting? "Get Mic Input" : "Stop Mic Input"}
               <div className="record-btn-wrapper">
                    <div className={!setting ? "record-btn hidden" : "record-btn shown"}
                         onClick={() => dispatch(flip_micVisual())} />
                       <div className={!setting ? "stop-btn shown" : "stop-btn hidden"}
                         onClick={() => dispatch(flip_micVisual())} />
               </div>
          </div>
     )
}
