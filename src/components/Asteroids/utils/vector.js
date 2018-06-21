export function translate (v, t) {
  return sum(v, t)
}

export function sum (a, b) {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  }
}

export function difference (a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  }
}

// returns the vector rotated by the given angle
export function rotate (v, angle) {
  /*
   * [ cos T, -sin T ]
   * [ sin T,  cos T ]
   */
  const cosT = Math.cos(angle)
  const sinT = Math.sin(angle)

  return {
    x: (cosT * v.x) - (sinT * v.y),
    y: (sinT * v.x) + (cosT * v.y),
  }
}

export function scale (v, n) {
  return {
    x: n * v.x,
    y: n * v.y,
  }
}

export function dot (a, b) {
  return (a.x * b.x) + (a.y * b.y)
}

// rotates a vector by pi/2
export function normal (v) {
  return {
    x: -v.y,
    y: v.x,
  }
}

export function magnitude (a) {
  return Math.sqrt((a.x * a.x) + (a.y * a.y))
}

export function unit (v) {
  const m = magnitude(v)

  return {
    x: v.x / m,
    y: v.y / m,
  }
}

export function midpoint (a, b) {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  }
}

export function inverse (a) {
  return {
    x: -a.x,
    y: -a.y,
  }
}

export function getStandardShipAngle (ship) {
  return (Math.PI * (90 - ship.rotation)) / 180
}
