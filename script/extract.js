const fs = require('fs')
const shapefile = require('shapefile')

extract('railways')
extract('transport')

function extract (theme) {
  const target = `data/raw/unpacked/gis_osm_${theme}_free_1`

  shapefile.read(target + '.shp', target + '.dbf', {encoding: 'UTF-8'}).then(geojson => {
    fs.writeFileSync(`data/processed/china_${theme}.json`, JSON.stringify(geojson, null, 2))
  }).catch(console.error)
}
