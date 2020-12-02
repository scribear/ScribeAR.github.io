import React from 'react'
import ToggleButton from '../ToggleButton'
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { useSelector, useDispatch } from "react-redux"
import {
  increase_box,
  decrease_box,
} from '../../redux/actions'
import full_pic from '../../image/pic/fulltext.png'
import half_pic from '../../image/pic/55.png'
import sub_pic from '../../image/pic/subtitle.png'
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    transform: 'scale(2.0)',
  },
  icon: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: 'black',
    transform: 'scale(4.0)',
  },
}));


const AROption = (props) => {
  const dispatch = useDispatch()
  const { text, setText } = props;
  const boxMode = useSelector((state) => state.botsize)
  const classes = useStyles();

  const add = () => {
    const temp = text + 1
    setText(temp);
  }

  const minus = () => {
    const temp = text - 1
    if (temp > 0) {
      setText(temp);
    } else {
      setText(1);
    }
  }

  const renderOption = () => {
    if (boxMode == 0) {
      return (
        <img src={full_pic} alt='preview' height='15vh' width='15vw'>
        </img>
      )
    } else if (boxMode == 1) {
      return (
        <img src={half_pic} alt='preview' height='15vh' width='15vw'>
        </img>
      )
    } else {
      return (
        <img src={sub_pic} alt='preview' height='15vh' width='15vw'>
        </img>
      )
    }

  }
  const Text = (p) => (
    <div className={classes.icon}>
      <ToggleButton type='Icon' onClick={minus}>
        <RemoveIcon />
      </ToggleButton>
      <span style={{ fontSize: text }}>{text}</span>
      <ToggleButton type='Icon' onClick={add}>
        <AddIcon />
      </ToggleButton>
    </div>
  )

  const Mode = () => (
    <div className={classes.icon}>
      <ToggleButton type='Icon' onClick={() => dispatch(decrease_box())}>
        <ArrowBackIosIcon />
      </ToggleButton>
      {renderOption()}
      <ToggleButton type='Icon' onClick={() => dispatch(increase_box())}>
        <ArrowForwardIosIcon />
      </ToggleButton>
    </div>
  )
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Text />
        </Grid>
        <Grid item xs={12}>
          <div className={classes.paper}>
            Text Size
          </div>
        </Grid>
        <Grid item xs={12}>
          <Mode />
        </Grid>
        <Grid item xs={12}>
          <div className={classes.paper}>
            Area Size
          </div>
        </Grid>
      </Grid>
    </div>
  )
}


export default AROption