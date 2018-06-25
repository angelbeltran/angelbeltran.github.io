import shipReducer from './ship';
import asteroidReducer from './asteroid';
import bulletReducer from './bullet';
import frameRateReducer from './frame-rate';
import keysReducer from './keys';
import focusReducer from './focus';
import mountReducer from './mount';
import saveReducer from './save';


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
  keysReducer,
  focusReducer,
  mountReducer,
  saveReducer,
);
