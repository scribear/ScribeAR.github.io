import React, { useState, useRef } from 'react';
import { CirclePicker } from 'react-color';
import {Button, ThemeProvider, FormatColorTextIcon } from '../../../../muiImports';
import { format } from 'path';
import { ConsoleLoggingListener } from 'microsoft-cognitiveservices-speech-sdk/distrib/lib/src/common.browser/ConsoleLoggingListener';
import { RootState, DisplayStatus } from '../../../../react-redux&middleware/redux/typesImports';
import { useDispatch, useSelector } from 'react-redux';

export default function ColorWheelButton() {
    const [selectedColor, setSelectedColor] = useState('#ff0000'); // Default color: red

    const dispatch = useDispatch()
    const position = useSelector((state: RootState) => {
      return state.DisplayReducer as DisplayStatus;
    });
    const handleInputChangeSlider = (event) => {
      dispatch({ type: 'CHANGE_TEXT_COLOR', payload: event })
    }

  const handleButtonClick = (event) => {
    console.log("bottoon click");
    handleColorChange(event); 
  };

  const handleColorChange = (event) => {
    const selectedColor = event.target.value;
    console.log(event);
    // Perform your custom action with the selected color
    console.log("Selected color:", selectedColor);
    handleInputChangeSlider(event.target.value);
    console.log("Selected colord:", selectedColor);
  };
  
    return (
        <Button id="demo-customized-button" variant="contained" disableElevation sx={{ width: 50, height: 30 }} onClick={handleButtonClick}>
            <input type="color" value={selectedColor} onChange={handleColorChange} />
            {/* {<FormatColorTextIcon />} */}
        </Button>
    );
};