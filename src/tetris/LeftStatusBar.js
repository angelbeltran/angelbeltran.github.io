import React, { Component } from 'react'


export default class LeftStatusBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: 'A'
    }
  }

  render() {
    const wrapperStyle = {
      height: '100%',
    }

    return (
      <div style={wrapperStyle}>
        <div style={{ textAlign: 'center' }}>
          Tetris
        </div>
      </div>
    )
  }
}

/*
        <select value={this.state.value} onChange={(e) => this.setState({ value: e.target.value })}>
          <option>A</option>
          <option>B</option>
          <option>C</option>
        </select>
*/
