import React from 'react'
import './index.css'
import MenuHider from './MenuHider'


export default function PlaceHolder(props){
        var sz = props.textSize;
        return <div className = "PlaceHolder" style = {
            {
                fontSize:sz,
            }
        }>
            <MenuHider />
        </div>
}