import React, { Component } from 'react';
import cloneDeep from 'lodash.clonedeep';
import reduce from 'lodash.reduce';
import map from 'lodash.map';
import * as constants from './constants'
import { getTileColor } from './utils'
import Block from './Block'


export default class Grid extends Component {
  static initialState = {
    grid: {},
    tile: null,
  }

  constructor(props) {
    super(props)

    this.state = cloneDeep(Grid.initialState)

    this.handleKeyDown = this.handleKeyDown.bind(this)

    document.addEventListener('keydown', this.handleKeyDown)
  }

  componentDidMount() {
    setTimeout(this.placeNextTile, 3000)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown(e) {
    switch (e.keyCode) {
      case 37:
        this.moveTile(constants.LEFT)
        break
      case 39:
        this.moveTile(constants.RIGHT)
        break
        /*
      case 38:
        this.moveTile(constants.UP)
        break
        */
      case 40:
        this.moveTile(constants.DOWN)
        break
      case 32:
        this.rotateTile()
        break
      default:
        break
    }
  }

  restart = () => {
    console.log('RESTART')
    if (this.state.tileDropInterval) {
      clearInterval(this.state.tileDropInterval)
    }
    this.setState(cloneDeep(Grid.initialState))
    this.placeNextTile()
  }

  placeNextTile = (shape = this.props.nextTile) => {
    this.addTile(shape)
    this.props.chooseNextTile()
    this.setTileDropInterval(200) // TODO: constant
  }

  setTileDropInterval = (ms) => {
    if (this.state.tileDropInterval) {
      clearInterval(this.state.tileDropInterval)
    }
    const tileDropInterval = setInterval(() => this.moveTile(constants.DOWN), ms) // TODO: make the drop rate variable
    this.setState({ tileDropInterval })
  }

  // TODO: RETURN HERE
  moveTile = (direction, tile = this.state.tile) => {
    if (tile) {
      const blocked = this.collisionCheck(tile, direction)

      if (blocked) {
        if (direction === constants.DOWN) {
          if (tile.y >= constants.NUM_ROWS - 1) {
            this.restart()
            return
          }
          this.settleTile(tile) // TODO
          this.removeCompleteRows()
          this.props.completeRow()
          this.placeNextTile()
        }
        return
      }

      const newTile = { ...this.state.tile }

      switch (direction) {
        case constants.UP:
          newTile.y += 1
          break
        case constants.DOWN:
          newTile.y -= 1
          break
        case constants.LEFT:
          newTile.x -= 1
          break
        case constants.RIGHT:
          newTile.x += 1
          break
        default:
          break
      }

      this.setState({
        tile: newTile,
      })
    }
  }

  rotateTile = (tile = this.state.tile) => {
    const updatedTile = {
      ...tile,
      rotation: (tile.rotation + 1) % 4,
    }

    if (!this.collisionCheck(updatedTile)) {
      this.setState({ tile: updatedTile })
    }
  }

  collisionCheck = (tile = this.state.tile, direction) => {
    let dx = 0
    let dy = 0

    switch (direction) {
      case constants.UP:
        dy = 1
        break
      case constants.DOWN:
        dy = -1
        break
      case constants.LEFT:
        dx = -1
        break
      case constants.RIGHT:
        dx = 1
        break
      default:
        break
    }

    const tilePoints = this.getTilePoints(tile).map((point) => ({
      x: point.x + dx,
      y: point.y + dy,
    }))
    // TODO: test
    const blockPoints = this.getBlockPoints(this.state.grid)
      //.map(this.gridToSvgTransform)
    // const blockPoints = this.getBlockPoints(this.state.grid)
      // .sort((a, b) => (constants.NUM_COLUMNS * (a.y - b.y)) + (a.x - b.x))

    for (let i = 0; i < tilePoints.length; i += 1) {
      const tilePoint = tilePoints[i]

      for (let j = 0; j < blockPoints.length; j += 1) {
        const blockPoint = blockPoints[j]

        if (parseInt(tilePoint.x, 10) === parseInt(blockPoint.x, 10) && parseInt(tilePoint.y, 10) === parseInt(blockPoint.y, 10)) {
          return true
        }
      }
    }

    let minX = 0
    let maxX = 0
    let minY = 0
    let maxY = 0
    tilePoints.forEach(({ x, y }) => {
      if (x < minX) {
        minX = x
      } else if (x > maxX) {
        maxX = x
      }
      if (y < minY) {
        minY = y
      } else if (y > maxY) {
        maxY = y
      }
    })

    return (minX < 0 || maxX >= constants.NUM_COLUMNS || minY < 0)
  }

  settleTile = (tile = this.state.tile) => {
    const color = getTileColor(tile.shape)
    const newGrid = cloneDeep(this.state.grid)

    this.getTilePoints(tile).forEach((point) => {
      newGrid[point.y] = newGrid[point.y] || {}
      newGrid[point.y][point.x] = color
    })

    this.setState({
      grid: newGrid,
    })
  }

  removeCompleteRows = () => {
    let newGrid = { ...this.state.grid }

    for (let i = 0; i < constants.NUM_ROWS; i += 1) {
      if (newGrid[i]) {
        let fullRow = true
        for (let j = 0; j < constants.NUM_COLUMNS; j += 1) {
          if (!newGrid[i][j]) {
            fullRow = false
            break
          }
        }

        if (fullRow) {
          for (let k = i; k < constants.NUM_ROWS - 1; k += 1) {
            newGrid[k] = newGrid[k + 1]
          }
          delete newGrid[constants.NUM_ROWS - 1]

          i -= 1
        }
      }
    }

    this.setState({ grid: newGrid })
  }

  addTile = (shape) => {
    switch (shape) {
      case constants.LINE:
        this.setState({
          tile: {
            x: 3,
            y: 19,
            rotation: 0,
            shape,
          },
        })
        break
      case constants.SQUARE:
        this.setState({
          tile: {
            x: 4,
            y: 19,
            rotation: 0,
            shape,
          },
        })
        break
      case constants.TEE:
        this.setState({
          tile: {
            x: 3,
            y: 19,
            rotation: 0,
            shape,
          },
        })
        break
      case constants.LEFT_L:
        this.setState({
          tile: {
            x: 3,
            y: 19,
            rotation: 0,
            shape,
          },
        })
        break
      case constants.RIGHT_L:
        this.setState({
          tile: {
            x: 3,
            y: 19,
            rotation: 0,
            shape,
          },
        })
        break
      case constants.LEFT_Z:
        this.setState({
          tile: {
            x: 3,
            y: 19,
            rotation: 0,
            shape,
          },
        })
        break
      case constants.RIGHT_Z:
        this.setState({
          tile: {
            x: 3,
            y: 19,
            rotation: 0,
            shape,
          },
        })
        break
      default:
        break
    }
  }

  getTile = (tile = this.state.tile) => {
    if (!tile) {
      return []
    }

    return this.getTilePoints(tile)
      .map(this.convertGridPointToSvgPoint)
      .map((point, i) => <Block key={`${tile.shape}-${i}`} {...point} color={getTileColor(tile.shape)} />)
  }

  getTilePoints = (tile = this.state.tile) => {
    const { x, y, shape, rotation } = tile
    const points = []

    if (shape === constants.LINE) {
      if (rotation === 0 || rotation === 2) {
        for (let i = 0; i < 4; i += 1) {
          points.push({ x: x + i, y })
        }
      } else {
        for (let i = 0; i < 4; i += 1) {
          points.push({ x, y: y - i })
        }
      }
    } else if (shape === constants.SQUARE) {
      points.push({
        x,
        y,
      }, {
        x: x + 1,
        y,
      }, {
        x,
        y: y - 1,
      }, {
        x: x + 1,
        y: y - 1,
      })
    } else if (shape === constants.TEE) {
      if (rotation === 0) {
        for (let i = 0; i < 3; i += 1) {
          points.push({
            x: x + i,
            y: y - 1,
          })
        }
        points.push({
          x: x + 1,
          y,
        })
      } else if (rotation === 1) {
        for (let i = 0; i < 3; i += 1) {
          points.push({
            x,
            y: y - i,
          })
        }
        points.push({
          x: x + 1,
          y: y - 1,
        })
      } else if (rotation === 2) {
        for (let i = 0; i < 3; i += 1) {
          points.push({
            x: x + i,
            y,
          })
        }
        points.push({
          x: x + 1,
          y: y - 1,
        })
      } else if (rotation === 3) {
        for (let i = 0; i < 3; i += 1) {
          points.push({
            x: x + 1,
            y: y - i,
          })
        }
        points.push({
          x,
          y: y - 1,
        })
      }
    } else if (shape === constants.LEFT_L) {
      if (rotation === 0) {
        for (let i = 0; i < 3; i += 1) {
          points.push({
            x: x + i,
            y: y - 1,
          })
        }
        points.push({
          x,
          y,
        })
      } else if (rotation === 1) {
        for (let i = 0; i < 3; i += 1) {
          points.push({
            x,
            y: y - i,
          })
        }
        points.push({
          x: x + 1,
          y,
        })
      } else if (rotation === 2) {
        for (let i = 0; i < 3; i += 1) {
          points.push({
            x: x + i,
            y,
          })
        }
        points.push({
          x: x + 2,
          y: y - 1,
        })
      } else if (rotation === 3) {
        for (let i = 0; i < 3; i += 1) {
          points.push({
            x: x + 1,
            y: y - i,
          })
        }
        points.push({
          x,
          y: y - 2,
        })
      }
    } else if (shape === constants.RIGHT_L) {
      if (rotation === 0) {
        for (let i = 0; i < 3; i += 1) {
          points.push({
            x: x + i,
            y: y - 1,
          })
        }
        points.push({
          x: x + 2,
          y,
        })
      } else if (rotation === 1) {
        for (let i = 0; i < 3; i += 1) {
          points.push({
            x,
            y: y - i,
          })
        }
        points.push({
          x: x + 1,
          y: y - 2,
        })
      } else if (rotation === 2) {
        for (let i = 0; i < 3; i += 1) {
          points.push({
            x: x + i,
            y,
          })
        }
        points.push({
          x,
          y: y - 1,
        })
      } else if (rotation === 3) {
        for (let i = 0; i < 3; i += 1) {
          points.push({
            x: x + 1,
            y: y - i,
          })
        }
        points.push({
          x,
          y,
        })
      }
    } else if (shape === constants.LEFT_Z) {
      if (rotation === 0 || rotation === 2) {
        points.push({
          x,
          y,
        }, {
          x: x + 1,
          y,
        }, {
          x: x + 1,
          y: y - 1,
        }, {
          x: x + 2,
          y: y - 1,
        })
      } else {
        points.push({
          x: x + 1,
          y,
        }, {
          x: x + 1,
          y: y - 1,
        }, {
          x,
          y: y - 1,
        }, {
          x,
          y: y - 2,
        })
      }
    } else if (shape === constants.RIGHT_Z) {
      if (rotation === 0 || rotation === 2) {
        points.push({
          x,
          y: y - 1,
        }, {
          x: x + 1,
          y: y - 1,
        }, {
          x: x + 1,
          y,
        }, {
          x: x + 2,
          y,
        })
      } else {
        points.push({
          x,
          y,
        }, {
          x,
          y: y - 1,
        }, {
          x: x + 1,
          y: y - 1,
        }, {
          x: x + 1,
          y: y - 2,
        })
      }
    }

    return points
  }


  /*
  getBlocks = (grid = this.state.grid) => reduce(grid, (data, row, y) => [
    ...data, ...map(row, (color, x) => ({
      x: x * 10,
      y: ((constants.NUM_ROWS * 10) - 10) - (10 * y),
      color,
    }))
  ], []).map((data) => <Block key={`${data.x}-${data.y}`}{...data} />)
  */

  getBlocks = (grid = this.state.grid) => this.getBlockPoints(grid)
    .map(this.gridToSvgTransform)
  //getBlocks = (grid = this.state.grid) => this.getBlockPoints(grid)
    .map((data) => <Block key={`${data.x}-${data.y}`}{...data} />)

    /*
  getBlockPoints = (grid = this.state.grid) => reduce(grid, (data, row, y) => [
    ...data, ...map(row, (color, x) => ({
      x: x * 10,
      y: ((constants.NUM_ROWS * 10) - 10) - (10 * y),
      color,
    }))
  ], [])
  */

  getBlockPoints = (grid = this.state.grid) => reduce(grid, (data, row, y) => [
    ...data, ...map(row, (color, x) => ({
      x,
      y,
      color,
    }))
  ], [])

  gridToSvgTransform = ({ x, y, ...rest }) => ({
    x: x * 10,
    y: ((constants.NUM_ROWS * 10) - 10) - (10 * y),
    ...rest,
  })

    // TODO: use everywhere
  convertGridPointToSvgPoint = ({ x, y, ...props }) => ({
    x: x * 10,
    y: ((constants.NUM_ROWS * 10) - 10) - (10 * y),
    ...props,
  })

  render() {
    return (
      <svg
        version="1.1"
        baseProfile="full"
        width="100%" height="100%"
        viewBox="0 0 100 200"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        strokeWidth="1" stroke="rgba(0, 0, 0, 0.5)"
      >

        {/* Background */}
        <rect width="100" height="200" fill="transparent" />

        {this.getBlocks()}
        {this.getTile()}

      </svg>
    )
  }
}

