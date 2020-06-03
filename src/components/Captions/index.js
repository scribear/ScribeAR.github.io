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
     return ( <div className="captionsSpace" id="captionsSpace"
          style={{
            fontSize: sz,
            height: h,
            width: "90vw",
            overflow: "auto",
            paddingLeft: paddingString,
            paddingRight: paddingString }}>
               <p className = "tutorial">Welcome to ScribeAR</p>
               <p className = "tutorial">There are some tips for you to start to use ScribeAR,</p> 
               <p className = "tutorial">Click button on the upperleft to open the menu.</p>
               <p className = "tutorial">Detailed instructions can be found in option menu.</p>
               <Recognition isRecording={recording} />
          </div> )
}
