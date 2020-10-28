import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './AzureCaptions.css'
import AzureRecognition from './AzureRecognition/AzureRecognition'
import Extender from './Extender/Extender'
import { Button, IconButton } from "@material-ui/core"
import ScrollButton from 'react-scroll-button'
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';

import store from '../../store'
import keys from '../AzureTopSpace/AzureOptions/Key/Key'
import { increment_numLines,
decrement_numLines, flip_correct_azureKey, flip_check_azureKey } from '../../redux/actions'



export default function AzureCaptions(props) {
     const dispatch = useDispatch()
     const lineWidth = useSelector((state) => state.lineWidth)
     const numLines = useSelector((state) => state.numLines)
     const recording = useSelector((state) => state.recordingAzure)
     const checkAzureKey = useSelector((state) => state.checkAzureKey)
     const correctAzureKey = useSelector((state) => state.correctAzureKey)
     // Sloppy styling. Please change.
     var paddingString = (11 - lineWidth) * 3 + 'vw'
     var h = numLines + 'vh'
     var resH = (43 - numLines) + 'vh'
     var sz = props.textSize

     if (props.wantWebspeech == true && store.isSuccessReducer == 'success') {
       store.desiredAPI = 'webspeech';
       return (
         <div>
            <AzureRecognition switchOffAzure = {true} />
         </div>
        )
     } else {
       store.desiredAPI = 'azure';
       return ( <div>
                      <div style = {{
                           height : resH,
                           margin : '0.5vh',
                      }}>

                      </div>
                              <i class="fa fa-angle-double-down fa-5x circle-icon" color='inherit' variant="outlined" onClick= {new AzureRecognition().scrollBottom}/>
                      <div className="captionsSpace" id="captionsSpace"
                      style={{
                      fontSize: sz,
                      height: h,
                      width: "100vw",
                      overflow: "auto",
                      paddingLeft: paddingString,
                      paddingRight: paddingString }}>

                           <AzureRecognition isRecording = {recording} isCrorrect = {correctAzureKey} checkKey = {checkAzureKey}
                            key = {store.azureKeyReducer} region = {store.azureRegionOptionsReducer} switchOffAzure = {false} />
                      </div>
                </div> )
        }
}
