import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './index.css'
import { flip_recording } from '../../../../redux/actions'

export default function Record(props) {
     const recording = (state) => state.recording
     const setting = useSelector(recording)
     const dispatch = useDispatch()

     document.body.onkeyup = function(e) {
          if (e.keyCode === 32)
               dispatch(flip_recording())
     }

     return ( <div>
          {setting ? "Recording" : "Record"}
          <div className="record-btn-wrapper">
               <div className={setting ? "record-btn hidden" : "record-btn shown"}
                    onClick={() => dispatch(flip_recording())} />
               <div className={setting ? "stop-btn shown" : "stop-btn hidden"}
                    onClick={() => dispatch(flip_recording())} />
          </div>
     </div> )
}
