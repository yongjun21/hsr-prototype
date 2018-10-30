const googleapis = require('@st-graphics/backend/client/googleapis')
const _pick = require('lodash/pick')

exportRailwayNames()
exportStationNames()

function exportRailwayNames () {
  const geojson = require('../data/processed/china_railways.json')

  const data = geojson.features.map(f => _pick(f.properties, ['fclass', 'name']))
  console.log(data.length)

  const params = {
    spreadsheetId: '1fuGvyEFSZQaV1EpuWbKxzTYRTwxu8r_NKuxG7u1Kp5c',
    range: 'Railways!A1:B200000',
    valueInputOption: 'USER_ENTERED',
    resource: {data}
  }

  return googleapis.sheets.spreadsheets.values.upload(params)
}

function exportStationNames () {
  const geojson = require('../data/processed/china_transport.json')
  const data = geojson.features
    .filter(f => f.properties.fclass.startsWith('railway'))
    .map(f => _pick(f.properties, ['fclass', 'name']))
  console.log(data.length)

  const params = {
    spreadsheetId: '1fuGvyEFSZQaV1EpuWbKxzTYRTwxu8r_NKuxG7u1Kp5c',
    range: 'Stations!A1:B20000',
    valueInputOption: 'USER_ENTERED',
    resource: {data}
  }

  return googleapis.sheets.spreadsheets.values.upload(params)
}
