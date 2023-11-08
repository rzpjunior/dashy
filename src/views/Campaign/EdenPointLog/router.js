export default [
    {
        path: '/campaign/eden-point-log',
        name: 'EdenPointLogList',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'EdenPoint Log List'
        }
    },
    {
        path: '/campaign/eden-point-log/detail/:id',
        name: 'EdenPointLogDetail',
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: 'EdenPoint Log Detail',
            breadcrumbs: [
                {
                    text: 'EdenPoint Log List',
                    to: '/campaign/eden-point-log'
                },
                {
                    text: 'EdenPoint Log Detail',
                },
            ],
        }
    },
]