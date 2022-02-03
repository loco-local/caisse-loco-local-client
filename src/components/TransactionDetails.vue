<template>
  <v-card flat>
    <v-card flat class="mb-2">
      <v-card-text>
        <strong v-if="areTransactionsCommited && products">
          {{ products[0].createdAt | date }}
        </strong>
      </v-card-text>
    </v-card>
    <v-card-text>
      <v-simple-table v-if="transactionItemsTotal > 0" class="mb-4">
        <template v-slot:default>
          <thead>
          <th v-for="header in headers" :key="header.value" class="text-left pl-4 s">
            {{ header.text }}
          </th>
          </thead>
          <tbody class="mt-4 mb-4">
          <tr
              v-for="item in transactionItems"
              :key="item.id"
          >
            <td class="text-left">
              {{ item.name }}
            </td>
            <td class="text-left pl-6">
              {{ item.amountWithoutTax | currency }}
            </td>
            <td class="text-left pl-6">
              {{ item.quantity }}
            </td>
            <td class="text-left">
              {{ (item.amountWithoutTax * item.quantity) | currency }}
              <span v-if="item.isTaxable">Tx</span>
            </td>

          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <strong v-if="transactionItems.length > 0" class="caption font-weight-bold">
                {{ tvqTotal | currency }}
                <span class="text-capitalize">
                TVQ
            </span>
              </strong>
            </td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <strong v-if="transactionItems.length > 0" class="caption font-weight-bold">
                {{ tpsTotal | currency }}
                <span class="text-capitalize">
                TPS
            </span>
              </strong>
            </td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <strong v-if="transactionItems.length > 0" class="subtitle-1 font-weight-bold">
                {{ transactionItemsTotal | currency }}
                <span class="text-capitalize">
                Total
            </span>
              </strong>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
    <span class="grey--text body-1 ml-8" v-if="transactionItemsTotal === 0">
      Pas encore d'items
    </span>
    <v-dialog v-model="confirmRemove" width="600">
      <v-card>
        <v-card-title>
          Vraiment supprimer cette transaction ?
        </v-card-title>
        <v-card-actions>
          <v-btn text>
            Annuler
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="removeTransaction()" :loading="removeLoading" :disabled="removeLoading">
            Confirmer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-btn color="primary" class="ml-2 left" @click="confirmRemove=true"
           :disabled="prepaidUser !== null"
           v-if="areTransactionsCommited && transactionId && $store.state.user.status === 'admin'"
    >
      <v-icon>delete</v-icon>
      Supprimer la transaction
    </v-btn>
    <v-dialog
        v-model="showTransactionMsgSuccess"
        persistent
        max-width="600"
    >
      <v-card>
        <v-card-title class="text-h6 text-center mb-4 vh-center">
          <span v-if="isPrepaidUser">
            Votre solde est maintenant de {{ balance | currency }}
          </span>
          <div v-if="!isPrepaidUser" class="text-center">
            <div>
              Veuillez payer le montant de <strong>{{ transactionItemsTotal | currency }}</strong>
            </div>
            <div class="">
              Merci !
            </div>
          </div>
        </v-card-title>
        <v-card-text>
          <v-layout row wrap flex align-center justify-center>
            <v-flex md6>
              Vous serez redirigé dans {{ disconnectTimeout }} secondes
            </v-flex>
            <v-flex md6 class="text-right">
              <v-btn color="primary" class="pull-right" @click="redirectToLanding()">
                Terminer
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import TransactionService from '@/service/TransactionService'
import ProductService from '@/service/ProductService'

export default {
  name: 'TransactionDetails',
  data() {
    return {
      confirmRemove: false,
      tableOptions: {
        sortBy: ['nbInStock'],
        sortDesc: [true]
      },
      headers: [
        {
          text: 'Nom',
          value: 'name'
        },
        {
          text: 'Prix unitaire',
          value: 'amountWithoutTax'
        },
        {
          text: 'Quantité',
          value: 'quantity'
        },
        {
          text: 'Prix total'
        }
      ],
      showTransactionMsgSuccess: false,
      balance: null,
      disconnectTimeout: null,
      timeoutInterval: null,
      ProductService: ProductService,
      removeLoading: false
    }
  },
  props: [
    'products',
    'prepaidUser',
    'areTransactionsCommited',
    'transactionId'
  ],
  computed: {
    transactionItems: function () {
      return this.products.filter(function (item) {
        return item.quantity > 0
      }).map((item) => {
        item.amountWithoutTax = this.amountWithoutTax(item);
        item.tvqAmount = this.TVQFromAmountWithTax(item);
        item.tpsAmount = this.TPSFromAmountWithTax(item);
        return item;
      })
    },
    tvqTotal: function () {
      return this.products.reduce((total, item) => {
        return total + item.tvqAmount
      }, 0)
    },
    tpsTotal: function () {
      return this.products.reduce((total, item) => {
        return total + item.tpsAmount;
      }, 0)
    },
    transactionItemsTotal: function () {
      return this.transactionItems.reduce((sum, item) => {
            return sum + item.quantity * item.price;
          }, 0
      )
    },
    isPrepaidUser: function () {
      return this.prepaidUser !== null
    },
    isSubscribedUserFlow: function () {
      return this.isPrepaidUser && this.$store.state.user.id === this.prepaidUser.id
    }
  },
  watch: {
    transactionItemsTotal: function () {
      this.$emit(
          'onTotal',
          this.transactionItemsTotal
      )
    }
  },
  mounted: function () {
    clearInterval(this.timeoutInterval)
  },
  methods: {
    TVQFromAmountWithTax(product) {
      return product.isTaxable ? product.amountWithoutTax * 0.09975 * product.quantity : 0;
    },
    TPSFromAmountWithTax(product) {
      return product.isTaxable ? product.amountWithoutTax * 0.05 * product.quantity : 0;
    },
    amountWithoutTax(product) {
      return product.isTaxable ? product.price / 1.14975 : product.price;
    },
    removeTransaction: async function () {
      this.removeLoading = true;
      await TransactionService.removeTransaction(this.transactionId);
      this.removeLoading = false;
      this.$emit('removeTransaction');
    },
    completeTransaction: function () {
      this.$emit('completeTransaction');
      const transaction = this.prepaidUser ? TransactionService.addForUser(
          this.transactionItems,
          this.prepaidUser
      ) : TransactionService.addForAnonymous(
          this.transactionItems
      )
      transaction.then(function (transaction) {
        if (this.isSubscribedUserFlow) {
          return this.$router.push({
            name: 'AccountStatementPage'
          })
        }
        this.balance = parseFloat(transaction.data.balance)
        this.disconnectTimeout = 20
        this.showTransactionMsgSuccess = true
        this.timeoutInterval = setInterval(function () {
          this.disconnectTimeout--
          if (this.disconnectTimeout <= 0) {
            this.redirectToLanding()
          }
        }.bind(this), 1000)
      }.bind(this))
    },
    redirectToLanding: function () {
      clearInterval(this.timeoutInterval)
      this.$store.dispatch('setprepaidUser', null)
      this.$router.push({
        name: 'ArdoiseLanding'
      })
    }
  }
}
</script>

<style scoped>

</style>
