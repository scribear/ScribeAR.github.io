import React from 'react'
import { Button, IconButton} from '@material-ui/core'

const ToggleButton = (props) => {
    const {children,type, ...rest } = props;
    
    if (type === 'Icon'){
        return (
            <>
                <IconButton {...rest}>
                    {children}
                </IconButton>
            </>
        )
    }

    return (
        <>
            <Button {...rest}>
                {children}
            </Button>
        </>
    )
};

export default ToggleButton;