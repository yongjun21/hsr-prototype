const fs = require('fs')
const _distance = require('@turf/distance').default
const _nearestPointOnLine = require('@turf/nearest-point-on-line').default

const config = require('./config')
const data = require('../data/processed/cleaned.json')
const linestring = data[0].features[0].geometry

const coordinates = {
  hongkong_west_kowloon: [114.165390, 22.303713],
  shenzhen_north: [114.024017, 22.612002],
  guangzhou_south: [113.264403, 22.991768],
  changsha_south: [113.059129, 28.150135],
  wuhan: [114.418640, 30.609336],
  zhengzhou_east: [113.772235, 34.759995],
  shijiazhuang: [114.478072, 38.009884],
  beijing_west: [116.315098, 39.892564]
}

const stations = Object.keys(coordinates)

const corrected = {}

stations.forEach(station => {
  corrected[station] = _nearestPointOnLine(linestring, coordinates[station])
})

const features = []

stations.forEach((to, i) => {
  features.push({
    id: 'station_' + i,
    type: 'Feature',
    properties: {
      name: to,
      label: formatName(to)
    },
    geometry: {
      type: 'Point',
      coordinates: corrected[to].geometry.coordinates
    }
  })
  if (i === 0) return
  const from = stations[i - 1]
  const filtered = linestring.coordinates.filter((v, i) =>
    i > corrected[from].properties.index && i <= corrected[to].properties.index)
  const original = [
    corrected[from].geometry.coordinates,
    ...filtered,
    corrected[to].geometry.coordinates
  ]
  const originalDistance = getDistance(original).reduce((sum, d) => sum + d, 0)
  const TOTAL_FRAMES = config.TRANSIT[from + '_to_' + to].duration * config.FRAME_RATE
  const coordinates = dice(original, originalDistance / TOTAL_FRAMES)
  const distance = getDistance(coordinates)
  const totalDistance = distance.reduce((sum, d) => sum + d, 0)
  features.push({
    id: 'route_' + i,
    type: 'Feature',
    properties: {from, to, distance, totalDistance, original},
    geometry: {
      type: 'LineString',
      coordinates
    }
  })
})

const geojson = {
  type: 'FeatureCollection',
  features
}

fs.writeFileSync('data/processed/tour_data.json', JSON.stringify(geojson))

function dice (input, maxSegmentLength) {
  const distance = getDistance(input)
  const output = []
  input.forEach((coord, i, coords) => {
    let d = maxSegmentLength
    while (d < distance[i]) {
      const interpolated = interpolate(coords[i - 1], coord, d / distance[i])
      output.push(interpolated)
      d += maxSegmentLength
    }
    output.push(coord)
  })
  return output
}

function getDistance (coordinates) {
  return coordinates.map((dest, i, coords) => {
    if (i === 0) return 0
    const orig = coords[i - 1]
    return _distance(orig, dest)
  })
}

function interpolate (a, b, r) {
  return [
    (1 - r) * a[0] + r * b[0],
    (1 - r) * a[1] + r * b[1]
  ]
}

function formatName (key) {
  return key.split('_').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')
}
