import React from 'react';
import { useSelector } from 'react-redux'
import TopSpace from './components/TopSpace'
import Captions from './components/Captions'
import MiddleSpace from './components/MiddleSpace'
import PlaceHolder from "./components/PlaceHolder"
import './App.css'

export default function App() {
     const darkMode = getComputedStyle(document.documentElement).getPropertyValue('--primary'); // #999999
     // Get global state from Redux. See the React Redux tutorial.
     const textSize = useSelector((state) => state.textSize)
     const numLines = useSelector((state) => state.numLines)
     const invertColors = useSelector((state) => state.invertColors)
     // Convert variables to CSS-friendly strings.
     var sizeString = textSize + 'vh'
     // Size of bottom space (text area) relative to text size and number of lines.
     var botHeight = 41 + 'vh'
     // topHeight + botHeight should always = 100vh because we don't want the full
     // page to scroll (we only want the individual areas to scroll).
     var bgColor = invertColors ? 'white': 'black'
     var color = invertColors ? 'black' : 'white'
     if (bgColor == 'black') {
       return (
            <div className="App-1" style={{
                 backgroundColor: 'black',
                 color: 'white',
                 overflow: 'hidden',
                }}>
                 <TopSpace color = {bgColor}/>
                 <PlaceHolder color = {bgColor} textSize = {sizeString}/>
                 <MiddleSpace color = {bgColor}/>
                 <Captions height={botHeight} textSize={sizeString} />
         
            </div>
       )
     } else {
       return (
            <div className="App-2" style={{
                 backgroundColor: 'white',
                 color: 'black',
                 overflow: 'hidden',
                }}>
                 <TopSpace  color = {bgColor}/>
                 <PlaceHolder color = {bgColor} textSize = {sizeString}/>
                 <MiddleSpace color = {bgColor}/>
                 <Captions height={botHeight} textSize={sizeString} />
            
            </div>
       )
     }
     // You can't comment in JSX.
     // The style tag is the easiest way to set style based on JS variables.

}
