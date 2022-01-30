import Service from '@/service/Service'

export default {
    listForUserId: function (userId) {
        return Service.api().get(userId + '/transaction')
    },
    listAllDetails: function () {
        return Service.api().get('/transactions/details')
    },
    removeTransaction: function (transactionId) {
        return Service.api().delete('/transaction/' + transactionId)
    },
    getDetails: function (user, transaction) {
        return Service.api().get(user.id + '/transaction/' + transaction.id)
    },
    addForUserId: function (items, userId) {
        return Service.api().post(
            userId + '/transaction',
            items
        )
    },
    addForAnonymous: function (items) {
        return Service.api().post(
            '/transaction',
            items
        )
    },
    addFundToAccount: function (amount, accountId) {
        return Service.api().post(
            '/transaction/fund',
            {
                amount: amount,
                accountId: accountId
            }
        )
    }
}
