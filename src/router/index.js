import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Landing',
        component: () => import('../views/Landing.vue')
    },
    {
        path: '/transaction',
        name: 'Transaction',
        component: () => import('../views/Transaction.vue')
    },
    {
        path: '/fafa',
        name: 'Administration',
        component: () => import('../views/Administration.vue')
    },
    {
        path: '/comptes',
        name: 'ComptesPrépayés',
        component: () => import('../views/PrepaidAccounts.vue')
    },
    {
        path: '/compte/:accountId',
        name: 'AccountEdit',
        component: () => import('../views/PrepaidAccount.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior() {
        // if (savedPosition) {
        //     return new Promise((resolve) => {
        //         setTimeout(() => {
        //             resolve({
        //                 savedPosition
        //             });
        //         }, 1000);
        //     });
        // } else {
        //
        // }
        console.log("scroll behavior");
        return {x: 0, y: 0};
    },
    routes,
})

export default router
