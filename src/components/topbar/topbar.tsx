import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import SideBar from '../sidebar/sidebar'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Fullscreen from './fullScreen'
import { ApiStatus, RootState, DisplayStatus } from '../../redux/types';
import { useDispatch, useSelector } from 'react-redux';
import MenuHider from './menuHider';
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
import PickApi from './ApiDropdown'
const currTheme = createTheme({
    palette: {
        primary: {
            main: '#ffffff'
        }
    },
});

export default function TemporaryDrawer(props) {
    const [state, setState] = React.useState({
        isOpen: false
    });
    const apiStatus = useSelector((state: RootState) => {
        return state.APIStatusReducer as ApiStatus;
    })
    const displayStatus = useSelector((state: RootState) => {
        return state.DisplayReducer as DisplayStatus;
    })
    let display = "Webspeech"
    if (apiStatus.currentAPI == 1) {
        display = "Azure"
    } else if (apiStatus.currentAPI == 2) {
        display = "StreamText"
    } else {
        display = "Webspeech"
    }
    const myTheme = currTheme
    const changeVisibility = () => {
        let topbarID = document.getElementById("topbar-wrapper")
        if (!displayStatus.menuVisible) {
            if (topbarID) {
                topbarID.style.opacity = "0"
            }
        } else {
            if (topbarID) {
                topbarID.style.opacity = "1"
            }
        }
    }
    const changeVisibilityOver = () => {
        let topbarID = document.getElementById("topbar-wrapper")
        if (topbarID) {
            topbarID.style.opacity = "1"
        }
    }
    const toggleDrawer =
        (open: boolean) =>
            (event: React.MouseEvent) => {
                setState({ ...state, isOpen: open });
            };
    return (
        <AppBar position="fixed" id="topbar-wrapper" onMouseOut={changeVisibility} onMouseOver={changeVisibilityOver} style={{ transition: '0.6s', height: '10vh'}}>
            <Toolbar style={{backgroundColor: displayStatus.secondaryColor}}>
                <div className="d-table-cell tar">
                    <IconButton
                        onClick={toggleDrawer(true)}
                    >
                        <ThemeProvider theme={myTheme}>
                            <MenuIcon color="primary" />
                        </ThemeProvider>
                    </IconButton>
                    <Drawer
                        disableEnforceFocus
                        open={state.isOpen}
                        onClose={toggleDrawer(false)}
                    >
                        <SideBar isRecording={props.isRecording}/>
                    </Drawer>
                </div>
                <div className="border d-table w-100">
                    <h2 className="d-table-cell tar2">ScribeAR</h2>
                </div>
                <div  style ={{position: 'relative', left: '62vw'}}>
                <PickApi />
                </div>
                <h3 style ={{position: 'relative', left: '62.5vw'}}> {display} </h3>
                <div  style ={{position: 'absolute', left: '93vw', paddingLeft: '2vw'}}>

                <Fullscreen/>
                </div>
                <div  style ={{position: 'absolute', left: '90.5vw', paddingLeft: '2vw'}}>

                    <MenuHider menuVisible={displayStatus.menuVisible}/>
                </div>

            </Toolbar>
        </AppBar>
    )
}