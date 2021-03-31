import React from 'react'
import Fade from '@material-ui/core/Fade';
import { Avatar, Button, Tooltip } from "@material-ui/core"
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const Azure = (props) => {
  const { dropDown, handleDropClose, handleDrop } = props;
  return (
    <>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        variant="contained"
        variant="text"
        color="inherit"
        onClick={handleDrop}
        startIcon={<Avatar
          src={'https://dz2cdn1.dzone.com/storage/temp/12165862-azurelogo-1.png'}
          variant='square'
        />} />
      <Menu
        id="simple-menu"
        anchorEl={dropDown}
        keepMounted
        open={Boolean(dropDown)}
        onClose={handleDropClose}
      >
        <Tooltip TransitionComponent={Fade} title="Item1" arrow>
          <MenuItem>
            <Button> Item 1</Button>
          </MenuItem>
        </Tooltip>
      </Menu>
    </>
  )
};

export default Azure;