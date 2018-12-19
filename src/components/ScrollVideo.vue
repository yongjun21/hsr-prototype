<template>
  <div class="scroll-video">
    <video
      ref="video"
      :poster="poster"
      preload="auto"
      muted
      playsinline>
      <source v-for="source in sources" :src="source.src" :type="source.type">
      <slot></slot>
    </video>
  </div>
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
    const $video = this.$refs.video
    $video.addEventListener('loadedmetadata', e => {
      this.duration = $video.duration
      pollActualFrame.call(this)
      const seek = getThrottledSeek($video)
      this.$watch(() => this.targetFrame - this.actualFrame, diff => {
        if (diff > 0) {
          $video.playbackRate = Math.min(diff, 4)
          if ($video.paused) $video.play()
        } else {
          $video.pause()
          if (diff <= -this.rewindSpeed) {
            const time = (Math.ceil(this.targetFrame / this.rewindSpeed) * this.rewindSpeed) / this.framerate
            seek(time)
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

function getThrottledSeek ($video) {
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
  position: relative;
  overflow: hidden;
  height: 100%;

  & > video {
    display: block;
    position: absolute;
    min-width: 100%;
    min-height: 100%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    @media screen and (max-aspect-ratio: 16/10) {
      height: 100%;
    }

    @media screen and (min-aspect-ratio: 16/10) {
      width: 100%;
    }
  }
}
</style>
