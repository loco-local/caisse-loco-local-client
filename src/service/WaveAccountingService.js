import Service from './Service'

export default {
    listCategories: function () {
        return Service.api().get('/wave-accounting/categories')
    }
}
