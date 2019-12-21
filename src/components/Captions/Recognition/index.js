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
               //recording: true
          }
          this.appendLine = this.appendLine.bind(this)
          this.start = this.start.bind(this)
          this.stop = this.stop.bind(this)
     }

     componentDidMount() {
          this.start()
     }

     componentDidUpdate(prevProps, prevState) {
          if (prevProps.isRecording === this.props.isRecording)
               return
          if (this.props.isRecording)
               this.start()
          else this.stop()
     }

     start() {
          recognition.start()
          recognition.onresult = (e) => {
               let words = Array.from(e.results)
                 .map(result => result[0])
                 .map(result => result.transcript)
                 .join('');
               words = words.charAt(0).toUpperCase() + words.slice(1)
               if (e.results[0].isFinal)
                    this.appendLine(words + '.')
               else this.updateCurrentLine(words)
          }
          recognition.onend = recognition.start
     }

     stop() {
          recognition.onresult = () => {}
          recognition.onend = () => {}
          recognition.stop()
     }

     updateCurrentLine(str) {
          const capts = document.querySelector('captionsSpace')
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
