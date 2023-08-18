import * as React from 'react';
import { Grid } from '../../../muiImports';

import ApiDropdown from './apiDropdown';
import Fullscreen from './fullScreen';
import Listening from './listening';
import MenuHider from './menuHider';


export default function TopBar(props) {

    return (
        <div>
            <Grid container direction="row" justifyContent="flex-end" alignItems="center">
                <Grid item>
                    <ApiDropdown theme={props.theme} apiDisplayName={props.apiDisplayName}/>
                </Grid>

                <Grid item>
                    <Listening listening={props.listening} />
                </Grid>

                <Grid item>
                    <MenuHider menuVisible={props.menuVisible} />
                </Grid>

                <Grid item>
                    <Fullscreen />
                </Grid>
            </Grid>
        </div>
    )
}