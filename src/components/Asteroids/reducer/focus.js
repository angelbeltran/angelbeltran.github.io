import * as constants from '../constants'
import initialState from './initial-state'

export default function (state = initialState, action) {
  switch (action.type) {

    case constants.GAME_RECEIVED_FOCUS: {
      if (state.gameFocused) {
        return state;
      } else {
        console.log('focused');
        return {
          ...state,
          gameFocused: true,
        };
      }
    }

    case constants.GAME_LOST_FOCUS: {
      if (state.gameFocused) {
        console.log('blurred');
        return {
          ...state,
          gameFocused: false,
        };
      } else {
        return state;
      }
    }

    default:
      return state

  }
}

