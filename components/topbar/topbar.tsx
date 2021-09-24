import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import SideBar from '../sidebar/sidebar'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
const currTheme = createTheme({
    palette: {
        primary: {
            main: '#ffffff'
        }
    },
});

export default function TemporaryDrawer() {
    const myTheme = currTheme;
    const [state, setState] = React.useState({
        isOpen: false
    });
    const toggleDrawer =
        (open: boolean) =>
            (event: React.MouseEvent) => {
                setState({ ...state, isOpen: open });
            };
    return (
        <AppBar position="fixed" >
            <Toolbar>
                <div className="d-table-cell tar">
                    <IconButton
                        onClick={toggleDrawer(true)}
                    >
                        <ThemeProvider theme={myTheme}>
                            <MenuIcon color="primary" />
                        </ThemeProvider>
                    </IconButton>
                    <Drawer
                        open={state.isOpen}
                        onClose={toggleDrawer(false)}
                    >
                        <SideBar />
                    </Drawer>
                </div>
                <div className="border d-table w-100">
                    <h2 className="d-table-cell tar2">ScribeAR</h2>
                </div>

            </Toolbar>
        </AppBar>
    )
}