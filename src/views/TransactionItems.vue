<template>
  <Page>
    <v-card flat>
      <v-card-actions class="mb-4">
        <v-spacer></v-spacer>
      </v-card-actions>
      <v-data-table
          :headers="headers"
          :items="transactionItems"
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
        <template v-slot:item.Product.name="{ item }">
          {{ item.Product.name }}
          <span v-if="item.info">{{item.info.name}}</span>
        </template>
        <template v-slot:item.createdAt="{ item }">
          {{ item.createdAt | dayDate }}
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
    <v-snackbar
        v-model="categoryModifySuccess"
        bottom
        color="accent"
        dark
        :timeout="7000"
        class="font-weight-bold body-1"
    >
      La catégorie a été modifiée.
      <template v-slot:action="{ attrs }">
        <v-btn
            color="white"
            text
            icon
            v-bind="attrs"
            @click="categoryModifySuccess = false"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </Page>
</template>

<script>
import TransactionService from "@/service/TransactionService";

export default {
  name: "Transactions",
  components: {
    Page: () => import('@/components/Page'),
  },
  data: function () {
    return {
      transactionItems: [],
      search: null,
      tableOptions: {
        sortBy: ['createdAt'],
        sortDesc: [true]
      },
      headers: [
        {
          text: "# Facture",
          value: 'TransactionId'
        },
        // totalPrice: DataTypes.DOUBLE,
        // info: DataTypes.JSON,
        // totalPriceAfterRebate: DataTypes.DOUBLE,
        // rebates: DataTypes.JSON
        {
          text: "Nom",
          value: 'Product.name'
        },
        {
          text: "Prix unitaire",
          value: 'price'
        },
        {
          text: "Quantité",
          value: 'quantity'
        },
        {
          text: "Prix total",
          value: 'totalPrice'
        },
        {
          text: "Créé",
          value: 'createdAt'
        }
      ],
    };
  },
  mounted: async function () {
    const response = await TransactionService.listAllDetails();
    this.transactionItems = response.data;
  },
  methods: {}
}
</script>

<style scoped>

</style>
