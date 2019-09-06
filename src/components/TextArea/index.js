import React from 'react';
import './index.css'
/*
window.SpeechRecognition = window.SpechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.continuous = false;
recognition.interimResults = true;
*/
export default function TextArea() {
     return (
          <div className="grid-item" id="out">
               <div className="element">This is a temporary build of ClassTranscribe's ScribeAR platform, which is not yet operational.</div>
               <div className="element">In the future, this site will be able to capture everyday speech and transcribe it into live captions.</div>
               <div className="element">These captions will be optimized for use with an Android phone to be projected onto augmented reality glasses.</div>
               <div className="element">Designed for deaf and hard of hearing students in a lecture-style classroom.</div>
          </div>
     );
}
