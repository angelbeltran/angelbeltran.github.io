import _ from 'lodash'
import { delay } from 'redux-saga'
import { select, put, take, takeEvery, call, fork, spawn, cancel, cancelled } from 'redux-saga/effects'
import * as constants from './constants'
import {
  addShip,
  removeShip,
  turnShip,
  accelerateShip,
  updateShipPositions,
  setWeaponCooldown,
  decrementShipWeaponCooldown,
} from './actions/ship'
import {
  addAsteroids,
  rotateAsteroids,
  updateAsteroidPositions,
  removeAsteroid,
} from './actions/asteroids'
import {
  decrementBulletTimesToLive,
  removeDeadBullets,
  updateBulletPositions,
  fireBulletFromShip,
  removeBullet,
} from './actions/bullets'
import {
  setFrameRate,
  reset,
  pause,
  unpause,
} from './actions/frame-rate'
import {
  keyDown,
  keyUp,
} from './actions/keys';
import createShip from './utils/ship'
import createAsteroid from './utils/asteroid'
import {
  checkForCollisionBetweenShipAndAsteroids,
  checkForCollisionBetweenBulletAndAsteroids,
} from './utils/collision'
// import checkForCollisions from './collision'


// TODO: remove the ship.firing, ship.turning, etc. props once we can

export default function* root (difficulty = constants.NORMAL) {
  let gameTask

  yield fork(handlePauseAndResetClicks); // can't have reset click watcher be reset along with the watcher, else a continuous loop of resets will occur while holding the r button

  do {
    if (gameTask) {
      yield cancel(gameTask)
    }
    gameTask = yield fork(bootup, difficulty)
  } while (yield take(constants.RESET))
}

export function* bootup (difficulty = constants.NORMAL) {
  yield put(setFrameRate(constants.IDEAL_FRAME_RATE))

  yield fork(clock)

  yield fork(watchKeys);

  yield call(initializeAsteroids, difficulty)

  yield fork(initializeShip)
}

export function* initializeAsteroids (difficulty = constants.NORMAL) {
  let numOfAsteroids = getNumberOfInitialAsteroids(difficulty)

  const asteroids = []
  for (let i = 0; i < numOfAsteroids; i += 1) {
    asteroids.push(createAsteroid())
  }

  yield put(addAsteroids(asteroids))
}

export function* initializeShip (...args) {
  const newShip = createShip(...args)
  yield call(addShipWhenSafe, newShip)
}

export function* addShipWhenSafe (ship) {
  const dummyShip = {
    ...ship,
    scale: 5 * ship.scale,
  }
  let asteroids = yield select((s) => _.values(s.asteroids))

  while (yield call(checkForCollisionBetweenShipAndAsteroids, dummyShip, asteroids)) {
  // while (yield call(checkForCollisions, dummyShip, asteroids)) {
    yield call(delay, 1000)
    asteroids = yield select((s) => _.values(s.asteroids))
  }

  yield put(addShip(ship))
}

export function* clock () {
  const intervalLength = yield select((s) => 1000 / s.frameRate)
  let outerResolve
  let intervalOccured

  function createIntervalPromise () {
    intervalOccured = new Promise((resolve) => {
      outerResolve = () => resolve(true)
    })
  }
  createIntervalPromise()

  // mechanism for defining when the next tick will be.
  // the time is variable to help with slower browsers/complexity
  let nextTick

  function setNextTick (ms) {
    nextTick = setTimeout(() => {
      outerResolve()
    }, ms)
  }

  setNextTick(intervalLength);

  let spawnedTasks = [];

  const dummyTimeStamp = Date.now()
  const numTimeStampsInHistory = 10
  const timeStamps = []
  for (let i = 0; i < numTimeStampsInHistory; i += 1) {
    timeStamps.push(dummyTimeStamp)
  }

  try {
    while (yield intervalOccured) {
      createIntervalPromise()
      setNextTick(intervalLength)
      const tasks = yield call(tick);
      if (tasks.length) {
        spawnedTasks = spawnedTasks.filter(t => t.isRunning()).concat(tasks);
      }

      const oldestTimeStamp = timeStamps.shift()
      const currentTimeStamp = Date.now()
      const diff = (currentTimeStamp - oldestTimeStamp) / numTimeStampsInHistory

      timeStamps.push(currentTimeStamp)

      const approxFrameRate = 1000 / diff
      const targetFrameRate = yield select((s) => s.frameRate)

      if ((Math.abs(targetFrameRate - approxFrameRate) / targetFrameRate) > 0.2) {
        //console.log('new target frame rate:', approxFrameRate)
        yield put(setFrameRate(approxFrameRate))
      }
    }
  } finally {
    clearTimeout(nextTick);
    for (let i = 0; i < spawnedTasks.length; i += 1) {
      yield cancel(spawnedTasks[i]);
    }
  }
}

