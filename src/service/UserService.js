import Service from './Service'

export default {
    list: function () {
        return Service.api().get('/user')
    }
}
