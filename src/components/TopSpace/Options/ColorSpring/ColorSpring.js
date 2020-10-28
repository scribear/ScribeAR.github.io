import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import {Button} from '@material-ui/core';
import black_pic from './black.png';
import white_pic from './white.png';
import {useSelector,useDispatch} from 'react-redux';
import {IconButton} from "@material-ui/core"
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import './ColorSpring.css'
import {
        pick_black,
        pick_white} from '../../../../redux/actions'

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
  const invertColors = useSelector((state) => state.invertColors)
  const dispatch = useDispatch()

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  if (invertColors == 0){
    return (
        <div>
          <Button color = 'inherit' variant = 'text' onClick={handleOpen}>
            Choose Theme
          </Button>

          <div className = 'abv_pic'>
            <IconButton onClick = {handleOpen}>
                <img id="transition-modal-description" src = {black_pic} alt = 'black' height = '30vh' width = '30vw'>
                </img>
            </IconButton>

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
                <div className = 'wrper'>
                    <IconButton disableRipple = {true} onClick = {()=>dispatch(pick_black())}>
                        <img id="transition-modal-description" src = {black_pic} alt = 'black' height = '120vh' width = '200vw'>
                        </img>
                    </IconButton>
                    <IconButton color = 'inherit' onClick = {()=>dispatch(pick_black())}>
                        <CheckCircleIcon />
                    </IconButton>
                </div>
                <div className = 'wrper'>
                    <IconButton disableRipple = {true} onClick = {()=>dispatch(pick_white())}>
                        <img id="transition-modal-description" src = {white_pic} alt = 'white' height = '120vh' width = '200vw'>
                        </img>
                    </IconButton>
                    <IconButton color = 'inherit' onClick = {()=>dispatch(pick_white())}>
                        <CheckCircleOutlineIcon />
                    </IconButton>
                </div>
              </div>
            </Fade>
          </Modal>
        </div>
      );
  }else{
    return (
        <div>
          <Button color = 'inherit' variant = 'text' onClick={handleOpen}>
            Choose Theme
          </Button>

            <div className = 'abv_pic'>
                <IconButton onClick = {handleOpen}>
                    <img id="transition-modal-description" src = {white_pic} alt = 'white' height = '30vh' width = '30vw'>
                    </img>
                </IconButton>
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
                <div className = 'wrper'>
                    <IconButton disableRipple = {true} onClick = {()=>dispatch(pick_black())}>
                        <img id="transition-modal-description" src = {black_pic} alt = 'black' height = '120vh' width = '200vw'>
                        </img>
                    </IconButton>
                    <IconButton color = 'inherit' onClick = {()=>dispatch(pick_black())}>
                        <CheckCircleOutlineIcon />
                    </IconButton>
                </div>
                <div className = 'wrper'>
                    <IconButton disableRipple = {true} onClick = {()=>dispatch(pick_white())}>
                        <img id="transition-modal-description" src = {white_pic} alt = 'white' height = '120vh' width = '200vw'>
                        </img>
                    </IconButton>
                    <IconButton color = 'inherit' onClick = {()=>dispatch(pick_white())}>
                        <CheckCircleIcon />
                    </IconButton>
                </div>
              </div>
            </Fade>
          </Modal>
        </div>
      );
  }

}
