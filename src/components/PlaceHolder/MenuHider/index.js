import React,{ useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { flip_menuhide } from '../../../redux/actions'
import IconButton from '@material-ui/core/IconButton';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
export default function MenuHider(props){
    const meh = (state) => state.meh;
    const setting = useSelector(meh);
    const dispatch = useDispatch();
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         dispatch(flip_menuhide())
    //     }, 10000);
    //     return () => clearTimeout(timer);
    // }, []);

    function handleAgain(){
        dispatch(flip_menuhide())
        // const timerr = setTimeout(() => {
        //     dispatch(flip_menuhide())
        // }, 10000);
        // return () => clearTimeout(timerr)
    }

    if (setting == 0){
        return (
            <div>
                <IconButton className = "c2" color = "inherit" onClick = {()=>dispatch(flip_menuhide())}>
                    <LockIcon className = 'c3' />
                </IconButton>
            </div>
        )
    }else{
        return (
            <div>
                <IconButton className = "c2" color = "inherit" onClick = {()=>handleAgain()}>
                    <LockOpenIcon className = 'c3' />
                </IconButton>
            </div>
        )
    }

}
