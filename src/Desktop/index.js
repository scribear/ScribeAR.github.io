import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import TopSpace from '../components/TopSpace'
import AzureCaptions from '../components/AzureCaptions'
import Captions from '../components/Captions'
import MiddleSpace from '../components/MiddleSpace'
import PlaceHolder from "../components/PlaceHolder"
import {
    flip_recording,
    flip_entered_key,
    flip_correct_azureKey, flip_on_webspeech,
    flip_check_azureKey,
    flip_entered_region
} from '../redux/actions'
import store from '../store'
import styles from './index.module.css'
import swal from 'sweetalert';


export default function Desktop() {
    const dispatch = useDispatch()
    // Get global state from Redux. See the React Redux tutorial.
    // webspeech on-off
    const onWebspeech = useSelector((state) => state.onWebspeech)
    //azure related
    const enteredKey = useSelector((state) => state.enteredKey)
    const enteredRegion = useSelector((state) => state.enteredRegion)
    const correctAzureKey = useSelector((state) => state.correctAzureKey)
    const checkAzureKey = useSelector((state) => state.checkAzureKey)
    //size of font display
    const textSize = useSelector((state) => state.textSize)
    //listening on-off
    const recording = useSelector((state) => state.recording)
    //theme color
    const invertColors = useSelector((state) => state.invertColors)
    //which menu shown
    const switchMenus = useSelector((state) => state.switchMenus)
    //caption space size display mode
    const bot_mode = useSelector((state) => state.botsize)
    //stream-text on-off
    const stream_text = useSelector((state) => state.streamtext)
    // Convert variables to CSS-friendly strings.
    var sizeString = textSize + 'vh'
    // Size of bottom space (text area) relative to text size and number of lines.
    // Webpage layout
    // please use this layout as the standard for bottom/top/middle/placeholder space
    var botHeight = (3 - bot_mode) * 28 + 'vh'
    var topHeight = 14 + 'vh'
    var placeHeight = 2 + 'vh'
    var midHeight = (84 - (3 - bot_mode) * 28) + 'vh'

    //-----------------------
    //checks how often user is still on browser
    //currently set to checking every 1 hour(s)
    var timerCheck = 600000;
    //----------------------
    // var topHeight = 9 + 'vh'
    // var placeHeight = 5 + 'vh'
    // var midHeight = 34 + 'vh'
    //-----------------------
    // topHeight + botHeight should always = 100vh because we don't want the full
    // page to scroll (we only want the individual areas to scroll).
    //------------------------
    //checkAzureKey is changed changed HERE in normal return
    //isCorrectKey is done in AzureCaptions
    //azureKeyEntered is done in enter button


    //some bool based on the value of redux state
    var isRecording = recording ? true : false
    var isEnteredKey = enteredKey ? true : false
    var isEnteredRegion = enteredRegion ? true : false
    var isCorrectKey = correctAzureKey ? true : false
    var wantsWebspeech = onWebspeech ? true : false
    //theme color 
    var bgColor = 'black'
    if (invertColors == 1) {
        bgColor = 'white'
    } else {
        bgColor = 'black'
    }

    //  var color = invertColors ? 'black' : 'white'
    //  console.log(color)
    if (store.azureKeyReducer === 'incorrect' && checkAzureKey === true) {
        store.azureKeyReducer = 'empty'
        dispatch(flip_entered_key())
        dispatch(flip_entered_region())
        dispatch(flip_check_azureKey())
    }
    if (store.isSuccessReducer === 'success' && isCorrectKey === false) {
        dispatch(flip_correct_azureKey())
    }

    if (checkAzureKey === true || isCorrectKey === true) {
        if (isRecording === true) {
            dispatch(flip_recording());
        }
        if (isCorrectKey === false && wantsWebspeech === true) {
            dispatch(flip_on_webspeech())
        }
        setInterval(checkIfStillHere, timerCheck);


        if (bgColor === 'black') {
            return (
                <div className={styles.App1} style={{
                    backgroundColor: 'black',
                    color: 'white',
                    overflow: 'hidden',
                    position: 'fixed',
                }}>
                    <TopSpace height={topHeight} color={bgColor} />
                    <PlaceHolder height={placeHeight} color={bgColor} textSize={sizeString} />
                    <MiddleSpace height={midHeight} color={bgColor} />
                    <AzureCaptions textSize={sizeString} wantWebspeech={wantsWebspeech} />
                    <Captions height={botHeight} textSize={sizeString} azureCaptionSuccess={wantsWebspeech} />
                </div>
            )
        } else {
            return (
                <div className={styles.App2} style={{
                    backgroundColor: 'white',
                    color: 'black',
                    overflow: 'hidden',
                    position: 'fixed',
                }}>
                    <TopSpace height={topHeight} color={bgColor} />
                    <PlaceHolder height={placeHeight} color={bgColor} textSize={sizeString} />
                    <MiddleSpace height={midHeight} color={bgColor} />
                    <AzureCaptions textSize={sizeString} wantWebspeech={wantsWebspeech} />
                    <Captions height={botHeight} textSize={sizeString} azureCaptionSuccess={wantsWebspeech} />
                    {/* <DNDTest /> */}
                </div>
            )
        }
    }
    // cases where azureKey is false but isrecording is not????

    if (bgColor === 'black') {
        if (isEnteredKey === true || isEnteredRegion === true) {
            dispatch(flip_check_azureKey())
            if (isRecording === true) {
                dispatch(flip_recording())
            }
        }
        return (
            <div className={styles.App1} style={{
                backgroundColor: 'black',
                color: 'white',
                overflow: 'hidden',
                position: 'fixed',
            }}>
                <TopSpace height={topHeight} color={bgColor} />
                <PlaceHolder height={placeHeight} color={bgColor} textSize={sizeString} />
                <MiddleSpace height={midHeight} color={bgColor} />
                <Captions height={botHeight} textSize={sizeString} azureCaptionSuccess={true} />


                {/* <DNDTest /> */}
            </div>
        )
    } else {
        if (isEnteredKey === true || isEnteredRegion === true) {
            dispatch(flip_check_azureKey())
            if (isRecording === true) {
                dispatch(flip_recording())
            }
        }
        return (
            <div className={styles.App2} style={{
                backgroundColor: 'white',
                color: 'black',
                overflow: 'hidden',
                position: 'fixed',
            }}>
                <TopSpace height={topHeight} color={bgColor} />
                <PlaceHolder height={placeHeight} color={bgColor} textSize={sizeString} />
                <MiddleSpace height={midHeight} color={bgColor} />
                <Captions height={botHeight} textSize={sizeString} azureCaptionSuccess={true} />
                {/* <DNDTest /> */}
            </div>
        )
    }
    // You can't comment in JSX.
    // The style tag is the easiest way to set style based on JS variables.

}

var timer = 30
    , isTimerStarted = false;
var myTime;
function checkIfStillHere() {
    swal({
        title: 'Are you still here?',
        confirmButtonText: "OK",
        icon: 'warning',
        text: 'If you want to continue using Azure Recogition click ok.  \n You have ' + timer + ' seconds.',
        timer: !isTimerStarted ? timer * 1000 : undefined,

    }
    ).then(function (isConfirm) {
        if (isConfirm) {
            swal({
                title: 'Continue using Azure Recogition.',
                icon: 'success',
                timer: 2000,
                buttons: false,
            });
            timer = 30;
            clearTimeout(myTime);
        }
    });

    isTimerStarted = true;
    if (timer) {
        timer--;
        myTime = setTimeout(checkIfStillHere, 1000);
    } else {
        swal({
            title: "Reloading...",
            icon: 'error',
            timer: 3000,
            buttons: false,
        });
        window.location.reload(true);
    }

}
