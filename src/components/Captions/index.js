import React from 'react'
import { useSelector } from 'react-redux'
import './index.css'
import Recognition from './Recognition'

export default function Captions(props) {
     const lineWidth = useSelector((state) => state.lineWidth)
     const recording = useSelector((state) => state.recording)
     // Sloppy styling. Please change.
     var paddingString = (11 - lineWidth) * 3 + 'vw'
     var h = props.height
     var sz = props.textSize
     var wid = "calc(100vh - 2 * " + paddingString + ")"
     if(window.innerHeight > window.innerWidth) {
       wid = "calc(100vw - 2 * " + paddingString + ")"
     }
     return ( <div className="captionsSpace" id="captionsSpace"
          style={{
            fontSize: sz,
            height: h,
            width: wid,
            paddingLeft: paddingString,
            paddingRight: paddingString }}>
               <Recognition isRecording={recording} />
          </div> )
}
