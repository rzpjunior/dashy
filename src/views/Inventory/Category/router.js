export default [
    {
        path: '/inventory/category',
        name: 'Category',
        component: () => import("./Index.vue"),
        alias: '/category',
        meta: {
            auth: true,
            title: 'Category'
        }
    },
    {
        path: '/inventory/category/create',
        name: 'CategoryCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Create Category',
            breadcrumbs : [
                {
                    text: 'Category List',
                    to : '/inventory/category'
                },
                {
                    text: 'Create Category',
                },
            ],
        }
    },
]