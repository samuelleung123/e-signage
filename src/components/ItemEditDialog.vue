<template>
  <v-dialog
      v-model="show"
      v-bind="$attrs"
      v-on="$listeners"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar
          dark
          color="primary"
      >
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="save">
            Save
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-form v-if="item" ref="form" style="padding: 15px; gap: 15px" class="d-flex flex-column">
        <window-item :item="item" style="min-height: 300px" video_control @loaded="loaded"></window-item>
        <v-file-input :rules="rules.file"
                      :value="item.file"
                      label="File"
                      :placeholder="item.file && item.file.name"
                      persistent-placeholder
                      hide-details="auto"
                      @change="change_file"
        ></v-file-input>

        <v-text-field v-model="item.duration" type="number" label="Duration"/>

      </v-form>

    </v-card>
  </v-dialog>
</template>

<script>
import WindowItem from "@/components/WindowItem.vue";

export default {
  name: "ItemEditDialog",
  components: {WindowItem},
  data() {
    return {
      title: null,
      show: false,
      item: null,

    }
  },
  computed: {
    rules() {
      return {
        file: [
          () => (this.item.file != null) || "File cannot be empty!",
          () => this.item.file && (this.item.file.type.includes('image/') || this.item.file.type.includes('video/')) || "File must be image/video!",
        ]
      }
    }
  },
  methods: {
    open(item) {
      this.show = true;
      this.item = this.parse_item(item);
    },
    close() {
      this.show = false;
      this.item = null;
    },
    parse_item(obj) {
      if (obj == null) {
        obj = {};
      }

      return {
        id: Math.random().toString().substr(2),
        channel: "1",
        url: null,
        is_image: false,
        is_video: false,
        duration: 3,
        ...obj,
      }
    },
    change_file(file) {
      let item = this.item || {};
      let old_is_image = item.is_image;
      item.url = file ? URL.createObjectURL(file) : null;
      item.file = file;

      item.is_image = file ? file.type.includes('image/') : false;
      item.is_video = file ? file.type.includes('video/') : false;

      if (!old_is_image && item.is_image) {
        item.duration = 3;
      }

      this.item = item;
    },
    save() {
      if (!this.$refs.form.validate()) {
        return;
      }

      this.$emit('save', this.item);
      this.close();
    },
    loaded(e) {
      console.log(e);
      if (this.item.is_video) {
        this.item.duration = Math.ceil(e.target.duration)
      }
    }
  }
}
</script>

<style scoped>

</style>