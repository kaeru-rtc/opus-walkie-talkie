import React, { Component } from 'react'

import { Button } from 'antd'

export default class LoggingHandler extends Component {
  handleClick = _ => {
    this.props.store.logging = false
  }
  render() {
   return(
     <div className="LoggingHandler">
       <Button type="danger" onClick={this.handleClick}>disable logging</Button>
     </div>
   )
  }
}