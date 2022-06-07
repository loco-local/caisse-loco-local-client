<template>
  <Page>
    <h2 class="mb-8">Transactions</h2>
    <v-card class="mb-12">
      <v-card-title>
        Filtres
      </v-card-title>
      <v-card-text>
        <v-menu
            ref="lowerDateMenu"
            v-model="lowerDateMenu"
            :close-on-content-click="false"
            :return-value.sync="lowerDateMenu"
            transition="scale-transition"
            offset-y
            min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
                v-model="lowerDate"
                label="Date de début"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="lowerDate" @change="lowerDateMenu=false"></v-date-picker>
        </v-menu>
        <v-spacer></v-spacer>
        <v-menu
            ref="higherDateMenu"
            v-model="higherDateMenu"
            :close-on-content-click="false"
            :return-value.sync="higherDateMenu"
            transition="scale-transition"
            offset-y
            min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
                v-model="higherDate"
                label="Date de fin"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="higherDate" @change="higherDateMenu=false"></v-date-picker>
        </v-menu>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="updateTransactions">Appliquer</v-btn>
      </v-card-actions>
    </v-card>
    <TransactionItems :transactionItems="notAddedInWave" class="mb-12" :showPaymentMethod="true">
      <div slot="title">
        Pas ajoutées dans Wave
      </div>
    </TransactionItems>
    <TransactionItems :transactionItems="interactTransactions">
      <div slot="title">
        Interact
      </div>
    </TransactionItems>
    <TransactionItems :transactionItems="cashTransactions" class="mb-12">
      <div slot="title">
        Cash
      </div>
    </TransactionItems>
    <TransactionItems :transactionItems="prepaidTransactions" class="mb-12">
      <div slot="title">
        Prépayé
      </div>
    </TransactionItems>
    <TransactionItems :transactionItems="bankTransferTransactions">
      <div slot="title">
        Transfert Bancaire
      </div>
    </TransactionItems>
  </Page>
</template>

<script>
import TransactionService from "@/service/TransactionService";
import {sub, startOfMonth, endOfMonth, format, startOfDay, endOfDay} from 'date-fns'
import Transaction from "@/Transaction";

export default {
  name: "TransactionItemsPage",
  components: {
    Page: () => import('@/components/Page'),
    TransactionItems: () => import('@/components/TransactionItems'),
  },
  data: function () {
    return {
      transactionItems: [],
      lowerDate: null,
      lowerDateMenu: null,
      higherDate: null,
      higherDateMenu: null
    };
  },
  mounted: async function () {
    let lastMonth = sub(new Date(), {
      months: 1,
    });
    this.lowerDate = format(startOfMonth(lastMonth), "yyyy-MM-dd");
    this.higherDate = format(endOfMonth(lastMonth), "yyyy-MM-dd");
    await this.updateTransactions();
  },
  methods: {
    updateTransactions: async function () {
      let lowerDate = new Date(this.lowerDate);
      lowerDate = startOfDay(lowerDate);
      let higherDate = new Date(this.higherDate);
      higherDate = endOfDay(higherDate);
      const response = await TransactionService.listAllDetails(lowerDate, higherDate);
      this.transactionItems = response.data.map((transaction) => {
            let personName = transaction.Transaction.personName;
            personName = personName === null ? "" : " " + personName;
            transaction.description = transaction.description + personName;
            transaction.paymentMethodText = Transaction.paymentMethodText(transaction.Transaction.paymentMethod);
            return transaction;
          }
      );
    }
  },
  computed: {
    prepaidTransactions: function () {
      return this.transactionItems.filter((transaction) => {
        return transaction.Transaction.paymentMethod === 'prepaid'
      });
    },
    cashTransactions: function () {
      return this.transactionItems.filter((transaction) => {
        return transaction.Transaction.paymentMethod === 'cash'
      });
    },
    interactTransactions: function () {
      return this.transactionItems.filter((transaction) => {
        return transaction.Transaction.paymentMethod === 'interact'
      });
    },
    bankTransferTransactions: function () {
      return this.transactionItems.filter((transaction) => {
        return transaction.Transaction.paymentMethod === 'bankTransfer'
      });
    },
    notAddedInWave: function () {
      return this.transactionItems.filter((transaction) => {
        return transaction.isAddedToWave === null || transaction.isAddedToWave === false;
      });
    }
  }
}
</script>

<style scoped>

</style>
