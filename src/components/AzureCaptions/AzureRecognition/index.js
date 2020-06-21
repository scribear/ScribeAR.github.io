import React from 'react'
import { isPureish } from '@babel/types';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk'
import AzureKey from '../../AzureTopSpace/AzureOptions/Key';
import store from '../../../store/';
import swal from 'sweetalert';

import $ from 'jquery';
import ScrollButton from 'react-scroll-button'
import ScrollToBottom from 'react-scroll-to-bottom';

import {useSelector, connect} from 'react-redux'
import {bindActionCreators} from "redux"
var key = 'empty';
//const key = this.props.key;
var regionOption = 'northcentralus';
var lang = 'en-US';
var targetLang = 'en';
var speechConfig = null;
const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
var reco = null;
export class AzureRecognition extends React.PureComponent {
    constructor() {
        super()
        this.state = {
           line: '',
        }
        this.appendLine = this.appendLine.bind(this)
        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
    }

    componentDidMount() {
        this.start();
    }
    scrollBottom() {
      var element = document.getElementById("curr");
      element.scrollIntoView({behavior: "smooth"});
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

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.isRecording === this.props.isRecording)
             return
      if (this.props.isRecording)
             this.start()
        else this.stop()
   }
    start() {
        console.log(store.isSuccessReducer)
        if (store.isSuccessReducer != 'success') {
        store.isSuccessReducer = 'inProgress';
        if (store.azureKeyReducer == undefined || store.azureRegionOptionsReducer == undefined || store.azureKeyReducer == '' || store.azureRegionOptionsReducer == '') {
          store.azureKeyReducer = 'empty'
          store.azureRegionOptionsReducer = 'empty'
        } else {
          key = store.azureKeyReducer;
          regionOption = store.azureRegionOptionsReducer;
        }
          speechConfig = SpeechSDK.SpeechTranslationConfig.fromSubscription(key, regionOption);
          lang = store.currentLanguageReducer;
          targetLang = store.targetLanguageReducer;
          speechConfig.speechRecognitionLanguage = lang;
          speechConfig.addTargetLanguage(targetLang);
          reco = new SpeechSDK.TranslationRecognizer(speechConfig, audioConfig);
        }

        var out = document.getElementById('out');
        var lastRecognized = out.innerHTML;

        reco.recognizing = function(s, e) {
            if (store.isSuccessReducer != 'success') {
              alert("Success")
            }
            store.isSuccessReducer = 'success';
            var language = targetLang;
            out.innerHTML = lastRecognized + e.result.translations.get(language);
            const capts = document.getElementById('captionsSpace')
            capts.scrollTop = capts.scrollHeight - capts.clientHeight // scroll to bottom
        }

        reco.recognized = function (s,e) {
            window.console.log(e);
            var language = targetLang;
            lastRecognized += e.result.translations.get(language) + "\r\n";
            out.innerHTML = lastRecognized;
        }
        reco.canceled = function (s, e) {
          store.isSuccessReducer = 'failure'
          store.azureRegionOptionsReducer = 'incorrect'
          store.azureKeyReducer = 'incorrect'
          swal({
              title: "Warning!",
              text: "Wrong key or region!",
              icon: "warning",
            })
            this.stop()
        };
        reco.startContinuousRecognitionAsync();
    }
    stop() {
        reco.stopContinuousRecognitionAsync(
            function() {
                reco.close();
                reco = undefined;
            },
            function (err) {
                reco.close();
                reco = undefined;
            }
        )
    }
    render() {
        // out holds all past lines. curr holds the current line.
        return (
             <div>
                  <div id='out'></div>
                    <p>{this.props.key}</p>
             </div>
        )
   }
}
export default AzureRecognition
