<template>
  <Page style="height:100%;" class="vh-center">
    <v-card flat>
      <v-card-title class="vh-center">
        Caisse du Loco Local
        <v-icon right color="" large>savings</v-icon>
      </v-card-title>
      <v-card-text>
        <v-btn to="/transaction" v-breathing-colors="locoColors" dark x-large height="175" width="250"
               style="font-size: 20px;">
          Démarrer
        </v-btn>
      </v-card-text>
    </v-card>
    <v-dialog v-model="fullscreenDialog" width="600">
      <v-card>
        <v-card-title>
          Allez en plein écran
          <v-spacer></v-spacer>
          <v-icon click="fullscreenDialog=false">close</v-icon>
        </v-card-title>
        <v-card-actions>
          <v-btn @click="goFullScreen()">
            Oui
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </Page>
</template>

<script>
import BreathingColors from '@/BreathingColors'

export default {
  name: "Landing",
  components: {
    Page: () => import('@/components/Page')
  },
  data: () => {
    return {
      locoColors: BreathingColors.buildLocoColors(),
      fullscreenDialog: false
    }
  },
  mounted: function () {
    this.locoColors = BreathingColors.buildLocoColors();
    if (this.$route.name === "Kiosque" && !this.isFullScreen()) {
      this.fullscreenDialog = true;
    }
  },
  methods: {
    isFullScreen: function () {
      return document.fullscreenElement || document.webkitFullscreenElement ||
          document.mozFullScreenElement;
    },
    goFullScreen: function () {
      document.documentElement.webkitRequestFullScreen();
      this.fullscreenDialog = false;
    }
  }
}
</script>

<style scoped>

</style>
