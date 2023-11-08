export default [
    {
        path: '/finance/payment',
        name: 'PaymentMethod',
        component: () => import("./Index.vue"),
        alias: '/finance/payment/v2',
        meta: {
            auth: true,
            title: 'Payment Method'
        }
    },
]