<template>
  <Page>
    <v-card flat>
      <v-card-actions class="mb-4">
        <v-btn to="/">
          Annuler
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="secondary" dark @click="addProduct()" fab absolute right>
          <v-icon>add</v-icon>
        </v-btn>
      </v-card-actions>
      <v-data-table
          :headers="headers"
          :items="products"
          :search="search"
          hide-default-footer
          class="elevation-1"
          disable-pagination
          :options="tableOptions"
      >
        <template v-slot:top>
          <v-text-field
              prepend-inner-icon="search"
              label="Recherche"
              single-line
              hide-details
              v-model="search"
              class="mx-4"
          ></v-text-field>
        </template>
        <template v-slot:item.price="{ item }">
          {{ item.price | currency }}
        </template>
        <template v-slot:item.isAvailable="{ item }">
          <v-icon v-if="item.isAvailable">
            done
          </v-icon>
          <v-icon v-else>
            clear
          </v-icon>
        </template>
        <template v-slot:item.createdAt="{ item }">
          {{ item.createdAt | dayDate }}
        </template>
        <template v-slot:item.edit="{ item }">
          <v-btn icon class="mx-0" @click="editProduct(item.id)">
            <v-icon color="secondary">edit</v-icon>
          </v-btn>
        </template>
        <v-layout slot="no-results">
          <v-flex xs3></v-flex>
          <v-flex xs6 class="text-h6">
            Votre recherche pour "{{ search }}" n'a retourné aucun résultat.
          </v-flex>
          <v-flex xs3></v-flex>
        </v-layout>
      </v-data-table>
    </v-card>
  </Page>
</template>

<script>
import ProductService from "@/service/ProductService";

export default {
  name: "Products",
  components: {
    Page: () => import('@/components/Page'),
  },
  mounted: async function () {
    const response = await ProductService.listAll();
    this.products = response.data;
  },
  data: function () {
    return {
      search: null,
      products: [],
      tableOptions: {
        sortBy: ['createdAt'],
        sortDesc: [true]
      },
      headers: [
        {
          text: "Nom",
          value: 'name'
        },
        {
          text: "Catégorie",
          value: 'category.name'
        },
        {
          text: "Quantité",
          value: "nbInStock"
        },
        {
          text: "Affiché",
          value: 'isAvailable'
        },
        {
          text: "Créé",
          value: 'createdAt'
        },
        {
          text: '',
          sortable: false,
          value: 'edit'
        }
      ],
    }
  },
  methods: {
    addProduct: function () {
      this.$router.push({
        name: 'ProductCreate'
      })
    },
    editProduct: function (productId) {
      this.$router.push({
        path: '/product/' + productId
      })
    }
  }
}
</script>

<style scoped>

</style>
