import React from 'react';
import {createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import {store} from './store';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
        <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
