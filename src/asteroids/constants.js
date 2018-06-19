export const style = {
  width: '100%',
  height: '100%',
  //width: '100vw',
  //height: '100vh',
  backgroundColor: 'gray',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}
export const LEFT = 'LEFT'
export const RIGHT = 'RIGHT'
export const FORWARD = 'FORWARD'
export const BACKWARD = 'BACKWARD'
export const EASY = 'EASY'
export const NORMAL = 'NORMAL'
export const HARD = 'HARD'
export const IDEAL_FRAME_RATE = 60
export const SHIP_WIDTH = 3
export const SHIP_HEIGHT = 3.75

// action types
//    initialization
// export const SET_INITIAL_ASTEROIDS = 'action/SET_INITIAL_ASTEROIDS'
// export const SET_FIRST_POST_INITIALIZATION_ASTEROID_ID = 'action/SET_FIRST_POST_INITIALIZATION_ASTEROID_ID'

//    ship
export const ADD_SHIP = 'action/ADD_SHIP'
export const REMOVE_SHIP = 'action/REMOVE_SHIP'
export const TURN_SHIP = 'action/TURN_SHIP'
export const ACCELERATE_SHIP = 'action/ACCELERATE_SHIP'
export const UPDATE_SHIP_POSITIONS = 'action/UPDATE_SHIP_POSITIONS'

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
export const DECREMENT_SHIP_WEAPON_COOLDOWN = 'actions/DECREMENT_SHIP_WEAPON_COOLDOWN'
export const REMOVE_BULLET = 'actions/REMOVE_BULLET'
export const START_TURNING_SHIP = 'actions/START_TURNING_SHIP'
export const STOP_TURNING_SHIP = 'actions/STOP_TURNING_SHIP'
export const START_ACCELERATING_SHIP = 'actions/START_ACCELERATING_SHIP'
export const STOP_ACCELERATING_SHIP = 'actions/STOP_ACCELERATING_SHIP'
export const START_FIRING_FROM_SHIP = 'actions/START_FIRING_FROM_SHIP'
export const STOP_FIRING_FROM_SHIP = 'actions/STOP_FIRING_FROM_SHIP'

//    experience
export const SET_FRAME_RATE = 'actions/SET_FRAME_RATE'
export const RESET = 'actions/RESET'
