import * as React from 'react';
import { useSelector } from 'react-redux';
import { ApiStatus, RootState, DisplayStatus, ControlStatus } from '../../redux/types';
import { createTheme, ThemeProvider, IconButton, MenuIcon, Drawer, Grid, AppBar, Toolbar } from '../../muiImports'

import SideBar from './sidebar/sidebar'
import TopBar from './topbar/topBar';

const currTheme = createTheme({
    palette: {
        primary: {
            main: '#ffffff'
        }
    },
});

export default function AppNavBar(props) {
    const [state, setState] = React.useState({ isOpen: false });
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


    const toggleDrawer = (open: boolean) => (event: React.MouseEvent) => {
        setState({ ...state, isOpen: open });
    };
    

    return (
        <AppBar position="fixed" id="topbar-wrapper" onMouseOut={changeVisibility} onMouseOver={changeVisibilityOver} style={{ transition: '0.6s' }}>
            <Grid container spacing={2} alignItems="center"  >
                <Toolbar style={{ backgroundColor: displayStatus.secondaryColor, width: '100%', maxHeight: '10vh', paddingLeft: '20px' }}>
                    <Grid item xs={6}>
                        <Grid container spacing={1} alignItems="center"  >
                            <Grid item>
                                <IconButton onClick={toggleDrawer(true)}>
                                    <ThemeProvider theme={myTheme}>
                                        <MenuIcon color="primary" fontSize="large"/>
                                    </ThemeProvider>
                                </IconButton>
                                <Drawer disableEnforceFocus open={state.isOpen} onClose={toggleDrawer(false)}>
                                    <SideBar isRecording={props.isRecording} />
                                </Drawer>
                            </Grid>
                            <Grid item>
                                <h2 style={{ textAlign: "left", paddingLeft: '20px' }}>ScribeAR</h2>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <TopBar theme={myTheme} display={display} listening={controlStatus.listening} menuVisible={displayStatus.menuVisible}/>
                    </Grid>
                </Toolbar>
            </Grid>
        </AppBar>
    )
    

    

    // return (
    //     <AppBar position="fixed" id="topbar-wrapper" onMouseOut={changeVisibility} onMouseOver={changeVisibilityOver} style={{ transition: '0.6s' }}>
    //         <Grid container spacing={2} alignItems="center"  >
    //             <Toolbar style={{ backgroundColor: displayStatus.secondaryColor, width: '100%', maxHeight: '10vh', paddingLeft: '20px' }}>
    //                 <Grid item xs={6}>
    //                     <Grid container spacing={1} alignItems="center"  >
    //                         <Grid item>
    //                             <IconButton onClick={toggleDrawer(true)}>
    //                                 <ThemeProvider theme={myTheme}>
    //                                     <MenuIcon color="primary" fontSize="large"/>
    //                                 </ThemeProvider>
    //                             </IconButton>
    //                             <Drawer disableEnforceFocus open={state.isOpen} onClose={toggleDrawer(false)}>
    //                                 <SideBar isRecording={props.isRecording} />
    //                             </Drawer>
    //                         </Grid>
    //                         <Grid item>
    //                             <h2 style={{ textAlign: "left", paddingLeft: '20px' }}>ScribeAR</h2>
    //                         </Grid>
    //                     </Grid>
    //                 </Grid>
    //                 <Grid item xs={6}>
    //                     <Grid container direction="row" justifyContent="flex-end" alignItems="center">
    //                         <Grid item >
    //                             <PickApi theme={currTheme} display={display}/>
    //                         </Grid>

    //                         <Grid item >
    //                             <Listening listening={controlStatus.listening} />
    //                         </Grid>

    //                         <Grid item>
    //                             <MenuHider menuVisible={displayStatus.menuVisible} />
    //                         </Grid>

    //                         <Grid item>
    //                             <Fullscreen />
    //                         </Grid>
    //                     </Grid>
    //                 </Grid>
    //             </Toolbar>
    //         </Grid>
    //     </AppBar>
    // )
}