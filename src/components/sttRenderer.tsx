import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { DisplayStatus, AzureStatus, ControlStatus, ApiStatus } from '../react-redux&middleware/redux/types'

import Swal from 'sweetalert2';

import { LoungeVisual } from './api/visualization/loungeVisual'
import { TimeDataVisual } from './api/visualization/timeDataVisual';
import { Draggable } from './api/visualization/DraggableFC';
import { Resizable } from './api/visualization/Resizable';
import { returnRecogAPI } from './api/returnAPI';

// export default function STTRenderer() {
export const STTRenderer : React.FC = (props) => {
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

    const { useRecognition, recognition, recogHandler } = returnRecogAPI(apiStatus, controlStatus, azureStatus);
    // const { transcripts, listen } = useRecognition(recognition);

    // whenever api changes, we test first
    // maybe we don't need to test it.
    // only allowing one service to be active at a time
    useEffect(() => {
        // get recognition

        if (apiStatus.currentAPI == 1) { // Azure
            // test
            // get recognition
            
            // start recognition
            // useRecognition();
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