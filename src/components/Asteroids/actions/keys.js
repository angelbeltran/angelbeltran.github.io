import * as constants from '../constants'


export function keyUp (key) {
  return {
    type: constants.KEY_UP,
    key,
  }
}

export function keyDown (key) {
  return {
    type: constants.KEY_DOWN,
    key,
  }
}
