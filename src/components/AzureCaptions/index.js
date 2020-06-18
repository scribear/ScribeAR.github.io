import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './index.css'
import AzureRecognition from './AzureRecognition'
import store from '../../store'
import keys from '../AzureTopSpace/AzureOptions/Key'
import { flip_correct_azureKey, flip_check_azureKey } from '../../redux/actions'



export default function AzureCaptions(props) {

     const dispatch = useDispatch()
     const lineWidth = useSelector((state) => state.lineWidth)
     const recording = useSelector((state) => state.recordingAzure)
     const checkAzureKey = useSelector((state) => state.checkAzureKey)
     const correctAzureKey = useSelector((state) => state.correctAzureKey)
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
              width: "90vw",
              overflow: "auto",
              // backgroundColor: "blue",
              paddingLeft: paddingString,
              paddingRight: paddingString }}>
                 <AzureRecognition isRecording = {recording} isCrorrect = {correctAzureKey} checkKey = {checkAzureKey}
                  key = {store.azureKeyReducer} region = {store.azureRegionOptionsReducer} />
            </div> )

}
