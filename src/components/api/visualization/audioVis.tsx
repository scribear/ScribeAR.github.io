import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { 
    DisplayStatus, AzureStatus, ControlStatus, 
    ApiStatus, SRecognition } from '../../../react-redux&middleware/redux/typesImports'


import { LoungeVisual } from './loungeVisual'
import { TimeDataVisual } from './timeDataVisual';
import { Draggable } from './DraggableFC';
import { Resizable } from './Resizable';



export const AudioVis: React.FC = (props) => {
    const controlStatus = useSelector((state: RootState) => {
        return state.ControlReducer as ControlStatus;
    });

    if (controlStatus.showTimeData === true) {
        return (
            <Draggable id="fullVisual">
                <Resizable size="290px">
                    <LoungeVisual></LoungeVisual>
                </Resizable>
            </Draggable>
        )
    } else if (controlStatus.showFrequency === true) {
        return (
            <Draggable id="fullVisual">
                <Resizable size="290px">
                    <LoungeVisual></LoungeVisual>
                </Resizable>
            </Draggable>
        )
    } else {
        return (<div></div>)
    }
}