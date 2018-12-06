<template>
  <div id="app">
    <!-- <prototype-map></prototype-map> -->
    <my-story></my-story>
  </div>
</template>

<script>
import PrototypeMap from './components/PrototypeMap.vue'
import MyStory from './components/MyStory.vue'

export default {
  name: 'app',
  components: {
    PrototypeMap,
    MyStory
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
