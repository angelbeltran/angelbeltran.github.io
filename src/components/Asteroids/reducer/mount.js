import * as constants from '../constants'
import initialState from './initial-state'

export default function (state = initialState, action) {
  switch (action.type) {

    case constants.GAME_DID_MOUNT: {
      if (state.mounted) {
        return state;
      } else {
        return {
          ...state,
          mounted: true,
        };
      }
    }

    case constants.GAME_WILL_UNMOUNT: {
      if (state.mounted) {
        return {
          ...state,
          mounted: false,
        };
      } else {
        return state;
      }
    }

    default:
      return state

  }
}


