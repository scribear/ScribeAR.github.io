import React from 'react'
import './index.css'


export default function PlaceHolder(props){
        var sz = props.textSize;
        return <div className = "PlaceHolder" style = {
            {
                fontSize:sz,
            }
        }>
            Fontsize Preview
        </div>
}