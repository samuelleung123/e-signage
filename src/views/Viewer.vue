<template>
  <div class="viewer" :class="{'is-playing': !!json_data}">
    <e-signage-viewer v-if="json_data" :json_data="json_data" absolute></e-signage-viewer>
    <v-btn v-if="!json_data" :loading="UI.btn_open.is_loading" color="primary" class="btn-open absolute" @click="open_zip">Open
    </v-btn>

    <div class="side-panel">
      <v-btn :loading="UI.btn_open.is_loading" color="primary" tile class="btn-open" @click="open_zip">
        Open
      </v-btn>
      <v-btn color="primary" tile class="btn-fullscreen" @click="request_fullscreen">
        Fullscreen
      </v-btn>
      <v-btn color="primary" tile class="btn-fullscreen" @click="exit_fullscreen">
        Exit Fullscreen
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn color="error" tile class="btn-fullscreen" @click="$router.back()">
        Back
      </v-btn>
    </div>

  </div>
</template>

<script>
import ESignageViewer from "@/components/E-Signage-Viewer.vue";
import {import_zip, open_file_picker} from "@/helpers/ExportImportHelper.js";

export default {
  name: "Viewer",
  components: {ESignageViewer},
  data() {
    return {
      UI: {
        btn_open: {
          is_loading: false,
        }
      },
      json_data: null,
    }
  },
  mounted() {
    document.querySelectorAll('html, body').forEach((el) => {
      el.style.overflowY = 'hidden';
    })

  },
  beforeDestroy() {
    document.querySelectorAll('html, body').forEach((el) => {
      el.style.overflowY = '';
    })
  },
  methods: {
    async open_zip() {
      let zip = await open_file_picker();
      if (zip === null) {
        return;
      }
      this.UI.btn_open.is_loading = true;
      this.json_data = await import_zip(zip);
      this.UI.btn_open.is_loading = false;

    },
    request_fullscreen() {
      document.body.requestFullscreen();
    },
    exit_fullscreen() {
      document.exitFullscreen();
    }
  }
}
</script>

<style scoped lang="scss">

.viewer {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: black;

  &.is-playing {
    cursor: none;

    .side-panel {
      opacity: 0;

      &:hover {
        opacity: 1;
      }
    }
  }

  .btn-open.absolute {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .side-panel {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: fit-content;
    background: #c7c7c7;
    opacity: 1;
    cursor: initial;
    display: flex;
    gap: 5px;
    padding: 5px;

  }

}
</style>