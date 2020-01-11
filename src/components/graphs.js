import React, { Component } from 'react'
import { Button, Col, Row, Statistic, Typography } from 'antd'
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
        <Title level={2}>source</Title>
        <Row gutter={16}>
          <Col span={12}>
            <Statistic title="byte size of pcm" value={this.props.pcmSize} />
          </Col>
          <Col span={12}>
            <Statistic title="byte size of opus" value={this.props.opusSize} />
          </Col>
          <Col span={12}>
            <Statistic title="size of circular buffer" value={this.props.bufferSize} />
          </Col>
        </Row>
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
          <Col span={24}>
            <SimpleGraph
              title="pcm before opus"
              type="line"
              min={-1} max={1} data={this.props.pcmBeforeOpus}
              length={4096}
              width={1280}
            />
          </Col>
          <Col span={12}>
            <SimpleGraph
              title="opus frame decoded"
              type="line"
              min={-32767} max={32767} data={this.props.d_opusframe}
              width={640}
            />
          </Col>
        </Row>
        <Title level={2}>destination (after decoded)</Title>
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