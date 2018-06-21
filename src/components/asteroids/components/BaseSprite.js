import React, { Component } from 'react';
import PropTypes from 'prop-types'

export const vectorPropType = PropTypes.shape({
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
})


export default class BaseSprite extends Component {
  // simply connects all the points together into
  // a path string for an svg path
  // by generating only when the outline is being
  // updated, we save a lot of computation
  generateOutline = ({ points } = this.props) => {
    const s = points.map((pos) => `${pos.x} ${pos.y}`)

    s[0] = `M ${s[0]}`
    for (let i = 1; i < s.length; i += 1) {
      s[i] = `L ${s[i]}`
    }
    s.push('z')

    return s.join(' ')
  }

  // returns outline in the state,
  // otherwise outline in props,
  // otherwise just draws a cube :P.
  // overwrite for a custom behavior
  getOutline = () => {
    if (this.state.outline) {
      return this.state.outline
    } else if (this.props.outline) {
      return this.props.outline
    }

    let d = ''

    d += ` M -5 -5`
    d += ` l 10 0`
    d += ` l 0 10`
    d += ` l -10 0`
    d += ` z`

    return d
  }

  getTransform = () => {
    const { position: { x, y }, rotation } = this.props
    let transform = `translate(${x} ${y}) rotate(${rotation})`

    if (this.props.scale) {
      transform = `${transform} scale(${this.props.scale} ${this.props.scale})`
    }

    return transform
  }

  render() {
    return (
      <path
        d={this.getOutline()}
        vectorEffect="non-scaling-stroke"
        fill="transparent"
        stroke="white"
        strokeWidth={0.5}
        transform={this.getTransform()}
      >
      </path>
    )
  }
}

BaseSprite.propTypes = {
  position: vectorPropType,
  rotation: PropTypes.number.isRequired,
  outline: PropTypes.string,
  scale: PropTypes.number,
}
BaseSprite.defaultProps = {
  outline: '',
  scale: 1,
}
