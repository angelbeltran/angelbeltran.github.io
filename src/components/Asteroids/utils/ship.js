import { SHIP_WIDTH, SHIP_HEIGHT } from '../constants'


export default function createShip (
  { x: posX = 50, y: posY = 50 } = {},
  rotation = -90,
  { x: moveX = 0, y: moveY = 0 } = {},
) {
  const points = [{ // front
    x: SHIP_HEIGHT - (SHIP_WIDTH / 2),
    y: 0,
  }, { // back left
    x: -(SHIP_WIDTH / 2),
    y: -(SHIP_WIDTH / 2),
  }, { // back right
    x: -(SHIP_WIDTH / 2),
    y: SHIP_WIDTH / 2,
  }]

  return { // TODO: save the outline of the shape in the state?
    position: {
      x: posX,
      y: posY,
    },
    rotation,
    points,
    scale: 1,
    movement: {
      x: moveX,
      y: moveY,
    },
    firing: false,
    weaponCooldown: 0,
  }
}
