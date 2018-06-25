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

export function turnShip (key, value) {
  return {
    type: constants.TURN_SHIP,
    key,
    value,
  };
}

export function accelerateShip (key, value) {
  return {
    type: constants.ACCELERATE_SHIP,
    key,
    value,
  };
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
