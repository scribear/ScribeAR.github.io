import React from 'react';
import { useSelector } from 'react-redux'
import TopSpace from './components/TopSpace'
import Captions from './components/Captions'
import './App.css'

export default function App() {
     const textSize = useSelector((state) => state.textSize)
     const numLines = useSelector((state) => state.numLines)
     const invertColors = useSelector((state) => state.invertColors)
     var sizeString = textSize + 'vh'
     var botHeight = textSize * numLines * 1.5
     var topHeight = 100 - botHeight + 'vh'
     botHeight += 'vh'
     var bgColor = invertColors ? 'white' : 'black'
     var color = invertColors ? 'black' : 'white'
     return (
          <div className="App" style={{
               backgroundColor: bgColor,
               color: color
          }}>
               <TopSpace height={topHeight} />
               <Captions height={botHeight} textSize={sizeString} />
          </div>
     )
}
