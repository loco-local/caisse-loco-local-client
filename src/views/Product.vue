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
              label="La quantité saisie par le client est en décimale"
              v-model="product.hasDecimalQuantity"
          />
          <v-text-field v-model="product.name" label="Nom" :rules="[rules.required]"></v-text-field>
          <v-select
              :items="categories"
              label="Catégorie"
              item-text="name"
              item-value="id"
              v-model="product.CategoryId"
          ></v-select>
          <v-text-field v-model="product.description" label="Description"></v-text-field>
          <v-checkbox
              label="Est taxable"
              v-model="product.isTaxable"
          />
          <v-checkbox
              label="Le prix est en kilogramme"
              v-model="product.isPriceInKg"
          />
          <v-text-field
              label="Prix unitaire"
              v-model="product.price"
              :rules="[rules.required]"
              min="0"
              hint="Le prix est taxes incluses"
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
          Créer le produit
        </v-btn>
        <v-btn color="primary" @click="modify()" v-if="!isCreate">
          Modifier le produit
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar
        v-model="modifyProductSuccess"
        bottom
        color="accent"
        dark
        :timeout="7000"
        class="font-weight-bold body-1"
    >
      Le produit a été modifié.
      <template v-slot:action="{ attrs }">
        <v-btn
            color="white"
            text
            icon
            v-bind="attrs"
            @click="modifyProductSuccess = false"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
        v-model="createProductSuccess"
        bottom
        color="accent"
        dark
        :timeout="7000"
        class="font-weight-bold body-1"
    >
      Le produit a été ajouté.
      <template v-slot:action="{ attrs }">
        <v-btn
            color="white"
            text
            icon
            v-bind="attrs"
            @click="createProductSuccess = false"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </Page>
</template>

<script>
import ProductService from "@/service/ProductService";
import Rules from '@/Rules'
import CategoryService from "@/service/CategoryService";

export default {
  name: "Product",
  components: {
    Page: () => import('@/components/Page'),
  },
  data: function () {
    return {
      categories: [],
      product: {},
      rules: Rules,
      modifyProductSuccess: false,
      createProductSuccess: false
    }
  },
  mounted: async function () {
    let response = await CategoryService.list();
    this.categories = response.data;
    await this.setup();
  },
  methods: {
    setup: async function () {
      this.product.id = this.$route.params.productId
      if (!this.product.id) {
        return
      }
      const response = await ProductService.getById(this.product.id);
      this.product = response.data;
    },
    create: async function () {
      if (!this.$refs.productForm.validate()) {
        return
      }
      const response = await ProductService.create(this.product);
      await this.$router.push({
        path: '/produit/' + response.data.id
      })
      this.createProductSuccess = true;
      await this.setup();
    },
    modify: async function () {
      if (!this.$refs.productForm.validate()) {
        return
      }
      await ProductService.update(this.product);
      this.modifyProductSuccess = true;
    }
  },
  computed: {
    isCreate: function () {
      return this.product.id === undefined
    }
  }
}
</script>

<style scoped>

</style>
