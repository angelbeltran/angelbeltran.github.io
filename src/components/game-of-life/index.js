import React, { Component } from 'react';


class Cell extends Component {
  render() {
    return (
      <rect
        width="1"
        height="1"
        x={this.props.x}
        y={this.props.y}
        fill={this.props.alive ? "#aaaaaa" : "#dddddd" }
        onClick={this.props.onClick}
      />
    )
  }
}

class Grid extends Component {
  constructor(props) {
    super(props)

    this.state = {
      grid: {},
      interval: 100,
    }
  }

  static defaultProps = {
    width: '100%',
    height: '100%',
    rows: 20,
    columns: 20,
  }

  componentDidMount() {
    this.tick()

    const startingGrid = this.props.startingGrid || this.getRandomGrid()
    this.setState({
      grid: startingGrid,
    })

    if (this.props.clear) {
      this.listenForClearCall(this.props.clear)
    }
    if (this.props.reset) {
      this.listenForResetCall(this.props.reset)
    }
  }

  componentWillUnmount() {
    this.stopTicking = true // to stop the next tick
    if (this.props.saveGrid) {
      this.props.saveGrid(this.state.grid)
    }
  }

  getRandomGrid = () => {
    const newGrid = {}

    for (let i = 0; i < this.props.rows; i += 1) {
      for (let j = 0; j < this.props.columns; j += 1) {
        if (Math.floor((4/3) * Math.random())) {
          newGrid[i] = newGrid[i] || {}
          newGrid[i][j] = true
        }
      }
    }

    return newGrid
  }

  listenForClearCall = (clear) => {
    return clear().then((_clear) => {
      this.setState({ grid: {} })
      return this.listenForClearCall(_clear)
    })
  }

  listenForResetCall = (reset) => {
    return reset().then((_reset) => {
      this.setState({ grid: this.getRandomGrid() })
      return this.listenForResetCall(_reset)
    })
  }

  tick = () => {
    if (this.stopTicking) {
      return
    }
    if (this.props.paused) {
      setTimeout(this.tick, this.state.interval)
      return
    }

    // count number of neighbors
    const counts = []

    // initiate counts at 0
    for (let i = 0; i < this.props.rows; i += 1) {
      counts.push([])
      for (let j = 0; j < this.props.columns; j += 1) {
        counts[i].push(0)
      }
    }

    // do counts
    for (let i = 0; i < this.props.rows; i += 1) {
      const y1 = (this.props.rows - 1 + i) % this.props.rows
      const y2 = i
      const y3 = (1 + i) % this.props.rows

      if (this.state.grid[i]) {
        for (let j = 0; j < this.props.columns; j += 1) {
          if (this.state.grid[i][j]) {
            const x1 = (this.props.columns - 1 + j) % this.props.columns
            const x2 = j
            const x3 = (1 + j) % this.props.columns

            counts[y1][x1] += 1
            counts[y1][x2] += 1
            counts[y1][x3] += 1
            counts[y2][x1] += 1
            counts[y2][x3] += 1
            counts[y3][x1] += 1
            counts[y3][x2] += 1
            counts[y3][x3] += 1
          }
        }
      }
    }

    // update grid
    const newGrid = {}
    for (let i = 0; i < this.props.rows; i += 1) {
      for (let j = 0; j < this.props.columns; j += 1) {
        // currently alive
        if (this.state.grid[i] && this.state.grid[i][j]) {
          if (counts[i][j] === 2 || counts[i][j] === 3) {
            newGrid[i] = newGrid[i] || {}
            newGrid[i][j] = true
          }
        } else { // currently dead
          if (counts[i][j] === 3) {
            newGrid[i] = newGrid[i] || {}
            newGrid[i][j] = true
          }
        }
      }
    }

    this.setState({ grid: newGrid }, () => setTimeout(this.tick, this.state.interval))
  }

  onCellClick = (x, y) => {
    const newGrid = { ...this.state.grid }

    if (newGrid[y]) {
      newGrid[y] = { ...newGrid[y], [x]: !newGrid[y][x] }
    } else {
      newGrid[y] = { [x]: true }
    }

    this.setState({ grid: newGrid })
  }

  getCell = (x, y, alive = false) =>
    <Cell
      key={`(${x}, ${y})`}
      x={x}
      y={y}
      onClick={() => (this.props.paused || !this.props.protected) && this.onCellClick(x, y)}
      alive={alive}
    />

  getCells = () => {
    const cells = []

    for (let i = 0; i < this.props.rows; i += 1) {
      cells.push([])
      if (this.state.grid[i]) {
        for (let j = 0; j < this.props.columns; j += 1) {
          if (this.state.grid[i][j]) {
            cells[i].push(this.getCell(j, i, true))
          } else {
            cells[i].push(this.getCell(j, i))
          }
        }
      } else {
        for (let j = 0; j < this.props.columns; j += 1) {
          cells[i].push(this.getCell(j, i))
        }
      }
    }

    return cells
  }

  render() {
    return (
      <svg
        version="1.1"
        baseProfile="full"
        width={this.props.width} height={this.props.height}
        viewBox={`0 0 ${this.props.columns} ${this.props.rows}`}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        strokeWidth="0.1" stroke="rgba(0, 0, 0, 0.5)"
      >

        {/* Background */}
        <rect width={this.props.columns} height={this.props.rows} fill="transparent" />
        {this.getCells()}

      </svg>
    )
  }
}


export default Grid
