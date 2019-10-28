import React from 'react'

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new SpeechRecognition()
recognition.lang = 'en-US'
recognition.continuous = false
recognition.interimResults = true

class Recognition extends React.Component {
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
               <div>
                    <div id='outtwo'></div>
                    <div>Hello world.</div>
                    <div>Hello world.</div>
                    <div>Hello world.</div>
                    <div>Hello world.</div>
                    <div id='curr'>{this.state.line}</div>
               </div>
          )
     }
}

export default Recognition
