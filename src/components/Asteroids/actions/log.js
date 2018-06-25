import * as constants from '../constants'


export function log (log) {
  return {
    type: constants.LOG,
    log,
  };
}
