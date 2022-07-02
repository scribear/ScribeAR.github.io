import * as React from 'react';
import { useRecognition, getSpeechRecognition} from './webspeech/recognition';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { RootState } from '../../store';
import { AzureRecognition } from './azure/azureRecognition';
import { DisplayStatus, AzureStatus, StreamTextStatus, ControlStatus, ApiStatus } from '../../redux/types'
import { Visualization } from './visualization/visualization'
import { FullVisual } from './visualization/fullVisual'
import { NoFreqVisual } from './visualization/noFreqVisual'
import { LoungeVisual } from './visualization/loungeVisual'
import StreamText from './streamtext/streamtextRecognition';
var transcriptsFull = "testing"
let desiredAPI = 0;

export const WebRecognitionExample: React.FC = (props) => {
  const dispatch = useDispatch()
const control = useSelector((state: RootState) => {
  return state.ControlReducer as ControlStatus;
});
const textSize = useSelector((state: RootState) => {
  return state.DisplayReducer as DisplayStatus;
});
const azureStatus = useSelector((state: RootState) => {
  return state.AzureReducer as AzureStatus
})
const streamTextStatus = useSelector((state: RootState) => {
  return state.StreamTextReducer as StreamTextStatus
})
const apiStatus = useSelector((state: RootState) => {
  return state.APIStatusReducer as ApiStatus
})
React.useEffect(() => {
  if (control.listening == true) {
    if (apiStatus.currentAPI == 0) {
      desiredAPI = 0
      webspeechHandler()
    } else if (apiStatus.currentAPI == 1) {
      desiredAPI = 1
      azureHandler()
    }
  } 
}, [control.listening, apiStatus.currentAPI]);
document.addEventListener("DOMContentLoaded", function(){
  if (apiStatus.currentAPI == 1) {
  Swal.fire({
    title: 'It appears you have a valid Microsoft Azure key, would you like to use Microsoft Azure?',
    icon: 'info',
    allowOutsideClick: false,
    showDenyButton: true,
    confirmButtonText: 'Yes!',
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire('Switching to Azure', '', 'success')
      desiredAPI = 1
      azureHandler()
    } else {
      let copyStatus = Object.assign({}, apiStatus);
      copyStatus.currentAPI = 0
      dispatch({type: 'CHANGE_API_STATUS', payload: copyStatus})
      webspeechHandler()
    }
  })
  } 
});
const textSizeA = "" + textSize.textSize + "vh"
const { azureTranscripts, azureListen } = AzureRecognition();
const { transcripts, listen } = useRecognition();

const stateRefControl = React.useRef(control)
const stateRefAzure = React.useRef(azureStatus)
const stateCurrentAPI = React.useRef(apiStatus)
stateRefControl.current = control
stateRefAzure.current = azureStatus
stateCurrentAPI.current = apiStatus
  const webspeechHandler = async () => {
    const recognizedMessage = await listen(transcriptsFull, stateRefControl, stateCurrentAPI).then(response => {  
      if (stateRefControl.current.listening && stateCurrentAPI.current.currentAPI == 0) {
          transcriptsFull = transcriptsFull + response
          webspeechHandler()
        }
      }
    );
  };
  const azureHandler = async () => {
    const recognizedMessage = await azureListen(transcriptsFull, stateRefControl, stateRefAzure, stateCurrentAPI).then(response => {  
      if (stateRefControl.current.listening && stateCurrentAPI.current.currentAPI == 1) {
          transcriptsFull = transcriptsFull + response
          azureHandler()
        }
      }
    );
  };

  const  checkNull = async (input: string) => {
    if (input == null || input == "" ) {
      input = "empty"
    } 
  }
  let fullTranscripts;
  if (desiredAPI == 0) {
    fullTranscripts = transcripts
  } else {
    fullTranscripts = azureTranscripts
  }
  const capts = document.getElementById('captionsSpace')
  if (capts != null) {
  var isScrolledToBottom = capts.scrollHeight - capts.clientHeight <= capts.scrollTop + 1
  capts.scrollTop = capts.scrollHeight - capts.clientHeight // scroll to bottom
  }
  if (apiStatus.currentAPI == 2) {
    return (
        <StreamText streamTextStatus = {streamTextStatus} displayStatus = {textSize} />
    )
  }
  if (stateRefControl.current.listening && stateRefControl.current.visualizing) {
    if (stateRefControl.current.showFrequency) {
      return (
        <div>   
          <div id='circular_visual' draggable='true' style={{position: 'absolute', left: '0', top: '0', zIndex: 1, paddingTop: '5%', paddingLeft: '5%', right: '90'}}>
            <LoungeVisual></LoungeVisual>
          </div>
          <ul >
            {fullTranscripts.map(transcript => (
              <h3  id = "captionsSpace" style ={{position: 'fixed', width: '90%', textAlign: 'left', left: '0', fontSize: textSizeA, paddingLeft: '5%', paddingRight: '60%', overflowY: 'scroll', height: '40%', color: textSize.textColor}}>{transcript}</h3>
            ))}
          </ul>
        </div>
      );
    }

    // not showing frequency
    return (
      <div>   
        <div id='circular_visual' draggable='true' style={{position: 'absolute', left: '0', top: '0', zIndex: 1, paddingTop: '5%', paddingLeft: '5%', right: '90'}}>
          <NoFreqVisual></NoFreqVisual>
        </div>
        <ul >
          {fullTranscripts.map(transcript => (
            <h3  id = "captionsSpace" style ={{position: 'fixed', width: '90%', textAlign: 'left', left: '0', fontSize: textSizeA, paddingLeft: '5%', paddingRight: '60%', overflowY: 'scroll', height: '40%', color: textSize.textColor}}>{transcript}</h3>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
        <ul >
          {fullTranscripts.map(transcript => (
            <h3  id = "captionsSpace" style ={{position: 'fixed', width: '90%', textAlign: 'left', left: '0', fontSize: textSizeA, paddingLeft: '5%', paddingRight: '60%', overflowY: 'scroll', height: '40%', color: textSize.textColor}}>{transcript}</h3>
          ))}
        </ul>
    </div>
  );
};