import React, { Component } from 'react'
import * as constants from './constants'
import { getTileColor } from './utils'
import Block from './Block'


export default class RightStatusBar extends Component {
  static NUM_ROWS = 5

  renderTile = (shape) => {
    if (!shape) {
      return []
    }

    const color = getTileColor(shape)
    const points = []

    if (shape === constants.LINE) {
      points.push({
        x: 0.5,
        y: 2,
      }, {
        x: 1.5,
        y: 2,
      }, {
        x: 2.5,
        y: 2,
      }, {
        x: 3.5,
        y: 2,
      })
    } else if (shape === constants.SQUARE) {
      points.push({
        x: 1.5,
        y: 2.5,
      }, {
        x: 2.5,
        y: 2.5,
      }, {
        x: 1.5,
        y: 1.5,
      }, {
        x: 2.5,
        y: 1.5,
      })
    } else if (shape === constants.TEE) {
      points.push({
        x: 1,
        y: 1.5,
      }, {
        x: 2,
        y: 1.5,
      }, {
        x: 2,
        y: 2.5,
      }, {
        x: 3,
        y: 1.5,
      })
    } else if (shape === constants.LEFT_L) {
      points.push({
        x: 1,
        y: 2.5,
      }, {
        x: 1,
        y: 1.5,
      }, {
        x: 2,
        y: 1.5,
      }, {
        x: 3,
        y: 1.5,
      })
    } else if (shape === constants.RIGHT_L) {
      points.push({
        x: 1,
        y: 1.5,
      }, {
        x: 2,
        y: 1.5,
      }, {
        x: 3,
        y: 1.5,
      }, {
        x: 3,
        y: 2.5,
      })
    } else if (shape === constants.LEFT_Z) {
      points.push({
        x: 1,
        y: 2.5,
      }, {
        x: 2,
        y: 2.5,
      }, {
        x: 2,
        y: 1.5,
      }, {
        x: 3,
        y: 1.5,
      })
    } else if (shape === constants.RIGHT_Z) {
      points.push({
        x: 1,
        y: 1.5,
      }, {
        x: 2,
        y: 1.5,
      }, {
        x: 2,
        y: 2.5,
      }, {
        x: 3,
        y: 2.5,
      })
    }

    return points
      .map(this.convertGridPointToSvgPoint)
      .map((point, i) => <Block key={`${shape}-${i}`} {...point} color={color} />)
  }

  convertGridPointToSvgPoint = ({ x, y }) => ({
    x: 10 * x,
    y: ((RightStatusBar.NUM_ROWS * 10) - 10) - (10 * y), // TODO: move constant?
  })

  render() {
    const tile = this.renderTile(this.props.shape)

    return (
      <div>
        <h5 style={{ textAlign: 'center' }}>Next</h5>
        <svg
          version="1.1"
          baseProfile="full"
          width="100%" height="100%"
          viewBox="0 0 50 50"
          xmlns="http://www.w3.org/2000/svg"
          style={{ alignSelf: 'start' }}
          strokeWidth="1" stroke="rgba(0, 0, 0, 0.5)"
        >

          {/* Background */}
          <rect width="50" height="50" fill="rgba(235, 235, 235, 0.5)" />

          {tile}

        </svg>
      </div>
    )
  }
}


