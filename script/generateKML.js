/* eslint-disable curly */

const fs = require('fs')

const config = process.env.MOBILE ? require('./config-mobile') : require('./config')
const features = require('../data/processed/tour_data.json').features
const lineFeatures = features.filter(f => f.geometry.type === 'LineString')
const pointFeatures = features.filter(f => f.geometry.type === 'Point')

const baseKML = fs.readFileSync('data/kml/base.kml', {encoding: 'utf-8'})
const tourKML = fs.readFileSync('data/kml/tour.kml', {encoding: 'utf-8'})

const OUTPUT_DIR = process.env.MOBILE ? 'data/kml/mobile/' : 'data/kml/'

generateBase()
generateEnterScene()
lineFeatures.forEach(generateTour)

function generateBase () {
  const $stations = pointFeatures.map(f => {
    const coordinates = f.geometry.coordinates.map(v => v.toFixed(6)).join(',')

    // STATIONS
    return `
<Placemark>
  <name>${f.properties.label}</name>
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

    // SEGMENTED ROUTE
    return `
<Placemark>
  <name>${name}</name>
  <visibility>0</visibility>
  <styleUrl>#animated-style</styleUrl>
  <LineString>
    <tessellate>1</tessellate>
    <coordinates>${coordinates}</coordinates>
    <altitude>10</altitude>
  </LineString>
</Placemark>
    `
  })

  // COMPLETE ROUTE
  $routes.push(`
<Placemark>
  <styleUrl>#base-style</styleUrl>
  <LineString>
    <tessellate>1</tessellate>
    <coordinates>${coordinatesSet.join(' ')}</coordinates>
    <altitude>10</altitude>
  </LineString>
</Placemark>
  `)

  const generatedKML = baseKML
    .replace('<!-- STATIONS -->', $stations.join(''))
    .replace('<!-- ROUTES -->', $routes.join(''))

  fs.writeFileSync(OUTPUT_DIR + 'static.kml', generatedKML)
}

function generateEnterScene () {
  const overview = config.CHECKPOINTS.overview
  const firstCP = config.CHECKPOINTS[pointFeatures[0].properties.name]

  const $initial = `
<Placemark>
  <name>INITIAL</name>
  <LookAt>
    <longitude>${overview.coordinates[0]}</longitude>
    <latitude>${overview.coordinates[1]}</latitude>
    <heading>${overview.heading || 0}</heading>
    <tilt>${overview.tilt}</tilt>
    <range>${overview.range}</range>
    <altitude>50</altitude>
    <altitudeMode>absolute</altitudeMode>
  </LookAt>
</Placemark>
  `

  const $camera = firstCP.map((cp, i) => {
    const nextCoord = cp.coordinates || lineFeatures[0].geometry.coordinates[lineFeatures[0].geometry.coordinates.length - 1]
    return `
    <gx:FlyTo>
      <gx:duration>${i === 0 ? config.ENTER_TIME : config.TRANSITION_TIME}</gx:duration>
      <gx:flyToMode>${i === 0 ? 'bounce' : 'smooth'}</gx:flyToMode>
      <LookAt>
        <longitude>${nextCoord[0]}</longitude>
        <latitude>${nextCoord[1]}</latitude>
        <heading>${cp.heading || 0}</heading>
        <tilt>${cp.tilt}</tilt>
        <range>${cp.range}</range>
        <altitude>50</altitude>
        <altitudeMode>absolute</altitudeMode>
      </LookAt>
    </gx:FlyTo>
    `
  })

  const generatedKML = tourKML
    .replace('<!-- INITIAL -->', $initial)
    .replace('<!-- CAMERA -->', $camera.join(''))

  fs.writeFileSync(OUTPUT_DIR + 'enter.kml', generatedKML)
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

    // ANIMATED ROUTE
    return `
<Placemark id="${i}">
  <visibility>0</visibility>
  <styleUrl>#animated-style</styleUrl>
  <LineString>
    <tessellate>1</tessellate>
    <coordinates>${coordinates}</coordinates>
    <altitude>10</altitude>
  </LineString>
</Placemark>
    `
  })

  const fromCheckpoints = config.CHECKPOINTS[path.properties.from]
  const toCheckpoints = config.CHECKPOINTS[path.properties.to]
  const lastCP = fromCheckpoints[fromCheckpoints.length - 1]
  const initialCoord = lastCP.coordinates || path.geometry.coordinates[0]

  // INITIAL VIEW
  const $initial = `
<Placemark>
  <name>INITIAL</name>
  <LookAt>
    <longitude>${initialCoord[0]}</longitude>
    <latitude>${initialCoord[1]}</latitude>
    <heading>${lastCP.heading || 0}</heading>
    <tilt>${lastCP.tilt}</tilt>
    <range>${lastCP.range}</range>
    <altitude>50</altitude>
    <altitudeMode>absolute</altitudeMode>
  </LookAt>
</Placemark>
  `

  const $camera = path.geometry.coordinates.map((coord, i) => {
    // ENTER TRANSITION
    if (i === 0) return `
    <gx:FlyTo>
      <gx:duration>${config.TRANSITION_TIME}</gx:duration>
      <gx:flyToMode>smooth</gx:flyToMode>
      <LookAt>
        <longitude>${coord[0].toFixed(6)}</longitude>
        <latitude>${coord[1].toFixed(6)}</latitude>
        <tilt>${config.TRANSIT[name].tilt}</tilt>
        <range>${config.TRANSIT[name].range}</range>
        <altitude>50</altitude>
        <altitudeMode>absolute</altitudeMode>
      </LookAt>
    </gx:FlyTo>
    `

    // JOURNEY
    const duration = path.properties.distance[i] / path.properties.totalDistance * config.TRANSIT[name].duration
    return `
    <gx:FlyTo>
      <gx:duration>${duration.toFixed(3)}</gx:duration>
      <gx:flyToMode>smooth</gx:flyToMode>
      <LookAt>
        <longitude>${coord[0].toFixed(6)}</longitude>
        <latitude>${coord[1].toFixed(6)}</latitude>
        <tilt>${config.TRANSIT[name].tilt}</tilt>
        <range>${config.TRANSIT[name].range}</range>
        <altitude>50</altitude>
        <altitudeMode>absolute</altitudeMode>
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
    `
  })

  // EXIT & REMAINING TRANSITIONS
  toCheckpoints.forEach(cp => {
    const nextCoord = cp.coordinates || path.geometry.coordinates[path.geometry.coordinates.length - 1]
    $camera.push(`
    <gx:FlyTo>
      <gx:duration>${config.TRANSITION_TIME}</gx:duration>
      <gx:flyToMode>smooth</gx:flyToMode>
      <LookAt>
        <longitude>${nextCoord[0]}</longitude>
        <latitude>${nextCoord[1]}</latitude>
        <heading>${cp.heading || 0}</heading>
        <tilt>${cp.tilt}</tilt>
        <range>${cp.range}</range>
        <altitude>50</altitude>
        <altitudeMode>absolute</altitudeMode>
      </LookAt>
    </gx:FlyTo>
    `)
  })

  const generatedKML = tourKML
    .replace('<!-- INITIAL -->', $initial)
    .replace('<!-- CAMERA -->', $camera.join(''))
    .replace('<!-- ANIMATED -->', $animated.join(''))

  fs.writeFileSync(OUTPUT_DIR + name + '.kml', generatedKML)
}
