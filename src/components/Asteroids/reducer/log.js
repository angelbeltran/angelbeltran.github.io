import * as constants from '../constants'
import initialState from './initial-state'

export default function (state = initialState, action) {
  switch (action.type) {

    case constants.LOG: {
      let logs = state.logs.concat(`${action.log}`);
      if (logs.length > 30) {
        logs.shift();
      }

      return {
        ...state,
        logs,
      };
    }

    default:
      return state

  }
}