export function* tick () {
  let tasks = [];

  try {
    if (yield select(s => s.paused)) {
      // if paused. not much to do
      return;
    }

    yield call(updateMovements)

    yield call(updatePositions)

    yield call(updateRotations)

    const restartShipTask = yield call(handleCollisions);
    if (restartShipTask) {
      tasks.push(restartShipTask);
    }

    yield call(handleBulletLifecycle)

    yield call(handleWeaponEvents)
  } finally {
    if (yield cancelled()) {
      for (let i = 0; i < tasks.length; i += 1) {
        yield cancel(tasks[i]);
      }
    }

    return tasks;
  }
}

export function* updateMovements () {
  const ships = yield select(s => s.ships);
  const shipIds = _.map(ships, (ship, key) => key);
  const keysPressed = yield select(s => s.keysPressed);
  const paused = yield select(s => s.paused);

  if (!paused) {
    for (let i = 0; i < shipIds.length; i += 1) {
      const id = shipIds[i];
      if (keysPressed.ArrowLeft) {
        yield put(turnShip(id, constants.LEFT));
      }
      if (keysPressed.ArrowRight) {
        yield put(turnShip(id, constants.RIGHT));
      }
      if (keysPressed.ArrowUp) {
        yield put(accelerateShip(id, constants.FORWARD));
      }
      if (keysPressed.ArrowDown) {
        yield put(accelerateShip(id, constants.BACKWARD));
      }
    }
  }
}

export function* updatePositions () {
  yield put(updateShipPositions())
  yield put(updateAsteroidPositions())
  yield put(updateBulletPositions())
}

export function* updateRotations () {
  yield put(rotateAsteroids())
}

export function* handleCollisions () {
  let restartShipTask;

  const ships = yield select((s) => _.values(s.ships))
  const asteroids = yield select((s) => _.values(s.asteroids))

  for (let i = 0, ship = ships[i]; i < ships.length; i += 1, ship = ships[i]) {
    if (yield call(checkForCollisionBetweenShipAndAsteroids, ship, asteroids)) {
      restartShipTask = yield spawn(restartShip, ship.key)
    }
  }

  const bullets = yield select((s) => _.values(s.bullets))

  for (let i = 0, bullet = bullets[i]; i < bullets.length; i += 1, bullet = bullets[i]) {
    const asteroid = yield call(checkForCollisionBetweenBulletAndAsteroids, bullet, asteroids)

    if (asteroid) {
      yield put(removeBullet(bullet.key))
      yield call(destroyAsteroid, asteroid)
    }
  }

  return restartShipTask;
}

export function* restartShip (key) {
  // remove ship
  // wait 5 seconds
  // create new ship at starting location
  yield put(removeShip(key))
  yield call(delay, 3000)
  const newShip = createShip()
  yield call(addShipWhenSafe, newShip)
}

