import React, { useState } from 'react'

import { RootState } from '../../../../store';
import { useDispatch, useSelector } from 'react-redux';
import Theme from '../../../theme';
import {Button, ThemeProvider, FormatColorTextIcon } from '../../../../muiImports';
import Testbutton from './testbutton';


export default function ShowFrequency() {

  const {myTheme} = Theme();

  
  return (
    <div>
      <ThemeProvider theme={myTheme}>
        {/* <Button id="demo-customized-button" variant="contained" disableElevation
                // onClick={handleClick}
                sx={{ width: 50, height: 30 }}>
          {<FormatColorTextIcon />}
        </Button> */}
        <Testbutton />
      </ThemeProvider>
    </div>
  );
}