import React, { Component } from 'react';
import * as constants from './constants'
import Grid from './Grid'
import RightStatusBar from './RightStatusBar'
import LeftStatusBar from './LeftStatusBar'


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      rowsComplete: 0,
      level: 1,
    }
  }

  componentDidMount() {
    this.chooseNextTile()
  }

  chooseNextTile = () => {
    const r = Math.floor(Math.random() * 7)
    const nextTile = constants.SHAPES[r]
    this.setState({ nextTile })
  }

  completeRow = () => {
    const rowsComplete = this.state.rowsComplete + 1
    let level = this.state.level
    let l = level
    let m = 1

    while (l >= 0) {
      l -= 10 * m
      m += 1
    }

    if (l === 0) {
      level += 1
    }

    this.setState({
      rowsComplete,
      level,
    })
  }

  render() {
    return (
      <div style={{ width: '100%', height: '100%'/*, border: 'solid 1px black'*/, display: 'flex', flexDirection: 'row' }}>
        <div style={{ width: '25%', height: '100%'/*, border: 'dashed 1px black'*/, }}>
          <LeftStatusBar />
        </div>
        <div style={{ width: '50%'/*, border: 'dashed 1px black'*/, }}>
          <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(235, 235, 235, 0.5)', }}>
            <Grid
              nextTile={this.state.nextTile}
              chooseNextTile={this.chooseNextTile}
              level={this.state.level}
              completeRow={this.completeRow}
            />
          </div>
        </div>
        <div style={{ width: '25%', height: '100%'/*, border: 'dashed 1px black'*/, }}>
          <RightStatusBar shape={this.state.nextTile} />
        </div>
      </div>
    );
  }
}


export default App;
