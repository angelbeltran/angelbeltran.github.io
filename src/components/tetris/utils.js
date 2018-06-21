import * as constants from './constants'


export function getTileColor (shape) {
  switch (shape) {
    case constants.LINE:
      return 'gray'
    case constants.SQUARE:
      return 'yellow'
    case constants.TEE:
      return 'red'
    case constants.LEFT_L:
      return 'green'
    case constants.RIGHT_L:
      return 'blue'
    case constants.LEFT_Z:
      return 'cyan'
    case constants.RIGHT_Z:
      return 'pink'
    default:
      return 'black'
  }
}
