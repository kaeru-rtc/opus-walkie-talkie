import React from 'react';

import { createStore } from 'redux'
import './App.css';

import { Typography } from 'antd'

import GetLocalStream from './components/get-local-stream'
import Graphs from './container/graphs'


const { Title } = Typography


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Title level={1}>Opus walkie talkie</Title>
        <Graphs />
        <GetLocalStream />
      </header>
    </div>
  );
}

export default App;
