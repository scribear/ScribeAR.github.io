// src/components/icons/WhisperIcon.tsx
import * as React from 'react';
import { useMediaQuery, useTheme } from '@mui/material';


import GraphicEqIcon from '@mui/icons-material/GraphicEq';
// import ClosedCaptionIcon from '@mui/icons-material/ClosedCaption';
// import SettingsVoiceIcon from '@mui/icons-material/SettingsVoice';

export default function WhisperIcon() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const fontSize: 'small' | 'medium' = isMobile ? 'small' : 'medium';

  return <GraphicEqIcon fontSize={fontSize} />;
}
