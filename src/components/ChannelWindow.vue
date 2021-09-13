<template>
  <div class="channel-window">
    <window-item v-for="(item, index) in buffer_channel()"
                 :key="item.id"
                 :is_current="index === 0"
                 :item="item"
                 autoplay
    ></window-item>
  </div>
</template>

<script>
import WindowItem from "@/components/WindowItem.vue";

export default {
  name: "ChannelWindow",
  components: {WindowItem},
  props: {
    channel: {
      type: Array,
      default() {
        return [];
      }
    },
    buffer_size: {
      type: Number,
      default() {
        return 2;
      }
    },
    trigger: {
      type: Number,
      default() {
        return null;
      }
    }
  },
  data() {
    return {
      duration: 0,
      queue: [],
    };
  },
  created() {
    this.set_channel(this.channel);
  },
  watch: {
    channel(new_channel) {
      this.set_channel(new_channel);
    },
    trigger() {
      if (this.query.length === 0) {
        return;
      }

      if (this.duration === 0) {
        let item = this.query.shift();
        this.query.push(item);
        this.duration = this.query[0].duration;
        this.$forceUpdate();
      } else {
        this.duration = this.duration - 1;
      }
    }
  },
  methods: {
    buffer_channel() {
      if (!this.query) {
        return [];
      }

      return this.query.slice(0, this.buffer_size);
    },
    set_channel(new_channel) {
      this.query = new_channel.concat([]);
      if (this.query.length) {
        this.duration = this.query[0].duration;
      }
      this.$forceUpdate();
    }
  }

}
</script>

<style scoped lang="scss">

.channel-window {
  position: relative;
  display: flex;
  align-items: stretch;
  justify-content: stretch;

  .window-item {
    visibility: hidden;
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .window-item:nth-child(1) {
    visibility: visible;
  }
}

</style>