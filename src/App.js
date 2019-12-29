import React from 'react';
import { useSelector } from 'react-redux'
import TopSpace from './components/TopSpace'
import Captions from './components/Captions'
import './App.css'

export default function App() {
     // Get global state from Redux. See the React Redux tutorial.
     const textSize = useSelector((state) => state.textSize)
     const numLines = useSelector((state) => state.numLines)
     const invertColors = useSelector((state) => state.invertColors)
     // Convert variables to CSS-friendly strings.
     var sizeString = textSize + 'vh'
     // Size of bottom space (text area) relative to text size and number of lines.
     // 1.5 is an estimate of the ratio of line size to text size.
     // This is a sloppy way of calculating the height. Please improve on this.
     var botHeight = textSize * numLines * 1.5
     // topHeight + botHeight should always = 100vh because we don't want the full
     // page to scroll (we only want the individual areas to scroll).
     var topHeight = 100 - botHeight + 'vh'
     botHeight += 'vh'
     var bgColor = invertColors ? 'white' : 'black'
     var color = invertColors ? 'black' : 'white'
     // You can't comment in JSX.
     // The style tag is the easiest way to set style based on JS variables.
     return (
          <div className="App" style={{
               backgroundColor: bgColor,
               color: color }}>
               <TopSpace height={topHeight} />
               <Captions height={botHeight} textSize={sizeString} />
          </div>
     )
}
