import React, { Component } from 'react'

import { Button, Typography } from 'antd'
const { Title } = Typography

export default class GetLocalStream extends Component {
  handleClickBtn = async _ => {
    await this.props.store.getLocalStream()

    thts.audio.srcObject = this.props.store.stream

    this.audio.onloadedmetadata = _ => {
      this.audio.play()

      this.props.store.getPCMStream()
    }
  }
  render() {
    return (
      <div className="GetLocalStream">
        <Title level={2}>GetLocalStream</Title>
        <Button type="primary" onClick={this.handleClickBtn}>start local stream</Button>
        <div>
          <audio ref={ elem => this.audio = elem } muted controls />
        </div>
      </div>
    )
  }
}

