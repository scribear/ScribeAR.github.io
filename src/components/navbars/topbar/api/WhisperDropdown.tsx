// src/components/navbars/topbar/api/WhisperDropdown.tsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  SettingsIcon,
} from '../../../../muiImports';

import { selectSelectedModel } from
  '../../../../react-redux&middleware/redux/reducers/modelSelectionReducers';

type Props = { onPicked?: () => void };

// Only keep tiny models (keep legacy 'tiny' for backward-compat)
type ModelKey = 'tiny-en-q5_1' | 'tiny-q5_1' | 'tiny';

export default function WhisperDropdown({ onPicked }: Props) {
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isShown = Boolean(anchorEl);

  const selected = useSelector(selectSelectedModel);
  const selectedKey: ModelKey = React.useMemo(() => {
    const allowed = new Set(['tiny-en-q5_1', 'tiny-q5_1']);
    if (typeof selected === 'string') {
      if (selected === 'tiny') return 'tiny-en-q5_1';
      return (allowed.has(selected) ? selected : 'tiny-en-q5_1') as ModelKey;
    }
    if (selected && typeof selected === 'object') {
      const k = (selected as any).model_key || (selected as any).key;
      if (k === 'tiny') return 'tiny-en-q5_1';
      return (allowed.has(k) ? k : 'tiny-en-q5_1') as ModelKey;
    }
    return 'tiny-en-q5_1';
  }, [selected]);

  const showPopup = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const pick = (which: ModelKey) => {
    // Maintain legacy session flags for any old code paths
    sessionStorage.setItem('isDownloadTiny', 'true');
    sessionStorage.setItem('isDownloadBase', 'false');

    dispatch({ type: 'SET_SELECTED_MODEL', payload: which as any });
    onPicked?.();
    handleClose();
  };

  return (
    <>
      <Tooltip title="Model" placement="bottom">
        <IconButton onClick={showPopup}>
          <SettingsIcon />
        </IconButton>
      </Tooltip>

      <Menu
        keepMounted
        open={isShown}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <MenuItem
          selected={selectedKey === 'tiny-en-q5_1'}
          onClick={() => pick('tiny-en-q5_1')}
        >
          TINY (EN, q5_1) ~31 MB
        </MenuItem>
        <MenuItem
          selected={selectedKey === 'tiny-q5_1'}
          onClick={() => pick('tiny-q5_1')}
        >
          TINY (Multi, q5_1) ~31 MB
        </MenuItem>
      </Menu>
    </>
  );
}
