import React from 'react'
import Fade from '@material-ui/core/Fade';
import { Button, Tooltip } from "@material-ui/core"
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Recognition from "../../Captions/Recognition"
import ShareIcon from '@material-ui/icons/Share';
import { EmailShareButton } from 'react-share';
import SaveIcon from '@material-ui/icons/SaveSharp';
import MailIcon from '@material-ui/icons/Mail';


const Share = (props) => {
  const { anchorEl, handleClose, handleClick } = props;
  return (
    <>
      <Button aria-controls="simple-menu" aria-haspopup="true" variant="contained" variant="text" color="inherit" onClick={handleClick} startIcon={<ShareIcon />}>Share</Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <Tooltip TransitionComponent={Fade} title="Share through emails" arrow>
          <MenuItem onClick={handleClose}>
            <EmailShareButton subject="Transcript History">
              <Button startIcon={<MailIcon />}> EMAIL</Button>
            </EmailShareButton>
          </MenuItem>
        </Tooltip>
        <Tooltip TransitionComponent={Fade} title="Download the transcript as a .txt file" arrow>
          <MenuItem onClick={handleClose}>
            <Button
              variant="contained"
              variant="text"
              onClick={new Recognition().downloadTxtFile} startIcon={<SaveIcon fontSize='large' />}>
              Download
            </Button>
          </MenuItem>
        </Tooltip>
      </Menu>
    </>
  )
}

export default Share;