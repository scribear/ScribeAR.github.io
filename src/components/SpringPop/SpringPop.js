import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { IconButton } from "@material-ui/core"
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import styles from './SpringPop.module.css'




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

export default function TransitionsModal(props) {
  const { type, state, children, functionMap, imageMap, title, disable = false } = props
  const dispatch = useDispatch()

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  if (type === 'display') {
    return (
      <>
        <Button disabled={disable} color='inherit' variant='outlined' onClick={handleOpen}>
          {title}
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
              <h2 id="transition-modal-title">{title}</h2>
              <p id="transition-modal-description">
                {children}
              </p>
            </div>
          </Fade>
        </Modal>
      </>
    )
  }
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.buttonwrapper}>
          <Button disabled={disable} color='inherit' variant='text' onClick={handleOpen}>
            {children}
          </Button>
        </div>
        <div className={styles.preview}>
          <IconButton onClick={handleOpen}>
            <img id="transition-modal-description" src={imageMap[state]} alt='preview' height='30vh' width='30vw'>
            </img>
          </IconButton>
        </div>
      </div>
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
            <h2 id="transition-modal-title">Theme</h2>
            {functionMap.map((func, idx) => (
              <>
                <IconButton onClick={() => dispatch(func())}>
                  <img id="transition-modal-description" src={imageMap[idx]} alt='view' height='120vh' width='200vw'>
                  </img>
                </IconButton>
                <IconButton color='inherit' onClick={() => dispatch(func())}>
                  {state === (idx) ? <CheckCircleIcon /> : <CheckCircleOutlineIcon />}
                </IconButton>
              </>
            ))}
          </div>
        </Fade>
      </Modal>
    </>
  );

}
