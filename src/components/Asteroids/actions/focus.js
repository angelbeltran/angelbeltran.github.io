import * as constants from '../constants'


export function gameReceivedFocus () {
  return {
    type: constants.GAME_RECEIVED_FOCUS,
  };
}

export function gameLostFocus () {
  return {
    type: constants.GAME_LOST_FOCUS,
  };
}
