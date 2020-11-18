import React from 'react';
import Desktop from './Desktop/Desktop'
import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";
  import AR from './AR/AR'

export default function App() {
    console.log(window.location.pathname)
    return (
        <Router>
            <Switch>
                <Route path='/'>
                    <Desktop />
                </Route>
                <Route path='/armode'>
                    <AR />
                </Route>
            </Switch>
        </Router>

    )
}