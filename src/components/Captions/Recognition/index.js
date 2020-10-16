import React from 'react'
import store from '../../../store/';
import $ from 'jquery';
import ScrollButton from 'react-scroll-button'
import ScrollToBottom from 'react-scroll-to-bottom';

import { flip_recording, flip_switch_to_azure,
         flip_switchMenus, flip_entered_key,
         flip_correct_azureKey, flip_on_webspeech,
         flip_check_azureKey,
         flip_entered_region } from '../../../redux/actions'

import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk'
import AzureKey from '../../AzureTopSpace/AzureOptions/Key';
import { isPureish } from '@babel/types';
import swal from 'sweetalert';
import {useSelector, connect, useDispatch} from 'react-redux'
import {bindActionCreators} from "redux"


var onWebspeech = true;
//Azure Variables
var reco = null;
var key = "empty"
var regionOption = "empty"
var lang = "en-US"
var targetLang = "en"
var azureSpeechConfig = null;
const azureAudioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();


//Webspeech Variables
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new SpeechRecognition()
recognition.lang = 'en-US'
recognition.continuous = false
recognition.interimResults = true

const mapDispatchToProps = {
  flip_entered_region,
  flip_entered_key,
  flip_correct_azureKey,
  flip_on_webspeech,
}

export class Recognition extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
           line: '',
           targetID: 'curr',
        }

        this.azureAppendLine = this.azureAppendLine.bind(this)
        this.azureStart = this.azureStart.bind(this)
        this.azureStop = this.azureStop.bind(this)
        this.appendLine = this.appendLine.bind(this)
        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)

    }

    componentDidMount() {
       this.start()
    }

    // Global state 'recording' is passed as a prop. componentDidUpdate is invoked
    // when props change, therefore also when 'recording' changes.
    componentDidUpdate(prevProps, prevState) {
      console.log("HELLLLLLLLOOOOOOOOOOOOo")
         if (this.props.wantsWebspeech === false && store.isSuccessReducer == "success") {
           this.onWebspeech = false;
           if (store.webspeechIsStart === "true") {
             this.stop()
           }
           if (this.props.isRecording) {
             this.azureStart()
           } else {
             this.azureStop()
           }
         } else if (this.props.shouldCheck === true && store.isSuccessReducer != "success") {
           this.onWebspeech = false;
           if (store.webspeechIsStart === "true") {
             this.stop()
           }
           this.azureStart()
         } else {
           this.onWebspeech = true;
           if (store.azureIsStart === "true") {
             this.azureStop()
           }
           if (prevProps.isRecording === this.props.isRecording && prevProps.wantsWebspeech === this.props.wantsWebspeech)
              return
           if (this.props.isRecording)
              this.start()
           else {
              this.stop()
         }
       }
    }

    downloadTxtFile = () => {
      const element = document.createElement("a");
      var results = [];
      results.push("transcript History \n\n\n\n");
      var searchEles = document.getElementById("out");
      results.push(searchEles.innerHTML);
      const file = new Blob([results], {type: 'text/plain;charset=utf-8'});
      element.href = URL.createObjectURL(file);
      element.download = "Script.txt";
      document.body.appendChild(element);
      element.click();
    }


    azureAppendLine(str) {
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

    azureStart() {
        store.azureIsStart = "true";
        if (store.isSuccessReducer != 'success') {
          store.isSuccessReducer = 'inProgress';
        if (store.azureKeyReducer == undefined || store.azureRegionOptionsReducer == undefined || store.azureKeyReducer == '' || store.azureRegionOptionsReducer == '') {
          store.azureKeyReducer = 'empty'
          store.azureRegionOptionsReducer = 'empty'
        } else {
          key = store.azureKeyReducer;
          regionOption = store.azureRegionOptionsReducer;
        }
      }
          azureSpeechConfig = SpeechSDK.SpeechTranslationConfig.fromSubscription(key, regionOption);
          lang = store.currentLanguageReducer;
          targetLang = store.targetLanguageReducer;
          azureSpeechConfig.speechRecognitionLanguage = lang;
          azureSpeechConfig.addTargetLanguage(targetLang);
          //allow all profanity (raw);
          azureSpeechConfig.setProfanity(2);

          reco = new SpeechSDK.TranslationRecognizer(azureSpeechConfig, azureAudioConfig);

        var out = document.getElementById('out');
        var lastRecognized = out.innerHTML;
        reco.sessionStarted = function(s,e) {
          if (store.isSuccessReducer != 'success') {
          store.isSuccessReducer = 'success';
          swal({
            title: "Success!",
            text: "Connected to Azure Speech Recognition!",
            icon: "success",
            timer: 2000,
          })
        }
      }
        reco.recognizing = function(s, e) {
            var language = targetLang;
            out.innerHTML = lastRecognized + e.result.translations.get(language);
            const capts = document.getElementById('captionsSpace')
            capts.scrollTop = capts.scrollHeight - capts.clientHeight // scroll to bottom
        }

        reco.recognized = function (s,e) {
            window.console.log("currently azure");
            var language = targetLang;
            lastRecognized += e.result.translations.get(language) + "\r\n";
            out.innerHTML = lastRecognized;
        }
        reco.canceled = function (s, e) {
          if (store.isSuccessReducer != 'success') {
            store.azureIsStart = "false";
          store.isSuccessReducer = 'failure'
          swal({
              title: "Warning!",
              text: "Wrong key or region!",
              icon: "warning",
            })
            this.azureStop()
          }
        };
        reco.startContinuousRecognitionAsync();
    }
    azureStop() {
      store.azureIsStart = "false";
        reco.stopContinuousRecognitionAsync(
            function() {
                reco.close();
                reco = undefined;
            },
            function (err) {
                reco.close();
                reco = undefined;
            }
        );
    }


    //WEBSPEECH WEBSPEECH WEBSPEECH


    start() {
      store.webspeechIsStart = "true";
         recognition.start()
         // Map the complex recognition result object to a string. You can explore
         // the full object with console.log(e).
         recognition.onresult = (e) => {
           window.console.log("currently webs");

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
      store.webspeechIsStart = "false";
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

// Webspeech Render

 render() {

         // out holds all past lines. curr holds the current line.
         if (onWebspeech) {
           return (
              <div>
                   <div id='out'></div>
                   <div id='curr'>{this.state.line}</div>
              </div>
         )
       } else {
         return (
                   <div>
                        <div contenteditable = "true" id='out'></div>
                          <div id='curr'>{this.props.key}</div>
                   </div>
              )
       }

  }

   //  render() {
   //      return (
   //           <div>
   //                <div contenteditable = "true" id='out'></div>
   //                  <div id='azureCurr'>{this.props.key}</div>
   //           </div>
   //      )
   // }
}
connect(mapDispatchToProps)(Recognition)
export default Recognition
