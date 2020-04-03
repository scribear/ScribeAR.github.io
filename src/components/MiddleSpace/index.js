import React from 'react'
import Index from './Loudness/index'
import './index.css'
import { useSelector } from 'react-redux'

export default function MiddleSpace(props) {
    var h = props.height
    const mic = useSelector((state) => state.mic)
   //  var wid = "calc(100vh - 2 * " + paddingString + ")"
   //  if(window.innerHeight > window.innerWidth) {
   //    wid = "calc(100vw - 2 * " + paddingString + ")"
   //  }

    return ( <div className="MiddleSpace"
         style={{
           height: h,
           width: "90vw",
           overflow:"hidden" }}>
             <Index ismic = {mic} style={{
               position:"relative",
             }}/>
         </div> )
}
