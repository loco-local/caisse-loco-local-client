<template>
  <Page>
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
    <TransactionItems :transactionItems="interactTransactions">
      <div slot="title">
        Interact
      </div>
    </TransactionItems>
  </Page>
</template>

<script>
import TransactionService from "@/service/TransactionService";

export default {
  name: "TransactionItemsPage",
  components: {
    Page: () => import('@/components/Page'),
    TransactionItems: () => import('@/components/TransactionItems'),
  },
  data: function () {
    return {
      transactionItems: []
    };
  },
  mounted: async function () {
    const response = await TransactionService.listAllDetails();
    this.transactionItems = response.data.map((transaction) => {
          let personName = transaction.Transaction.personName;
          personName = personName === null ? "" : " " + personName;
          transaction.description = transaction.description + personName;
          return transaction;
        }
    )
  },
  methods: {}
  ,
  computed: {
    prepaidTransactions: function () {
      return this.transactionItems.filter((transaction) => {
        return transaction.Transaction.paymentMethod === 'prepaid'
      });
    }
    ,
    cashTransactions: function () {
      return this.transactionItems.filter((transaction) => {
        return transaction.Transaction.paymentMethod === 'cash'
      });
    }
    ,
    interactTransactions: function () {
      return this.transactionItems.filter((transaction) => {
        return transaction.Transaction.paymentMethod === 'interact'
      });
    }
  }
}
</script>

<style scoped>

</style>
