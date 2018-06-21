import _ from 'lodash'
import { ascending, descending } from './sort'
import {
  rotate,
  scale,
  translate,
  difference,
  dot,
  normal,
  unit,
} from './vector'


/*
 * GAME PLAN
 *
 * Get three triangles (or four) whose sides most closely point to the center
 * of the ship.
 *    Get the center of the ship.
 *    Get the center of the polygon/asteroid.
 *    Get the outer points of the polygon. (absolute points)
 *      Rotate
 *      Scale
 *      Translate
 *    Get the vector connecting the polygon center to the ship center.
 *    Get the unit vectors directing the polygon center to the outer polygon points.
 *    Get the dot products of each of the previous vectors with the center connecting line, respectively.
 *    The four sides with largest dot products (five in case of a tie for fourth) surround the three triangles (or four) that are on the side facing the ship.
 *      Aggregate the each dot product data point with the associated triangle
 *    Create triangle objects out of each four (of five) sides
 *      Each triangle is a triple with the center as the ship and two consecutive polygon points as points
 *
 * Check that there is a line between each triangle and the ship S.
 *    For each triangle T:
 *      For each side s:
 *        Get the unit normal vector, u_i, from the midpoint of s pointing outward from T.
 *        Project all points p_i, q_i of T and S onto the axis parallel to u_i.
 *        If min{p_i}, max{p_i} < min{q_i}:
 *          A line l_i parallel to u_i exists between T and S
 *        Else if min{q_i}, max{q_i} < min{p_i}:
 *          A line l_i parallel to u_i exists between T and S
 *        Else
 *          No line l_i parallel to u_i exists between T and S
 *      If a line l_i exists for any side s:
 *        Continue with the next triangle.
 *      Else
 *        For each side s of S:
 *          Get the unit normal vector, u_i, from the midpoint of s pointing outward from S.
 *          Project all points p_i, q_i of T and S onto the axis parallel to u_i.
 *          If min{p_i}, max{p_i} < min{q_i}:
 *            A line l_i parallel to u_i exists between T and S
 *          Else if min{q_i}, max{q_i} < min{p_i}:
 *            A line l_i parallel to u_i exists between T and S
 *          Else
 *            No line l_i parallel to u_i exists between T and S
 *        If a line l_i exists for any side s:
 *          Continue with the next triangle.
 *        Else
 *          No line exists between T and S. A collision occured. Stop here.
 *    Stop here. There is a line between each triangle and S. No collision occured.
 *
 */

// TODO: move these to a constants file
const SCREEN_WIDTH = 100
const SCREEN_HEIGHT = 100

export function checkForCollisionBetweenShipAndAsteroids (ship, asteroids) {
  const numTriangles = 3
  const collisionCheck = checkForCollisionAmongstTriangles

  return checkForCollision(ship, asteroids, collisionCheck, numTriangles)
}

export function checkForCollisionBetweenBulletAndAsteroids (bullet, asteroids) {
  const numTriangles = 2
  const collisionCheck = checkForCollisionBetweenTriangleAndLine

  return checkForCollision(bullet, asteroids, collisionCheck, numTriangles)
}

function checkForCollision (entity, asteroids, collisionCheck, numTriangles) {
  const mirrorAsteroids = getMirrorAsteroids(asteroids)

  return _.values(asteroids).concat(mirrorAsteroids).reduce((asteroidCollidedWith, asteroid) => {
    if (asteroidCollidedWith) {
      return asteroidCollidedWith
    } else if (checkForCollisionBetweenEntityAndAsteroid(entity, asteroid, collisionCheck, numTriangles)) {
      return asteroid
    }
    return undefined
  }, false)
}

function getMirrorAsteroids (asteroids) {
  return asteroids.reduce((mirrors, asteroid) => {
    let hMirror
    if (asteroid.position.x - asteroid.scale <= 0) {
      hMirror = {
        x: asteroid.position.x + 100,
        y: asteroid.position.y,
      }
    } else if (asteroid.position.x + asteroid.scale >= SCREEN_WIDTH) {
      hMirror = {
        x: asteroid.position.x - 100,
        y: asteroid.position.y,
      }
    }

    let vMirror
    if (asteroid.position.y - asteroid.scale <= 0) {
      vMirror = {
        x: asteroid.position.x,
        y: asteroid.position.y + 100,
      }
    } else if (asteroid.position.y + asteroid.scale >= SCREEN_HEIGHT) {
      vMirror = {
        x: asteroid.position.x,
        y: asteroid.position.y - 100,
      }
    }

    let dMirror
    if (hMirror && vMirror) {
      dMirror = {
        x: hMirror.x,
        y: vMirror.y,
      }
    }

    if (hMirror) {
      mirrors.push({
        ...asteroid,
        position: hMirror,
      })
    }
    if (vMirror) {
      mirrors.push({
        ...asteroid,
        position: vMirror,
      })
    }
    if (dMirror) {
      mirrors.push({
        ...asteroid,
        position: dMirror,
      })
    }

    return mirrors
  }, [])
}

function checkForCollisionBetweenEntityAndAsteroid (entity, asteroid, collisionCheck, numTriangles = 3) {
  if (!roughCheckForCollision(entity, asteroid)) {
    return false
  }

  const asteroidTrianglesClosestToEntity = getAsteroidTrianglesClosestToPoint(asteroid, entity.position, numTriangles)
  const entityPoints = getAbsolutePoints(entity)
  //console.log(entity.points, entityPoints)  // PASS

  return asteroidTrianglesClosestToEntity.reduce((collision, triangle) => collision || collisionCheck(triangle, entityPoints), false)
}

