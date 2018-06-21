import PropTypes from 'prop-types'
import BaseSprite from './BaseSprite'


export default class Bullet extends BaseSprite {
  constructor(props) {
    super(props)

    let points

    if (props.points) {
      points = props.points
    } else {
      points = [{
        x: -0.75,
        y: 0,
      }, {
        x: 0.75,
        y: 0,
      }]
    }

    this.state = {
      outline: this.generateOutline({ points })
    }
  }
}

Bullet.propTypes = {
  ...BaseSprite.propTypes,
  outline: PropTypes.string,
}
