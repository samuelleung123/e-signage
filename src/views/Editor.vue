<template>
  <div style="height: 100%">
    <split-container style="height: 100%" position_key="editor_split_line" :max_percent="70" :min_percent="30">

      <template #left>
        <e-signage-viewer v-if="UI.viewer.exists" :json_data="json_data" absolute></e-signage-viewer>
      </template>

      <template #right>
        <div style="padding: 15px; gap: 15px; display:flex; flex-direction: column">
          <div class="d-flex flex-wrap " style="gap: 5px">
            <v-btn :loading="UI.btn_open.is_loading" @click="open_zip" color="primary">Open</v-btn>
            <v-btn :loading="UI.btn_download.is_loading" @click="download_zip" color="primary">Download</v-btn>
            <v-btn @click="restart_viewer()" color="success">Restart</v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="$router.back()" color="error">Back</v-btn>
          </div>

          <v-text-field v-model="name" type="text" label="Name" placeholder="E-Signage" persistent-placeholder/>

          <layout-selector v-model="selected_layout" label="Layout"></layout-selector>

          <v-expansion-panels>
            <v-expansion-panel
                v-for="(items, channel) in windows"
                :key="channel"
            >
              <v-expansion-panel-header>
                Channel {{ channel }}
                <span v-if="!is_in_use(channel)" class="error--text pl-3">(Not In Use)</span>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <draggable class="d-flex flex-column" style="gap: 15px" v-model="windows[channel]">
                  <div v-for="item in items" :key="item.id" class="d-flex align-stretch" style="gap: 15px">
                    <window-item :item="item" style="width: 100px; height: 100px"></window-item>
                    <div class="d-flex flex-column" style="flex: 1">
                      <div style="word-break: break-all;">
                        {{ item.file.name }}
                      </div>
                      <v-spacer></v-spacer>
                      <div class="text-right">
                        <v-btn icon @click="copy_item(item)">
                          <v-icon>mdi-content-copy</v-icon>
                        </v-btn>
                        <v-btn icon @click="edit_item(item)">
                          <v-icon>mdi-lead-pencil</v-icon>
                        </v-btn>
                        <v-btn icon color="error" @click="remove_item(item)">
                          <v-icon>mdi-trash-can-outline</v-icon>
                        </v-btn>
                      </div>
                    </div>
                  </div>
                </draggable>

                <div class="text-center pt-3">
                  <v-btn color="primary" @click="create_item(channel)">Add Item</v-btn>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

        </div>
      </template>

    </split-container>
    <item-edit-dialog ref="item_edit_dialog" @save="add_to_channel($event)"></item-edit-dialog>
  </div>
</template>

<script>
import LayoutSelector from "@/components/LayoutSelector.vue";
import SplitContainer from "@/components/SplitContainer.vue";
import ItemEditDialog from "@/components/ItemEditDialog.vue";
import WindowItem from "@/components/WindowItem.vue";
import {export_zip, import_zip, open_file_picker} from "@/helpers/ExportImportHelper.js";
import ESignageViewer from "@/components/E-Signage-Viewer.vue";
import {Channels, is_in_use, layout_windows} from "@/helpers/Global.js";
import draggable from 'vuedraggable'


export default {
  name: "Editor",
  components: {ESignageViewer, WindowItem, ItemEditDialog, SplitContainer, LayoutSelector, draggable},
  data() {
    let windows = {};

    Channels.forEach(i => {
      windows[`${i}`] = [];
    });

    return {
      UI: {
        item_dialog: {
          show: false,
        },
        btn_open: {
          is_loading: false,
        },
        btn_download: {
          is_loading: false,
        },
        viewer: {
          exists: true,
        }
      },
      name: "E-Signage",
      selected_layout: '1',
      windows: windows,
      layout_windows: layout_windows,
    }
  },
  computed: {
    json_data() {
      return {
        name: this.name,
        selected_layout: this.selected_layout,
        windows: this.windows,
      };
    }
  },
  mounted() {
    // this.create_item("1");
  },
  methods: {
    is_in_use(channel) {
      return is_in_use(this.selected_layout, channel);
    },
    create_item(channel) {
      this.$refs.item_edit_dialog.open({channel});
    },
    add_to_channel(item) {
      let channel = this.windows[item.channel];
      let index = channel.findIndex(i => i.id === item.id);
      if (index === -1) {
        channel.push(item);
      } else {
        channel.splice(index, 1, item);
      }
    },
    async download_zip() {
      this.UI.btn_download.is_loading = true;
      await export_zip(this.json_data)
      this.UI.btn_download.is_loading = false;

    },
    async open_zip() {
      let zip = await open_file_picker();
      if (zip) {
        this.UI.btn_open.is_loading = true;
        let data = await import_zip(zip);
        this.selected_layout = data.selected_layout;
        this.windows = data.windows;
        this.name = data.name;
        this.UI.btn_open.is_loading = false;
      }
    },
    remove_item(item) {
      if (!confirm('Are you sure you want to delete this item?')) {
        return;
      }
      if (item) {
        let channel = this.windows[`${item.channel}`];
        let index = channel.indexOf(item);
        if (index !== -1) {
          channel.splice(index, 1);
        }
      }


    },
    edit_item(item) {
      this.$refs.item_edit_dialog.open(item);
    },
    copy_item(item) {
      let new_item = {...item};
      delete new_item.id;
      this.$refs.item_edit_dialog.open(new_item);
    },
    async restart_viewer() {
      this.UI.viewer.exists = false;
      await this.$nextTick();
      this.UI.viewer.exists = true;
    }
  }
}
</script>

<style scoped lang="scss">

</style>