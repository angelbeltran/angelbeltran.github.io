import * as constants from '../constants'


export function saveGame (id) {
  return {
    type: constants.SAVE_GAME,
    id,
  };
}

export function loadGame (state) {
  return {
    type: constants.LOAD_GAME,
    state,
  };
}

export function setGameId (id) {
  return {
    type: constants.SET_GAME_ID,
    id,
  };
}

export function resetState () {
  return {
    type: constants.RESET_STATE,
  };
}
