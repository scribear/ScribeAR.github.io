import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { DisplayStatus, AzureStatus, ControlStatus, ApiStatus } from '../react-redux&middleware/redux/types'

import Swal from 'sweetalert2';

import { useRecognition } from './api/web-speech/webSpeechRecognition';
import { azureRecognition } from './api/azure/azureRecognition';
import { LoungeVisual } from './api/visualization/loungeVisual'
import { TimeDataVisual } from './api/visualization/timeDataVisual';
import { Draggable } from './api/visualization/DraggableFC';
import { Resizable } from './api/visualization/Resizable';

export default function STTRenderer() {
    const dispatch = useDispatch();
    // use createSelector to memoize the selector
    const controlStatus = useSelector((state: RootState) => {
        return state.ControlReducer as ControlStatus;
    });
    const displayStatus = useSelector((state: RootState) => {
        return state.DisplayReducer as DisplayStatus;
    });
    const azureStatus = useSelector((state: RootState) => {
        return state.AzureReducer as AzureStatus
    })
    const apiStatus = useSelector((state: RootState) => {
        return state.APIStatusReducer as ApiStatus
    })

    // whenever api changes, we test first
    useEffect(() => {
        if (apiStatus.currentAPI == 1) { // test Azure
            

            // get recognition
            // start recognition
        } else if (apiStatus.currentAPI == 0) { // test WebSpeech
            

            // get recognition
            // start recognition
        }
    }, [apiStatus.currentAPI]);





    // get transcripts from localStorage or sessionStorage or redux






    // according to controlStatus, display visualization or not

    return (
        <div>
        </div>
    )

}