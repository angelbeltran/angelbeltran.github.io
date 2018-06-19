import * as constants from '../constants'


export function setFrameRate (rate) {
  return {
    type: constants.SET_FRAME_RATE,
    rate,
  }
}

export function reset () {
  return {
    type: constants.RESET,
  }
}
