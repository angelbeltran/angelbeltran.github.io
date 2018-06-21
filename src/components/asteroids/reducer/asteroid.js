import _ from 'lodash'
import initialState from './initial-state'
import * as constants from '../constants'
// import { updateDuplicateAsteroids } from '../duplicate'


export default function (state = initialState, action) {
  switch (action.type) {

    case constants.ADD_ASTEROIDS: {
      let asteroidList = action.asteroids || []
      const nextAsteroidMap = {
        ...state.asteroids,
      }
      let nextState = { ...state }

      for (let i = 0; i < asteroidList.length; i += 1) {
        let asteroid = asteroidList[i]

        if (!asteroid.key) {
          asteroid = {
            ...asteroid,
            key: nextState.nextAsteroidId,
          }
          nextState.nextAsteroidId += 1
        }

        nextAsteroidMap[asteroid.key] = asteroid
      }

      nextState.asteroids = nextAsteroidMap

      return nextState
    }

    case constants.ROTATE_ASTEROIDS: {
      const { asteroids, duplicateAsteroids } = state
      const updatedAsteroids = {}
      const updatedDuplicateAsteroids = {}
      // modify rotation change by difference according to actual frame rate
      const d = constants.IDEAL_FRAME_RATE / state.frameRate

      _.each(asteroids, (asteroid) => {
        updatedAsteroids[asteroid.key] = {
          ...asteroid,
          rotation: asteroid.rotation + (d * asteroid.spin),
        }
      })
      _.each(duplicateAsteroids, (duplicates, key) => {
        _.each(duplicates, (asteroid) => {
          updatedDuplicateAsteroids[key] = updatedDuplicateAsteroids[key] || {}
          updatedDuplicateAsteroids[key][asteroid.key] = {
            ...asteroid,
            rotation: asteroid.rotation + (d * asteroid.spin),
          }
        })
      })

      return {
        ...state,
        asteroids: updatedAsteroids,
        duplicateAsteroids: updatedDuplicateAsteroids,
      }
    }

    case constants.UPDATE_ASTEROID_POSITIONS: {
      // modify movement by according to actual frame rate
      const d = constants.IDEAL_FRAME_RATE / state.frameRate
      const updatedAsteroids = _.mapValues(state.asteroids, (asteroid) => {
        const position = {
          x: asteroid.position.x + (d * asteroid.movement.x),
          y: asteroid.position.y - (d * asteroid.movement.y),
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

        return {
          ...asteroid,
          position,
        }
      })

      return {
        ...state,
        asteroids: updatedAsteroids,
      }
    }

  /*
    case constants.UPDATE_ASTEROID_POSITIONS: {
      const { asteroids, duplicateAsteroids } = state
      const updatedAsteroids = {}
      const updatedDuplicateAsteroids = {}

      _.each(asteroids, (asteroid, key) => {
        // update asteroid's position
        let updatedAsteroid = {
          ...asteroid,
          position: {
            x: asteroid.position.x + asteroid.movement.x,
            y: asteroid.position.y - asteroid.movement.y,
          },
        }

        // create/update duplicate ships or replace the ship with a duplicate ship, if needed
        let updatedDuplicateAsteroids2
        ({ asteroid: updatedAsteroid, duplicateAsteroids: updatedDuplicateAsteroids2 } = updateDuplicateAsteroids(updatedAsteroid, duplicateAsteroids))

        updatedAsteroids[key] = updatedAsteroid
        updatedDuplicateAsteroids[key] = updatedDuplicateAsteroids2
      })

      return {
        ...state,
        asteroids: updatedAsteroids,
        duplicateAsteroids: updatedDuplicateAsteroids,
      }
    }
  */

    case constants.REMOVE_ASTEROID: {
      const nextAsteroids = { ...state.asteroids }

      delete nextAsteroids[action.key]

      return {
        ...state,
        asteroids: nextAsteroids,
      }
    }


    default:
      return state

  }
}
