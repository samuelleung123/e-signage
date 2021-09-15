<template>
  <div class="viewer" :class="{'is-playing': !!json_data}" @drop.prevent="drop_file" @dragover="dragover_handle">
    <e-signage-viewer v-if="json_data" :json_data="json_data" absolute></e-signage-viewer>
    <div class="absolute-center text--white">
      <v-btn v-if="!json_data" :loading="UI.btn_open.is_loading" color="primary" class="btn-open"
             @click="open_zip">Open
      </v-btn>
    </div>

    <div class="side-panel">
      <v-btn :loading="UI.btn_open.is_loading" color="primary" tile class="btn-open" @click="open_zip">
        Open
      </v-btn>
      <v-btn :loading="UI.btn_open.is_loading" color="primary" tile @click="load_last_zip">
        Open Last Zip
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
import localforage from "localforage";
import {Channels} from "@/helpers/Global.js";
import {async_timeout} from "@/helpers/async_utils.js";

const viewer_store = localforage.createInstance({
  name: "viewer",
});

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
  async mounted() {
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
      await this.load_zip(zip);
    },
    async load_zip(zip) {
      if (zip === null) {
        return;
      }
      this.UI.btn_open.is_loading = true;
      this.json_data = null;
      this.json_data = await import_zip(zip);
      await viewer_store.setItem('json_data', this.json_data);
      this.UI.btn_open.is_loading = false;

    },
    async load_last_zip() {
      let data = await viewer_store.getItem('json_data');
      if (!data) {
        alert('Cannot find last zip file');
        return;
      }
      this.regenerate_url(data);
      this.json_data = data;
    },
    regenerate_url(data) {
      if (data == null) {
        data = this.json_data;
      }

      Channels.forEach(channel => {
        data.windows[channel].forEach(item => {
          item.url = URL.createObjectURL(item.file);
        })
      })
    },
    request_fullscreen() {
      document.body.requestFullscreen();
    },
    exit_fullscreen() {
      document.exitFullscreen();
    },
    drop_file(e) {
      if (e.dataTransfer.files.length === 0) {
        return
      }
      let file = e.dataTransfer.files[0];
      this.load_zip(file);
    },
    dragover_handle(e) {
      e.preventDefault();
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

  .absolute-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

  }

  .btn-open.absolute {
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