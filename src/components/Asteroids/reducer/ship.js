import _ from 'lodash'
import * as constants from '../constants'
import initialState from './initial-state'
// import { getStandardShipAngle } from '../vector'
// import { updateDuplicateShips } from '../duplicate'


// TODO: update to use the target frame rate state

export default function (state = initialState, action) {
  switch (action.type) {

    case constants.ADD_SHIP: {
      const nextState = { ...state }
      let ship = action.ship

      if (!ship.key) {
        ship = {
          ...ship,
          key: nextState.nextShipId,
        }
        nextState.nextShipId += 1
      }

      nextState.ships[ship.key] = ship

      return nextState
    }

    case constants.REMOVE_SHIP: {
      const nextShips = {
        ...state.ships
      }

      delete nextShips[action.key]

      return {
        ...state,
        ships: nextShips,
      }
    }

    case constants.TURN_SHIP: {
      const key = action.key
      const ship = state.ships[key]
      let da = 3 * action.value;

      // modify for the target frame rate
      da *= (constants.IDEAL_FRAME_RATE / state.frameRate)

      return {
        ...state,
        ships: {
          ...state.ships,
          [key]: {
            ...ship,
            rotation: ship.rotation + da,
          },
        },
      }
    }

    case constants.ACCELERATE_SHIP: {
      const key = action.key
      const ship = state.ships[key]
      const dr = 0.01 * action.value;
      const angle = (Math.PI * ship.rotation) / 180

      let dx = dr * Math.cos(angle)
      let dy = - (dr * Math.sin(angle))

      // modify for the target frame rate
      dx *= (constants.IDEAL_FRAME_RATE / state.frameRate)
      dy *= (constants.IDEAL_FRAME_RATE / state.frameRate)

      const x = ship.movement.x + dx
      const y = ship.movement.y + dy

      return {
        ...state,
        ships: {
          ...state.ships,
          [key]: {
            ...ship,
            movement: {
              ...ship.movement,
              x,
              y,
            },
          },
        },
      }
    }

    case constants.UPDATE_SHIP_POSITIONS: {
      const updatedShips = _.mapValues(state.ships, (ship) => {
        let dx = ship.movement.x
        let dy = -ship.movement.y

        // modify for the target frame rate
        dx *= (constants.IDEAL_FRAME_RATE / state.frameRate)
        dy *= (constants.IDEAL_FRAME_RATE / state.frameRate)

        const position = {
          x: ship.position.x + dx,
          y: ship.position.y + dy,
        }

        // swap asteroids that have are drifting off the map to the other side
        if (position.x > 100) {
          position.x -= 100
        } else if (position.x < 0) {
          position.x += 100
        }

        if (position.y > 100) {
          position.y -= 100
        } else if (position.y < 0) {
          position.y += 100
        }

        // update ship's position
        return {
          ...ship,
          position,
        }
      })

      return {
        ...state,
        ships: updatedShips,
      }
    }

    case constants.SET_WEAPON_COOLDOWN: {
      const key = action.key
      const ship = state.ships[key]

      return {
        ...state,
        ships: {
          ...state.ships,
          [key]: {
            ...ship,
            weaponCooldown: action.ticks,
          },
        },
      }
    }

    case constants.DECREMENT_SHIP_WEAPON_COOLDOWN: {
      const key = action.key
      const ship = state.ships[key]
      // number of ticks passed should be relative to the target frame rate
      const ticks = (constants.IDEAL_FRAME_RATE / state.frameRate)

      return {
        ...state,
        ships: {
          ...state.ships,
          [key]: {
            ...ship,
            weaponCooldown: ship.weaponCooldown - ticks,
          },
        },
      }
    }

    default:
      return state

  }
}
