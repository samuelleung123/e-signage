<template>
  <v-menu offset-y max-width="fit-content" min-width="fit-content">
    <template v-slot:activator="{ on, attrs }">
      <div>
        <div class="text-caption" v-if="label">{{ label }}</div>
        <v-card v-bind="attrs" v-on="on" width="fit-content" style="padding: 5px">
          <v-img :src="require('../assets/layouts/' + value +'.png')" max-width="100px"
                 style="border: 1px solid black"/>
        </v-card>
      </div>
    </template>
    <v-list style="padding: 0;width: fit-content">
      <template v-for="(item, index) in layouts">
        <v-list-item
            :key="item"
            @click="$emit('input', item)"
            dense
            style="padding: 5px"
        >
          <v-list-item-title>
            <v-img :src="require('../assets/layouts/' + item +'.png')" max-width="100px"
                   style="border: 1px solid black"/>
          </v-list-item-title>
        </v-list-item>
        <v-divider v-if="index < layouts.length - 1" :key="'line'+item"></v-divider>
      </template>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: "LayoutSelector",
  props: {
    label: {
      type: String,
      default() {
        return null;
      }
    },
    value: {
      type: String,
      default() {
        return '1';
      }
    },
  },
  model: {
    prop: 'value',
    event: 'input',
  },
  data() {
    return {
      layouts: [
        '1',
        '2',
        '3',
        '4'
      ]
    }
  }
}
</script>

<style scoped>

</style>