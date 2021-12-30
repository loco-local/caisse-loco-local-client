import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Transaction',
        component: () => import('../views/Transaction.vue')
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
