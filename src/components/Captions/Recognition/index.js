import React from 'react'
import store from '../../../store/';

import $ from 'jquery';
import ScrollButton from 'react-scroll-button'
import ScrollToBottom from 'react-scroll-to-bottom';


const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new SpeechRecognition()

recognition.lang = 'en-US'
recognition.continuous = false
recognition.interimResults = true

// In this document, a 'line' is more like a sentence.
// this.state.line is like a buffer of text held at the end of the page. When the line
// is finished, the buffer is flushed: a new div is appended to the 'out' div and
// this.state.line is reset for the next line.




export class Recognition extends React.PureComponent {
     constructor() {
          super()
          this.state = {
               line: '',
               targetID: 'curr'
               //recording: true
          }
          this.appendLine = this.appendLine.bind(this)
          this.start = this.start.bind(this)
          this.stop = this.stop.bind(this)
     }

     componentDidMount() {
        if (store.desiredAPI == 'azure') {
          this.stop()
        }  else {
          this.start()
        }
     }

     // Global state 'recording' is passed as a prop. componentDidUpdate is invoked
     // when props change, therefore also when 'recording' changes.
     componentDidUpdate(prevProps, prevState) {
          if (prevProps.isRecording === this.props.isRecording)
               return
          if (this.props.isRecording)
               this.start()
          else {
              this.stop()
          }
     }

     start() {
          recognition.start()
          // Map the complex recognition result object to a string. You can explore
          // the full object with console.log(e).
          recognition.onresult = (e) => {
               let words = Array.from(e.results)
                 .map(result => result[0])
                 .map(result => result.transcript)
                 .join('');
               words = words.charAt(0).toUpperCase() + words.slice(1)
               if (e.results[0].isFinal) // if line is final
                    this.appendLine(words + '.') // flush buffer
               else this.updateCurrentLine(words) // update state
          }
          // By default, recognition stops when it gets a final result.
          recognition.onend = recognition.start // override this behavior
     }

     downloadTxtFile = () => {
       const element = document.createElement("a");
       var results = [];
       results.push("transcript History \n\n\n\n");
       var searchEles = document.getElementById("out").children;
       console.log(searchEles);

       for(var i = 0; i < searchEles.length; i++) {
         console.log(searchEles[i].innerHTML[1,searchEles[i].innerHTML.length-2]);
         results.push(searchEles[i].innerHTML + '\n');
       }

       // const file = new Blob([document.getElementById('out').value],
       //             {type: 'text/plain;charset=utf-8'});
       const file = new Blob([results],
                   {type: 'text/plain;charset=utf-8'});
       element.href = URL.createObjectURL(file);
       element.download = "Script.txt";
       document.body.appendChild(element);
       element.click();
     }

     stop() {
          recognition.onresult = () => {} // do nothing with results
          recognition.onend = () => {} // don't restart when ending
          recognition.stop()
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
          const out = document.getElementById('out')
          var isScrolledToBottom = capts.scrollHeight - capts.clientHeight <= capts.scrollTop + 1
          var div = document.createElement('div') // create new div
          div.textContent = str // set new div's text to the updated current line
          out.appendChild(div) // add the new div to the document inside 'out' element
          this.setState({ line: '' }) // reset line
          if (isScrolledToBottom)
               capts.scrollTop = capts.scrollHeight - capts.clientHeight // scroll to bottom
     }

     scrollBottom() {
       var element = document.getElementById("curr");
       element.scrollIntoView({behavior: "smooth"});
     }

     render() {
          // out holds all past lines. curr holds the current line.
          return (
               <div>
                    <div id='out'></div>
                    <div id='curr'>{this.state.line}</div>
               </div>
          )
     }
}

export default Recognition
