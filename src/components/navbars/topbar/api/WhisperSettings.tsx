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

type ModelKey = 'tiny' | 'base';

export default function WhisperSettings() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isShown = Boolean(anchorEl);

  const dispatch = useDispatch();
  const selected = useSelector(selectSelectedModel);

  // normalize current selection to 'tiny' | 'base' | undefined
  const selectedKey: ModelKey | undefined = React.useMemo(() => {
    if (typeof selected === 'string') {
      return selected === 'tiny' || selected === 'base' ? selected : undefined;
    }
    if (selected && typeof selected === 'object' && 'key' in (selected as any)) {
      const k = (selected as any).key;
      return k === 'tiny' || k === 'base' ? k : undefined;
    }
    return undefined;
  }, [selected]);

  const showPopup = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const closePopup = () => setAnchorEl(null);

  const pick = (which: ModelKey) => {
    // keep existing flags your loader watches
    sessionStorage.setItem('isDownloadTiny', (which === 'tiny').toString());
    sessionStorage.setItem('isDownloadBase', (which === 'base').toString());

    // update redux
    dispatch({ type: 'SET_SELECTED_MODEL', payload: which as any });

    closePopup();
  };

  return (
    <>
      {/* Right-side gear, same pattern as Azure/ScribeAR Server */}
      <IconButton onClick={showPopup}>
        <SettingsIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={isShown}
        onClose={closePopup}
        PaperProps={{
          elevation: 0,
          sx: {
            position: 'unset',
            ml: '25vw',
            width: '50vw',
            mt: '25vh',
            height: '50vh',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          },
        }}
        transformOrigin={{ horizontal: 'center', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      >
        <List component="div" disablePadding>
          <ListItem sx={{ pl: 4 }} style={{ width: '100%' }}>
            <Button
              onClick={() => pick('tiny')}
              variant={selectedKey === 'tiny' ? 'contained' : 'outlined'}
              color={selectedKey === 'tiny' ? 'primary' : 'inherit'}
              style={{ width: '100%' }}
            >
              tiny (75 MB)
            </Button>
          </ListItem>

          <ListItem sx={{ pl: 4 }} style={{ width: '100%' }}>
            <Button
              onClick={() => pick('base')}
              variant={selectedKey === 'base' ? 'contained' : 'outlined'}
              color={selectedKey === 'base' ? 'primary' : 'inherit'}
              style={{ width: '100%' }}
            >
              base (145 MB)
            </Button>
          </ListItem>
        </List>
      </Menu>
    </>
  );
}
