import shipReducer from './ship'
import asteroidReducer from './asteroid'
import bulletReducer from './bullet'
import frameRateReducer from './frame-rate'


function composeReducers(...reducers) {
  return reducers.reduce((f, g) =>
    (state, action) => g(f(state, action), action)
  )
}

export default composeReducers(
  shipReducer,
  asteroidReducer,
  bulletReducer,
  frameRateReducer,
)
