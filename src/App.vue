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
      <v-btn to="/comptes" text v-if="$route.name === 'Landing'">
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
      <v-list class="">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              Transactions
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-subheader class="font-weight-bold">
          Produits
        </v-subheader>
        <v-list-item
            to="/produits"
        >
          <v-list-item-content>
            <v-list-item-title>
              Liste
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
            to="/produits/catégories"
        >
          <v-list-item-content>
            <v-list-item-title>
              Catégories
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
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
        "Products",
        "ProductEdit",
        "ProductCreate"
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
