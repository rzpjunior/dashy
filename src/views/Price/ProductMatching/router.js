export default [
    {
        path: '/price/product-matching',
        name: 'ProductMatching',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Product Matching'
        }
    },
]