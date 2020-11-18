import React from 'react'
import { Button, IconButton} from '@material-ui/core'
import styles from './ToggleButton.module.css'

const ToggleButton = (props) => {
    const {children,type, ...rest } = props;
    
    if (type === 'Icon'){
        return (
            <>
                <IconButton className={styles.icon} {...rest}>
                    {children}
                </IconButton>
            </>
        )
    }

    return (
        <>
            <Button className={styles.button} {...rest}>
                {children}
            </Button>
        </>
    )
};

export default ToggleButton;