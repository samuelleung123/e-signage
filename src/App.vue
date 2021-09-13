<template>
  <v-app>
    <v-app-bar max-height="56px" color="primary" dark v-if="!$route.meta.fullscreen">{{ title }}</v-app-bar>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  computed: {
    title: function () {
      return this.$route.name || "E-Signage"
    },
  },
  data: () => ({
    //
  }),
};
</script>
