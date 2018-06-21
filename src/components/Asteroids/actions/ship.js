import * as constants from '../constants'


export function addShip (ship) {
  return {
    type: constants.ADD_SHIP,
    ship,
  }
}

export function removeShip (key) {
  return {
    type: constants.REMOVE_SHIP,
    key,
  }
}

export function turnShip (key, direction) {
  return {
    type: constants.TURN_SHIP,
    key,
    direction,
  }
}

export function accelerateShip (key, direction) {
  return {
    type: constants.ACCELERATE_SHIP,
    key,
    direction,
  }
}

export function updateShipPositions () {
  return {
    type: constants.UPDATE_SHIP_POSITIONS,
  }
}

export function setWeaponCooldown (key, ticks) {
  return {
    type: constants.SET_WEAPON_COOLDOWN,
    key,
    ticks,
  }
}

export function decrementShipWeaponCooldown (key) {
  return {
    type: constants.DECREMENT_SHIP_WEAPON_COOLDOWN,
    key,
  }
}

export function startTurningShip (key, direction) {
  return {
    type: constants.START_TURNING_SHIP,
    key,
    direction,
  }
}

export function stopTurningShip (key, direction) {
  return {
    type: constants.STOP_TURNING_SHIP,
    key,
    direction,
  }
}

export function startAcceleratingShip (key, direction) {
  return {
    type: constants.START_ACCELERATING_SHIP,
    key,
    direction,
  }
}

export function stopAcceleratingShip (key, direction) {
  return {
    type: constants.STOP_ACCELERATING_SHIP,
    key,
    direction,
  }
}

export function startFiringFromShip (key) {
  return {
    type: constants.START_FIRING_FROM_SHIP,
    key,
  }
}

export function stopFiringFromShip (key) {
  return {
    type: constants.STOP_FIRING_FROM_SHIP,
    key,
  }
}
