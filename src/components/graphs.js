import React, { Component } from 'react'
import { observer } from 'mobx-react'

import { Col, Tabs,  Row, Divider, Typography } from 'antd'

import SimpleGraph from './simple-graph'
const { Title } = Typography
const { TabPane } = Tabs

@observer
export default class Graphs extends Component {
  render() {
    return(
      <div className="Graphs">
        <Title level={1}>Graphs for debugging</Title>
        <SimpleGraph 
          data={this.props.store.sourcePcm}
          title="source audio" 
          height={120}
          min={-1} 
          max={1} 
          maxLen={8192} />
        <SimpleGraph
          data={this.props.store.opusData}
          title="opus encoded"
          width={1280}
          height={120}
          min={0}
          max={256} />
        <Divider />
        <Tabs defaultActivekey="1">
        { this.props.store.decodedFrames.map( (frame, idx) => {
          const timeDecoded = 
            this.props.store.timeDecodeds.length > idx ?
            this.props.store.timeDecodeds[idx] : 0
          return(
            <TabPane tab={idx} key={idx}>
              <SimpleGraph
                key={idx}
                data={frame}
                timeDecoded={timeDecoded}
                title="decoded opus of each frame"
                  width={1280}
                  height={120}
                  min={-32267} 
                  max={32267} />
              </TabPane>
            )
          }
        )}
        </Tabs>
      </div>
    )
  }
}
