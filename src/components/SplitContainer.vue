<template>
  <div class="split-container" :class="{'vertical': $vuetify.breakpoint.mdAndDown}" :style="{'--position': position}">
    <div class="left-side">
      <slot name="left"></slot>
    </div>

    <div class="split-line"
         :class="{'is-moving': is_moving}"
         v-touch="touch_handler"
         @mousemove="touch_handler.move"
         @mousedown="touch_handler.move"
         @mouseup="is_moving = false"
         @mouseleave="touch_handler.move"
    >
      <slot name="split-line"></slot>
    </div>

    <div class="right-side">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "SplitContainer",
  props: {
    default_position: {
      type: [String, Number],
      default() {
        return "50%";
      }
    },
    position_key: {
      type: String,
      default() {
        return null;
      }
    },
    max_percent: {
      type: Number,
      default() {
        return null;
      }
    },
    min_percent: {
      type: Number,
      default() {
        return null;
      }
    }
  },
  created() {
    let last_position = localStorage.getItem(this.save_key);
    if (last_position) {
      this.position = last_position;
    } else {
      this.position = this.default_position;
    }
  },
  computed: {
    save_key() {
      return "split-container-" + this.position_key;
    }
  },
  data() {
    let move_handler = (e) => {
      if (e.buttons != null && e.buttons === 0) {
        this.is_moving = false;
        return;
      }
      console.log(e);
      let position = e.clientX || e.touchmoveX;
      if(this.$vuetify.breakpoint.mdAndDown) {
        position = e.clientY || e.touchmoveY
      }
      this.move_line(position);
    }

    return {
      is_moving: false,
      position: "50%",
      touch_handler: {
        move: move_handler,
        end: () => {
          this.is_moving = false;
        }
      }
    }
  },
  methods: {
    move_line(x) {
      x = x - 1;

      let window_length = this.$vuetify.breakpoint.mdAndDown ? window.innerHeight : window.innerWidth;

      let max = this.max_percent ? window_length * this.max_percent / 100 : null;
      let min = this.min_percent ? window_length * this.min_percent / 100 : null;
      x = Math.min(window_length, Math.max(x, 0))
      if (max) {
        x = Math.min(max, x);
      }
      if (min) {
        x = Math.max(min, x);
      }
      this.is_moving = true;
      this.position = `${x}px`;
      if (this.position_key) {
        this.save_position()
      }
    },
    async save_position() {
      localStorage.setItem(this.save_key, this.position);
    }
  }
}
</script>

<style scoped lang="scss">

.split-container {
  position: relative;
  display: flex;
  --position: 50%;
  --line-width: 3px;

  &.vertical {
    flex-direction: column;

    .split-line {
      width: 100%;
      height: var(--line-width);
      left: 0;
      top: var(--position);
      cursor: row-resize;


      &.is-moving {
        &:before, &:after {
          height: var(--width);
          width: 100%;
          left: 0;
        }

        &:before {
          top: calc(-1 * var(--width));
        }

        &:after {
          bottom: calc(-1 * var(--width));
        }
      }
    }


    .left-side {
      width: 100%;
      height: var(--position);
    }

    .right-side {
      padding-left: 0;
      padding-top: var(--line-width);
    }
  }

  .split-line {
    position: absolute;
    height: 100%;
    width: var(--line-width);
    background: #c7c7c7;
    left: var(--position);
    cursor: col-resize;
    user-select: none;
    box-sizing: content-box;

    &.is-moving {
      &:before, &:after {
        --width: 200px;
        content: "";
        position: absolute;
        width: var(--width);
        height: 100%;
      }

      &:before {
        left: calc(-1 * var(--width));
      }

      &:after {
        right: calc(-1 * var(--width));
      }
    }

  }

  .right-side {
    padding-left: var(--line-width);
    flex: 1;
  }

  .left-side {
    width: var(--position);
  }

  .left-side, .right-side {

  }
}

</style>