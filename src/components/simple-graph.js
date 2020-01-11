import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Card, Typography } from 'antd'
const { Title } = Typography

export default class SimpleGraph extends Component {
  d = 20 // canvas 境界とグラフの間
  dt = 5 // text の padding

  constructor( props ) {
    super( props )

    this.w = this.props.width || 1280
    this.h = this.props.height || 240

    this.type = this.props.type || 'line' // or 'bar'
  }

  componentDidMount() {
    this.canvas.width = this.w
    this.canvas.height = this.h
    
    this.ctx = this.canvas.getContext('2d')
    this.ctx.clearRect(0, 0, this.w, this.h )
  }

  updateChart() {
    if( !this.ctx ) return

    const points = this.getPoints(this.props.data)

    if(!points) return

    this.ctx.clearRect( 0, 0, this.w, this.h )
    this.drawAxis()
    this.drawText()
    this.drawPoints( points )
  }

  drawAxis() {
    if( this.ctx ) {
      this.ctx.lineWidth = 1

      // x-axis and y-axis
      this.ctx.strokeStyle = '#000'
      this.ctx.beginPath()
      this.ctx.moveTo( this.d, 0 )
      this.ctx.lineTo( this.d, this.h - this.d)
      this.ctx.lineTo( this.w - this.d, this.h - this.d)
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

  getPoints( data ) {
    if( !data ) return null

    const { min, max } = this.props
    const ret = []
    const length = this.props.length || data.length
    const dx = ( this.w - this.d * 2 ) / length
    const dy = ( this.h - this.d ) / ( max - min )


    for( let i = 0; i < length; i++ ) {
      ret.push({
        x: this.d + dx * i,
        y: ( max - data[i] ) * dy
      })
    }
    return ret
  }

  drawPoints( points ) {
    if( this.ctx ) {
      if( this.type === 'line') {
        this.ctx.lineWidth = 1
        this.ctx.strokeStyle = '#666'
        points.forEach( (p, idx) => {
          if( idx === 0 ) {
            this.ctx.moveTo( p.x, p.y )
          } else {
            this.ctx.lineTo( p.x, p.y )
          }
        })
        this.ctx.stroke()
      } else {
        const w = ( this.w - this.d ) / points.length
        points.forEach( p => {
          const h = this.h - this.d - p.y
          this.ctx.fillRect( p.x, p.y, w, h)
        })
      }
    }
  }


  render() {
    this.updateChart()
    return (
      <div className="SimpleGraph">
        <Card title={<Title level={2}>{this.props.title}</Title>}>
          <canvas ref={elem => this.canvas = elem}></canvas>
        </Card>
      </div>
    )
  }
}

SimpleGraph.propTypes = {
  min: PropTypes.number.isRequired, // グラフの最小値
  max: PropTypes.number.isRequired, // グラフの最大値
  width:  PropTypes.number, // グラフの幅
  height: PropTypes.number  // フラフの高さ
}