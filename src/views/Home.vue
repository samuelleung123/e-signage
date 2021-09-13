<template>
  <div class="d-flex justify-space-around align-center" style="gap: 15px; padding: 15px;height: 100%">
    <router-link to="/viewer" style=";text-decoration: none">
      <v-card min-width="300px" max-width="100%">
        <v-card-text class="text-center">
          <v-icon size="200">mdi-monitor</v-icon>
          <div>Viewer</div>
        </v-card-text>
      </v-card>
    </router-link>
    <router-link to="/editor" style=";text-decoration: none">
      <v-card min-width="300px" max-width="100%">
        <v-card-text class="text-center">
          <v-icon size="200">mdi-application-edit-outline</v-icon>
          <div>Editor</div>
        </v-card-text>
      </v-card>
    </router-link>
  </div>
</template>

<script>

  export default {
    name: 'Home',
    components: {
    },
  }
</script>
