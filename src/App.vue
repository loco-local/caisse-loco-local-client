<template>
  <v-app>
    <v-app-bar
        app
        color="white"
    >
      <div class="d-flex align-center">
        <v-app-bar-nav-icon @click.stop="adminMenu = !adminMenu" v-if="isAdminPage"></v-app-bar-nav-icon>
        <router-link to="/">
          <v-img
              alt="Logo Loco Local"
              class="shrink mr-2"
              contain
              :src="require('@/assets/logo-loco-horizontal.png')"
              transition="scale-transition"
              width="140"
          />
        </router-link>
      </div>
      <v-spacer></v-spacer>
      <v-btn to="/comptes" text>
        <v-icon left size="25">
          account_circle
        </v-icon>
        Comptes Prépayés
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
            to="/produits"
        >
          <v-list-item-action>
            <v-icon></v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              Produits
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
        "Administration"
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
