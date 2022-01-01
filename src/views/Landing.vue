<template>
  <Page style="height:100%;" class="vh-center">
    <v-card flat>
      <v-card-title class="vh-center">
        Caisse du Loco Local
      </v-card-title>
      <v-card-text>
        <v-btn to="/transaction" color="primary" x-large height="175" width="250" style="font-size: 20px;">Commencer</v-btn>
      </v-card-text>
    </v-card>
  </Page>
</template>

<script>
export default {
  name: "Landing",
  components: {
    Page: () => import('@/components/Page')
  },
}
</script>

<style scoped>

</style>
