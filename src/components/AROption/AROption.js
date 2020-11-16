import React from 'react'
import ToggleButton from '../ToggleButton'
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import {useSelector, useDispatch} from "react-redux"
import {
    increment_textSize,
    decrement_textSize,
} from '../../redux/actions'

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
    transform:'scale(2.0)',
  },
  icon: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: 'black',
    transform:'scale(4.0)',
  },
}));


const AROption = () => {
    const dispatch = useDispatch()
    const textSize = useSelector((state) => state.textSize)
    const classes = useStyles();

    const Text = (p) => (
        <div className={classes.icon}>
            <ToggleButton type='Icon' onClick={() => dispatch(increment_textSize())}>
                <AddIcon />
            </ToggleButton>
            {textSize}
            <ToggleButton type='Icon' onClick={() => dispatch(decrement_textSize())}>
                <RemoveIcon />
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
              </Grid>
        </div>
    )
}


export default AROption