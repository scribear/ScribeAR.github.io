import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import {Button} from '@material-ui/core';
import {useSelector,useDispatch} from 'react-redux';
import {IconButton} from "@material-ui/core"
import full_pic from './pic/fulltext.png'
import half_pic from './pic/55.png'
import sub_pic from './pic/subtitle.png'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import './index.css'
import {
        bot_1,
        bot_2,
        bot_3} from '../../../../redux/actions'

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

export default function BoxSpring() {
  const bot_size = useSelector((state) => state.botsize)
  const dispatch = useDispatch()

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  if (bot_size === 0){
      return (
          <div>
            <Button color = 'inherit' variant = 'text' onClick={handleOpen}>
              Caption Size
            </Button>

            <div className = 'abv_pic'>
              <IconButton onClick = {handleOpen}>
                <img id="transition-modal-description" src = {full_pic} alt = 'full' height = '30vh' width = '30vw'>
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
                  <h2 id="transition-modal-title">Caption Size</h2>
                  <div className = 'wrper'>
                      <IconButton disableRipple = {true} onClick = {()=>dispatch(bot_1())}>
                          <img id="transition-modal-description" src = {full_pic} alt = 'full' height = '120vh' width = '200vw'>
                          </img>
                      </IconButton>
                      <IconButton color = 'inherit' onClick = {()=>dispatch(bot_1())}>
                          <CheckCircleIcon />
                      </IconButton>
                  </div> 
                  <div className = 'wrper'>
                      <IconButton disableRipple = {true} onClick = {()=>dispatch(bot_2())}>
                          <img id="transition-modal-description" src = {half_pic} alt = 'half' height = '120vh' width = '200vw'>
                          </img>
                      </IconButton>
                      <IconButton color = 'inherit' onClick = {()=>dispatch(bot_2())}>
                          <CheckCircleOutlineIcon />
                      </IconButton>
                  </div>
                  <div className = 'wrper'>
                      <IconButton disableRipple = {true} onClick = {()=>dispatch(bot_3())}>
                          <img id="transition-modal-description" src = {sub_pic} alt = 'sub' height = '120vh' width = '200vw'>
                          </img>
                      </IconButton>
                      <IconButton color = 'inherit' onClick = {()=>dispatch(bot_3())}>
                          <CheckCircleOutlineIcon />
                      </IconButton>
                  </div>      
                </div>
              </Fade>
            </Modal>
          </div>
        );
  }else if (bot_size === 1){
    return(
      <div>
      <Button color = 'inherit' variant = 'text' onClick={handleOpen}>
        Caption Size
      </Button>

      <div className = 'abv_pic'>
        <IconButton onClick = {handleOpen}>
          <img id="transition-modal-description" src = {half_pic} alt = 'half' height = '30vh' width = '30vw'>
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
            <h2 id="transition-modal-title">Caption Size</h2>
            <div className = 'wrper'>
                <IconButton disableRipple = {true} onClick = {()=>dispatch(bot_1())}>
                    <img id="transition-modal-description" src = {full_pic} alt = 'full' height = '120vh' width = '200vw'>
                    </img>
                </IconButton>
                <IconButton color = 'inherit' onClick = {()=>dispatch(bot_1())}>
                   <CheckCircleOutlineIcon />
                </IconButton>
            </div> 
            <div className = 'wrper'>
                <IconButton disableRipple = {true} onClick = {()=>dispatch(bot_2())}>
                    <img id="transition-modal-description" src = {half_pic} alt = 'half' height = '120vh' width = '200vw'>
                    </img>
                </IconButton>
                <IconButton color = 'inherit' onClick = {()=>dispatch(bot_2())}>
                   <CheckCircleIcon />
                </IconButton>
            </div>
            <div className = 'wrper'>
                <IconButton disableRipple = {true} onClick = {()=>dispatch(bot_3())}>
                    <img id="transition-modal-description" src = {sub_pic} alt = 'sub' height = '120vh' width = '200vw'>
                    </img>
                </IconButton>
                <IconButton color = 'inherit' onClick = {()=>dispatch(bot_3())}>
                    <CheckCircleOutlineIcon />
                </IconButton>
            </div>      
          </div>
        </Fade>
      </Modal>
    </div>
    );
  }else{
    return(
      <div>
      <Button color = 'inherit' variant = 'text' onClick={handleOpen}>
        Caption Size
      </Button>

      <div className = 'abv_pic'>
        <IconButton onClick = {handleOpen}>
          <img id="transition-modal-description" src = {sub_pic} alt = 'sub' height = '30vh' width = '30vw'>
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
            <h2 id="transition-modal-title">Caption Size</h2>
            <div className = 'wrper'>
                <IconButton disableRipple = {true} onClick = {()=>dispatch(bot_1())}>
                    <img id="transition-modal-description" src = {full_pic} alt = 'full' height = '120vh' width = '200vw'>
                    </img>
                </IconButton>
                <IconButton color = 'inherit' onClick = {()=>dispatch(bot_1())}>
                   <CheckCircleOutlineIcon />
                </IconButton>
            </div> 
            <div className = 'wrper'>
                <IconButton disableRipple = {true} onClick = {()=>dispatch(bot_2())}>
                    <img id="transition-modal-description" src = {half_pic} alt = 'half' height = '120vh' width = '200vw'>
                    </img>
                </IconButton>
                <IconButton color = 'inherit' onClick = {()=>dispatch(bot_2())}>
                   <CheckCircleOutlineIcon />
                </IconButton>
            </div>
            <div className = 'wrper'>
                <IconButton disableRipple = {true} onClick = {()=>dispatch(bot_3())}>
                    <img id="transition-modal-description" src = {sub_pic} alt = 'sub' height = '120vh' width = '200vw'>
                    </img>
                </IconButton>
                <IconButton color = 'inherit' onClick = {()=>dispatch(bot_3())}>
                    <CheckCircleIcon />
                </IconButton>
            </div>      
          </div>
        </Fade>
      </Modal>
    </div>
    )
  }
}
