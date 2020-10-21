import React from 'react'
import {useSelector, useDispatch} from 'react-redux'

import {
    stereo_circular,
    stereo_rectangular,
    stereo_spectrum,

} from '../../../../redux/actions'
import {FormControlLabel, IconButton} from "@material-ui/core"
import RadioButtonUncheckedOutlinedIcon from '@material-ui/icons/RadioButtonUncheckedOutlined';
import BarChartSharpIcon from '@material-ui/icons/BarChartSharp';
import Crop169Icon from '@material-ui/icons/Crop169';


export default function Stereovisual(props) {

    // useDispatch returns the state modifying function, invoked below.
    const dispatch = useDispatch()
    const setting = useSelector((state) => state.mic)

    let color = {
        circularColor: 'inherit',
        barColor: 'inherit',
        spectrumColor: 'inheirt',
    }

    if (setting === 0 || setting < 4) {
        color.circularColor = 'inherit';
        color.barColor = 'inherit';
        color.spectrumColor = 'inherit';
    } else if (setting === 4) {
        color.circularColor = 'primary';
        color.barColor = 'inherit';
        color.spectrumColor = 'inherit';
    } else if (setting === 5) {
        color.circularColor = 'inherit';
        color.barColor = 'primary';
        color.spectrumColor = 'inherit';
    } else if (setting === 6) {
        color.circularColor = 'inherit';
        color.barColor = 'inherit';
        color.spectrumColor = 'primary';
    }

    if(setting !== 0 && setting > 3){
        localStorage.setItem('mic',setting);
    }

    return (
        <div>
            <FormControlLabel
                value="Circular"
                control={<IconButton color={color.circularColor} onClick={() => (dispatch(stereo_circular()))}>
                    <RadioButtonUncheckedOutlinedIcon fontSize="large"/>
                </IconButton>}
                label="Circular"
                labelPlacement="bottom"
            />
            <FormControlLabel
                value="Bar"
                control={<IconButton color={color.barColor} onClick={() => (dispatch(stereo_rectangular()))}>
                    <Crop169Icon fontSize="large"/>
                </IconButton>}
                label="Bar"
                labelPlacement="bottom"
            />
            <FormControlLabel
                value="Spectrum"
                control={<IconButton color={color.spectrumColor} onClick={() => (dispatch(stereo_spectrum()))}>
                    <BarChartSharpIcon fontSize="large"/>
                </IconButton>}
                label="Spectrum"
                labelPlacement="bottom"
            />


        </div>

    )
}
