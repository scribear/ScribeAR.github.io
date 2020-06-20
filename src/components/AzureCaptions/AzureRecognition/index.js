import React from 'react'
import { isPureish } from '@babel/types';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk'
import AzureKey from '../../AzureTopSpace/AzureOptions/Key';
import store from '../../../store/';
import {useSelector, connect} from 'react-redux'
import {bindActionCreators} from "redux"
import swal from 'sweetalert';


//const key = (state) =>state.azureKey
//7882896e3ffc4fe3b2f4c055f0914d67
var key = 'empty';
var regionOption = 'empty';
var lang = 'en-US';
var correctKey = true;
var speechConfig = null;
const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
var reco = null;

class AzureRecognition extends React.PureComponent {
    constructor() {
        super()
        this.state = {
           line: '',
        }
        //this.appendLine = this.appendLine.bind(this)
        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
    }

    componentDidMount() {
      alert("After pressing OK, please allow the the program to confirm Azure key authentication by listening to speech")

        this.start()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.isRecording === this.props.isRecording) {
             return
           }
        if (this.props.isRecording) {
             this.start()
           }
        else {
          this.stop()
        }
   }
    start() {
      if (store.isSuccessReducer != 'success') {
        store.isSuccessReducer = 'inProgress';
        if (store.azureKeyReducer == undefined || store.azureRegionOptionsReducer == undefined || store.azureKeyReducer == '' || store.azureRegionOptionsReducer == '') {
          store.azureKeyReducer = 'empty'
          store.azureRegionOptionsReducer = 'empty'
        } else {
          key = store.azureKeyReducer;
          regionOption = store.azureRegionOptionsReducer;
        }
        speechConfig = SpeechSDK.SpeechConfig.fromSubscription(key, regionOption);
        speechConfig.speechRecognitionLanguage = lang;
      }
        reco = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
        var out = document.getElementById('out');
        var lastRecognized = out.innerHTML;
        reco.recognizing = function(s, e) {

            if (store.isSuccessReducer != 'success') {
              alert("Success")
            }
            store.isSuccessReducer = 'success';
            //window.console.log(e);
            out.innerHTML = lastRecognized + e.result.text;

            const capts = document.getElementById('captionsSpace')
            capts.scrollTop = capts.scrollHeight - capts.clientHeight // scroll to bottom

        }
        reco.recognized = function (s,e) {
            //window.console.log(e);
            if(e.result.reason == SpeechSDK.ResultReason.NoMatch) {
                var noMatchDetail = SpeechSDK.NoMatchDetails.fromResult(e.result);
            }
            lastRecognized += e.result.text + "\r\n";
            out.innerHTML = lastRecognized;
        }
        reco.canceled = function(s, e) {
          console.log("lol that didnt work eheheheh")
          store.isSuccessReducer = 'failure'
          store.azureRegionOptionsReducer = 'incorrect'
          store.azureKeyReducer = 'incorrect'
          swal({
                title: "Warning!",
                text: "Wrong key or region!",
                icon: "warning",
            })
          this.stop()
        }
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
        console.log("render")
        return (
             <div>
                  <div id='out'></div>
                    <p>{this.props.key}</p>
             </div>
        )
   }
}

export default AzureRecognition
