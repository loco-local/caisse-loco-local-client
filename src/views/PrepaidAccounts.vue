<template>
  <Page>
    <v-card flat>
      <v-card-actions class="mb-4">
        <v-btn to="/">
          Annuler
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="secondary" dark @click="addAccount()" fab absolute right>
          <v-icon>add</v-icon>
        </v-btn>
      </v-card-actions>
      <v-card-title>
        Comptes Prépayés
      </v-card-title>
      <v-data-table
          :headers="headers"
          :items="prepaidAccounts"
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
        <template v-slot:item.balance="{ item }">
          {{ item.balance | currency }}
        </template>
        <template v-slot:item.createdAt="{ item }">
          {{ item.createdAt | dayDate }}
        </template>
        <template v-slot:item.latestTransaction="{ item }">
          {{ item.latestTransaction | dayDate }}
        </template>
        <template v-slot:item.edit="{ item }">
          <v-btn icon class="mx-0" @click="editAccount(item.id)">
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
import UserService from "@/service/UserService";

export default {
  name: "PrepaidAccounts",
  components: {
    Page: () => import('@/components/Page')
  },
  data: function () {
    return {
      tableOptions: {
        sortBy: ['createdAt'],
        sortDesc: [true]
      },
      headers: [
        {
          text: "Prénom",
          value: 'firstname'
        },
        {
          text: "Nom",
          value: 'lastname'
        },
        {
          text: "Balance",
          value: 'balance'
        },
        {
          text: "Créé",
          value: 'createdAt'
        },
        {
          text: "Dernière transaction",
          value: 'latestTransaction'
        },
        {
          text: '',
          sortable: false,
          value: 'edit'
        }
      ],
      prepaidAccounts: [],
      search: ''
    }
  },
  methods: {
    addAccount: function () {
      this.$router.push({
        name: 'AccountCreate'
      })
    },
    editAccount: function (userId) {
      this.$router.push({
        path: '/compte/' + userId
      })
    }
  },
  mounted: async function () {
    const response = await UserService.list();
    this.prepaidAccounts = response.data.map(function (account) {
      account.balance = account.balance || 0;
      return account;
    })
  }
}
</script>

<style scoped>

</style>
