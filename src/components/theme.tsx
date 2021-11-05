import { createTheme } from '@mui/material/styles';
import { RootState, DisplayStatus } from '../redux/types';
import { useSelector } from 'react-redux';

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
            }
            
        },
    });
    return{myTheme}
}