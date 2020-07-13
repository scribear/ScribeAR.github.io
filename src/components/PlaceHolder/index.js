import React from 'react'
import './index.css'
import MenuHider from './MenuHider'
import {useSelector} from 'react-redux'



export default function PlaceHolder(props){
        var sz = props.textSize;
        const meh = (state) => state.meh
        const setting = useSelector(meh)
        // var h = setting ? '23vh' : '14vh';
        var h = props.height
        return <div className = "PlaceHolder" style = {
            {
                // fontSize:sz,
                height:h,
            }
        }>
      
        </div>
}