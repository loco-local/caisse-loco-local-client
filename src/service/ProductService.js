import Service from './Service'

export default {
    listAll: function () {
        return Service.api().get('/product')
    },
    listAvailable: function () {
        return Service.api().get('/product/available')
    },
    getById: function(productId){
        return Service.api().get('/product/' + productId)
    }
}
