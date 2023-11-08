export default [
    {
        path: '/warehouse/stock-opname',
        name: 'StockOpname',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Stock Opname'
        }
    },
    {
        path: '/warehouse/stock-opname/create',
        name: 'StockOpnameCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Stock Opname Create',
            breadcrumbs : [
                {
                    text: 'Stock Opname',
                    to : '/warehouse/stock-opname'
                },
                {
                    text: 'Stock Opname Create',
                },
            ],
        }
    },
    {
        path: '/warehouse/stock-opname/:id',
        name:'StockOpnameDetail',
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: 'Stock Opname Detail',
            breadcrumbs : [
                {
                    text: 'Stock Opname',
                    to : '/warehouse/stock-opname'
                },
                {
                    text: 'Stock Opname Detail',
                },
            ],
        },
        props: true,
    },
]