export function* destroyAsteroid (asteroid) {
  // remove asteroid
  // TODO
  // if of minimum threshold scale, create smaller asteroids
  //    reduced scale
  //    velocity dependent on:
  //      velocity & rotation speed of parent asteroid
  //      velocity of bullet
  //      size of new asteroid in relation to siblings
  //    sum of cubes of child asteroids equals cude of parent, minus ~20%
  //    minimum of two asteroids
  yield put(removeAsteroid(asteroid.key))

  function sphericalVolume (radius) {
    return (4 * Math.PI * Math.pow(radius, 3)) / 3
  }
  function radiusOfSphere (volume) {
    return Math.cbrt((3 * volume) / (4 * Math.PI))
  }

  if (asteroid.scale > 1.25) { // TODO: save constant
    // const approxVolumeOfAsteroid = Math.pow(asteroid.scale, 3)
    const approxVolumeOfAsteroid = sphericalVolume(asteroid.scale)
    const volumeOfSizableDebris = approxVolumeOfAsteroid * 0.8
    const minimumChildAsteroidScale = asteroid.scale > 5 ? asteroid.scale / 4 : 1.25
    let remainingVolume = volumeOfSizableDebris
    //const volumeOfUnitSphere = 4.19
    const volumeOfDoubleUnitSphere = 33.51
    const newAsteroids = []

    // at least make two pieces half the scale/max radius of the original
    newAsteroids.push({
      scale: 2 * asteroid.scale / 3
    }, {
      scale: 2 * asteroid.scale / 3,
    })

    remainingVolume *= (11 / 27)

    while (remainingVolume > 0) {
      let scale

      if (remainingVolume > volumeOfDoubleUnitSphere) {
        const maxScale = radiusOfSphere(remainingVolume)
        scale = (Math.random() * (maxScale - minimumChildAsteroidScale)) + minimumChildAsteroidScale
        const volume = sphericalVolume(scale)
        remainingVolume -= volume
      // } else if (remainingVolume > volumeOfUnitSphere) {
      } else {
        scale = radiusOfSphere(remainingVolume)
        remainingVolume = 0
      }

      newAsteroids.push({
        scale,
      })
    }

    const totalWidthOfChildAsteroids = newAsteroids.reduce((total, newsteroid) => {
      return total + (2 * newsteroid.scale)
    }, 0)
    const radiansPerUnitWidth = (2 * Math.PI) / totalWidthOfChildAsteroids
    let totalDisplacement = 0
    const angularDisplacements = []
    for (let i = 0; i < newAsteroids.length; i += 1) {
      const width = newAsteroids[i].scale
      const radians = radiansPerUnitWidth * width
      angularDisplacements.push(totalDisplacement)
      totalDisplacement += radians
    }

    let largestScale = 0
    let smallestScale = 0
    for (let i = 0; i < newAsteroids.length; i += 1) {
      if (largestScale < newAsteroids[i].scale) {
        largestScale = newAsteroids[i].scale
      }
      if (smallestScale > newAsteroids[i].scale) {
        smallestScale = newAsteroids[i].scale
      }
    }
    const range = largestScale - smallestScale
    const radii = newAsteroids.map(({ scale }) => 
      ((scale - smallestScale) * asteroid.scale) / range
    )

    for (let i = 0; i < newAsteroids.length; i += 1) {
      const angle = angularDisplacements[i]
      const radius = radii[i]
      const position = {
        x: asteroid.position.x + (radius * Math.cos(angle)),
        y: asteroid.position.y + (radius * Math.cos(angle)),
      }

      newAsteroids[i].position = position
    }

    // TODO: specify their velocity, etc.

    const completeAsteroids = newAsteroids.map(createAsteroid)
    yield put(addAsteroids(completeAsteroids))
  }
}

export function* handleBulletLifecycle() {
  yield put(decrementBulletTimesToLive())
  yield put(removeDeadBullets())
}

export function* handleWeaponEvents () {
  const ships = yield select((s) => _.values(s.ships))
  const keysPressed = yield select(s => s.keysPressed);

  for (let i = 0, ship = ships[i]; i < ships.length; i += 1, ship = ships[i]) {
    if (ship.weaponCooldown <= 0 && keysPressed[' ']) {
      yield put(fireBulletFromShip(ship.key))
      yield put(setWeaponCooldown(ship.key, 20)) // TODO: save constant somewhere
    } else if (ship.weaponCooldown > 0) {
      yield put(decrementShipWeaponCooldown(ship.key))
    }
  }
}

function* watchKeys () {
  let actionList;
  let actionOccured;

  let waitForNextAction;
  function setUpForNextAction() {
    waitForNextAction = new Promise(resolve => {
      actionOccured = () => resolve(true);
    });
    actionList = [];
  }
  setUpForNextAction();

  function onKeyDown (e) {
    actionList.push(keyDown(e.key));
    actionOccured();
  }
  function onKeyUp (e) {
    actionList.push(keyUp(e.key));
    actionOccured();
  }

  try {
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    while (yield waitForNextAction) {
      for (let i = 0; i < actionList.length; i += 1) {
        yield put(actionList[i]);
      }
      setUpForNextAction();
    }
  } finally {
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
  }
}

export function* handlePauseAndResetClicks() {
  const keysPressed = yield select(s => s.keysPressed);
  let rWasUp = !keysPressed.r;
  let pWasUp = !keysPressed.p;

  yield takeEvery([constants.KEY_DOWN, constants.KEY_UP], function* (action) {
    const key = action.key;

    if (action.type === constants.KEY_DOWN) {
      if (key === 'r' && rWasUp) {
        rWasUp = false;
        yield put(reset());
      } else if (key === 'p' && pWasUp) {
        pWasUp = false;

        if (yield select(s => s.paused)) {
          yield put(unpause());
        } else {
          yield put(pause());
        }
      }
    } else {
      if (key === 'r') {
        rWasUp = true;
      } else if (key === 'p') {
        pWasUp = true;
      }
    }
  });
}


function getNumberOfInitialAsteroids (difficulty = constants.NORMAL) {
  let numOfAsteroids = 5

  if (difficulty === constants.EASY) {
    numOfAsteroids = 3
  } else if (difficulty === constants.HARD) {
    numOfAsteroids = 7
  }

  return numOfAsteroids
}
