import React from 'react'
import { useSelector , useDispatch} from 'react-redux'
import './index.css'
import Recognition from './Recognition'
import Extender from './Extender'
import {
     increment_numLines,
     decrement_numLines,
} from '../../redux/actions'


export default function Captions(props) {
     const lineWidth = useSelector((state) => state.lineWidth)
     const numLines = useSelector((state) => state.numLines)
     const recording = useSelector((state) => state.recording)
     // Sloppy styling. Please change.
     var paddingString = (11 - lineWidth) * 3 + 'vw'
     var h = numLines + 'vh'
     var resH = (51.5 - numLines) + 'vh'
     var sz = props.textSize

     return ( <div>
                    <div style = {{
                         height : resH,
                         margin : '0.5vh',
                    }}>
                    <Extender
                                        increment={increment_numLines}
                                        decrement={decrement_numLines}  />
                    </div>
                    <div className="captionsSpace" id="captionsSpace"
                    style={{
                    fontSize: sz,
                    height: h,
                    width: "100vw",
                    overflow: "auto",
                    paddingLeft: paddingString,
                    paddingRight: paddingString }}>
                         Welcome to ScribeAR<br />
                         There are some tips for you to start to use ScribeAR,<br /> 
                         Click button on the upperleft to open the menu.<br />
                         Detailed instructions can be found in option menu.<br />
                         <Recognition isRecording={recording} />
                    </div>
              </div> )
}
