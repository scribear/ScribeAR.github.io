import React, { useState, useRef } from 'react';
import {Button, FormatColorTextIcon } from '../../../../muiImports';
import { RootState, DisplayStatus } from '../../../../react-redux&middleware/redux/typesImports';
import { useDispatch, useSelector } from 'react-redux';

export default function FontColorWheelButton() {
    const color = useSelector((state: RootState) => {
      return state.DisplayReducer as DisplayStatus;
    });

    const [selectedColor, setSelectedColor] = useState(color.textColor);
    // console.log("the current color is:", color.textColor);

    const dispatch = useDispatch();
    const position = useSelector((state: RootState) => {
      return state.DisplayReducer as DisplayStatus;
    });
    const handleInputChange = (event) => {
      dispatch({ type: 'CHANGE_TEXT_COLOR', payload: event });
    }

    const inputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = (event) => {
      console.log("font color button click");
      inputRef.current?.click(); 
    };

    const handleColorChange = (event) => {
      const selectedColor = event.target.value;
      console.log("font selected color:", selectedColor);
      handleInputChange(event.target.value);
      setSelectedColor(selectedColor);
    };
  
    return (
        <Button id="demo-customized-button" variant="contained" disableElevation sx={{ width: 50, height: 30 }} onClick={handleButtonClick}>
            <input ref={inputRef} type="color" value={selectedColor} onChange={handleColorChange} />
            {/* {<FormatColorTextIcon />} */}
        </Button>
    );
};