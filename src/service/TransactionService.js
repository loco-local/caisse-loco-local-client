import Service from '@/service/Service'

export default {
    list: function (user) {
        return Service.api().get(user.id + '/transaction')
    },
    listAllDetails: function (yearFilter) {
        return Service.api().get('/transactions/details/' + yearFilter)
    },
    removeTransaction: function (transactionId) {
        return Service.api().delete('/transaction/' + transactionId)
    },
    getDetails: function (user, transaction) {
        return Service.api().get(user.id + '/transaction/' + transaction.id)
    },
    addForUser: function (items, user) {
        return Service.api().post(
            user.id + '/transaction',
            items
        )
    },
    addForAnonymous: function (items) {
        return Service.api().post(
            '/transaction',
            items
        )
    },
    addFundToSubscriber: function (amount, subscriber) {
        return Service.api().post(
            '/transaction/fund',
            {
                amount: amount,
                subscriberId: subscriber.id
            }
        )
    }
}
