import React from 'react';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { IconButton } from '@material-ui/core';
import styles from './Switch.module.css';
import { useDispatch } from 'react-redux';

const Switch = (props) => {
  const dispatch = useDispatch();
  const { page, titleMap, prev, next } = props;
  return (
    <div className={styles.switch}>
      <IconButton color='inherit' onClick={() => dispatch(prev())}>
        <ArrowBackIosIcon />
      </IconButton>
      <div className={styles.word}>
        {titleMap[page - 1]}
      </div>
      <IconButton color='inherit' onClick={() => dispatch(next())}>
        <ArrowForwardIosIcon />
      </IconButton>
    </div>
  )
}

export default Switch;