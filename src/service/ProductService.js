import Service from './Service'

export default {
    listAll: function () {
        return Service.api().get('/product')
    },
    listAvailable: function () {
        return Service.api().get('/product/available')
    }
}
