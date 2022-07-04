import { RootState } from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { ControlStatus } from '../../../redux/types';
import Theme from '../../theme'
import * as React from 'react';
import { PauseIcon, Button, PlayArrowIcon, createTheme, ThemeProvider, Switch } from '../../../muiImports'


    export default function ShowFrequency() {
        const dispatch = useDispatch()
        let controlStatus = useSelector((state: RootState) => {
            return state.ControlReducer as ControlStatus;
        });

        const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
            dispatch({type: 'FLIP_SHOWFREQ'})
        }
        const {myTheme} = Theme()

        return (
        <div>
            <ThemeProvider theme={myTheme}>
                {/* <Button
                id="demo-customized-button"
                variant="contained"
                disableElevation
                onClick={toggleDrawer}
                sx={{ width: 50, height:30}}
                > */}
                    {/* {controlStatus.showFrequency === false ? <PlayArrowIcon /> : <PauseIcon />} */}
                    {controlStatus.showFrequency === true ? <Switch onClick={toggleDrawer} defaultChecked /> : <Switch onClick={toggleDrawer}/>}
                {/* </Button> */}
            </ThemeProvider>
        </div>
        );
    }
