import React from 'react';
import './App.css';
import { Typography } from 'antd'

import GetLocalStream from './components/get-local-stream'
import LoggingHandler from './components/logging-handler'
import TranceiverStore from './store/tranceiver'

import Graph from './components/graph'

const { Title } = Typography

const store = new TranceiverStore()

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Title level={1}>Opus walkie talkie</Title>
        
        {/*
        <Graph store={store} />
        */}

        <LoggingHandler store={store} />

        <GetLocalStream store={store} />

      </header>
    </div>
  );
}

export default App;
