import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider, { SliderThumb } from '@mui/material/Slider';
import Grid from '@material-ui/core/Grid';
import { styled } from '@mui/material/styles';

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

  interface AirbnbThumbComponentProps extends React.HTMLAttributes<unknown> {}

function AirbnbThumbComponent(props: AirbnbThumbComponentProps) {
  const { children, ...other } = props;
  return (
    <SliderThumb {...other}>
      {children}      
      {textS.textSize}
    </SliderThumb>
  );
}

const TextSizeSlider = styled(Slider)(({ theme }) => ({
  color: '#3a8589',
  height: 3,
  padding: '13px 0',
  '& .MuiSlider-thumb': {
    transition: '.2s',
    height: 27,
    width: 27,
    backgroundColor: '#fff',
    border: '1px solid currentColor',
    '&:hover': {
      transition: '.2s',
      boxShadow: '0 0 0 8px rgba(58, 133, 137, 0.16)',
      height: 18,
      width: 18,
      backgroundColor: 'currentColor',
    },
    '& .airbnb-bar': {
      height: 9,
      width: 1,
      backgroundColor: 'currentColor',
      marginLeft: 1,
      marginRight: 1,
    },
  },
  '& .MuiSlider-track': {
    height: 3,
  },
  '& .MuiSlider-rail': {
    color: theme.palette.mode === 'dark' ? '#bfbfbf' : '#d8d8d8',
    opacity: theme.palette.mode === 'dark' ? undefined : 1,
    height: 3,
  },
}));
const marks = [
  {
    value: 1,
    label: "1",
  },
  {
    value: 5,
    label: "5",
  },
  {
    value: 10,
    label: "10",
  },
  {
    value: 15,
    label: "15",
  },
];
  return (
    <div className={styles.slider}>
        <Typography gutterBottom>
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
          <Slider
                  sx={{
                    '& .MuiSlider-thumb': {
                      transition: '.2s',

                      height: 27,
                      width: 27,
                      backgroundColor: '#fff',
                      border: '1px solid currentColor',
                      '&:hover': {
                        boxShadow: '0 0 0 8px rgba(58, 133, 137, 0.16)',
                        height: 18,
                        width: 18,
                        backgroundColor: 'currentColor',
                      },
                      
                    }
                  }}
        components={{ Thumb: AirbnbThumbComponent }}
        style={{ color: textS.secondaryColor }}
        value={textS.textSize}
        onChange={(e, val) => { handleInputChangeSlider(val) }}
        marks={marks}
        step={1}
        min={1}
        max={15}

      />
            
          </Grid>
          
        </Grid>
    </div>
  )
}