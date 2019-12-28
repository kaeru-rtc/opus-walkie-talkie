import React, { Component } from 'react'
import { observer } from 'mobx-react'

import { Button, Typography } from 'antd'
const { Title } = Typography

@observer
export default class GetLocalStream extends Component {
  handleClickBtn = async _ => {
    await this.props.store.getLocalStream()

    this.audio.srcObject = this.props.store.stream

    this.audio.onloadedmetadata = _ => {
      this.audio.play()
    }
  }
  render() {
    return (
      <div className="GetLocalStream">
        <Title level={2}>GetLocalStream</Title>
        <Button type="primary" onClick={this.handleClickBtn}>start local stream</Button>

        <div>
          <audio ref={ elem => this.audio = elem } controls />
        </div>
      </div>
    )
  }
}

