const fs = require('fs')

const railways = require('../data/processed/china_railways.json').features
  .filter(f => f.properties.fclass === 'rail')

const picked = require('../data/processed/manual_cleaned.json').features

railways.forEach(f => {
  f.id = f.properties.osm_id
  if (picked.some(ff => f.id === ff.id)) f.properties._included = true
})

const subgraphs = [{
  type: 'FeatureCollection',
  features: railways
}]

fs.writeFileSync('data/processed/cleaned.json', JSON.stringify(subgraphs, null, 2))
