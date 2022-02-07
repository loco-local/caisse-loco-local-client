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
    addForUserId: function (items, userId, personName) {
        return Service.api().post(
            userId + '/transaction',
            {
                items: items,
                personName: personName
            }
        )
    },
    addForAnonymous: function (items, paymentMethod, personName) {
        console.log(items)
        return Service.api().post(
            '/transaction',
            {
                items: items,
                paymentMethod: paymentMethod,
                personName: personName
            }
        )
    },
    addFundToAccount: function (amount, accountId, paymentMethod, personName) {
        return Service.api().post(
            '/transaction/fund',
            {
                amount: amount,
                accountId: accountId,
                paymentMethod: paymentMethod,
                personName: personName
            }
        )
    }
}
