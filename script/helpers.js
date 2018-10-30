const _cleanCoords = require('@turf/clean-coords').default

exports.getSubgraph = function (features, starting, eps = 0.00001) {
  features.forEach(f => {
    delete f.properties._included
  })
  const leaves = []
  starting.forEach(id => {
    const root = features.find(f => f.id === id)
    root.properties._included = true
    leaves.push(...getTwoEnds(root))
  })
  while (leaves.length > 0) {
    const point = leaves.pop()
    features.forEach(f => {
      if (f.properties._included) return
      getTwoEnds(f).forEach((pt, i, pair) => {
        if (Math.abs(pt[0] - point[0]) <= eps &&
            Math.abs(pt[1] - point[1]) <= eps) {
          f.properties._included = true
          leaves.push(pair[1 - i])
        }
      })
    })
  }
  return {
    type: 'FeatureCollection',
    features: features.filter(f => f.properties._included)
  }
}

exports.mergeLineString = function (features, eps = 0.00001) {
  features.forEach(f => {
    delete f.properties._included
  })
  const root = features[0]
  root.properties._included = true
  let merged = root.geometry.coordinates
  const ends = getTwoEnds(root)
  while (ends.length > 0) {
    const point = ends.pop()
    features.forEach(f => {
      if (f.properties._included) return
      getTwoEnds(f).forEach((pt, i, pair) => {
        if (Math.abs(pt[0] - point[0]) <= eps &&
            Math.abs(pt[1] - point[1]) <= eps) {
          f.properties._included = true
          if (ends.length === 1) {
            if (i === 0) merged = merged.concat(f.geometry.coordinates)
            else merged = merged.concat(f.geometry.coordinates.reverse())
          } else {
            if (i === 1) merged = f.geometry.coordinates.concat(merged)
            else merged = f.geometry.coordinates.reverse().concat(merged)
          }
          ends.push(pair[1 - i])
        }
      })
    })
  }
  const feature = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: merged
    }
  }
  _cleanCoords(feature, {mutate: true})
  return feature
}

function getTwoEnds (lineString) {
  const coordinates = lineString.geometry.coordinates
  return [
    coordinates[0],
    coordinates[coordinates.length - 1]
  ]
}
exports.getTwoEnds = getTwoEnds
