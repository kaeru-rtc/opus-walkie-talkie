import React, { Component } from 'react'
import { observer } from 'mobx-react'

import { Card, Col, Row, Statistic, Typography } from 'antd'
const { Title } = Typography

@observer
export default class SimpleGraph extends Component {
  d = 20 // canvas 境界とグラフの間
  dt = 5 // text の padding
  updated = false

  state = {
    points: [],
    numPoints: 0
  }

  constructor( props ) {
    super( props )

    this.w = this.props.width || 1240
    this.h = this.props.height || 240
  }

  componentDidMount() {
    this.canvas.width = this.w
    this.canvas.height = this.h
    
    this.ctx = this.canvas.getContext('2d')

    this.drawChart()
  }

  componentDidUpdate() {
    this.drawChart()
  }



  drawChart() {
    // note: to avoid multiple call of `setState`,
    // the condition below is needed.
    if( this.props.data && this.state.points.length === 0) {
      const points = this.getPoints()
      const numPoints = this.props.data
        ? this.props.data.length : 0

      this.setState({
        points, numPoints
      })


      this.drawPoints( points )

      this.drawBorder()
      this.drawText()

      this.updated = true
    }
  }

  drawBorder() {
    if( this.ctx ) {
      this.ctx.beginPath()
      this.ctx.lineWidth = 1
      this.ctx.strokeStyle = '#666'
      this.ctx.moveTo( this.d, 0 )
      this.ctx.lineTo( this.d, this.h - this.d)
      this.ctx.lineTo( this.w - this.d, this.h - this.d)
      this.ctx.stroke()

      this.ctx.beginPath()
      this.ctx.setLineDash([10, 2, 10, 2])
      this.ctx.moveTo( this.d, (this.h - this.d) / 2 )
      this.ctx.lineTo( this.w - this.d, ( this.h - this.d ) / 2)
      this.ctx.stroke()
    }
  }

  getPoints() {
    if( !this.props.data ) return []

    const { min, max, maxLen } = this.props
    //const src = this.props.store[this.props.dataName]
    const src = this.props.data
    const values = src.values(), ret = []
    const dx = ( this.w - this.d * 2 ) / ( maxLen || src.length )
    const dy = ( this.h - this.d ) / ( max - min )

    let idx = 0

    for( let v of values ) {
      if( idx >= ( maxLen || src.length )) break

      ret.push({
        x: this.d + dx * idx++,
        y: ( max - v ) * dy
      })
    }
    return ret
  }

  drawPoints( points ) {
    if( this.ctx ) {
      this.ctx.lineWidth = 1
      this.ctx.strokeStyle = '#f33'
      points.forEach( (p, idx) => {
        if( idx === 0 ) {
          this.ctx.moveTo( p.x, p.y )
        } else {
          this.ctx.lineTo( p.x, p.y )
        }
      })
      this.ctx.stroke()
    }
  }

  drawText() {
    if( this.ctx) {
      this.ctx.fillText( this.props.max, this.dt, this.d)
      this.ctx.fillText( this.props.min, this.dt, this.h - this.d)
      if( this.props.max < 0 ) {
        this.ctx.fillText( 0, this.dt, ( this.h - this.d ) / 2)
      }
    }
  }


  render() {
    const decodedAt = this.props.timeDecoded ?
      new Date(this.props.timeDecoded).toISOString() :
      'N/A'
    return (
      <div className="SimpleGraph">
        <Card title={<Title level={2}>{this.props.title}</Title>}>
          <Row gutter={16}>
            <Col span={12}>
              <Statistic title="num of total points" value={this.state.numPoints} />
            </Col>
            <Col span={12}>
              <Statistic title="num of points displayed" value={this.state.points.length} />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Statistic title="decoded at" value={decodedAt} />
            </Col>
          </Row>
          <canvas ref={elem => this.canvas = elem}></canvas>
        </Card>
      </div>
    )
  }
}