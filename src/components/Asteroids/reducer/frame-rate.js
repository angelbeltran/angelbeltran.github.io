import * as constants from '../constants'
import initialState from './initial-state'

export default function (state = initialState, action) {
  switch (action.type) {

    case constants.SET_FRAME_RATE: {
      return {
        ...state,
        frameRate: action.rate,
      }
    }

    case constants.RESET: {
      return initialState;
    }

    case constants.PAUSE: {
      if (state.paused) {
        return state;
      } else {
        return {
          ...state,
          paused: true,
        };
      }
    }

    case constants.UNPAUSE: {
      if (state.paused) {
        return {
          ...state,
          paused: false,
        };
      } else {
        return state;
      }
    }

    default:
      return state

  }
}
