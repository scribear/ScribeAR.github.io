import * as React from 'react';
import SideBar from '../sidebar/sidebar'
import Fullscreen from './fullScreen'
import Listening from './listening'
import { ApiStatus, RootState, DisplayStatus, ControlStatus } from '../../redux/types';
import { useDispatch, useSelector } from 'react-redux';
import MenuHider from './menuHider';
import PickApi from './ApiDropdown'
import { useCallback, useEffect } from 'react';
import { createTheme, ThemeProvider, IconButton, MenuIcon, Drawer, Grid, AppBar, Toolbar } from '../../muiImports'
import { SxProps } from '@mui/system';
// import './topbar.css'

const currTheme = createTheme({
    palette: {
        primary: {
            main: '#ffffff'
        }
    },
});

export default function TemporaryDrawer(props) {
    const dispatch = useDispatch()
    const [state, setState] = React.useState({
        isOpen: false
    });
    const apiStatus = useSelector((state: RootState) => {
        return state.APIStatusReducer as ApiStatus;
    })
    const displayStatus = useSelector((state: RootState) => {
        return state.DisplayReducer as DisplayStatus;
    })
    const controlStatus = useSelector((state: RootState) => {
        return state.ControlReducer as ControlStatus;
    })
    let display = "Webspeech"
    if (apiStatus.currentAPI == 1) {
        display = "Azure"
    } else if (apiStatus.currentAPI == 2) {
        display = "StreamText"
    } else {
        display = "Webspeech"
    }
    const myTheme = currTheme;

    const sxP: SxProps = {
        height: 400,
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
    };

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
        <AppBar position="fixed" id="topbar-wrapper" onMouseOut={changeVisibility} onMouseOver={changeVisibilityOver} style={{ transition: '0.6s' }}>
            <Grid container spacing={2} alignItems="center"  >
                <Toolbar style={{ backgroundColor: displayStatus.secondaryColor, width: '100%', maxHeight: '10vh', paddingLeft: '20px'}}>
                    <Grid item xs={6}>
                        <Grid container spacing={1} alignItems="center"  >
                            <Grid item>
                                <IconButton
                                    onClick={toggleDrawer(true)}
                                >
                                    <ThemeProvider theme={myTheme}>
                                        <MenuIcon
                                            color="primary"
                                            fontSize="large"
                                            sx={{
                                                fontSize: '2rem',
                                                '@media (max-width:900px)': {
                                                    position: 'absolute',
                                                    margin: '0px',
                                                    padding: '0px',
                                                    left: '1vw'
                                                },
                                            }}
                                        />
                                    </ThemeProvider>
                                </IconButton>
                                <Drawer
                                    disableEnforceFocus
                                    open={state.isOpen}
                                    onClose={toggleDrawer(false)}
                                >
                                    <SideBar isRecording={props.isRecording} onClose={() => setState({...state, isOpen: false})} />
                                </Drawer>
                            </Grid>
                            <Grid item>
                                <h2 style={{ 
                                    textAlign: "left", 
                                    paddingLeft: '20px',
                                    paddingRight: '0px',    
                                    margin: '0px',
                                }}>ScribeAR</h2>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Grid
                            container
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="center"
                        >   
                            <style>
                                {`
                                    @media (max-width: 600px) {    
                                        #Hi {
                                            width: 20vw;
                                            margin: 0px;
                                            padding: 0px;
                                            float: left;
                                            position: absolute;
                                            top: 5px;
                                            right: 40vw;
                                        }
                                    }
                                `}
                            </style>
                            <Grid item id='Hi'>
                                <PickApi />
                            </Grid>

                            <Grid item >
                                <Listening listening={controlStatus.listening} />
                            </Grid>

                            <Grid item>
                                <MenuHider menuVisible={displayStatus.menuVisible} />
                            </Grid>

                            <Grid item>
                                <Fullscreen />
                            </Grid>

                        </Grid>
                    </Grid>
                </Toolbar>
            </Grid>
        </AppBar>
    )
}