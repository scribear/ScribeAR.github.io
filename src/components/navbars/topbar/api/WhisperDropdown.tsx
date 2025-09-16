import React from 'react';
import { List, ListItem, Button } from '../../../../muiImports';
import { useDispatch, useSelector } from 'react-redux';
import { selectSelectedModel } from
  '../../../../react-redux&middleware/redux/reducers/modelSelectionReducers';

type Props = { onPicked?: () => void };

export default function WhisperDropdown({ onPicked }: Props) {
  const dispatch = useDispatch();
  const selected = useSelector(selectSelectedModel); // could be a string or an object

  // Normalize to a simple key we can compare
  const selectedKey: 'tiny' | 'base' | undefined = (() => {
    if (typeof selected === 'string') {
      return (selected === 'tiny' || selected === 'base') ? selected : undefined;
    }
    if (selected && typeof selected === 'object' && 'key' in (selected as any)) {
      const k = (selected as any).key;
      return (k === 'tiny' || k === 'base') ? k : undefined;
    }
    return undefined;
  })();

  const pick = (which: 'tiny' | 'base') => {
    // Keep your existing sessionStorage flags if your loader watches them
    sessionStorage.setItem('isDownloadTiny', (which === 'tiny').toString());
    sessionStorage.setItem('isDownloadBase', (which === 'base').toString());

    // Dispatch your model selection change
    // If you have an action creator (e.g., setSelectedModel), use that instead.
    dispatch({ type: 'SET_SELECTED_MODEL', payload: which as any });

    onPicked?.();
  };

  return (
    <div>
      <List component="div" disablePadding>
        <ListItem sx={{ pl: 4 }} style={{ width: '100%' }}>
          <Button
            onClick={() => pick('tiny')}
            variant={selectedKey === 'tiny' ? 'contained' : 'outlined'}
            color={selectedKey === 'tiny' ? 'primary' : 'inherit'}
            style={{ width: '100%' }}
          >
            TINY (75 MB)
          </Button>
        </ListItem>
        <ListItem sx={{ pl: 4 }} style={{ width: '100%' }}>
          <Button
            onClick={() => pick('base')}
            variant={selectedKey === 'base' ? 'contained' : 'outlined'}
            color={selectedKey === 'base' ? 'primary' : 'inherit'}
            style={{ width: '100%' }}
          >
            BASE (145 MB)
          </Button>
        </ListItem>
      </List>
    </div>
  );
}
