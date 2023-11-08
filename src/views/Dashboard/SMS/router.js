export default [
    {
        path: '/fulfillment',
        name: 'Fulfillment',
        component: () => import("./Fulfillment.vue"),
        meta: {
            auth: true,
            title: 'Fulfillment Dashboard'
        }
    },
]