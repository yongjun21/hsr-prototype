<template>
  <div class="prototype-map" :style="style"></div>
</template>

<script>
import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'

import saveAs from 'file-saver'

export default {
  data () {
    return {
      style: {
        cursor: 'grab'
      }
    }
  },
  methods: {
    mountMap (el, geojson) {
      console.log(geojson)
      mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhY2hvcGF6b3MiLCJhIjoiY2pkMDN3eW4wNHkwZDJ5bGc0cnpueGNxbCJ9.WWWg_OnK5e7L1RknMliY4A'

      const map = new mapboxgl.Map({
        container: el,
        center: [0, 0],
        zoom: 1,
        style: 'mapbox://styles/mapbox/streets-v10',
        hash: true
      })
      const nav = new mapboxgl.NavigationControl()
      map.addControl(nav, 'top-right')

      map.on('load', e => {
        map.addSource('geojson', {
          type: 'geojson',
          data: geojson
        })

        map.addLayer({
          id: 'lines',
          type: 'line',
          source: 'geojson',
          filter: ['==', ['geometry-type'], 'LineString'],
          paint: {
            'line-color': [
              'case',
              ['boolean', ['feature-state', 'selected'], ['get', '_included'], false],
              'blue',
              'red'
            ],
            'line-width': 3
          }
        })

        map.addLayer({
          id: 'points',
          type: 'circle',
          source: 'geojson',
          filter: ['==', ['geometry-type'], 'Point'],
          paint: {
            'circle-color': 'black',
            'circle-radius': 5
          }
        })

        const popover = new mapboxgl.Popup({closeButton: false})

        const layers = ['lines', 'points']
        layers.forEach(layer => {
          map.on('mouseover', layer, e => {
            this.style = {cursor: 'pointer'}
            const feature = e.features[0]
            popover.setText(feature.properties.name)
            popover
              .setLngLat(e.lngLat)
              .addTo(map)
          })

          map.on('mouseout', layer, e => {
            this.style = {cursor: 'grab'}
            popover.remove()
          })
        })

        map.on('click', 'lines', e => {
          const feature = e.features[0]
          console.log(feature)
          const selected = feature.state.selected != null
            ? feature.state.selected
            : feature.properties._included
          map.setFeatureState(feature, {selected: !selected})
        })

        this.$el.addEventListener('keydown', e => {
          if (e.key.toLowerCase() !== 's' || !e.ctrlKey) return
          const features = geojson.features.filter(f => {
            const selected = map.getFeatureState({id: f.id, source: 'geojson'}).selected
            return selected != null ? selected : f.properties._included
          })
          const output = JSON.stringify({
            type: 'FeatureCollection',
            features
          }, null, 2)
          const blob = new Blob([output], {type: 'application/json'})
          saveAs(blob, 'manual_cleaned.json')
        })
      })
    }
  },
  mounted () {
    window.fetch('./data.json').then(res => res.json()).then(subgraphs => {
      this.mountMap(this.$el, pickSubgraphs(subgraphs, 0, 1, 2, 4, 5))
    })
  }
}

function pickSubgraphs (subgraphs, ...indexes) {
  return {
    type: 'FeatureCollection',
    features: indexes.reduce((arr, index) => {
      if (!subgraphs[index]) return arr
      return arr.concat(subgraphs[index].features)
    }, [])
  }
}
</script>

<style lang="scss">
.prototype-map {
  width: 100%;
  height: 100%;

  .mapboxgl-canvas {
    left: 0;
  }

  .mapboxgl-canvas-container.mapboxgl-interactive {
    cursor: inherit;
  }
}
</style>
