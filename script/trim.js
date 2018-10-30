const fs = require('fs')
const _bbox = require('@turf/bbox').default

let unassigned = require('../data/processed/manual_cleaned.json').features

console.log('Total', unassigned.length)

const {getSubgraph} = require('./helpers')

const subgraphs = []

while (unassigned.length > 0) {
  const root = unassigned[0]
  const subgraph = getSubgraph(unassigned, [root.id])
  console.log(subgraph.features.length)
  subgraphs.push(subgraph)
  unassigned = unassigned.filter(f => !f.properties._included)
}

subgraphs.forEach(subgraph => {
  subgraph.bbox = _bbox(subgraph)
})

fs.writeFileSync('data/processed/cleaned.json', JSON.stringify(subgraphs, null, 2))
