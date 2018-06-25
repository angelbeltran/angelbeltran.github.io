//import * as constants from '../constants'


export default {
  // TODO: update state so there may be multiple ships, like with asteroids
  // basic ship properties
  /*
  ship: { // TODO: save the outline of the shape in the state?
    position: {
      x: 50,
      y: 50,
    },
    rotation: 0,
    movement: {
      x: 0,
      y: 0,
    },
    firing: false,
    weaponCooldown: 0,
  },
  */
  ships: {},
  duplicateShips: {},
  nextShipId: 1,
  
  // Map<String(asteroid key), asteroid>
  asteroids: {},
  // Map<String(asteroid key), Array<asteroid>>
  duplicateAsteroids: {}, 
  nextAsteroidId: 1,

  bullets: {},
  nextBulletId: 1,

  frameRate: 1, // TODO: set constants somewhere
  paused: false,

  keysPressed: {},

  gameFocused: true,

  mounted: false,

  savedGames: {},

  touches: {
    fire: {},
    move: {},
  },

  logs: [], // for logging (particularly for debugging mobile)
}
