import { /* PlayArrowIcon, PauseIcon,*/ MicIcon, MicOffIcon, ThemeProvider, IconButton, Tooltip  } from '../../../muiImports';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { ControlStatus } from '../../../react-redux&middleware/redux/typesImports';
import Theme from '../../theme'
import * as React from 'react';


   export default function CustomizedMenus(props) {
    console.log(Theme())
     const dispatch = useDispatch()
     
     let controlStatus = useSelector((state: RootState) => {
          return state.ControlReducer as ControlStatus;
     });

     const handleClick = (event: React.KeyboardEvent | React.MouseEvent) => {
          controlStatus.listening = !controlStatus.listening
          dispatch({type: 'FLIP_RECORDING', payload: controlStatus})
     }
     const {myTheme} = Theme()

     // color "primary" comes from Theme()
     return (
       <div>
        <ThemeProvider theme={myTheme}>
          <Tooltip title = 
            {props.listening === false ? "Begin Listening" : "Pause Listening"}>
            <IconButton color="primary" onClick={handleClick}>
              {props.listening ? 
                <MicIcon color="primary" fontSize="large"/> : 
                <MicOffIcon color="primary" fontSize="large"/>
              }
            </IconButton>
          </Tooltip>
         </ThemeProvider>

       </div>
     );
   }
