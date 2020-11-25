import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';


const useStyles = makeStyles({
  root: {
    width: 300,
    marginLeft: 5,
  },
});

function valuetext(value) {
  return `${value}`;
}
export default function PlusMinus(props) {
  const classes = useStyles();
  // useDispatch returns the state modifying function, invoked below.
  const textS = props.text;
  const setTextS = props.setText;

  return (
    <div className={classes.root}>
      <Typography id="discrete-slider" gutterBottom>
        TEXTSIZE
      </Typography>
      <Slider
        defaultValue={textS}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        onChange={(e, val) => { setTextS(val) }}
        step={1}
        marks
        min={4}
        max={10}
        color='inherit'
      />
    </div>
  )
  /* // <div className={styles.itemwrapper}>
  //   <div className={styles.wordwrapper}>
  //     {textS}
  //   </div>
  //   {/* <div className={styles.buttonwrapper}>
  //     <ToggleButton color="inherit" variant="outlined" size="small"
  //       onClick={add}>-</ToggleButton>
  //     <ToggleButton color="inherit" variant="outlined" size="small"
  //       onClick={() => dispatch(props.increment())}>+</ToggleButton>
  //   </div> */
}
