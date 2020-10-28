import React, {useState} from 'react'
import { useSelector , useDispatch} from 'react-redux'
import './Captions.css'
import Recognition from './Recognition/Recognition'

import { Button, IconButton } from "@material-ui/core"
import store from '../../store'
import mytheme from '../NewDrawer/theme'
import Extender from './Extender/Extender'
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import {ThemeProvider} from "@material-ui/core/styles";
import {
     increment_numLines,
     decrement_numLines,
} from '../../redux/actions'


export default function Captions(props) {
     const lineWidth = useSelector((state) => state.lineWidth)
     const numLines = useSelector((state) => state.numLines)
     const recording = useSelector((state) => state.recording)

     const [maxHeight, setMaxHeight] = useState(64)
     const [visible, setVisible] = useState(false)

     const onWebspeech = useSelector((state) => state.onWebspeech)
     const correctAzureKey = useSelector((state) => state.correctAzureKey)
     const checkAzureKey= useSelector((state) => state.checkAzureKey)

     var paddingString = (11 - lineWidth) * 3 + 'vw'
     var h = numLines + 'vh'
     var resH = (43 - numLines) + 'vh'
     var sz = props.textSize

     const DisTop = () => {
       if (document.getElementById("captionsSpace").scrollTop >= maxHeight) {
          setMaxHeight(document.getElementById("captionsSpace").scrollTop);
       }
       if (maxHeight - document.getElementById("captionsSpace").scrollTop > 10) {
         setVisible(true);
       } else {
         setVisible(false);
       }
     };
      if (visible) {
        return (
          <ThemeProvider theme = {mytheme}>
          <div>
            <IconButton className="scroll circle-icon"  color='inherit' variant="outlined" onClick= {new Recognition().scrollBottom}>
                 <DoubleArrowIcon fontSize="large"/>
          </IconButton>
            <div onScroll={DisTop} className="captionsSpace" id="captionsSpace"
             style={{
               fontSize: sz,
               height: h,
               width: "100vw",
               overflow: "auto",
               paddingLeft: paddingString,
               paddingRight: paddingString }}>
                  <Recognition isRecording={recording} shouldCheck={checkAzureKey} wantsWebspeech={onWebspeech} azureKey={store.azureKeyReducer} azureRegion ={store.azureRegionOptionsReducer}/>
                </div>
           </div>
           </ThemeProvider>
         )
      } else {
        return (
          <ThemeProvider theme = {mytheme}>
          <div>
          <IconButton className="scroll-hidden" color='inherit'  onClick= {new Recognition().scrollBottom}>
             <DoubleArrowIcon fontSize="large"/>
          </IconButton>
            <div onScroll={DisTop} className="captionsSpace" id="captionsSpace"
             style={{
               fontSize: sz,
               height: h,
               width: "100vw",
               overflow: "auto",
               paddingLeft: paddingString,
               paddingRight: paddingString }}>
                  <Recognition isRecording={recording} shouldCheck={checkAzureKey} wantsWebspeech={onWebspeech} azureKey={store.azureKeyReducer} azureRegion ={store.azureRegionOptionsReducer}/>
                </div>
           </div>
           </ThemeProvider>
         )
      }

}
