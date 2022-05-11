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
          <v-text-field
              v-model="account.firstname"
              label="Prénom"
              @keyup="updateAccountPropOnKeyup($event, 'firstname')"
          ></v-text-field>
          <v-text-field
              v-model="account.lastname"
              label="Nom"
              @keyup="updateAccountPropOnKeyup($event, 'lastname')"
          ></v-text-field>
          <v-text-field
              v-model="account.phone"
              label="Téléphone"
              prepend-icon="phone"
              @keyup="updateAccountPropOnKeyup($event, 'phone')"
          ></v-text-field>
          <v-text-field
              v-model="account.email"
              label="Courriel"
              prepend-icon="mail"
              @keyup="updateAccountPropOnKeyup($event, 'email')"
          ></v-text-field>
          <v-text-field
              v-model="account.address"
              label="Adresse"
              prepend-icon="home"
              @keyup="updateAccountPropOnKeyup($event, 'address')"
          ></v-text-field>
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
    <v-card v-if="!isCreate" raised class="mt-6 mb-6">
      <v-card-title>
        Ajouter fonds dans le compte
      </v-card-title>
      <v-card-text>
        <v-text-field label="Montant d'ajout dans le compte"
                      v-model.number="prepaidAmount"
                      type="number"
                      min="0"
                      @keyup="updateModelOnKeyUp($event, 'prepaidAmount')"
        ></v-text-field>
        <v-radio-group v-model="paymentMethod" label="Mode de paiement">
          <v-radio
              label="Comptant"
              value="cash"
              class="pt-2 pb-2"
          ></v-radio>
          <v-radio
              label="Virement interact à horizonsgaspesiens@gmail.com"
              value="interact"
              class="pt-2 pb-2"
          ></v-radio>
        </v-radio-group>
      </v-card-text>
      <v-card-text class="pb-0">
        <v-text-field
            label="Votre nom"
            hint="Pour que l'on vous reconnaisse"
            v-model="personName"
            @keyup="updateModelOnKeyUp($event, 'personName')"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="addFund" :disabled="prepaidAmount === null || paymentMethod === null ">
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
    <CompletePaymentModal ref="completePaymentModal"
                          :amount="prepaidAmount"
                          :paymentMethod="paymentMethod"
                          :accountBalance="account.balance"></CompletePaymentModal>
    <v-snackbar
        v-model="createAccountSuccess"
        bottom
        color="accent"
        dark
        :timeout="7000"
        class="font-weight-bold body-1"
    >
      <v-icon left color="white">account_circle</v-icon>
      Le compte a été créé.
      <template v-slot:action="{ attrs }">
        <v-btn
            color="white"
            text
            icon
            v-bind="attrs"
            @click="createAccountSuccess = false"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
        v-model="modifyAccountSuccess"
        bottom
        color="accent"
        dark
        :timeout="7000"
        class="font-weight-bold body-1"
    >
      <v-icon left color="white">account_circle</v-icon>
      Le compte a été modifié.
      <template v-slot:action="{ attrs }">
        <v-btn
            color="white"
            text
            icon
            v-bind="attrs"
            @click="modifyAccountSuccess = false"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </Page>
</template>

<script>
import UserService from "@/service/UserService";
import TransactionService from "@/service/TransactionService";

export default {
  name: "PrepaidAccount",
  components: {
    Page: () => import('@/components/Page'),
    CompletePaymentModal: () => import('@/components/CompletePaymentModal'),
  },
  data: function () {
    return {
      account: {},
      transactions: [],
      prepaidAmount: null,
      paymentMethod: null,
      personName: null,
      createAccountSuccess: false,
      modifyAccountSuccess: false
    };
  },
  mounted: async function () {
    await this.setup();
  },
  methods: {
    updateAccountPropOnKeyup: function (event, model) {
      this.account[model] = event.target.value;
    },
    updateModelOnKeyUp: function (event, model) {
      this[model] = event.target.value;
    },
    setup: async function () {
      this.account.id = this.$route.params.accountId
      if (!this.account.id) {
        return
      }
      let response = await UserService.getById(this.account.id);
      this.account = response.data;
      this.personName = this.account.firstname + ' ' + this.account.lastname;
      await this.buildTransactions();
    },
    create: async function () {
      const response = await UserService.create(this.account);
      await this.$router.push({
        path: '/compte/' + response.data.id
      })
      this.createAccountSuccess = true;
      await this.setup();
    },
    modify: async function () {
      await UserService.update(this.account);
      this.modifyAccountSuccess = true;
      await this.setup();
    },
    addFund: async function () {
      if (!this.prepaidAmount || this.prepaidAmount <= 0) {
        return
      }
      this.account.balance += parseFloat(this.prepaidAmount);
      await TransactionService.addFundToAccount(
          this.prepaidAmount,
          this.account.id,
          this.paymentMethod,
          this.personName
      );
      this.$refs.completePaymentModal.enter();
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
