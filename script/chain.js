const fs = require('fs')
const trimmed = require('../data/processed/cleaned.json')

const {mergeLineString} = require('./helpers')

const chained = {
  type: 'FeatureCollection',
  features: trimmed.map(subgraph => mergeLineString(subgraph.features))
    .sort((a, b) => a.geometry.coordinates[0][1] - b.geometry.coordinates[0][1])
}

chained.features.forEach((f, i) => {
  f.id = i.toString()
})

fs.writeFileSync('data/processed/cleaned.json', JSON.stringify([chained], null, 2))
