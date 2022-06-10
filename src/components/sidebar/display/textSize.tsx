
import Slider, { SliderThumb } from '@mui/material/Slider';
import { Grid, makeStyles, Typography } from '../../../muiImports'
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

export default function PlusMinus(props) {
  const dispatch = useDispatch()
  const textS = useSelector((state: RootState) => {
    return state.DisplayReducer as DisplayStatus;
  });
  const handleInputChangeSlider = (event) => {
    dispatch({ type: 'SET_TEXT', payload: event })
  }
  const styles = useStyles()

  interface HoverThumbProps extends React.HTMLAttributes<unknown> {}

function HoverThumb(props: HoverThumbProps) {
  const { children, ...other } = props;
  return (
    <SliderThumb {...other}>
      {children}      
      {textS.textSize}
    </SliderThumb>
  );
}

const marks = [{value: 1, label: "1",}, {value: 5, label: "5",}, {value: 10, label: "10",}, {value: 15, label: "15",}];                                              
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
        components={{ Thumb: HoverThumb }}
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