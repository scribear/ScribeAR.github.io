// src/components/navbars/sidebar/model/menu.tsx

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Autocomplete,
  TextField,
  Tooltip,
  ListItem,
} from '../../../../muiImports';

import type { RootState } from '../../../../store';
import type { SelectedOption } from '../../../../react-redux&middleware/redux/types/modelSelection';
import {
  selectModelOptions,
  selectSelectedModel,
  setSelectedModel,
} from '../../../../react-redux&middleware/redux/reducers/modelSelectionReducers';

export default function ModelMenu(_props: any) {
  const dispatch = useDispatch();

  const modelOptions = useSelector((state: RootState) =>
    selectModelOptions(state),
  );
  const selected = useSelector((state: RootState) =>
    selectSelectedModel(state),
  );

  return (
    <Autocomplete<SelectedOption>
      sx={{ width: 300 }}
      disablePortal
      options={modelOptions}
      value={selected}
      onChange={(_, val) => {
        if (val) {
          dispatch(setSelectedModel(val));
        }
      }}
      getOptionLabel={(v: SelectedOption | null) =>
        v ? v.display_name : ''
      }
      isOptionEqualToValue={(
        a: SelectedOption | null,
        b: SelectedOption | null,
      ) => !!a && !!b && a.model_key === b.model_key}
      renderInput={(params) => <TextField {...params} />}
      renderOption={(props, option) => {
        const opt = option as SelectedOption | null;
        if (!opt) return null;
        return (
          <Tooltip
            key={props.key}
            title={opt.description}
            placement="right"
          >
            <ListItem {...props}>{opt.display_name}</ListItem>
          </Tooltip>
        );
      }}
    />
  );
}
