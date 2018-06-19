import BaseSprite from './BaseSprite'
import { SHIP_WIDTH, SHIP_HEIGHT } from '../constants'


// TODO: should all sprites just be the Base class?
export default class SpaceShip extends BaseSprite {
  constructor(props) {
    super(props)

    this.state = {
      outline: this.generateOutline(props)
    }
  }
}

SpaceShip.propTypes = BaseSprite.propTypes
SpaceShip.SHIP_WIDTH = SHIP_WIDTH
SpaceShip.SHIP_HEIGHT = SHIP_HEIGHT
// TODO: update this to point to the right like in src/ship.js
SpaceShip.defaultProps = {
  points: [{
    x: -(SHIP_WIDTH / 2),
    y: SHIP_WIDTH / 2,
  }, {
    x: 0,
    y: SHIP_WIDTH / 2 - SHIP_HEIGHT,
  }, {
    x: SHIP_WIDTH / 2,
    y: SHIP_WIDTH / 2,
  }],
}
