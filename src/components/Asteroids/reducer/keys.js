import * as constants from '../constants'
import initialState from './initial-state'

export default function (state = initialState, action) {
  switch (action.type) {

    case constants.KEY_UP: {
      if (action.key && state.keysPressed[action.key]) {
        const keysPressed = { ...state.keysPressed };
        delete keysPressed[action.key];

        console.log('keysPressed:', keysPressed);

        return {
          ...state,
          keysPressed,
        };
      } else {
        return state;
      }
    }

    case constants.KEY_DOWN: {
      if (action.key && !state.keysPressed[action.key]) {
        const keysPressed = { ...state.keysPressed };
        keysPressed[action.key] = true;

        console.log('keysPressed:', keysPressed);

        return {
          ...state,
          keysPressed,
        };
      } else {
        return state;
      }
    }

    default:
      return state

  }
}
