export default [
    {
        path: '/sales/sales-performance',
        name: 'SalesPerformance',
        component: () => import("./Index.vue"),
        alias: '/sales/sales-performance/v2',
        meta: {
            auth: true,
            title: 'Sales Performance List'
        }
    },
    {
        path: '/sales/sales-performance/detail/:date/:id',
        name: 'SalesPerformanceDetail',
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: 'Sales Performance Detail',
            breadcrumbs: [
                {
                    text: 'Sales Performance List',
                    to: '/sales/sales-performance'
                },
                {
                    text: 'Sales Performance Detail',
                },
            ],
        }
    },
]