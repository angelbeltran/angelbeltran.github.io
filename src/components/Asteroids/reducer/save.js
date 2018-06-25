import cloneDeep from 'lodash.clonedeep';
import * as constants from '../constants'
import initialState from './initial-state'

export default function (state = initialState, action) {
  switch (action.type) {

    case constants.SAVE_GAME: {
      let stateWithoutSavedGames = { ...state };
      delete stateWithoutSavedGames.savedGames;
      const nextState = cloneDeep(stateWithoutSavedGames);
      nextState.savedGames = { ...state.savedGames };
      nextState.savedGames[state.id || action.id] = stateWithoutSavedGames; // allow for optional in action id

      return nextState;
    }

    case constants.LOAD_GAME: {
      const nextState = { ...action.state };
      nextState.savedGames = { ...state.savedGames };

      return nextState;
    }

    case constants.SET_GAME_ID: {
      return {
        ...state,
        id: action.id,
      };
    }

    case constants.RESET_STATE: {
      return initialState;
    }

    default:
      return state

  }
}


