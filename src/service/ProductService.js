import Service from './Service'

export default {
    listAll: function () {
        return Service.api().get('/product')
    },
    listAvailable: function () {
        return Service.api().get('/product/available')
    },
    getById: function (productId) {
        return Service.api().get('/product/' + productId)
    },
    update: function (product) {
        return Service.api().put(
            '/product/' + product.id,
            product
        );
    },
    create: function (product) {
        return Service.api().post(
            '/product',
            product
        );
    }
}
