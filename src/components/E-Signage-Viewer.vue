<template>

  <div class="e-signage-viewer" :class="get_viewer_classes()">
    <channel-window
        v-for="channel in layout_windows[json_data.selected_layout]"
        ref="channels"
        :key="channel"
        :channel="json_data.windows[channel]"
        :trigger="trigger"
    >
    </channel-window>

  </div>

</template>

<script>
import {layout_windows} from "@/helpers/Global.js";
import ChannelWindow from "@/components/ChannelWindow.vue";

export default {
  name: "e-signage-viewer",
  components: {ChannelWindow},
  props: {
    json_data: {
      type: Object,
      default() {
        return null;
      }
    },
    absolute: {
      type: Boolean,
      default() {
        return false;
      }
    },
  },
  data() {
    return {
      layout_windows: layout_windows,
      trigger: 0,
      loop_id: null,
    }
  },
  created() {
    this.loop_id = setInterval(() => {
      this.trigger = (this.trigger + 1) % 2
    }, 1000);
  },
  mounted() {
    this.$refs.channels.forEach(channel => channel.play());
  },
  beforeDestroy() {
    clearInterval(this.loop_id);
  },
  methods: {
    get_viewer_classes() {
      let classes = {};

      classes["layout-" + this.json_data.selected_layout] = true;
      classes["absolute"] = this.absolute;


      return classes;
    }
  }
}
</script>

<style scoped lang="scss">

.e-signage-viewer {
  display: grid;
  background: black;

  &.layout-1 {
    grid-template:
        "1";
  }

  &.layout-2 {
    grid-template:
        "1 2";
  }

  &.layout-3 {
    grid-template:
        "1 2 3";
  }

  &.layout-4 {
    grid-template:
        "1 2"
        "3 4";
  }

  &.absolute {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}

</style>