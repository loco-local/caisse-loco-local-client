<template>
  <Page>
    <v-toolbar class="mb-0" elevation="0">
      <v-btn color="primary" @click="back" class="mt-3 mb-3 ml-3">
        Annuler
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn :dark="transactionItemsTotal > 0" color="primary" :disabled="transactionItemsTotal <= 0"
             @click="showCompleteTransactionModal = true; showConfirmSnackbar= false;">
        Compléter la transaction
      </v-btn>
    </v-toolbar>
    <v-card flat class="" color="transparent">
      <!--      <v-card-title class="logo-font text-h4">-->
      <!--        Transaction-->
      <!--      </v-card-title>-->
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
      <v-card-subtitle class="body-1 text-left mb-4 font-italic">
        Les prix sont taxes incluses
      </v-card-subtitle>
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
            <v-card height="150" @click="selectProduct(product)" class="vh-center">
              <v-card-title class="vh-center">
                {{ product.name }}
              </v-card-title>
              <v-card-subtitle v-if="product.price" class="mt-1 text-h6">
                {{product.price | currency}}
                <small v-if="product.isPriceInKg">/kg</small>
              </v-card-subtitle>
              <v-card-text>
                {{ product.description }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-row>
    </v-card>
    <v-dialog v-model="productQuantityDialog" v-if="productQuantityDialog" max-width="600">
      <v-card>
        <v-card-title class="vh-center">
          {{ selectedProduct.name }}
        </v-card-title>
        <v-card-subtitle class="text-center">
          {{ selectedProduct.category.name }}
        </v-card-subtitle>
        <v-card-text>
          <v-form ref="quantityForm">
            <v-row class="vh-center">
              <v-col cols="4">
                <v-text-field
                    label="Poids"
                    ref="quantityInput"
                    v-model="productQuantity"
                    suffix="kg"
                    :rules="[Rules.required]"
                    required
                    type="number"
                    size="5"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="productQuantityDialog=false">
            Annuler
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="confirmQuantity">
            Confirmer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
        color="secondary"
        :timeout="9999999"
        bottom
        multi-line
        v-model="showConfirmSnackbar"
        class="pl-8 pb-8"
    >
      <span class="font-weight-bold body-1">
        Total: {{ transactionItemsTotal | currency }}
      </span>
      <v-btn dark color="primary" class="ml-8" :disabled="selectedProducts.length === 0"
             @click="showCompleteTransactionModal = true; showConfirmSnackbar= false;">
        Compléter la transaction
      </v-btn>
      <template v-slot:action="{ attrs }">
        <v-btn icon dark color="secondary" class="ml-8" @click.native="showConfirmSnackbar = false" v-bind="attrs">
          <v-icon color="white">close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <v-dialog v-model="showCompleteTransactionModal" eager>
      <v-card>
        <v-card-text class="pt-8">
          <TransactionDetails :products="selectedProducts" @onTotal="setTransactionItemsTotal"
                              :ardoiseUser="null"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" text
                 @click.native="showCompleteTransactionModal = false; showConfirmSnackbar = true">
            Annuler
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </Page>
</template>

<script>
import ProductService from "@/service/ProductService";
import Rules from '@/Rules'

export default {
  name: "Transaction",
  components: {
    Page: () => import('@/components/Page'),
    TransactionDetails: () => import('@/components/TransactionDetails'),
  },
  data: function () {
    return {
      Rules: Rules,
      isLoading: false,
      categories: {},
      selectedProduct: null,
      selectedProducts: [],
      productQuantityDialog: false,
      productQuantity: null,
      transactionItemsTotal: 0,
      showConfirmSnackbar: false,
      showCompleteTransactionModal: false
    }
  },
  methods: {
    setTransactionItemsTotal: function (value) {
      this.transactionItemsTotal = value
    },
    back: function () {
      window.history.back()
    },
    selectProduct: async function (product) {
      this.selectedProduct = product;
      this.productQuantity = null;
      this.productQuantityDialog = true;
      await this.$nextTick();
      setTimeout(() => {
        this.$refs.quantityInput.$el.querySelector("input").focus()
      })
    },
    confirmQuantity: function () {
      if (!this.$refs.quantityForm.validate()) {
        return;
      }
      this.selectedProduct.quantity = this.productQuantity;
      this.showConfirmSnackbar = true;
      this.selectedProducts.push(this.selectedProduct);
      this.productQuantityDialog = false;
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
    this.isLoading = false;
  }
}
</script>

<style scoped>

</style>
