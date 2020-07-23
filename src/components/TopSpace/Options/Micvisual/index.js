import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {mono_line, mono_spectrum, mono_circular} from '../../../../redux/actions'
import {IconButton, FormControlLabel} from "@material-ui/core"
import ShowChartSharpIcon from '@material-ui/icons/ShowChartSharp';
import RadioButtonUncheckedOutlinedIcon from '@material-ui/icons/RadioButtonUncheckedOutlined';
import BarChartSharpIcon from '@material-ui/icons/BarChartSharp';



export default function Micvisual(props) {

    // useDispatch returns the state modifying function, invoked below.
    const setting = useSelector((state) => state.mic)
    const dispatch = useDispatch()

    let color = {
        lineColor: 'inherit',
        spectrumColor: 'inherit',
        circularColor: 'inherit',
    }

    if(setting == 0 || setting > 3){
        color.lineColor = 'inherit';
        color.circularColor = 'inherit';
        color.spectrumColor = 'inherit';
    }else if (setting == 1){
        color.lineColor = 'primary';
        color.spectrumColor = 'inherit';
        color.circularColor = 'inherit';
    }else if (setting == 2){
        color.lineColor = 'inherit';
        color.spectrumColor = 'primary';
        color.circularColor = 'inherit';
    }else if (setting == 3){
        color.lineColor = 'inherit';
        color.spectrumColor = 'inherit';
        color.circularColor = 'primary';
    }

    if(setting != 0 && setting < 4){
        localStorage.setItem('mic',setting);
    }

    return (
        <div>
            <FormControlLabel
                value="Line"
                control={<IconButton color={color.lineColor} onClick={() => (dispatch(mono_line()))}>
                    <ShowChartSharpIcon fontSize="large"/>
                </IconButton>}
                label="Line"
                labelPlacement="bottom"
            />

            <FormControlLabel
                value="Spectrum"
                control={<IconButton color={color.spectrumColor} onClick={() => (dispatch(mono_spectrum()))}>
                    <BarChartSharpIcon fontSize="large"/>
                </IconButton>}
                label="Spectrum"
                labelPlacement="bottom"
            />

            <FormControlLabel
                value="Circular"
                control={<IconButton color={color.circularColor} onClick={() => (dispatch(mono_circular()))}>
                    <RadioButtonUncheckedOutlinedIcon fontSize="large"/>
                </IconButton>}
                label="Circular"
                labelPlacement="bottom"
            />


        </div>

    )
}

