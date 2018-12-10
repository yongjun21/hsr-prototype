<template>
  <st-scrolly class="my-story">
    <scroll-video slot="background"
      slot-scope="{slideIndex, fromPrevSlide, toNextSlide}"
      :sources="videoSources"
      :progress="getProgress(fromPrevSlide, toNextSlide)">
    </scroll-video>
    <div class="slide"></div>
  </st-scrolly>
</template>

<script>
import StScrolly from './StScrolly.vue'
import ScrollVideo from './ScrollVideo.vue'

export default {
  components: {StScrolly, ScrollVideo},
  data () {
    return {
      videoSources: [
        {src: './hk2sz.mp4', type: 'video/mp4'}
      ]
    }
  },
  methods: {
    getProgress (from, to) {
      return from / (from + to - window.innerHeight)
    }
  }
}
</script>

<style lang="scss">
.my-story {
  .slide {
    height: 12000px;
  }
}
</style>
