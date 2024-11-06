import { createTheme } from '@mui/material/styles';
//import { RootState, DisplayStatus } from '../react-redux&middleware/redux/typesImports';
//import { useSelector } from 'react-redux';

// our global theme provider
// Secondary represents the color of the background
// Primary is the color of the topbar
// Info is the color of the text and the icons (always either 1 (black) or 0 (white))

export default function Theme() {
// const displayStatus = useSelector((state: RootState) => {
//     return state.DisplayReducer as DisplayStatus;
// })

// alert(displayStatus.secondaryColor);
// alert(displayStatus.primaryColor);
// alert(displayStatus.textColor);
const myTheme = createTheme
    ({
        palette: {
            primary: {
                main: '#fff'
            },
            secondary: {
                main: '#000'
            },
            info: {
                main: '#000'
            }
            
            
        },
    });
    return{myTheme}
}