<template>
  <st-scrolly class="my-story">
    <template slot="background" slot-scope="{slideIndex, fromPrevSlide, toNextSlide}">
      <scroll-video v-for="(video, index) in videos" :key="video.key"
        v-show="slideIndex === index + 1"
        :sources="getSources(video.key)"
        :progress="getProgress(slideIndex, index, fromPrevSlide)">
      </scroll-video>
    </template>
    <div class="slide" v-for="video in videos" :style="{height: video.height + 'px'}"></div>
  </st-scrolly>
</template>

<script>
import StScrolly from './StScrolly.vue'
import ScrollVideo from './ScrollVideo.vue'

export default {
  components: {StScrolly, ScrollVideo},
  data () {
    return {
      videos: [{
        key: 'enter',
        height: 6000
      }, {
        key: 'hk2sz',
        height: 6000
      }, {
        key: 'sz2gz',
        height: 6000
      }, {
        key: 'gz2cs',
        height: 9000
      }]
    }
  },
  methods: {
    getSources (key) {
      const prefix = window.innerWidth > 480 ? './video/' : './video/mobile/'
      return [
        {src: prefix + key + '.webm', type: 'video/webm'},
        {src: prefix + key + '.mp4', type: 'video/mp4'}
      ]
    },
    getProgress (slideIndex, index, from) {
      if (slideIndex < index + 1) return 0
      if (slideIndex > index + 1) return 1
      let height = this.videos[index].height
      if (index === this.videos.length - 1) height -= window.innerHeight
      return from / height
    }
  }
}
</script>

<style lang="scss">
.my-story {
  .slide {
    &:last-child {
      height: calc(6000px + 100vh);
    }
  }
}
</style>
