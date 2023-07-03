import * as React from 'react';
import Theme from '../../../theme'
import { useDispatch} from 'react-redux';
import {TextField, Autocomplete, ThemeProvider} from '../../../../muiImports';

export default function CustomizedMenus(props) {
  const {myTheme} = Theme()
  const dispatch = useDispatch();
  const handleClickItem = (code) => { 
    if (code)
    dispatch({type: props.dispatchType, payload: code })
  }
  return (
    <div>
        <ThemeProvider theme={myTheme}>      
        <Autocomplete
              disablePortal
              id="combo-box-demo"
              value={props.currLanguage.label}
              options={props.languageList}
              sx={{ width: "200%"  }}
              onChange={(event, newValue) => {
                handleClickItem(newValue)
              }}
              renderInput={(params) => <TextField {...params} />}
            />
      </ThemeProvider>

    </div>
  );
}
