<template>
  <Page>
    <div class="text-left mb-4">
      <v-btn to="/">
        Annuler
      </v-btn>
    </div>
    <v-card>
      <v-card-text>
        <v-form name="accountForm" ref="accountForm">
          <v-text-field v-model="account.firstname" label="Prénom"></v-text-field>
          <v-text-field v-model="account.lastname" label="Nom"></v-text-field>
          <v-text-field v-model="account.phone" label="Téléphone" prepend-icon="phone"></v-text-field>
          <v-text-field v-model="account.email" label="Courriel" prepend-icon="mail"></v-text-field>
          <v-text-field v-model="account.address" label="Adresse" prepend-icon="home"></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="create()" v-if="isCreate">
          Créer le compte
        </v-btn>
        <v-btn color="primary" @click="modify" v-if="!isCreate">
          Modifier le compte
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-if="!isCreate" raised class="mt-6 mb-6">
      <v-card-title>
        Ajouter fonds dans le compte
      </v-card-title>
      <v-card-text>
        <v-text-field label="Montant d'ajout dans le compte"
                      v-model="prepaidAmount"
                      type="number"
                      min="0"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="addFund">
          Ajouter
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-if="!isCreate">
      <v-card-title>
        Relevé de compte
      </v-card-title>
      <v-card-text>
        <v-simple-table>
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">
                #
              </th>
              <th class="text-left">
                Date
              </th>
              <th class="text-left">
                Dépôt
              </th>
              <th class="text-left">
                Retrait
              </th>
              <th class="text-left">
                Balance
              </th>
              <th class="text-left"></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="transaction in (transactions)" :key="transaction.id">
              <td class="text-left">
                {{ transaction.id }}
              </td>
              <td class="text-left">
                {{ transaction.createdAt | dayDate }}
              </td>
              <td class="text-left">
                {{ transaction.deposit | currency }}
              </td>
              <td class="text-left">
                {{ transaction.withdrawal | currency }}
              </td>
              <td class="text-left">
                {{ transaction.balance | currency }}
              </td>
              <td class="text-left">
                <!--                                <v-btn color="primary" @click="showDetails(item)">-->
                <!--                                  {{ $t('details') }}-->
                <!--                                </v-btn>-->
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </Page>
</template>

<script>
import UserService from "@/service/UserService";
import TransactionService from "@/service/TransactionService";

export default {
  name: "PrepaidAccount",
  components: {
    Page: () => import('@/components/Page')
  },
  data: function () {
    return {
      account: {},
      transactions: [],
      prepaidAmount: null
    };
  },
  mounted: async function () {
    this.account.id = this.$route.params.accountId
    if (!this.account.id) {
      return
    }
    let response = await UserService.getById(this.account.id);
    this.account = response.data;
    await this.buildTransactions();
  },
  methods: {
    create: function () {

    },
    modify: function () {

    },
    addFund: async function () {
      if (!this.prepaidAmount || this.prepaidAmount <= 0) {
        return
      }
      const amount = this.prepaidAmount;
      this.prepaidAmount = null
      await TransactionService.addFundToAccount(
          amount,
          this.account.id
      );
      await this.buildTransactions();
    },
    buildTransactions: async function () {
      let response = await TransactionService.listForUserId(this.account.id);
      this.transactions = response.data.map((transaction) => {
        if (Math.sign(transaction.totalPrice) === 1) {
          transaction.withdrawal = transaction.totalPrice
        } else {
          transaction.deposit = transaction.totalPrice * -1
        }
        return transaction;
      }).sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      })
    }
  },
  computed: {
    isCreate: function () {
      return this.account.id === undefined
    }
  }
}
</script>

<style scoped>

</style>
