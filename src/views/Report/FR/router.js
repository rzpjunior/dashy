export default [
    {
        path: '/report/product-fridge',
        name: 'FridgeSOReport',
        component: () => import("./FridgeSOReport.vue"),
        meta: {
            auth: true,
            title: 'Product Fridge Report'
        }
    },
]