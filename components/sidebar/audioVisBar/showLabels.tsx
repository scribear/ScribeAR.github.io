import { RootState } from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { ControlStatus } from '../../../redux/types';
import Theme from '../../theme'
import * as React from 'react';
import { ThemeProvider, Switch } from '../../../muiImports'


    export default function ShowLabels() {
        const dispatch = useDispatch()
        let controlStatus = useSelector((state: RootState) => {
            return state.ControlReducer as ControlStatus;
        });

        const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
            // console.log('flip showLabels');
            dispatch({type: 'FLIP_SHOWLABELS'})
        }
        const {myTheme} = Theme()

        if (controlStatus.showFrequency) {
            return (
                <div>
                    <ThemeProvider theme={myTheme}>
                        {controlStatus.showLabels === true ? <Switch onClick={toggleDrawer} checked={true} /> : <Switch onClick={toggleDrawer} checked={false} />}
                    </ThemeProvider>
                </div>
            )
        }

        // show disabled switch
        return (
            <div>
                <ThemeProvider theme={myTheme}>
                    {/* {controlStatus.showLabels === true ? <Switch onClick={toggleDrawer} checked={true} /> : <Switch onClick={toggleDrawer} checked={false} />} */}
                    {controlStatus.showLabels === true ? <Switch disabled checked={true} /> : <Switch disabled checked={false} />}
                </ThemeProvider>
            </div>
        );
    }
