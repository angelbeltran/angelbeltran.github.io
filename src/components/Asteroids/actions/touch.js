import * as constants from '../constants'


export function fireTouchStarted (id) {
  return {
    type: constants.FIRE_TOUCH_STARTED,
    id,
  };
}

export function fireTouchEnded (id) {
  return {
    type: constants.FIRE_TOUCH_ENDED,
    id,
  };
}

export function moveTouchStarted (id, position) {
  return {
    type: constants.MOVE_TOUCH_STARTED,
    id,
    position,
  };
}

export function moveTouchMoved (id, position) {
  return {
    type: constants.MOVE_TOUCH_MOVED,
    id,
    position,
  };
}

export function moveTouchEnded (id) {
  return {
    type: constants.MOVE_TOUCH_ENDED,
    id,
  };
}
