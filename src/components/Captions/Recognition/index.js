import React from 'react'

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new SpeechRecognition()
recognition.lang = 'en-US'
recognition.continuous = false
recognition.interimResults = true

class Recognition extends React.PureComponent {
     constructor() {
          super()
          this.state = {
               line: '',
               recording: true
          }
          this.appendLine = this.appendLine.bind(this)
          this.start = this.start.bind(this)
          this.stop = this.stop.bind(this)
          this.onResult = this.onResult.bind(this)
     }

     componentDidUpdate(prevProps, prevState) {
          if (prevProps.isRecording === this.props.isRecording)
               return
          if (this.props.isRecording)
               this.start()
          else this.stop()
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
          this.start()
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
          const capts = document.getElementById('captionsSpace')
          var isScrolledToBottom = capts.scrollHeight - capts.clientHeight <= capts.scrollTop + 1
          this.setState({ line: str })
          if (isScrolledToBottom)
               capts.scrollTop = capts.scrollHeight - capts.clientHeight
     }

     appendLine(str) {
          const capts = document.getElementById('captionsSpace')
          const outtwo = document.getElementById('out')
          var isScrolledToBottom = capts.scrollHeight - capts.clientHeight <= capts.scrollTop + 1
          var div = document.createElement('div')
          div.textContent = str
          outtwo.appendChild(div)
          this.setState({ line: '' })
          if (isScrolledToBottom)
               capts.scrollTop = capts.scrollHeight - capts.clientHeight
     }

     render() {
          return (
               <div>
                    <div id='out'></div>
                    <div id='curr'>{this.state.line}</div>
               </div>
          )
     }
}

export default Recognition
