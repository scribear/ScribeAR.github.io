import { createTheme } from '@mui/material/styles';
import { RootState, DisplayStatus } from '../react-redux&middleware/redux/types';
import { useSelector } from 'react-redux';

// our global theme provider
// Secondary represents the color of the background
// Primary is the color of the topbar
// Info is the color of the text and the icons (always either 1 (black) or 0 (white))

export default function Theme() {
const displayStatus = useSelector((state: RootState) => {
    return state.DisplayReducer as DisplayStatus;
})

const myTheme = createTheme
    ({
        palette: {
            primary: {
                main: displayStatus.secondaryColor
            },
            secondary: {
                main: displayStatus.primaryColor
            },
            info: {
                main: displayStatus.textColor
            }
            
            
        },
    });
    return{myTheme}
}