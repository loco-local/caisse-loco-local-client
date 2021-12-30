import Service from './Service'

export default {
    listAvailable: function () {
        return Service.api().get('/product/available')
    }
}
