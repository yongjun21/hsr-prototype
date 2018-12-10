/* eslint-disable curly */

const fs = require('fs')

const config = require('./config')

const features = require('../data/processed/tour_data.json').features
const lineFeatures = features.filter(f => f.geometry.type === 'LineString')
const pointFeatures = features.filter(f => f.geometry.type === 'Point')

const baseKML = fs.readFileSync('data/kml/base.kml', {encoding: 'utf-8'})
const tourKML = fs.readFileSync('data/kml/tour.kml', {encoding: 'utf-8'})

generateBase()
lineFeatures.forEach(generateTour)

function generateBase () {
  const $stations = pointFeatures.map(f => {
    const coordinates = f.geometry.coordinates.map(v => v.toFixed(6)).join(',')
    return `
<Placemark>
  <name>${f.properties.name}</name>
  <Point>
    <coordinates>${coordinates}</coordinates>
  </Point>
</Placemark>
    `
  })

  const coordinatesSet = []

  const $routes = lineFeatures.map(f => {
    const name = f.properties.from + '_to_' + f.properties.to
    const coordinates = f.properties.original.map(coords => {
      return coords.map(v => v.toFixed(6)).join(',')
    }).join(' ')
    coordinatesSet.push(coordinates)

    return `
<Placemark>
  <name>${name}</name>
  <visibility>0</visibility>
  <styleUrl>#animated-style</styleUrl>
  <LineString>
    <tessellate>1</tessellate>
    <coordinates>${coordinates}</coordinates>
  </LineString>
</Placemark>
    `
  })

  $routes.push(`
<Placemark>
  <styleUrl>#base-style</styleUrl>
  <LineString>
    <tessellate>1</tessellate>
    <coordinates>${coordinatesSet.join(' ')}</coordinates>
  </LineString>
</Placemark>
  `)

  const generatedKML = baseKML
    .replace('<!-- STATIONS -->', $stations.join(''))
    .replace('<!-- ROUTES -->', $routes.join(''))

  fs.writeFileSync('data/kml/static.kml', generatedKML)
}

function generateTour (path) {
  const name = path.properties.from + '_to_' + path.properties.to

  const $animated = path.geometry.coordinates.map((coord, i, coords) => {
    if (i === 0) return ''
    const prevCoord = coords[i - 1]
    const coordinates = [
      [prevCoord[0].toFixed(6), prevCoord[1].toFixed(6)].join(','),
      [coord[0].toFixed(6), coord[1].toFixed(6)].join(',')
    ].join(' ')
    return `
<Placemark id="${i}">
  <visibility>0</visibility>
  <styleUrl>#animated-style</styleUrl>
  <LineString>
    <tessellate>1</tessellate>
    <coordinates>${coordinates}</coordinates>
  </LineString>
</Placemark>
    `
  })

  const $camera = []

  // ENTER
  const fromCheckpoints = config.CHECKPOINTS[path.properties.from]
  const toCheckpoints = config.CHECKPOINTS[path.properties.to]
  const lastCP = fromCheckpoints[fromCheckpoints.length - 1]
  const initialCoord = lastCP.coordinates || path.geometry.coordinates[0]
  $camera.push(`
    <LookAt>
      <longitude>${initialCoord[0]}</longitude>
      <latitude>${initialCoord[0]}</latitude>
      <heading>${lastCP.heading || 0}</heading>
      <tilt>${lastCP.tilt}</tilt>
      <range>${lastCP.range}</range>
      <altitude>0</altitude>
      <altitudeMode>clampedToGround</altitudeMode>
    </LookAt>
  `)

  // JOURNEY
  path.geometry.coordinates.forEach((coord, i) => {
    if (i === 0) $camera.push(`
    <gx:FlyTo>
      <gx:duration>${config.TRANSITION_TIME}</gx:duration>
      <LookAt>
        <longitude>${coord[0].toFixed(6)}</longitude>
        <latitude>${coord[1].toFixed(6)}</latitude>
        <tilt>${config.TRANSIT[name].tilt}</tilt>
        <range>${config.TRANSIT[name].range}</range>
        <altitude>0</altitude>
        <altitudeMode>clampedToGround</altitudeMode>
      </LookAt>
    </gx:FlyTo>
    `)

    const duration = path.properties.distance[i] / path.properties.totalDistance * config.TRANSIT[name].duration
    $camera.push(`
    <gx:FlyTo>
      <gx:duration>${duration.toFixed(3)}</gx:duration>
      <gx:flyToMode>smooth</gx:flyToMode>
      <LookAt>
        <longitude>${coord[0].toFixed(6)}</longitude>
        <latitude>${coord[1].toFixed(6)}</latitude>
        <tilt>${config.TRANSIT[name].tilt}</tilt>
        <range>${config.TRANSIT[name].range}</range>
        <altitude>0</altitude>
        <altitudeMode>clampedToGround</altitudeMode>
      </LookAt>
    </gx:FlyTo>
    <gx:AnimatedUpdate>
      <Update>
        <Change>
          <Placemark targetId="${i}">
            <visibility>1</visibility>
          </Placemark>
        </Change>
      </Update>
    </gx:AnimatedUpdate>
    `)
  })

  // EXIT
  toCheckpoints.forEach(cp => {
    const nextCoord = cp.coordinates || path.geometry.coordinates[path.geometry.coordinates.length - 1]
    $camera.push(`
    <gx:FlyTo>
      <gx:duration>${config.TRANSITION_TIME}</gx:duration>
      <LookAt>
        <longitude>${nextCoord[0]}</longitude>
        <latitude>${nextCoord[1]}</latitude>
        <heading>${cp.heading || 0}</heading>
        <tilt>${cp.tilt}</tilt>
        <range>${cp.range}</range>
        <altitude>0</altitude>
        <altitudeMode>clampedToGround</altitudeMode>
      </LookAt>
    </gx:FlyTo>
    `)
  })

  const generatedKML = tourKML
    .replace('<!-- ANIMATED -->', $animated.join(''))
    .replace('<!-- CAMERA -->', $camera.join(''))

  fs.writeFileSync(`data/kml/${name}.kml`, generatedKML)
}
