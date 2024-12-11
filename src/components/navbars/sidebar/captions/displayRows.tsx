import React from 'react';

import Slider, { SliderThumb } from '@mui/material/Slider';
import { Grid, makeStyles, Typography } from '../../../../muiImports'
import { RootState, DisplayStatus } from '../../../../react-redux&middleware/redux/typesImports';
import { useDispatch, useSelector } from 'react-redux';
/*const useStyles = makeStyles({
  slider: {
    width: '16vw',
    marginLeft: '2vw',
  },
  textBox: {
    width: '2.5vw',
    marginLeft: '1vw'
  }
});*/

const useStyles = makeStyles({
  slider: {
    width: '60%',
    margin: 'auto',
    /*
    // Responsive styles using media queries
    '@media (min-width: 600px)': { // Small screens
      width: '30vw',
    },
    '@media (min-width: 960px)': { // Medium screens
      width: '16vw',
    },
    '@media (min-width: 1280px)': { // Large screens
      width: '16vw',
    },*/
  },
  textBox: {
    width: '90%',
    margin: '0 auto',
  },
});



export default function PlusMinus(props) {
  const dispatch = useDispatch()
  const lines = useSelector((state: RootState) => {
    return state.DisplayReducer as DisplayStatus;
  });
  const handleInputChangeSlider = (event) => {
    dispatch({ type: 'SET_ROW_NUM', payload: event })
  }
  const styles = useStyles()

  interface HoverThumbProps extends React.HTMLAttributes<unknown> {}

function HoverThumb(props: HoverThumbProps) {
  const { children, ...other } = props;
  return (
    <SliderThumb {...other}>
      {children}      
      {lines.rowNum}
    </SliderThumb>
  );
}

// function initialVal(value) {
//   if (isNaN(value) || typeof value === 'undefined') {
//     return 4;
//   }
//   return value;
// }

// let lineheight = initialVal(lines.lineNum)

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
        style={{ color: lines.secondaryColor }}
        value={lines.rowNum}
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