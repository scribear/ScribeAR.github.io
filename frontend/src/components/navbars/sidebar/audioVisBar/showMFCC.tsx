import React, { } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Theme from '../../../theme';
import { RootState } from '../../../../store';
import { ThemeProvider, Switch } from '../../../../muiImports';
import { ControlStatus } from '../../../../react-redux&middleware/redux/typesImports';


export default function ShowMFCC() {
  const dispatch = useDispatch()
  let controlStatus = useSelector((state: RootState) => {
    return state.ControlReducer as ControlStatus;
  });

  const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
    dispatch({type: 'FLIP_SHOWMFCC'});
    // if (controlStatus.showFrequency) {dispatch({type: 'FLIP_SHOWFREQ'})};
  }
  const {myTheme} = Theme()

  return (
    <div>
      <ThemeProvider theme={myTheme}>
        {controlStatus.showMFCC === true ? <Switch onClick={toggleDrawer} checked={true} /> : <Switch onClick={toggleDrawer} checked={false} />}
      </ThemeProvider>

    </div>
  );
}
