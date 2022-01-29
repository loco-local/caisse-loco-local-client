import Service from './Service'

export default {
    list: function () {
        return Service.api().get('/category')
    },
    create: function () {
        return Service.api().post('/category')
    },
    updatePriority: function (categoryId, priority) {
        return Service.api().put(
            '/category/priority/' + categoryId,
            {
                priority: priority
            }
        )
    },
    updateName: function (categoryId, name) {
        return Service.api().put(
            '/category/name/' + categoryId,
            {
                name: name
            }
        )
    },
}
