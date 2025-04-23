import { FullscreenIcon, FullscreenExitIcon, createTheme, ThemeProvider, IconButton, Tooltip } from "../../../muiImports"
import * as React from 'react';


const currTheme = createTheme({
    palette: {
        primary: {
            main: '#ffffff'
        }
    },
});

export default function Fullscreen(props) {
    const [state, setState] = React.useState({ isFullScreen: false });

    const toggleDrawer = () => {
        let elem = document.documentElement;
        if (!state.isFullScreen) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
        setState({ ...state, isFullScreen: !state.isFullScreen })
    }

    return (
        <div style={{ position: 'relative' }}>
            <ThemeProvider theme={currTheme}>
                <Tooltip title={state.isFullScreen ? "Exit full screen" : "Makes application full screen"}>
                    <IconButton onClick={toggleDrawer} color="primary" >
                        {state.isFullScreen ? <FullscreenExitIcon fontSize="large" /> : <FullscreenIcon fontSize="large" />}
                    </IconButton>
                </Tooltip>
            </ThemeProvider>
        </div>
    );
}
