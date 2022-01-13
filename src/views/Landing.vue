<template>
  <Page style="height:100%;" class="vh-center">
    <v-card flat>
      <v-card-title class="vh-center">
        Caisse du Loco Local
        <v-icon right color="" large>savings</v-icon>
      </v-card-title>
      <v-card-text>
        <v-btn to="/transaction" v-breathing-colors="locoColors" dark x-large height="175" width="250" style="font-size: 20px;">
          Démarrer
        </v-btn>
      </v-card-text>
    </v-card>
  </Page>
</template>

<script>
import BreathingColors from '@/BreathingColors'
export default {
  name: "Landing",
  components: {
    Page: () => import('@/components/Page')
  },
  data: ()=>{
    return {
      locoColors: BreathingColors.buildLocoColors()
    }
  },
  mounted: function(){
    this.locoColors = BreathingColors.buildLocoColors();
  }
}
</script>

<style scoped>

</style>
