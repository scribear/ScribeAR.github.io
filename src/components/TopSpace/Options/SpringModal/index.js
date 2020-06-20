import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import {Button} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: 'none'
  },
}));

export default function TransitionsModal() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button color = 'inherit' variant = 'outlined' onClick={handleOpen}>
        Instructions
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Tutorial</h2>
            <p id="transition-modal-description">
                    -The text size button can be used to change size of 
                    text shown in caption space.<br />
                    -There are 3 different graph can be toggled to help
                    reflex the surrounding voices by clicking forth button<br />
                    -For circular graph, try to drag it around.<br />
                    -To stop captioning just click switch button for Recording. Also 
                    click again to resume captioning.<br />
                    -To memorize textsize option, click save after choosing a proper size of the text.
            </p>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
