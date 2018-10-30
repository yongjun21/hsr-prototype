const fs = require('fs')

const {getSubgraph} = require('./helpers')

const railways = require('../data/processed/china_railways.json').features
  .filter(f => f.properties.fclass === 'rail')

railways.forEach(f => {
  f.id = f.properties.osm_id
})

const seeds = [
  '331353160',
  '382451920',
  '203655277',
  '499494817'
]

const subgraphs = [getSubgraph(railways, seeds)]

fs.writeFileSync('data/processed/cleaned.json', JSON.stringify(subgraphs, null, 2))
