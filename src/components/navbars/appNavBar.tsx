import * as React from 'react';
import { useSelector } from 'react-redux';
import { ApiStatus, RootState, DisplayStatus, ControlStatus } from '../../react-redux&middleware/redux/typesImports';
import {
    createTheme,
    ThemeProvider,
    IconButton,
    Drawer,
    Grid,
    AppBar,
    Toolbar,
    Typography,
    Tooltip,
    // useMediaQuery,
    // useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SideBar from './sidebar/sidebar';
import TopBar from './topbar/topBar';
import { API_Name } from '../../react-redux&middleware/redux/types/apiEnums';

import {
  useTheme
} from '@mui/material';

const currTheme = createTheme({
    palette: {
        primary: {
            main: '#ffffff',
            contrastText: '#000000'
        },
    },
});

export default function AppNavBar(props) {
    const [isDrawerOpen, setDrawerOpen] = React.useState(false);
    const apiStatus = useSelector((state: RootState) => state.APIStatusReducer as ApiStatus);
    const displayStatus = useSelector((state: RootState) => state.DisplayReducer as DisplayStatus);
    const controlStatus = useSelector((state: RootState) => state.ControlReducer as ControlStatus);

    const apiDisplayName = API_Name(apiStatus.currentApi);
    const accentColor = displayStatus.secondaryColor;

    const theme = useTheme();
    // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const toggleDrawer = (open: boolean) => (event: React.MouseEvent | React.KeyboardEvent) => {
        if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };
    console.log(apiStatus.currentApi)

    return (
        <ThemeProvider theme={theme}>
            <AppBar position="fixed" id="topbar-wrapper" sx={{ transition: '0.6s', backgroundColor: accentColor }}>
                <Toolbar sx={{ width: '100%', minHeight: 56, color: 'white' }}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid container alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                            {/* Left Section: Menu Icon and Title */}
                            <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                                <Tooltip title = "Menu">
                                    <IconButton edge="start" sx={{ color: 'white' }} aria-label="menu" onClick={toggleDrawer(true)}>
                                        <MenuIcon />
                                    </IconButton>
                                </Tooltip>
                                <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
                                    <SideBar isRecording={props.isRecording} onClose={toggleDrawer(false)} />
                                </Drawer>
                                <Typography variant="h6" noWrap sx={{ color: 'white', paddingLeft: 2 }}>
                                    ScribeAR
                                </Typography>
                            </Grid>

                            {/* Right Section: TopBar (Strictly on one line with padding) */}
                            <Grid 
                                item 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    whiteSpace: 'nowrap', 
                                    flexShrink: 0, 
                                    pr: 5
                                }}
                            >
                                <TopBar
                                    theme={theme}
                                    apiDisplayName={apiDisplayName}
                                    listening={controlStatus.listening}
                                    menuVisible={displayStatus.menuVisible}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
}
