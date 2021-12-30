<template>
  <Page>
    <v-card flat class="pt-8" color="transparent">
      <v-card-title class="logo-font text-h4">
        Transaction
      </v-card-title>
      <v-card-actions :class="{
          'pl-0 pr-0': $vuetify.breakpoint.smAndDown
        }">
      </v-card-actions>
      <v-row v-if="isLoading">
        <v-col cols="12" md="4" class="text-center vh-center" v-for="n in 20" :key="n">
          <v-skeleton-loader
              width="250"
              type="image, list-item-two-line"
              color="transparent"
          ></v-skeleton-loader>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="categories.length === 0" cols="12" class="text-h6">
          <v-sheet height="400" class="grey--text">
            Pas de résultats
          </v-sheet>
        </v-col>

        <v-row wrap v-for="category in categories" :key="category.id" class="" v-else>
          <v-col cols="12" class="text-left" v-if="category.products.length > 1">
            <h4 class="">
              {{ category.name }}
            </h4>
          </v-col>
          <v-col cols="12" md="4" class="text-center" v-for="product in category.products"
                 :key="product.id">
            <v-card height="150">
              <v-card-title class="">
                {{ product.name }}
              </v-card-title>
              <v-card-text>
                {{ product.description }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-row>
    </v-card>
  </Page>
</template>

<script>
import ProductService from "@/service/ProductService";

export default {
  name: "Transaction",
  components: {
    Page: () => import('@/components/Page')
  },
  data: function () {
    return {
      isLoading: false,
      categories: {}
    }
  },
  mounted: async function () {
    this.isLoading = true;
    let response = await ProductService.listAvailable();
    const products = response.data;
    products.forEach((product) => {
      if (this.categories[product.CategoryId] === undefined) {
        this.categories[product.CategoryId] = {
          name: product.category.name,
          priority: product.category.priority,
          id: product.CategoryId,
          products: []
        }
      }
      this.categories[product.CategoryId].products.push(
          product
      );
    });
    this.categories = Object.values(this.categories).sort(function (a, b) {
      return a.priority - b.priority;
    });
    console.log(this.categories)
    this.isLoading = false;
  }
}
</script>

<style scoped>

</style>
