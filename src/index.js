import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import * as serviceWorker from './serviceWorker';

import logger from 'redux-logger'
import reducer, { addCounter, TYPES } from './store/appStore'

const store = createStore( reducer, applyMiddleware(logger) )

// store.subscribe( () => console.log( store.getState() ))


ReactDOM.render(
  <Provider store={store}><App /></Provider>, 
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
