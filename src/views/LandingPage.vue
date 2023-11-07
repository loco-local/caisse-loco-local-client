<template>
  <PageWrap style="height:100%;" class="vh-center">
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
      <v-card-actions class="vh-center mt-4">
        <v-btn @click="paymentMethodsDialog=true;">
          <v-icon left class="pr-0 mr-0">info_outlined</v-icon>
          Modes de paiements
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="paymentMethodsDialog" width="600">
      <v-card>
        <v-card-title class="text-h5 font-weight-regular">
          Modes de paiement
          <v-spacer></v-spacer>
          <v-icon @click="paymentMethodsDialog=false">close</v-icon>
        </v-card-title>
        <v-card-text>
          <v-list class="text-left">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-h6 font-weight-regular">
                  Comptant
                </v-list-item-title>
                <v-list-item-subtitle class="body-1">
                  Déposez l'argent dans la caisse qui se trouve sous la balance.
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-h6 font-weight-regular">
                  Virement interact à admin@loco-local.net
                </v-list-item-title>
                <v-list-item-subtitle class="body-1">
                  Utilisez la question "Ville" et la réponse "Bonaventure".
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-h6 font-weight-regular">
                  Transfert bancaire
                </v-list-item-title>
                <v-list-item-subtitle class="body-1">
                  Transit caisse: 40001, No institution: 815, Folio: 0451286.
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-h6 font-weight-regular">
                  Par chèque
                </v-list-item-title>
                <v-list-item-subtitle class="body-1">
                  À la coopérative de solidarité Horizons Gaspésiens.
                </v-list-item-subtitle>
                <v-list-item-subtitle class="body-1">
                  Déposez le chèque dans la caisse sous la balance.
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="paymentMethodsDialog=false">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    <v-footer padless absolute>
      <v-col
          class="vh-center"
          cols="12"
      >
        <span style="margin-bottom:-10px;">
          Assurez-vous de bien pouvoir lire ce texte tout en étant debout lorsque vous placez la tablette dans sa boîte en bois.
        </span>
      </v-col>
    </v-footer>
  </PageWrap>
</template>

<script>
import BreathingColors from '@/BreathingColors'

export default {
  name: "LandingPage",
  components: {
    PageWrap: () => import('@/components/PageWrap')
  },
  data: () => {
    return {
      locoColors: BreathingColors.buildLocoColors(),
      fullscreenDialog: false,
      paymentMethodsDialog: false
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
