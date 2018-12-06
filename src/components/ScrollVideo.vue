<template>
  <video class="scroll-video"
    width="100%"
    height="100%"
    :poster="poster"
    preload="auto"
    muted
    playsinline>
    <source v-for="source in sources" :src="source.src" :type="source.type">
    <slot></slot>
  </video>
</template>

<script>
export default {
  props: {
    sources: {
      type: Array,
      required: true
    },
    poster: String,
    progress: Number,
    framerate: {
      type: Number,
      default: 30
    },
    rewindSpeed: {
      type: Number,
      default: 3
    }
  },
  data () {
    return {
      duration: null,
      actualFrame: 0
    }
  },
  computed: {
    targetFrame () {
      if (typeof this.progress !== 'number' || typeof this.duration !== 'number') return 0
      return Math.floor(this.progress * this.duration * this.framerate)
    }
  },
  mounted () {
    const $video = this.$el
    $video.addEventListener('loadedmetadata', e => {
      this.duration = $video.duration
      pollActualFrame.call(this)
      const rewind = getThrottledRewind($video)
      this.$watch(() => this.targetFrame - this.actualFrame, diff => {
        if (diff > 0) {
          $video.playbackRate = Math.min(diff, 4)
          if ($video.paused) $video.play()
        } else {
          $video.pause()
          if (diff <= -this.rewindSpeed) {
            const time = (Math.ceil(this.targetFrame / this.rewindSpeed) * this.rewindSpeed) / this.framerate
            rewind(time)
          }
        }
      }, {immediate: true})
    })
    function pollActualFrame () {
      this.actualFrame = Math.floor($video.currentTime * this.framerate)
      window.requestAnimationFrame(pollActualFrame.bind(this))
    }
  }
}

function getThrottledRewind ($video) {
  let waiting = null
  $video.addEventListener('seeked', e => {
    if (waiting != null) {
      $video.currentTime = waiting
      waiting = null
    }
  })
  return time => {
    if ($video.seeking) waiting = time
    else $video.currentTime = time
  }
}
</script>

<style lang="scss">
.scroll-video {
  display: block;
}
</style>
