export default [
    {
        path: '/configuration/warehouse-coverage',
        name: 'WarehouseCoverageList',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Warehouse Coverage'
        }
    },
    {
        path: '/configuration/warehouse-coverage/detail/:id',
        name: 'WarehouseCoverageDetail',
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: 'Warehouse Coverage Detail',
            breadcrumbs : [
                {
                    text: 'Warehouse Coverage List',
                    to : '/configuration/warehouse-coverage'
                },
                {
                    text: 'Warehouse Coverage Detail',
                },
            ],
        }
    },
]