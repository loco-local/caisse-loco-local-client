<template>
  <PageWrap>
    <v-card flat>
      <v-card-title>
        Administration
      </v-card-title>
    </v-card>
  </PageWrap>
</template>

<script>
export default {
  name: "AdministrationLanding",
  components: {
    PageWrap: () => import('@/components/PageWrap')
  }
}
</script>

<style scoped>

</style>
