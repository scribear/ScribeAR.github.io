import React from 'react';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import {IconButton} from '@material-ui/core'
import {useDispatch} from 'react-redux'
import styles from './index.module.css'


const Switch = (props) => {
    const {pageNum, setPage, page,titleMap} = props;
    const next = () => {
        if (page + 1 > pageNum){
            page = pageNum;
            setPage(page);
            return ;
        }
        page++;
        setPage(page)
        return ;
    }
    const prev = () => {
        if (page - 1 < 1){
            page = 1;
            setPage(page);
            return ;
        }
        page--;
        setPage(page);
        return ;
    }
    return (
        <div className={styles.switch}>
            <IconButton color = 'inherit' onClick = {prev()}>
                <ArrowBackIosIcon />
            </IconButton>
            {titleMap[page]}
            <IconButton color = 'inherit' onClick = {next()}>
                <ArrowForwardIosIcon />
            </IconButton>
        </div>
    )
}

export default Switch