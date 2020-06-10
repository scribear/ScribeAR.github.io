import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import { useSelector, useDispatch } from 'react-redux'

const useStyles = makeStyles({
  root: {
    width: 220,
  },
});

function valuetext(value) {
  return `${value}`;
}

export default function DiscreteSlider(props) {
  const classes = useStyles();
  const [value, setValue] = useState(20)
  const dispatch = useDispatch()
  const setting = useSelector(props.setting)


  return (
    <div className={classes.root}>
      <Typography id="discrete-slider" gutterBottom>
        {props.item}
      </Typography>
      <Slider
        defaultValue={setting}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        onChange= {() => dispatch(props.decrement())}
        step={1}
        marks
        min={1}
        max={10}
      />
    </div>
  );
}
