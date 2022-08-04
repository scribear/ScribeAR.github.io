import * as React from 'react';
import { RootState } from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { ControlStatus } from '../../../redux/types';
import Theme from '../../theme'
import { ThemeProvider, Switch } from '../../../muiImports'


    export default function ShowTimeData() {
        const dispatch = useDispatch()
        let controlStatus = useSelector((state: RootState) => {
            return state.ControlReducer as ControlStatus;
        });

        const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
            dispatch({type: 'FLIP_SHOWTIMEDATA'});
            // if (controlStatus.showFrequency) {dispatch({type: 'FLIP_SHOWFREQ'})};
        }
        const {myTheme} = Theme()

        return (
            <div>
                <ThemeProvider theme={myTheme}>
                    {controlStatus.showTimeData === true ? <Switch onClick={toggleDrawer} checked={true} /> : <Switch onClick={toggleDrawer} checked={false} />}
                </ThemeProvider>

            </div>
        );
    }
