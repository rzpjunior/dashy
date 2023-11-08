export default [
    {
        path: '/inventory/uom',
        name: 'UOM',
        component: () => import("./Index.vue"),
        alias: '/uom',
        meta: {
            auth: true,
            title: 'UOM'
        }
    },
    {
        path: '/inventory/uom/create',
        name: 'UomCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Create UOM',
            breadcrumbs : [
                {
                    text: 'UOM List',
                    to : '/inventory/uom'
                },
                {
                    text: 'Create UOM',
                },
            ],
        },
        props: true,
    },
]