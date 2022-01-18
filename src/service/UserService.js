import Service from './Service'

export default {
    list: function () {
        return Service.api().get('/user')
    },
    getById: function (userId) {
        return Service.api().get('/user/' + userId);
    }
}
