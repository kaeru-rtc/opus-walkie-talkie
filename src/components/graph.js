import React, { Component } from 'react'
import { observer } from 'mobx-react'

import '../../node_modules/react-vis/dist/style.css';
import {XYPlot, LineSeries} from 'react-vis';


import { Typography } from 'antd'
const { Title } =  Typography

@observer
export default class Graph extends Component {
  render() {
    return (
      <div className="Graph">
        <Title level={3}>debug: Graph</Title>
        <XYPlot height={300} width={1024}>
          <LineSeries data={this.props.store.target} color="yellow" />
        </XYPlot>
      </div>
    )
  }
}