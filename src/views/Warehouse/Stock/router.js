export default [
    {
        path: '/warehouse/stock',
        name: 'Warehouse Stock',
        component: () => import("./Index.vue"),
        alias: '/warehouse/stock/v2',
        meta: {
            auth: true,
            title: 'Stock'
        }
    },
]
