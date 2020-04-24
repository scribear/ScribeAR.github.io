import React from 'react'
import Index from './Loudness/index'
import './index.css'
export default function Middle(props) {
    var h = props.height
   //  var wid = "calc(100vh - 2 * " + paddingString + ")"
   //  if(window.innerHeight > window.innerWidth) {
   //    wid = "calc(100vw - 2 * " + paddingString + ")"
   //  }
    return ( <div className="MiddleSpace"
         style={{
           height: h,
           width: "90vw",
           overflow:"hidden" }}>
             <Index style={{
               position:"relative",
             }}/>
         </div> )
}

