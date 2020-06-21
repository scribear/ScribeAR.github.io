import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './index.css'
import AzureRecognition from './AzureRecognition'
import Extender from './Extender'
import { Button } from "@material-ui/core"
import ScrollButton from 'react-scroll-button'
import store from '../../store'
import keys from '../AzureTopSpace/AzureOptions/Key'
import { increment_numLines,
decrement_numLines, flip_correct_azureKey, flip_check_azureKey } from '../../redux/actions'



export default function AzureCaptions(props) {
    console.log(store.azureRegionOptionsReducer);
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

                           <AzureRecognition isRecording = {recording} isCrorrect = {correctAzureKey} checkKey = {checkAzureKey}
                            key = {store.azureKeyReducer} region = {store.azureRegionOptionsReducer} />
                      </div>
                </div> )
  }
