<template>
  <Page>
    <v-card flat>
      <v-card-actions class="mb-4">
        <v-spacer></v-spacer>
        <v-btn color="" @click="exportTransactionsToCsv">
          Exporter en CSV
        </v-btn>
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
          <span v-if="item.info">{{ item.info.name }}</span>
        </template>
        <template v-slot:item.tps="{ item }">
          {{ item.tps | currency }}
        </template>
        <template v-slot:item.tvq="{ item }">
          {{ item.tvq | currency }}
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
  </Page>
</template>

<script>
import TransactionService from "@/service/TransactionService";
import {format} from 'date-fns'
import ExportToCsv from "@/ExportToCsv";

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
          text: "TVQ",
          value: 'tvq'
        },
        {
          text: "TPS",
          value: 'tps'
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
  methods: {
    exportTransactionsToCsv: function () {
      let data = [
        [
          'Description',
          'Withdrawal',
          'Deposit',
          'Date'
        ]
      ];
      let fileName = "transactions.csv";
      this.transactionItems.forEach((item) => {
        data.push([
          item.Product.name,
          item.price,
          0,
          format(new Date(), 'yyyy-MM-dd')
        ])
      })
      ExportToCsv.build(fileName, data);
    },
  },
  computed: {
    prepaidTransactions: function () {
      return this.transactionItems.filter(()=>{

      });
    },
    cashTransactions: function () {
      return this.transactionItems.filter(()=>{

      });
    },
    interactTransactions: function () {
      return this.transactionItems.filter(()=>{

      });
    }
  }
}
</script>

<style scoped>

</style>
