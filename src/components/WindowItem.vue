<template>
  <div class="window-item">
    <template v-if="item">
      <img v-if="item.is_image" :src="item.url" class="item-content" @load="loaded"/>
      <video v-else-if="item.is_video" :src="item.url" class="item-content" :controls="video_control" @loadeddata="loaded"/>
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
    item: {
      type: Object,
      default() {
        return null;
      }
    }
  },
  methods: {
    loaded(e) {
      this.$emit('loaded', e);
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