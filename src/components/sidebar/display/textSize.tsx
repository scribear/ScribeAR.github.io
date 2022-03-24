import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import { RootState, DisplayStatus } from '../../../redux/types';
import { useDispatch, useSelector } from 'react-redux';
const useStyles = makeStyles({
  slider: {
    width: '16vw',
    marginLeft: '2vw',
  },
  textBox: {
    width: '2.5vw',
    marginLeft: '1vw'
  }
});
function valuetext(value) {
  return `${value}`;
}
export default function PlusMinus(props) {
  const dispatch = useDispatch()
  const textS = useSelector((state: RootState) => {
    return state.DisplayReducer as DisplayStatus;
  });
  
  const handleInputChangeInput = (event) => {
    let copyStatus = Object.assign({}, textS);
    copyStatus.textSize = Number(event.target.value)
    if (event.nativeEvent.inputType) {
      
    } else {
      dispatch({ type: 'SET_TEXT', payload: copyStatus })
    }
  }
  const handleInputChangeSlider = (event) => {
    let copyStatus = Object.assign({}, textS);
    copyStatus.textSize = event
    dispatch({ type: 'SET_TEXT', payload: copyStatus })
  }
  const styles = useStyles()
  const handleBlur = () => {
    let copyStatus = Object.assign({}, textS);
    if (textS.textSize < 1) {
      copyStatus.textSize = 1
    } else if (textS.textSize > 15) {
      copyStatus.textSize = 1
    }
    dispatch({ type: 'SET_TEXT', payload: copyStatus })
  };
  return (
    <div className={styles.slider}>
        <Typography gutterBottom>
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Slider
              style={{ color: textS.secondaryColor }}
              getAriaValueText={valuetext}
              aria-labelledby="discrete-slider"
              valueLabelDisplay="auto"
              value={textS.textSize}
              onChange={(e, val) => { handleInputChangeSlider(val) }}
              step={1}
              marks
              min={1}
              max={15}
            />
          </Grid>
          <div className={styles.textBox}>
            <Grid item>
              <Input
                value={textS.textSize}
                margin="dense"
                onChange={(e) => {handleInputChangeInput(e) }}
                onBlur={handleBlur}
                inputProps={{
                  step: 1,
                  min: 1,
                  max: 15,
                  type: 'number',                 
                }}
              />
            </Grid>
          </div>
        </Grid>
    </div>
  )
}