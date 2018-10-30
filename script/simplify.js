const fs = require('fs')
const _simplify = require('@turf/simplify').default

const {getTwoEnds} = require('./helpers')

const original = require('../data/processed/cleaned.json')[0]

const simplified = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
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

console.log(simplified.features[0].geometry.coordinates.length)
_simplify(simplified, {mutate: true, highQuality: true, tolerance: 0.0001})
console.log(simplified.features[0].geometry.coordinates.length)

fs.writeFileSync('data/processed/cleaned.json', JSON.stringify([simplified], null, 2))
