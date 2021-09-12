<template>
  <div style="height: 100%">
    <split-container style="height: 100%" position_key="editor_split_line" :max_percent="70" :min_percent="30">

      <template #right>
        <div style="padding: 15px; gap: 15px; display:flex; flex-direction: column">

          <v-text-field v-model="name" type="text" label="Name" placeholder="E-Signage" persistent-placeholder/>

          <layout-selector v-model="selected_layout" label="Layout"></layout-selector>

          <div class="d-flex " style="gap: 5px">
            <v-btn :loading="UI.btn_open.is_loading" @click="open_zip" color="primary">Open</v-btn>
            <v-btn :loading="UI.btn_download.is_loading" @click="download_zip" color="primary">Download</v-btn>
          </div>

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
                <div class="d-flex flex-column" style="gap: 15px">
                  <div v-for="item in items" :key="item.id" class="d-flex align-stretch" style="gap: 15px">
                    <window-item :item="item" style="width: 100px; height: 100px"></window-item>
                    <div class="d-flex flex-column" style="flex: 1">
                      <div>
                        {{ item.file.name }}
                      </div>
                      <v-spacer></v-spacer>
                      <div class="text-right">
                        <v-btn icon color="error" @click="remove_item(item)">
                          <v-icon>mdi-trash-can-outline</v-icon>
                        </v-btn>
                      </div>
                    </div>
                  </div>
                </div>

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

export default {
  name: "Editor",
  components: {WindowItem, ItemEditDialog, SplitContainer, LayoutSelector},
  data() {
    let windows = {};
    for (let i = 1; i < 5; i++) {
      windows[`${i}`] = [];
    }
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
      },
      name: "E-Signage",
      selected_layout: '1',
      windows: windows,
      layout_windows: {
        '1': ['1'],
        '2': ['1', '2'],
        '3': ['1', '2', '3'],
        '4': ['1', '2', '3', '4'],
      }
    }
  },
  mounted() {
    // this.create_item("1");
  },
  methods: {
    is_in_use(channel) {
      return this.layout_windows[`${this.selected_layout}`].includes(`${channel}`)
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
      await export_zip({
        name: this.name,
        selected_layout: this.selected_layout,
        windows: this.windows,
      })
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


    }
  }
}
</script>

<style scoped lang="scss">

</style>