import React, { Component } from 'react'
import { Button, Col, Row, Typography } from 'antd'
const { Title } = Typography

import SimpleGraph from './simple-graph'

class Graphs extends Component {
  startAudioSource = _ =>  {
    this.props.startAudioSource()
  }
  
  render() {
    return (
      <div className="graphs">
        <Title level={1}>Graph components</Title>
        <Button type="primary" onClick={this.startAudioSource}>start audio source</Button><br />
        <Row gutter={16}>
          <Col span={12}>
            <SimpleGraph 
              title="PCM data"
              min={0} max={256} data={this.props.pcm} 
              width={640}
            />
          </Col>
          <Col span={12}>
            <SimpleGraph
              title="FFT data"
              type="bar"
              min={0} max={256} data={this.props.fft}
              width={640}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <SimpleGraph 
              title="PCM data"
              min={0} max={256} data={this.props.outPCM} 
              width={640}
            />
          </Col>
          <Col span={12}>
            <SimpleGraph
              title="FFT data"
              type="bar"
              min={0} max={256} data={this.props.outFFT}
              width={640}
            />
          </Col>
        </Row>
      </div>
    )
  }
}

export default Graphs