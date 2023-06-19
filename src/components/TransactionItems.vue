<template>
  <v-card>
    <v-card-title>
      <slot name="title"></slot>
    </v-card-title>
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
      <template v-slot:item.Transaction.totalPrice="{ item }">
        {{ Math.abs(item.Transaction.totalPrice) | currency }}
      </template>
      <template v-slot:item.description="{ item }">
        {{ item.description }}
        <span v-if="item.info">{{ item.info.name }}</span>
      </template>
      <template v-slot:item.price="{ item }">
        {{ item.price | currency }}
      </template>
      <template v-slot:item.totalPrice="{ item }">
        <strong>
          {{ item.totalPrice | currency }}
        </strong>
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
</template>

<script>
import {format} from "date-fns";
import ExportToCsv from "@/ExportToCsv";

export default {
  name: "TransactionItems",
  components: {},
  props: ['transactionItems', 'showPaymentMethod'],
  data: function () {
    const headers = [
      {
        text: "# Facture",
        value: 'TransactionId'
      },
      {
        text: "Total Facture",
        value: 'Transaction.totalPrice'
      },
      // info: DataTypes.JSON,
      // totalPriceAfterRebate: DataTypes.DOUBLE,
      // rebates: DataTypes.JSON
      {
        text: "Nom",
        value: 'description'
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
        text: "Total item",
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
    ];
    headers.push({
      text: "Méthode",
      value: 'paymentMethodText'
    })
    return {
      tableOptions: {
        sortBy: ['TransactionId'],
        sortDesc: [true]
      },
      search: null,
      headers: headers,
    }
  },
  methods: {
    exportTransactionsToCsv: function () {
      let data = [
        [
          'Description',
          'Retrait',
          'Depot',
          'Date'
        ]
      ];
      let fileName = "transactions.csv";
      this.transactionItems.forEach((item) => {
        let withdrawal = 0;
        let deposit = 0;
        if (Math.sign(item.price) === -1) {
          deposit = Math.abs(item.totalPrice).toFixed(2);
        } else {
          withdrawal = item.totalPrice.toFixed(2);
        }
        data.push([
          item.description,
          parseFloat(withdrawal).toString().replace(".", ","),
          parseFloat(deposit).toString().replace(".", ","),
          format(new Date(), 'yyyy-MM-dd')
        ])
      })
      ExportToCsv.build(fileName, data);
    }
  }
}
</script>

<style scoped>

</style>
