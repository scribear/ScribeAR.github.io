import React, { useState, useEffect } from 'react';
import Desktop from './Desktop'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import AR from './AR'

export default function App() {
  const [text, setText] = useState(JSON.parse(localStorage.getItem('text')) || 6)
  useEffect(() => {
    localStorage.setItem('text', JSON.stringify(text));
  }, [text])
  console.log(window.location.pathname)
  return (
    <Router>
      <Switch>
        <Route path='/'>
          <Desktop text={text} setText={setText} />
        </Route>
        <Route path='/armode'>
          <AR text={text} setText={setText} />
        </Route>
      </Switch>
    </Router>

  )
}