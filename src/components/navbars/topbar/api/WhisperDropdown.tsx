import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectSelectedModel } from
  '../../../../react-redux&middleware/redux/reducers/modelSelectionReducers';

import { IconButton, Tooltip, Popover, Stack, Chip, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

type Props = { onPicked?: () => void };
type ModelKey = 'tiny' | 'base';

export default function WhisperDropdown({ onPicked }: Props) {
  const dispatch = useDispatch();
  const selected = useSelector(selectSelectedModel);

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? 'whisper-model-popover' : undefined;

  // Normalize current selection -> 'tiny' | 'base' | undefined
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

  const pick = (which: ModelKey) => {
    // Keep the legacy flags that your loader watches
    sessionStorage.setItem('isDownloadTiny', String(which === 'tiny'));
    sessionStorage.setItem('isDownloadBase', String(which === 'base'));

    // Update redux (adjust action type if your project uses a different one)
    dispatch({ type: 'SET_SELECTED_MODEL', payload: which } as any);

    setAnchorEl(null);
    onPicked?.();
  };

  return (
    <>
      {/* Right-side gear, aligned like the other rows */}
      <Tooltip title="Whisper settings">
        <IconButton
          aria-describedby={id}
          edge="end"
          sx={{ color: 'action.active', ml: 'auto' }}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>

      {/* Small chooser window */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ sx: { p: 1.5 } }}
      >
        <Typography variant="subtitle2" sx={{ px: 1, pb: 1 }}>
          Whisper model
        </Typography>
        <Stack direction="row" spacing={1}>
          <Chip
            label="TINY (75 MB)"
            clickable
            onClick={() => pick('tiny')}
            variant={selectedKey === 'tiny' ? 'filled' : 'outlined'}
            color={selectedKey === 'tiny' ? 'primary' : 'default'}
            size="small"
          />
          <Chip
            label="BASE (145 MB)"
            clickable
            onClick={() => pick('base')}
            variant={selectedKey === 'base' ? 'filled' : 'outlined'}
            color={selectedKey === 'base' ? 'primary' : 'default'}
            size="small"
          />
        </Stack>
      </Popover>
    </>
  );
}
