import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { 
    DisplayStatus, AzureStatus, ControlStatus, 
    ApiStatus, SRecognition } from '../react-redux&middleware/redux/typesImports'

import Swal from 'sweetalert2';

import { useRecognition } from './api/returnAPI';
import { AudioVis } from './api/visualization/audioVis';

// export default function STTRenderer() {
// export const STTRenderer : React.FC = (props) => {
export const STTRenderer = () : JSX.Element => {
    // const dispatch = useDispatch();
    // use createSelector to memoize the selector
    // rerender if any subscribed state changes
    const controlStatus = useSelector((state: RootState) => {
        return state.ControlReducer as ControlStatus;
    });
    const displayStatus = useSelector((state: RootState) => {
        return state.DisplayReducer as DisplayStatus;
    });
    const azureStatus = useSelector((state: RootState) => {
        return state.AzureReducer as AzureStatus;
    })
    const apiStatus = useSelector((state: RootState) => {
        return state.APIStatusReducer as ApiStatus;
    })
    const sRecog = useSelector((state: RootState) => {
        return state.SRecognitionReducer as SRecognition;
    })


    
    const { transcript, recogHandler } = useRecognition(sRecog, apiStatus, controlStatus, azureStatus);
    // if (recogHandler) recogHandler({type: 'STOP'});
    // console.log('40', transcript);

    // return transcript;


    return (
        <div>
            <AudioVis></AudioVis>
            <ul >
                <h3 id = "captionsSpace" 
                    style = {{
                        position: 'fixed', width: '90%', 
                        textAlign: 'left', left: '0', fontSize: displayStatus.textSize + "vh", 
                        paddingLeft: '5%', paddingRight: '60%', 
                        overflowY: 'scroll', height: '40%', 
                        color: displayStatus.textColor
                    }}>{transcript}
                </h3>
            </ul>
        </div>
    );
}