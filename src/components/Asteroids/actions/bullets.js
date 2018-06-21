import * as constants from '../constants'

export function decrementBulletTimesToLive () {
  return {
    type: constants.DECREMENT_BULLET_TIMES_TO_LIVE,
  }
}

export function removeDeadBullets () {
  return {
    type: constants.REMOVE_DEAD_BULLETS,
  }
}

export function updateBulletPositions () {
  return {
    type: constants.UPDATE_BULLET_POSITIONS,
  }
}

export function fireBulletFromShip (key) {
  return {
    type: constants.FIRE_BULLET_FROM_SHIP,
    key,
  }
}

export function removeBullet (key) {
  return {
    type: constants.REMOVE_BULLET,
    key,
  }
}
