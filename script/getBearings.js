const fs = require('fs')
const _lineChunk = require('@turf/line-chunk').default
const _bearing = require('@turf/bearing').default

const config = require('./config')

const features = require('../data/processed/tour_data.json').features
const lineFeatures = features.filter(f => f.geometry.type === 'LineString')

const segments = {}

lineFeatures.forEach(f => {
  const name = f.properties.from + '_to_' + f.properties.to
  const geojson = {
    type: 'LineString',
    coordinates: f.properties.original
  }
  const distance = f.properties.totalDistance
  const frames = config.TRANSIT[name].duration * config.FRAME_RATE
  const segmentLength = distance / frames

  const chunks = _lineChunk(geojson, segmentLength).features
  const bearings = chunks.slice(0, frames).map(f => {
    const coordinates = f.geometry.coordinates
    return _bearing(coordinates[0], coordinates[1])
  }).map(Math.round)

  segments[name] = {distance, frames, bearings}
})

fs.writeFileSync('data/processed/bearings.json', JSON.stringify(segments))
