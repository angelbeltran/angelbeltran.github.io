import * as constants from '../constants'


export function addAsteroids (asteroids) {
  return {
    type: constants.ADD_ASTEROIDS,
    asteroids: Array.isArray(asteroids) ? asteroids : [asteroids],
  }
}

export function rotateAsteroids () {
  return {
    type: constants.ROTATE_ASTEROIDS,
  }
}

export function updateAsteroidPositions () {
  return {
    type: constants.UPDATE_ASTEROID_POSITIONS,
  }
}

export function removeAsteroid (key) {
  return {
    type: constants.REMOVE_ASTEROID,
    key,
  }
}
