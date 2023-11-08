export default [
    {
        path: '/sales/person',
        name: 'Salesperson',
        component: () => import("./Index.vue"),
        alias: '/sales/person/v2',
        meta: {
            auth: true,
            title: 'Salesperson List'
        }
    },
    {
        path: '/sales/person/bulkchange',
        name: 'BulkChangeSalesperson',
        component: () => import("./BulkChange"),
        meta: {
            auth: true,
            title: 'Bulk Change Salesperson',
            breadcrumbs : [
                {
                    text: 'Salesperson List',
                    to : '/sales/person'
                },
                {
                    text: 'Bulk Change Salesperson',
                },
            ],
        }
    },
]