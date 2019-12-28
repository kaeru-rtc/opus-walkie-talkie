import React from 'react';
import './App.css';
import { Typography } from 'antd'

import GetLocalStream from './components/get-local-stream'
import TranceiverStore from './store/tranceiver'

const { Title } = Typography

const store = new TranceiverStore()

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Title level={1}>Opus walkie talkie</Title>

        <GetLocalStream store={store} />

      </header>
    </div>
  );
}

export default App;
