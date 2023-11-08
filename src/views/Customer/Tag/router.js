export default [
    {
        path: '/customer/tag',
        name: 'Tag',
        component: () => import("./Index.vue"),
        alias: '/customer/tag/v2',
        meta: {
            auth: true,
            title: 'Customer Tag List'
        }
    },
    {
        path: '/customer/tag/create',
        name: 'TagCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Create Customer Tag',
            breadcrumbs : [
                {
                    text: 'Customer Tag List',
                    to : '/customer/tag'
                },
                {
                    text: 'Create Customer Tag',
                },
            ],
        }
    }
]