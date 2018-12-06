const fs = require('fs')

const features = require('../data/processed/tour_data.json').features
const lineFeatures = features.filter(f => f.geometry.type === 'LineString')
const pointFeatures = features.filter(f => f.geometry.type === 'Point')

const baseKML = fs.readFileSync('data/kml/base.kml', {encoding: 'utf-8'})
const tourKML = fs.readFileSync('data/kml/tour.kml', {encoding: 'utf-8'})

const TARGET_DURATION = 15

const cameraProps = {
  hongkong_west_kowloon_to_shenzhen_north: {range: 10000, tilt: 40},
  shenzhen_north_to_guangzhou_south: {range: 10000, tilt: 40},
  guangzhou_south_to_changsha_south: {range: 10000, tilt: 40},
  changsha_south_to_wuhan: {range: 10000, tilt: 40},
  wuhan_to_shijiazhuang: {range: 10000, tilt: 40},
  shijiazhuang_to_beijing_west: {range: 10000, tilt: 40}
}

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

  const $camera = path.geometry.coordinates.map((coord, i) => {
    if (i === 0) {
      return `
    <gx:FlyTo>
      <gx:duration>3.000</gx:duration>
      <LookAt>
        <longitude>${coord[0].toFixed(6)}</longitude>
        <latitude>${coord[1].toFixed(6)}</latitude>
        <tilt>${cameraProps[name].tilt}</tilt>
        <range>${cameraProps[name].range}</range>
        <altitude>0</altitude>
        <altitudeMode>clampedToGround</altitudeMode>
      </LookAt>
    </gx:FlyTo>
    `
    }

    const duration = path.properties.distance[i] / path.properties.totalDistance * TARGET_DURATION
    return `
    <gx:FlyTo>
      <gx:duration>${duration.toFixed(3)}</gx:duration>
      <gx:flyToMode>smooth</gx:flyToMode>
      <LookAt>
        <longitude>${coord[0].toFixed(6)}</longitude>
        <latitude>${coord[1].toFixed(6)}</latitude>
        <tilt>${cameraProps[name].tilt}</tilt>
        <range>${cameraProps[name].range}</range>
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
    `
  })

  const generatedKML = tourKML
    .replace('<!-- ANIMATED -->', $animated.join(''))
    .replace('<!-- CAMERA -->', $camera.join(''))

  fs.writeFileSync(`data/kml/${name}.kml`, generatedKML)
}
