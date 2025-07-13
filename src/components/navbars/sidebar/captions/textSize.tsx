import React from 'react';
// import {useEffect} from 'react';
import Slider, { SliderThumb } from '@mui/material/Slider';
import { Grid, Typography } from '../../../../muiImports'
import { RootState, DisplayStatus } from '../../../../react-redux&middleware/redux/typesImports';
import { useDispatch, useSelector } from 'react-redux';

export default function PlusMinus(props) {
  const dispatch = useDispatch()
  const textS = useSelector((state: RootState) => {
    return state.DisplayReducer as DisplayStatus;
  });

  const HandleInputChangeSlider = (event) => {
    // useEffect(() => {
    //   // This function will be triggered for all renders
    //   console.log('Function triggered for all renders.');
    // }, []);
    dispatch({ type: 'SET_TEXT', payload: event })
  }

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
    <div style={{ width: '60%', margin: 'auto' }}>
        <Typography gutterBottom>
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid size={12}>
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
        onChange={(e, val) => { HandleInputChangeSlider(val) }}
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