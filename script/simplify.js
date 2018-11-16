require('./chain')

const fs = require('fs')
const _simplify = require('@turf/simplify').default

const {getTwoEnds} = require('./helpers')

const original = JSON.parse(fs.readFileSync('data/processed/cleaned.json'))[0]

const merged = {
  type: 'FeatureCollection',
  features: [{
    id: 0,
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: original.features
        .reduce((arr, f) => {
          const coordinates = f.geometry.coordinates
          const [first, last] = getTwoEnds(f)
          if (first[1] > last[1]) f.geometry.coordinates.reverse()
          return arr.concat(coordinates)
        }, [])
    }
  }]
}

const simplified = [
  _simplify(merged, {highQuality: true, tolerance: 0.00001}),
  _simplify(merged, {highQuality: true, tolerance: 0.0001}),
  _simplify(merged, {highQuality: true, tolerance: 0.001})
]

fs.writeFileSync('data/processed/cleaned.json', JSON.stringify(simplified, null, 2))
