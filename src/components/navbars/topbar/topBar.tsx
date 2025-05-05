import * as React from 'react';
import { Grid, Box } from '../../../muiImports';

import ApiDropdown from './apiDropdown';
import Fullscreen from './fullScreen';
import Listening from './listening';
import QRCodeScreen from './qrCodeScreen';
import MenuHider from './menuHider';
import TranscriptDownload from './transcriptDownload';

import {
    useMediaQuery,
    useTheme
  } from '@mui/material';


  export default function TopBar(props) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const iconSize = isMobile ? "small" : "medium";

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',  // Even spacing across the row
            flexWrap: 'nowrap',               // Prevent wrapping
            overflow: 'hidden',               // Hide overflowing items
            minWidth: 0,                      // Prevent layout shifts                   
            px: 2,                            // Padding on left and right
            width: '100%',                    // Ensure full row usage
        }}>
            {/* Always display API dropdown */}
            <ApiDropdown theme={props.theme} apiDisplayName={props.apiDisplayName} />

            {/* Only display if there is enough space */}
            {<Listening listening={props.listening} iconSize={iconSize} />}
            {/* {!isMobile && <MenuHider menuVisible={props.menuVisible} iconSize={iconSize} />} */}
            {<TranscriptDownload />}
            { <Fullscreen iconSize={iconSize} />}
            {/* {!isMobile && <QRCodeScreen />} */}
        </Box>
    );
}