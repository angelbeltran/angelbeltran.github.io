import * as constants from '../constants'


export function gameDidMount (id) {
  return {
    type: constants.GAME_DID_MOUNT,
    id,
  };
}

export function gameWillUnmount () {
  return {
    type: constants.GAME_WILL_UNMOUNT,
  };
}
