<template>
  <div class="st-scrolly">
    <div class="background-container">
      <div class="background" :style="stickyStyle">
        <slot name="background" v-bind="exposedScope"></slot>
      </div>
    </div>

    <div ref="slides" class="slide-container">
      <slot v-bind="exposedScope"></slot>
    </div>

    <div class="foreground-container">
      <div class="foreground" :style="stickyStyle">
        <slot name="foreground" v-bind="exposedScope"></slot>
      </div>
    </div>
  </div>
</template>

<script>
const supportsSticky = window.CSS &&
                       window.CSS.supports &&
                       window.CSS.supports('position', 'sticky')

export default {
  props: {
    windowHeight: Number,
    windowTop: {
      type: Number,
      default: 0
    },
    scrollInitial: {
      type: Number,
      default: 0
    },
    dontUseSticky: Boolean
  },
  data () {
    return {
      windowHeight_: this.windowHeight || window.innerHeight,
      slideHeights: [],
      scrollPosition: 0
    }
  },
  computed: {
    scrollCheckpoints () {
      return this.slideHeights.reduce((arr, h) => {
        arr.push(arr[arr.length - 1] + h)
        return arr
      }, [0])
    },
    scrollLength () {
      return this.scrollCheckpoints[this.scrollCheckpoints.length - 1]
    },
    slideIndex () {
      const position = this.scrollPosition
      return this.scrollCheckpoints.filter(h => position >= h).length
    },
    exposedScope () {
      const {slideIndex, scrollPosition, scrollCheckpoints, scrollLength} = this
      /* eslint-disable indent */
      const fromPrevSlide = scrollPosition < 0
                          ? Infinity
                          : scrollPosition - scrollCheckpoints[slideIndex - 1]
      const toNextSlide = scrollPosition >= scrollLength
                        ? Infinity : scrollCheckpoints[slideIndex] - scrollPosition
      /* eslint-enable indent */
      return {
        slideIndex,
        slideCount: this.slideHeights.length,
        scrollPosition,
        scrollLength: this.scrollLength,
        fromPrevSlide,
        toNextSlide
      }
    },
    stickyStyle () {
      let position = 'fixed'
      let top = this.windowTop + 'px'
      let bottom = 'auto'
      if (!this.dontUseSticky && supportsSticky) {
        position = 'sticky'
      } else if (this.scrollPosition <= this.scrollInitial) {
        // align top
        position = 'absolute'
        top = '0'
      } else if (this.scrollPosition > this.scrollInitial + this.scrollLength - this.windowHeight_) {
        // align bottom
        position = 'absolute'
        top = 'auto'
        bottom = '0'
      }
      return {
        position,
        top,
        bottom,
        height: this.windowHeight ? (this.windowHeight + 'px') : '100vh'
      }
    }
  },
  created () {
    this.handleScroll = frameRateLimited(function () {
      this.scrollPosition = this.scrollInitial - this.$el.getBoundingClientRect().top + this.windowTop
    }).bind(this)

    this.handleResize = frameRateLimited(function () {
      const $slides = this.$refs.slides.children
      this.slideHeights = Array.prototype.map
        .call($slides, el => el.getBoundingClientRect().height)
      this.windowHeight_ = this.windowHeight || window.innerHeight
    }).bind(this)
  },
  mounted () {
    this.handleResize()
    this.handleScroll()
    window.addEventListener('resize', this.handleResize, {capture: true, passive: true})
    window.addEventListener('scroll', this.handleScroll, {capture: true, passive: true})
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('scroll', this.handleScroll)
  }
}

export function clamp (value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function frameRateLimited (cb) {
  let ready = true
  return function (e) {
    if (!ready) return
    ready = false
    window.requestAnimationFrame(() => {
      cb.call(this, e)
      ready = true
    })
  }
}
</script>

<style lang="scss">
.st-scrolly {
  position: relative;
  width: 100%;

  .background-container,
  .foreground-container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .background,
  .foreground {
    box-sizing: border-box;
    width: 100%;
  }

  .background-container {
    z-index: 0;
  }

  .slide-container {
    position: relative;
    z-index: 1;
    pointer-events: none;
  }

  .foreground-container {
    z-index: 2;
    pointer-events: none;
  }
}
</style>
