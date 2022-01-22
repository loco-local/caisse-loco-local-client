import Service from './Service'

export default {
    list: function () {
        return Service.api().get('/user')
    },
    getById: function (userId) {
        return Service.api().get('/user/' + userId);
    },
    create: function (user) {
        return Service.api().post(
            '/user',
            user
        );
    },
    update: function (user) {
        return Service.api().put(
            '/user/' + user.id,
            user
        );
    }
}
