export default [
    {
        path: '/sales/sales-order-edn',
        name: 'SalesOrderEDNList',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Sales Order EDN List'
        }
    },
    {
        path: '/sales/sales-order-edn/create',
        name: 'SalesOrderEDNCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Create Sales Order EDN',
            breadcrumbs: [
                {
                    text: 'Sales Order EDN List',
                    to: '/sales/sales-order-edn'
                },
                {
                    text: 'Create Sales Order EDN',
                },
            ],
        },
        props: true,
    }
]