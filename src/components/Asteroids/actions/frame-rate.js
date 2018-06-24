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

export function pause () {
  return {
    type: constants.PAUSE,
  }
}

export function unpause () {
  return {
    type: constants.UNPAUSE,
  }
}
