export default [
    {
        path: '/purchase/sales-recap',
        name: 'SalesRecap',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Sales Recap'
        }
    },
]