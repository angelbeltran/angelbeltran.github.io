import * as constants from '../constants'
import initialState from './initial-state'


export const FIRE_TOUCH_STARTED = 'actions/FIRE_TOUCH_STARTED';
export const FIRE_TOUCH_ENDED = 'actions/FIRE_TOUCH_ENDED';
export const MOVE_TOUCH_STARTED = 'actions/MOVE_TOUCH_STARTED';
export const MOVE_TOUCH_MOVED = 'actions/MOVE_TOUCH_MOVED';
export const MOVE_TOUCH_ENDED = 'actions/MOVE_TOUCH_ENDED';


export default function (state = initialState, action) {
  switch (action.type) {

    case constants.FIRE_TOUCH_STARTED: {
      return {
        ...state,
        touches: {
          ...state.touches,
          fire: {
            ...state.touches.fire,
            [action.id]: true,
          },
        },
      };
    }

    case constants.FIRE_TOUCH_ENDED: {
      const nextState = {
        ...state,
        touches: {
          ...state.touches,
          fire: {
            ...state.touches.fire,
          },
        },
      };
      delete nextState.touches.fire[action.id];

      return nextState;
    }

    case constants.MOVE_TOUCH_STARTED: {
      return {
        ...state,
        touches: {
          ...state.touches,
          move: {
            ...state.touches.move,
            [action.id]: {
              id: action.id,
              start: action.position,
              position: action.position,
            },
          },
        },
      };
    }

    case constants.MOVE_TOUCH_MOVED: {
      return {
        ...state,
        touches: {
          ...state.touches,
          move: {
            ...state.touches.move,
            [action.id]: {
              ...state.touches.move[action.id],
              position: action.position,
            },
          },
        },
      };
    }

    case constants.MOVE_TOUCH_ENDED: {
      const nextState = {
        ...state,
        touches: {
          ...state.touches,
          move: {
            ...state.touches.move,
          },
        },
      };

      delete nextState.touches.move[action.id];

      return nextState;
    }

    default:
      return state;

  }
}


