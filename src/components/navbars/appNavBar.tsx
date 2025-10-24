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

    const TOP_TRIGGER_ZONE = 48; // px from top to reveal
    const HIDE_TIMEOUT_MS = 2500;
    const [topbarLocked, setTopbarLocked] = React.useState<boolean>(false);
    const [topbarVisible, setTopbarVisible] = React.useState<boolean>(true);
    const hideRef = React.useRef<number | null>(null);
    const pointerStartY = React.useRef<number | null>(null);
    const pointerId = React.useRef<number | null>(null);

    const showTopbar = React.useCallback(() => {
        setTopbarVisible(true);
        if (hideRef.current) {window.clearTimeout(hideRef.current); hideRef.current = null;}
        if (!topbarLocked) {
            hideRef.current = window.setTimeout(() => setTopbarVisible(false), HIDE_TIMEOUT_MS);
        }
    }, [topbarLocked]);

    React.useEffect(() => {showTopbar();}, [showTopbar]); //to activate immediately

    React.useEffect(() => {
        const onPointerDown = (e: PointerEvent) => {
            if(pointerId.current !== null) return;

            const y = e.clientY;
            pointerId.current = e.pointerId;
            pointerStartY.current = y;

            if (y <= TOP_TRIGGER_ZONE) {
                showTopbar();
            }
        };

        const onPointerMove = (e: PointerEvent) => {
            // proximity check
            if (e.clientY <= TOP_TRIGGER_ZONE) {
                showTopbar();
            }
            // swipe down check
            if (e.pointerId !== pointerId.current || pointerStartY.current === null) {
                return;
            }
            const y = e.clientY
            const delta = y - (pointerStartY.current ?? 0);
            const SWIPE_THRESHOLD = 40; //how far to swipe

            if(pointerStartY.current <= TOP_TRIGGER_ZONE && delta >= SWIPE_THRESHOLD) {
                showTopbar();

                // reset
                pointerStartY.current = null;
                pointerId.current = null;
            }
        };

        const onPointerUp = (e: PointerEvent) => {
            if(e.pointerId === pointerId.current) {
                pointerId.current = null;
                pointerStartY.current = null;
            }
        };

        window.addEventListener('pointerdown', onPointerDown, {passive: true });
        window.addEventListener('pointermove', onPointerMove, {passive: true });
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);

        return () => {
            window.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointercancel', onPointerUp);
        };
    }, [showTopbar]);

    React.useEffect(() => () => {if (hideRef.current) window.clearTimeout(hideRef.current); }, []);

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
            <AppBar position="fixed" id="topbar-wrapper" sx={{ transition: 'transform 240ms ease-in-out', transform: topbarVisible ? 'translateY(0)' : 'translateY(-100%)', backgroundColor: accentColor }}>
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

                                    topbarLocked={topbarLocked}
                                    onTopBarToggle= {(v) => {
                                        setTopbarLocked(v);
                                        if(v) {
                                            setTopbarVisible(true);
                                            if (hideRef.current) {window.clearTimeout(hideRef.current); hideRef.current=null; }
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
}
