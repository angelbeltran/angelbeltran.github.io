export default function createAsteroid ({
  key, scale, points, position, movement, rotation, spin
} = {}) {
  const asteroid = {}

  if (key) {
    asteroid.key = key
  }
  asteroid.points = points || createRandomPoints()
  asteroid.position = position || ({
    x: 100 * Math.random(),
    y: 100 * Math.random(),
  })
  asteroid.movement = movement || ({
    x: 0.05 - 0.1 * Math.random(),
    y: 0.05 - 0.1 * Math.random(),
  })
  asteroid.rotation = rotation || 0
  asteroid.spin = spin || -0.8 + Math.random()
  asteroid.scale = scale || 3 + (4 * Math.random())

  return asteroid
}

// in this context, "points" mean coordinates in relation to the center of
// the asteroid. they are not absolute or have a direct relationship with
// how they are displayed on the grid/screen
function createRandomPoints () {
  const pts = []

  for (let i = 0; i < 8; i += 1) {
    const angle = ((i * Math.PI) / 4) + (Math.random() * (Math.PI / 4))
    const r = (2 + Math.random()) / 3

    pts.push({
      x: r * Math.cos(angle),
      y: r * Math.sin(angle),
    })
  }

  return pts
}