// PASS
function roughCheckForCollision (a, b) {
  const aMinX = a.position.x - a.scale
  const aMaxX = a.position.x + a.scale
  const aMinY = a.position.y - a.scale
  const aMaxY = a.position.y + a.scale
  const bMinX = b.position.x - b.scale
  const bMaxX = b.position.x + b.scale
  const bMinY = b.position.y - b.scale
  const bMaxY = b.position.y + b.scale

  return !(
    aMinX > bMaxX ||
    bMinX > aMaxX ||
    aMinY > bMaxY ||
    bMinY > aMaxY
  )
}

function getAsteroidTrianglesClosestToPoint(asteroid, point, numTriangles) {
  const asteroidRotationInRadians = (Math.PI * asteroid.rotation) / 180
  const asteroidPoints = _.map(asteroid.points, (point) => rotate(point, asteroidRotationInRadians))
    .map((point) => scale(point, asteroid.scale))
    .map((point) => translate(point, asteroid.position))
  //console.log(asteroid.points, asteroidPoints)  // TEST

  const centerConnectingVector = difference(point, asteroid.position)
  const asteroidCenterToPointUnitVectors = asteroidPoints.map((point) => unit(difference(point, asteroid.position)))
  const dotProducts = asteroidCenterToPointUnitVectors.map((vector) => dot(centerConnectingVector, vector))

  const pointDotProductData = asteroidPoints.map((point, i) => ({
    point,
    dotProduct: dotProducts[i],
  })).sort((dataA, dataB) => descending(dataA.dotProduct, dataB.dotProduct))
  const maximalDotProductData = pointDotProductData.slice(0, numTriangles + 1)
  if (pointDotProductData[numTriangles].dotProduct === pointDotProductData[numTriangles + 1].dotProduct) {
    maximalDotProductData.push(pointDotProductData[numTriangles + 1])
  }
  const unorderedMaximalDotProductData = asteroidPoints.map((point) => {
    return maximalDotProductData.find((data) => data.point.x === point.x && data.point.y === point.y) && point
  })
  let gap = -1
  for (let gapFound = false; !gapFound; gap += 1) {
    if (!unorderedMaximalDotProductData[gap + 1]) {
      gapFound = true
    }
  }
  for (let i = 0; i < gap; i += 1) {
    unorderedMaximalDotProductData.push(unorderedMaximalDotProductData.shift())
  }
  const orderedMaximalDotProductData = unorderedMaximalDotProductData
    .filter((data) => data)
  const asteroidTrianglesClosestToPoint = []
  for (let i = 0; i < orderedMaximalDotProductData.length - 1; i += 1) {
    asteroidTrianglesClosestToPoint.push([
      asteroid.position,
      orderedMaximalDotProductData[i],
      orderedMaximalDotProductData[i + 1]
    ])
  }
  //console.log(asteroidTrianglesClosestToPoint) // TEST

  return asteroidTrianglesClosestToPoint
}

function getAbsolutePoints (entity) {
  const rotationInRadians = (Math.PI * entity.rotation) / 180
  return _.map(entity.points, (point) => rotate(point, rotationInRadians))
    .map((point) => scale(point, entity.scale))
    .map((point) => translate(point, entity.position))
}

function checkForCollisionAmongstTriangles (triangle, ship) {
  //return !checkForSeparatingLine(triangle, ship)
  return !checkForSeparatingLineBetweenTriangles(triangle, ship)
}

//function checkForSeparatingLine(a, b) {
function checkForSeparatingLineBetweenTriangles(a, b) {
  const sides = getSidesFromPoints(a.concat(b))

  for (let i = 0; i < sides.length; i += 1) {
    const side = sides[i]
    const sideVector = difference(side[0], side[1]) // direction is dependent on order of arguments // PASS
    const sideUnitNormal = unit(normal(sideVector)) // PASS
    const projectionA = projectOntoVector(a, sideUnitNormal)
    const projectionB = projectOntoVector(b, sideUnitNormal)

    if (checkForCollisionAmongProjections(projectionA, projectionB)) {
      return true
    }
  }

  return false
}

function checkForCollisionBetweenTriangleAndLine(triangle, line) {
  return !checkForSeparatingLineBetweenTriangleAndLine(triangle, line)
}

// TODO: move out
function checkForSeparatingLineBetweenTriangleAndLine(a, b) {
  const sides = getSidesFromPoints(a)

  for (let i = 0; i < sides.length; i += 1) {
    const side = sides[i]
    const sideVector = difference(side[0], side[1]) // direction is dependent on order of arguments // PASS
    const sideUnitNormal = unit(normal(sideVector)) // PASS
    const projectionA = projectOntoVector(a, sideUnitNormal)
    const projectionB = projectOntoVector(b, sideUnitNormal)

    if (checkForCollisionAmongProjections(projectionA, projectionB)) {
      return true
    }
  }

  return false
}

// PASSED
function getSidesFromPoints (points) {
  return points.map((pointA, i) => {
    const pointB = points[(i + 1) % points.length]
    return [pointA, pointB]
  })
}

function projectOntoVector (points, vector) {
  return points.map((point) => dot(point, vector))
}

function checkForCollisionAmongProjections (a, b) {
  const sortedA = a.slice().sort(ascending)
  const sortedB = b.slice().sort(ascending)
  const aMin = sortedA[0]
  const aMax = sortedA[sortedA.length - 1]
  const bMin = sortedB[0]
  const bMax = sortedB[sortedB.length - 1]

  return (aMax < bMin || bMax < aMin)
}
