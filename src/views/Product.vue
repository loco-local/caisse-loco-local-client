<template>
  <Page>
    <v-card>
      <v-card-text>
        <v-form name="productForm" ref="productForm">
          <v-checkbox
              label="Est disponible"
              v-model="product.isAvailable"
          />
          <v-checkbox
              label="Est taxable"
              v-model="product.isTaxable"
          />
          <v-checkbox
              label="La quantité est en décimale"
              v-model="product.hasDecimalQuantity"
          />
          <v-text-field v-model="product.name" label="Nom"></v-text-field>
          <v-text-field v-model="product.description" label="Description"></v-text-field>
          <v-text-field
              label="Prix unitaire"
              v-model="product.price"
              :rules="[rules.required]"
              min="0"
              type="number"
          />
          <v-text-field
              label="Nb en stock"
              v-model="product.nbInStock"
              min="0"
              type="number"
          />
          <v-checkbox
              label="Est une activité"
              v-model="product.isActivity"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="create()" v-if="isCreate">
          Créer le compte
        </v-btn>
        <v-btn color="primary" @click="modify()" v-if="!isCreate">
          Modifier le compte
        </v-btn>
      </v-card-actions>
    </v-card>
  </Page>
</template>

<script>
import ProductService from "@/service/ProductService";
import Rules from '@/Rules'

export default {
  name: "Product",
  components: {
    Page: () => import('@/components/Page'),
  },
  data: function () {
    return {
      product: {},
      rules: Rules
    }
  },
  mounted: async function () {
    this.product.id = this.$route.params.productId
    if (!this.product.id) {
      return
    }
    const response = await ProductService.getById(this.product.id);
    this.product = response.data;
  },
  methods: {},
  computed: {
    isCreate: function () {
      return this.product.id === undefined
    }
  }
}
</script>

<style scoped>

</style>
