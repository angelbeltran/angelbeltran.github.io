export const style = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}
export const EASY = 'EASY'
export const NORMAL = 'NORMAL'
export const HARD = 'HARD'
export const IDEAL_FRAME_RATE = 60
export const SHIP_WIDTH = 3
export const SHIP_HEIGHT = 3.75

// action types
//    initialization
// export const SET_INITIAL_ASTEROIDS = 'actions/SET_INITIAL_ASTEROIDS'
// export const SET_FIRST_POST_INITIALIZATION_ASTEROID_ID = 'actions/SET_FIRST_POST_INITIALIZATION_ASTEROID_ID'

//    ship
export const ADD_SHIP = 'actions/ADD_SHIP'
export const REMOVE_SHIP = 'actions/REMOVE_SHIP'
export const TURN_SHIP = 'actions/TURN_SHIP'
export const ACCELERATE_SHIP = 'actions/ACCELERATE_SHIP'
export const UPDATE_SHIP_POSITIONS = 'actions/UPDATE_SHIP_POSITIONS'

//    asteroid
export const ADD_ASTEROIDS = 'actions/ADD_ASTEROIDS'
export const ROTATE_ASTEROIDS = 'actions/ROTATE_ASTEROIDS'
export const UPDATE_ASTEROID_POSITIONS = 'actions/UPDATE_ASTEROID_POSITIONS'
export const REMOVE_ASTEROID = 'actions/REMOVE_ASTEROID'

// bullet
export const DECREMENT_BULLET_TIMES_TO_LIVE = 'actions/DECREMENT_BULLET_TIMES_TO_LIVE'
export const REMOVE_DEAD_BULLETS = 'actions/REMOVE_DEAD_BULLETS'
export const UPDATE_BULLET_POSITIONS = 'actions/UPDATE_BULLET_POSITIONS'
export const FIRE_BULLET_FROM_SHIP = 'actions/FIRE_BULLET_FROM_SHIP'
export const SET_WEAPON_COOLDOWN = 'actions/SET_WEAPON_COOLDOWN'
export const DECREMENT_SHIP_WEAPON_COOLDOWN = 'actions/DECREMENT_SHIP_WEAPON_COOLDOWN' // TODO: does there need to be an adjust for the frame rate?
export const REMOVE_BULLET = 'actions/REMOVE_BULLET'

//    experience
export const SET_FRAME_RATE = 'actions/SET_FRAME_RATE';
export const RESET = 'actions/RESET';
export const PAUSE = 'actions/PAUSE';
export const UNPAUSE = 'actions/UNPAUSE';

// keys pressed
export const KEY_DOWN = 'actions/KEY_DOWN';
export const KEY_UP = 'actions/KEY_UP';

// game focus
export const GAME_RECEIVED_FOCUS = 'actions/GAME_RECEIVED_FOCUS';
export const GAME_LOST_FOCUS = 'actions/GAME_LOST_FOCUS';

// game mounted?
export const GAME_DID_MOUNT = 'actions/GAME_DID_MOUNT';
export const GAME_WILL_UNMOUNT = 'actions/GAME_WILL_UNMOUNT';

// saving games
export const SAVE_GAME = 'actions/SAVE_GAME';
export const SET_GAME_ID = 'actions/SET_GAME_ID';
export const RESET_STATE = 'actions/RESET_STATE';
export const LOAD_GAME = 'actions/LOAD_GAME';

// touch
export const FIRE_TOUCH_STARTED = 'actions/FIRE_TOUCH_STARTED';
export const FIRE_TOUCH_ENDED = 'actions/FIRE_TOUCH_ENDED';
export const MOVE_TOUCH_STARTED = 'actions/MOVE_TOUCH_STARTED';
export const MOVE_TOUCH_MOVED = 'actions/MOVE_TOUCH_MOVED';
export const MOVE_TOUCH_ENDED = 'actions/MOVE_TOUCH_ENDED';

// logging (particularly for debugging on mobile)
export const LOG = 'actions/LOG';
