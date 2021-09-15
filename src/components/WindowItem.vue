<template>
  <div class="window-item">
    <template v-if="item">
      <img v-if="item.is_image" :src="item.url" class="item-content" @load="loaded"/>
      <video v-else-if="item.is_video" :src="item.url" ref="video" class="item-content" :autoplay="is_current && autoplay"
             :controls="video_control" @loadeddata="loaded"/>
    </template>
  </div>
</template>

<script>

export default {
  name: "WindowItem",
  props: {
    video_control: {
      type: Boolean,
      default() {
        return false;
      }
    },
    is_current: {
      type: Boolean,
      default() {
        return false;
      }
    },
    autoplay: {
      type: Boolean,
      default() {
        return false;
      }
    },
    item: {
      type: Object,
      default() {
        return null;
      }
    }
  },
  watch: {
    is_current(is_current) {
      if (is_current) {
        this.play();
      }
    }
  },
  methods: {
    loaded(e) {
      this.$emit('loaded', e);
    },
    play() {
      if (!this.$refs.video) {
        return;
      }

      let video = this.$refs.video;

      if (this.autoplay) {
        video.currentTime = 0;
        video.play();
      } else {
        video.pause();
      }
    }
  }
}
</script>

<style scoped lang="scss">
.window-item {
  position: relative;
  background: black;

  img.item-content {
    object-fit: contain;
  }

  .item-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    max-width: 100%;
    margin: auto;
    height: 100%;
    width: 100%;
    background: black;
  }
}
</style>