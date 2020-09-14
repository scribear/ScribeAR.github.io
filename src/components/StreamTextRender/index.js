import React from 'react'
import ReactDOM from 'react-dom'
import { useSelector, useDispatch } from 'react-redux'

export default function StreamTextRender() {
    return (
        <div className = "streamTextWrapper">
            <iframe id = "StreamTextDemo" style = "height: 250px; width: 100%;" src = "https://www.streamtext.net/player?event=IHaveADream" width = "300" height = "150" frameborder = "0" marginwidth = "0px" marginheight = "0px" scrolling = "no">
            </iframe>
        </div>
  )
}
