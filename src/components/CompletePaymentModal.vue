<template>
  <v-dialog v-model="completedDialog"
            persistent
            max-width="600">
    <v-card>
      <v-card-title class="text-h6 text-center mb-4 vh-center">
        <div v-if="paymentMethod === 'prepaid' && accountBalance !== null">
          <div class="text-center">
            Merci !
          </div>
          Votre solde est maintenant de {{ accountBalance | currency }}
        </div>
        <div v-else class="text-center">
          <div>
            Veuillez payer le montant de <strong>{{ amount | currency }}</strong>
          </div>
          <div class="text-center">
            Merci !
          </div>
        </div>
      </v-card-title>
      <v-card-subtitle class="vh-center body-1">
        <div v-if="paymentMethod === 'cash'">
          Déposez l'argent comptant dans la caisse sous la balance
        </div>
        <div v-if="paymentMethod === 'interact'">
          Virement interact à admin@loco-local.net
          <div>
            Utilisez <strong class="font-italic">bonaventure</strong> comme réponse à la question
          </div>
        </div>
        <v-row class="vh-center" v-if="paymentMethod === 'bankTransfer'">
          <v-col cols="12" class="vh-center">
            <strong class="mr-2">Notre folio:</strong> 40001
          </v-col>
          <v-col cols="12" class="vh-center">
            <strong class="mr-2">No institution:</strong> 815
          </v-col>
          <v-col cols="12" class="vh-center">
            <strong class="mr-2">Folio:</strong> 0451286
          </v-col>
          <v-col cols="12">
            <p class="text-center">
              Vous pouvez également trouver ces informations sur notre site web dans la section "DON ET PAIEMENTS"
            </p>
          </v-col>
        </v-row>
      </v-card-subtitle>
      <v-card-subtitle v-if="paymentMethod !== 'prepaid' && accountBalance !== null" class="vh-center body-1">
        Votre solde est maintenant de {{ accountBalance | currency }}
      </v-card-subtitle>
      <v-card-text>
        <v-layout row wrap flex align-center justify-center>
          <v-flex md6>
            Vous serez redirigé dans {{ disconnectTimeout }} secondes
          </v-flex>
          <v-flex md6 class="text-right">
            <v-btn color="primary" class="pull-right" @click="redirectToLanding()">
              Terminer
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "CompletePaymentModal",
  props: {
    paymentMethod: String,
    amount: Number,
    accountBalance: {
      type: Number,
      default:
          null
    }
  },
  data: function () {
    return {
      completedDialog: false,
      disconnectTimeout: null,
      timeoutInterval: null
    }
  },
  mounted: function () {
    clearInterval(this.timeoutInterval)
  },
  methods: {
    enter: function () {
      this.completedDialog = true;
      this.disconnectTimeout = 60;
      this.timeoutInterval = setInterval(() => {
        this.disconnectTimeout--;
        if (this.disconnectTimeout <= 0) {
          this.redirectToLanding()
        }
      }, 1000);
    },
    redirectToLanding: function () {
      clearInterval(this.timeoutInterval)
      this.$router.push({
        name: 'Landing'
      })
    }
  }
}
</script>

<style scoped>

</style>
