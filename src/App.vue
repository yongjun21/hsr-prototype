<template>
  <div id="app">
    <prototype-map></prototype-map>
  </div>
</template>

<script>
import PrototypeMap from './components/PrototypeMap.vue'

export default {
  name: 'app',
  components: {
    PrototypeMap
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

html,
body,
#app {
  height: 100%;
  margin: 0;
}
</style>
