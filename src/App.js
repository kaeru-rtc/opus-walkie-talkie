import React from 'react';
import './App.css';

import { Divider, Typography } from 'antd'

import GetLocalStream from './components/get-local-stream'
import TranceiverStore from './store/tranceiver'

import Graphs from './components/graphs'

const { Title } = Typography


const store = new TranceiverStore()

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Title level={1}>Opus walkie talkie</Title>
        
        <GetLocalStream store={store} />

        <Divider />

        <Graphs store={store} />

      </header>
    </div>
  );
}

export default App;
