import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Pull UI pieces from the same aggregator used elsewhere
import {
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  SettingsIcon,   // this should be re-exported by your muiImports like other icons
} from '../../../../muiImports';

import { selectSelectedModel } from
  '../../../../react-redux&middleware/redux/reducers/modelSelectionReducers';

type Props = { onPicked?: () => void };

type ModelKey = 'tiny' | 'base';

// Helper to normalize current selection into 'tiny' | 'base' | undefined
function normalizeSelected(selected: unknown): ModelKey | undefined {
  if (typeof selected === 'string') {
    return selected === 'tiny' || selected === 'base' ? selected : undefined;
  }
  if (selected && typeof selected === 'object' && 'key' in (selected as any)) {
    const k = (selected as any).key;
    return k === 'tiny' || k === 'base' ? k : undefined;
  }
  return undefined;
}

export default function WhisperDropdown({ onPicked }: Props) {
  const dispatch = useDispatch();
  const selected = useSelector(selectSelectedModel);
  const selectedKey = normalizeSelected(selected);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const pick = (which: ModelKey) => {
    // Keep the existing flags your loader is watching
    sessionStorage.setItem('isDownloadTiny', String(which === 'tiny'));
    sessionStorage.setItem('isDownloadBase', String(which === 'base'));

    // Update Redux – if you have a real action creator, use it here
    dispatch({ type: 'SET_SELECTED_MODEL', payload: which as any });

    handleClose();
    onPicked?.();
  };

  return (
    <>
      {/* Right-aligned gear like other providers */}
      <Tooltip title="Whisper settings">
        <IconButton onClick={handleOpen} size="large">
          <SettingsIcon />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <MenuItem selected={selectedKey === 'tiny'} onClick={() => pick('tiny')}>
          TINY (75 MB)
        </MenuItem>
        <MenuItem selected={selectedKey === 'base'} onClick={() => pick('base')}>
          BASE (145 MB)
        </MenuItem>
      </Menu>
    </>
  );
}
