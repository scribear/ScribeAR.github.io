import { LockIcon, LockOpenIcon, ThemeProvider, IconButton, Tooltip } from "../../../muiImports"
import * as React from 'react';
import Theme from '../../theme'

interface Props {
    locked?: boolean;
    onToggle?: (locked: boolean) => void;
}

export default function LockToggle(props: Props) {
    const {locked: lockedProp, onToggle} = props;
    const [locked, setLocked] = React.useState<boolean>(!!lockedProp);

    React.useEffect(()=>{
        if(typeof lockedProp === 'boolean') setLocked(lockedProp);
    }, [lockedProp]);

    const handleClick = () => {
        const next = !locked;
        setLocked(next);
        onToggle?.(next);
    };
     const {myTheme} = Theme()
     // color "primary" comes from Theme()
     return (
       <div>
        <ThemeProvider theme={myTheme}>
          <Tooltip title = {locked ? "Unlock (hide)" : "Lock (keep visible)"}>
            <IconButton color="primary" onClick={handleClick}>
              {locked ? <LockIcon /> : <LockOpenIcon />}
            </IconButton>
          </Tooltip>
         </ThemeProvider>

       </div>
     );
}