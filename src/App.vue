<template>
  <v-app>
    <ScreenSaver></ScreenSaver>
    <v-app-bar
        app
        color="white"
        height="120"
    >
      <div class="d-flex align-center mb-2" style="margin-top: auto;">
        <v-app-bar-nav-icon @click.stop="adminMenu = !adminMenu" v-if="isAdminPage"></v-app-bar-nav-icon>
        <router-link to="/">
          <v-img
              alt="Logo Loco Local"
              class="shrink mr-2 align-self-end"
              contain
              :src="require('@/assets/logo-loco-horizontal.png')"
              transition="scale-transition"
              width="140"
          />
        </router-link>
      </div>
      <v-spacer></v-spacer>
      <v-btn to="/comptes" text v-if="$route.name === 'LandingPage' || $route.name === 'Kiosque'" class="d-flex align-center" style="margin-top: auto;">
        <v-icon left size="25">
          account_circle
        </v-icon>
        <span v-if="$vuetify.breakpoint.mdAndUp">Comptes Prépayés</span>
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
        <v-list-item to="/transactions">
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
            to="/categories-produits"
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
import store from '@/store'
import Vue from "vue";
import IdleVue from "idle-vue";
import BreathingColors from "@/BreathingColors";

const fiveMinutesInMs = 300000;

Vue.use(IdleVue, {idleTime: fiveMinutesInMs, store})

export default {
  name: 'App',
  components: {
    ScreenSaver: () => import('@/components/ScreenSaver')
  },
  mounted: function () {
  },
  data: () => {
    BreathingColors.setup();
    return {
      adminMenu: true,
    }
  },
  computed: {
    isAdminPage: function () {
      return [
        "AdministrationLanding",
        "ProductsPage",
        "ProductEdit",
        "ProductCreate",
        "CategoriesPage",
        "Transactions"
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
