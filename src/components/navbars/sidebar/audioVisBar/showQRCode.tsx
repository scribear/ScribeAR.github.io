import React from 'react';
import { RootState } from '../../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { ControlStatus } from '../../../../react-redux&middleware/redux/typesImports';
import Theme from '../../../theme';
import { ThemeProvider, Switch } from '../../../../muiImports';

import { useAccessToken } from '../../../api/useAccessToken';

export default function ShowQRCode() {
    const dispatch = useDispatch();
    const controlStatus = useSelector((state: RootState) => {
        return state.ControlReducer as ControlStatus;
    });

    const { myTheme } = Theme();

    const urlParams = new URLSearchParams(window.location.search);
    const isKioskMode = urlParams.get('mode') === 'kiosk';
    const serverAddress = urlParams.get('serverAddress');

    const {
        accessToken,
        nodeServerAddress,
        successful,
        loading,
    } = useAccessToken(serverAddress, isKioskMode);

    const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
        dispatch({ type: 'FLIP_SHOWQRCODE' });
    };

    return (
        <div>
            <ThemeProvider theme={myTheme}>
                <Switch 
                  onClick={toggleDrawer}
                  checked={controlStatus.showQRCode} // <--- bind directly
                />
            </ThemeProvider>
        </div>
    );
}