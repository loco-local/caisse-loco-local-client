import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'LandingPage',
        component: () => import('../views/LandingPage.vue')
    },
    {
        path: '/kiosque',
        name: 'Kiosque',
        component: () => import('../views/LandingPage.vue')
    },
    {
        path: '/transaction',
        name: 'TransactionPage',
        component: () => import('../views/TransactionPage.vue')
    },
    {
        path: '/fafa',
        name: 'AdministrationLanding',
        component: () => import('../views/AdministrationLanding.vue')
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
    },
    {
        path: '/compte',
        name: 'AccountCreate',
        component: () => import('../views/PrepaidAccount.vue')
    },
    {
        path: '/produits',
        name: 'ProductsPage',
        component: () => import('../views/ProductsPage.vue')
    },
    {
        path: '/categories-produits',
        name: 'CategoriesPage',
        component: () => import('../views/CategoriesPage.vue')
    },
    {
        path: '/produit/:productId',
        name: 'ProductEdit',
        component: () => import('../views/ProductPage.vue')
    },
    {
        path: '/produit',
        name: 'ProductCreate',
        component: () => import('../views/ProductPage.vue')
    },
    {
        path: '/transactions',
        name: 'Transactions',
        component: () => import('../views/TransactionItemsPage.vue')
    }
]

const router = new VueRouter({
    mode    : 'history',
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
