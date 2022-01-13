<template>
  <v-app>
    <v-app-bar
        app
        color="white"
        dark
    >
      <div class="d-flex align-center">
        <v-app-bar-nav-icon @click.stop="adminMenu = !adminMenu" v-if="isAdminPage"></v-app-bar-nav-icon>
        <v-img
            alt="Logo Loco Local"
            class="shrink mr-2"
            contain
            :src="require('@/assets/logo-loco-horizontal.png')"
            transition="scale-transition"
            width="140"
        />

        <v-img
            alt="Vuetify Name"
            class="shrink mt-1 hidden-sm-and-down"
            contain
            min-width="100"
            src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
            width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
          href="https://github.com/vuetifyjs/vuetify/releases/latest"
          target="_blank"
          text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
        v-if="isAdminPage"
        v-model="adminMenu"
        light
        app
        fixed
    >
      <v-list>
        <v-list-item
            value="true"
        >
          <v-list-item-action>
            <v-icon></v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              asdf
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <router-view/>
  </v-app>
</template>

<script>
import BreathingColors from '@/BreathingColors'

export default {
  name: 'App',

  components: {},

  data: () => {
    BreathingColors.setup();
    return {
      adminMenu: true
    }
  },
  computed: {
    isAdminPage: function () {
      return [
        "Administration",
        "ComptesPrépayés"
      ].indexOf(this.$route.name) !== -1;
    }
  }
};
</script>

<style lang="scss">
.vh-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
