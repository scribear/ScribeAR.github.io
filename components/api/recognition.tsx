import React from 'react'

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
const recognition = new SpeechRecognition()
recognition.lang = 'en-US'
recognition.continuous = false
recognition.interimResults = true

// In this document, a 'line' is more like a sentence.
// this.state.line is like a buffer of text held at the end of the page. When the line
// is finished, the buffer is flushed: a new div is appended to the 'out' div and
// this.state.line is reset for the next line.

class Recognition extends React.PureComponent {
     constructor(props) {
          super(props)
          this.state = {
               line: '',
               //recording: true
          }
          this.appendLine = this.appendLine.bind(this)
          this.start = this.start.bind(this)
          this.stop = this.stop.bind(this)
     }

     componentDidMount() {
        console.log("did start")
          this.start()
     }

     // Global state 'recording' is passed as a prop. componentDidUpdate is invoked
     // when props change, therefore also when 'recording' changes.
     componentDidUpdate(prevProps, prevState) {
         console.log("did return")
          return
     }

     start() {
          recognition.start()
          // Map the complex recognition result object to a string. You can explore
          // the full object with console.log(e).
          recognition.onresult = (e) => {
               let words = Array.from(e.results)
                 .map(result => (result as any)[0])
                 .map(result => result.transcript)
                 .join('');
               words = words.charAt(0).toUpperCase() + words.slice(1)
               console.log(words)
               if (e.results[0].isFinal) // if line is final
                    this.appendLine(words + '.') // flush buffer
               else this.updateCurrentLine(words) // update state
          }
          // By default, recognition stops when it gets a final result.
          recognition.onend = recognition.start // override this behavior
     }

     stop() {
          recognition.onresult = () => {} // do nothing with results
          recognition.onend = () => {} // don't restart when ending
          recognition.stop()
     }

     updateCurrentLine(str) {
          const capts = document.getElementById('captionsSpace')
          console.log(capts)
          if (capts != null) {
          var isScrolledToBottom = capts!.scrollHeight - capts!.clientHeight <= capts!.scrollTop + 1
          this.setState({ line: str })
          if (isScrolledToBottom)
               capts!.scrollTop = capts!.scrollHeight - capts!.clientHeight
          }
     }

     appendLine(str) {
          const capts = document.getElementById('captionsSpace')
          const out = document.getElementById('out')
          console.log(out)
          var isScrolledToBottom = capts!.scrollHeight - capts!.clientHeight <= capts!.scrollTop + 1
          var div = document.createElement('div') // create new div
          div.textContent = str // set new div's text to the updated current line
          out!.appendChild(div) // add the new div to the document inside 'out' element
          this.setState({ line: '' }) // reset line
          if (isScrolledToBottom)
               capts!.scrollTop = capts!.scrollHeight - capts!.clientHeight // scroll to bottom
     }

     render() {
          // out holds all past lines. curr holds the current line.
          return (
               <div>
                    <div id='out'></div>
                    <div id='curr'>{this.state}</div>
               </div>
          )
     }
}

export default Recognition