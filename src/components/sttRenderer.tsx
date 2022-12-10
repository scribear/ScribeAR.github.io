import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { 
    DisplayStatus, AzureStatus, ControlStatus, 
    ApiStatus, SRecognition } from '../react-redux&middleware/redux/typesImports'

import Swal from 'sweetalert2';

import { LoungeVisual } from './api/visualization/loungeVisual'
import { TimeDataVisual } from './api/visualization/timeDataVisual';
import { Draggable } from './api/visualization/DraggableFC';
import { Resizable } from './api/visualization/Resizable';
import { returnRecogAPI, useRecognition } from './api/returnAPI';

// export default function STTRenderer() {
// export const STTRenderer : React.FC = (props) => {
export const STTRenderer = async () => {
    // const dispatch = useDispatch();
    // use createSelector to memoize the selector
    // rerender if any subscribed state changes
    const controlStatus = useSelector((state: RootState) => {
        return state.ControlReducer as ControlStatus;
    });
    // const displayStatus = useSelector((state: RootState) => {
    //     return state.DisplayReducer as DisplayStatus;
    // });
    const azureStatus = useSelector((state: RootState) => {
        return state.AzureReducer as AzureStatus;
    })
    const apiStatus = useSelector((state: RootState) => {
        return state.APIStatusReducer as ApiStatus;
    })
    const sRecog = useSelector((state: RootState) => {
        return state.SRecognitionReducer as SRecognition;
    })


    





    const { transcript } = await useRecognition(sRecog, apiStatus, controlStatus, azureStatus);
    console.log('40', transcript);

    return transcript;

    // // whenevers api changes, we test first
    // // maybe we don't need to test it.
    // // only allowing one service to be active at a time
    // useEffect(() => {
    //     // recogHandler(action={type: 'START'});



    //     // if (apiStatus.currentApi == 0) { // WebSpeech
            
    //     //     // start recognition
    //     //     // useRecognition();
    //     // } else if (apiStatus.currentApi == 1) { // Azure TranslationRecognizer
    //     //     // start recognition
    //     // }

        
    // }, [apiStatus.currentApi, controlStatus.listening]);





    // get transcripts from localStorage or sessionStorage or redux






    // according to controlStatus, display visualization or not




    // return (
    //     <div>
    //     </div>
    // )
}