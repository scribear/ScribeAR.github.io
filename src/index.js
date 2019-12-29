import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore } from 'redux';
import allReducers from './redux/reducers';
import { Provider } from 'react-redux';

const store = createStore(allReducers);

ReactDOM.render(
     <Provider store={store}>
          <App />
     </Provider>,
     document.getElementById('root')
);

// AUTOMATIC COMMENT PROVIDED BY NPX:
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
