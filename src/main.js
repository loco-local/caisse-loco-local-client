import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'
import CurrencyFilter from '@/currencyFilter'

Vue.config.productionTip = false

CurrencyFilter.setup()

new Vue({
    vuetify,
    router,
    store,
    render: h => h(App)
}).$mount('#app')
