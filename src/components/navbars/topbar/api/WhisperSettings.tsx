// src/components/navbars/topbar/api/WhisperSettings.tsx
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Menu,
  List,
  ListItem,
  IconButton,
  SettingsIcon,
  Button,
} from '../../../../muiImports';

import { selectSelectedModel } from
  '../../../../react-redux&middleware/redux/reducers/modelSelectionReducers';

type ModelKey = 'tiny-en-q5_1' | 'tiny-q5_1' | 'tiny';

export default function WhisperSettings() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isShown = Boolean(anchorEl);

  const dispatch = useDispatch();
  const selected = useSelector(selectSelectedModel);

  const selectedKey: ModelKey = React.useMemo(() => {
    const allowed = new Set(['tiny-en-q5_1', 'tiny-q5_1']);
    if (typeof selected === 'string') {
      if (selected === 'tiny') return 'tiny-en-q5_1';
      return allowed.has(selected) ? (selected as ModelKey) : 'tiny-en-q5_1';
    }
    if (selected && typeof selected === 'object') {
      const k = (selected as any).model_key || (selected as any).key;
      if (k === 'tiny') return 'tiny-en-q5_1';
      return allowed.has(k) ? (k as ModelKey) : 'tiny-en-q5_1';
    }
    return 'tiny-en-q5_1';
  }, [selected]);

  const showPopup = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const closePopup = () => setAnchorEl(null);

  const pick = (which: ModelKey) => {
    sessionStorage.setItem('isDownloadTiny', 'true');
    sessionStorage.setItem('isDownloadBase', 'false');
    dispatch({ type: 'SET_SELECTED_MODEL', payload: which as any });
    closePopup();
  };

  return (
    <>
      <IconButton onClick={showPopup} aria-label="Whisper model settings">
        <SettingsIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={isShown}
        onClose={closePopup}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <Box sx={{ p: 1, width: 260 }}>
          <List dense>
            <ListItem>
              <Button
                onClick={() => pick('tiny-en-q5_1')}
                variant={selectedKey === 'tiny-en-q5_1' ? 'contained' : 'outlined'}
                color={selectedKey === 'tiny-en-q5_1' ? 'primary' : 'inherit'}
                fullWidth
              >
                tiny (EN, q5_1) ~31 MB
              </Button>
            </ListItem>
            <ListItem>
              <Button
                onClick={() => pick('tiny-q5_1')}
                variant={selectedKey === 'tiny-q5_1' ? 'contained' : 'outlined'}
                color={selectedKey === 'tiny-q5_1' ? 'primary' : 'inherit'}
                fullWidth
              >
                tiny (Multi, q5_1) ~31 MB
              </Button>
            </ListItem>
          </List>
        </Box>
      </Menu>
    </>
  );
}
