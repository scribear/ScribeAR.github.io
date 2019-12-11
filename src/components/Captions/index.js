import React from 'react'
import { useSelector } from 'react-redux'
import './index.css'
import Recognition from './Recognition'

export default function Captions(props) {
     const lineWidth = useSelector((state) => state.lineWidth)
     const recording = useSelector((state) => state.recording)
     var paddingString = 0//(11 - lineWidth) * 3 + 'vw'
     var h = props.height
     var sz = props.textSize
     return ( <div className="Captions" id="captionsSpace"
          style={{
            fontSize: sz,
            height: h,
            paddingLeft: paddingString,
            paddingRight: paddingString }}>
               <Recognition isRecording={recording} />
          </div> )
}
/*

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new SpeechRecognition()
recognition.lang = 'en-US'
recognition.continuous = false
recognition.interimResults = true

class Captions extends React.Component {
     constructor() {
          super()
          this.state = {
               line: 'Hello world.'
          }
          this.appendLine = this.appendLine.bind(this)
     }

     start() {
          recognition.addEventListener('end', recognition.start)
          recognition.start()
     }

     stop() {
          recognition.removeEventListener('end', recognition.start)
          recognition.stop()
     }

     componentDidMount() {
          recognition.addEventListener('result', e => { this.onResult(e) })
          //this.start()
     }

     onResult(e) {
          let line_ = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
          line_ = line_.charAt(0).toUpperCase() + line_.slice(1)
          if (e.results[0].isFinal)
               this.appendLine(line_ + '.')
          else this.updateCurrentLine(line_)
     }

     updateCurrentLine(str) {
          const out = document.getElementById('out')
          var isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 1
          this.setState({ line: str })
          if (isScrolledToBottom)
               out.scrollTop = out.scrollHeight - out.clientHeight
     }

     appendLine(str) {
          const out = document.getElementById('out')
          const outtwo = document.getElementById('outtwo')
          var isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 1
          var div = document.createElement('div')
          div.textContent = str
          outtwo.appendChild(div)
          this.setState({ line: '' })
          if (isScrolledToBottom)
               out.scrollTop = out.scrollHeight - out.clientHeight
     }

     render() {


          return (
               <div className='Captions' id='out'>
                    <div id='outtwo'></div>
                    <div id='curr'>{this.state.line}</div>
               </div>
          )
     }
}

export default Captions
*/
