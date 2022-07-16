import { RootState } from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { ControlStatus } from '../../../redux/types';
import Theme from '../../theme'
import * as React from 'react';
import { PauseIcon, Button, PlayArrowIcon, createTheme, ThemeProvider, Switch } from '../../../muiImports'


    export default function Visualizing() {
        const dispatch = useDispatch()
        let controlStatus = useSelector((state: RootState) => {
            return state.ControlReducer as ControlStatus;
        });

        const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
            dispatch({type: 'FLIP_VISUALIZING'})
        }
        const {myTheme} = Theme()

        return (
        <div>
            <ThemeProvider theme={myTheme}>
                {controlStatus.visualizing === true ? <Switch onClick={toggleDrawer} defaultChecked /> : <Switch onClick={toggleDrawer}/>}
            </ThemeProvider>

        </div>
        );
    }
