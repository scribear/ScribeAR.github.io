import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { RootState } from '../../../store';
import PauseIcon from '@mui/icons-material/Pause';
import { useDispatch, useSelector } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ControlStatus } from '../../../redux/types';
import Theme from '../../theme'
import * as React from 'react';
import Button from '@mui/material/Button';

   export default function CustomizedMenus(props) {
     const dispatch = useDispatch()
     let controlStatus = useSelector((state: RootState) => {
          return state.ControlReducer as ControlStatus;
     });

     const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
          controlStatus.listening = !controlStatus.listening
          dispatch({type: 'FLIP_RECORDING', payload: controlStatus})
     }
     const {myTheme} = Theme()

     return (
       <div>
        <ThemeProvider theme={myTheme}>
         <Button
           id="demo-customized-button"
           variant="contained"
           disableElevation
           onClick={toggleDrawer}
           sx={{ width: 50, height:30}}
         >
          {controlStatus.listening === false ? <PlayArrowIcon /> : <PauseIcon />}
         </Button>
         </ThemeProvider>

       </div>
     );
   }
