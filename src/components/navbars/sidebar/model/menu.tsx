import React from 'react';

import { List, ListItemText, Collapse, ListItem, MemoryIcon, Autocomplete, TextField, Tooltip } from '../../../../muiImports';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store';
import { API, type ApiStatus } from '../../../../react-redux&middleware/redux/typesImports';
import { useDispatch } from 'react-redux';
import { selectModelOptions, selectSelectedModel, setSelectedModel } from '../../../../react-redux&middleware/redux/reducers/modelSelectionReducers';

export default function ModelMenu(props) {
  const dispatch = useDispatch();
  const APIStatus = useSelector((state: RootState) => {
    return state.APIStatusReducer as ApiStatus;
  });
  const modelOptions = useSelector(selectModelOptions);
  const selected = useSelector(selectSelectedModel);
  const modelSelectEnable = APIStatus.currentApi !== API.SCRIBEAR_SERVER;

  return (
    <div>
      {props.listItemHeader("Model", "model", MemoryIcon)}

      <Collapse in={props.open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem sx={{ pl: 4 }}>
            <ListItemText primary="Select Model" />
          </ListItem>

          <ListItem sx={{ pl: 4 }}>
            <Autocomplete
              disabled={modelSelectEnable}
              sx={{ width: 300 }}
              disablePortal
              options={modelOptions}
              onChange={(_, val) => {
                dispatch(setSelectedModel(val))
              }}
              defaultValue={selected}
              getOptionLabel={(v) => v.display_name}
              isOptionEqualToValue={(a, b) => a.model_key === b.model_key}
              renderInput={(params) => <TextField {...params} />}
              renderOption={(props, option) => {
                return <Tooltip key={props.key} title={option.description} placement='right'>
                  <ListItem {...props}>
                    {option.display_name}
                  </ListItem>
                </Tooltip>
              }}
            />
          </ListItem>

        </List>
      </Collapse>
    </div>
  );
}