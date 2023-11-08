export default [
    {
        path: '/finance/spt/term',
        name: 'SalesPaymentTerm',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Sales Term'
        },
        props: true,
    },
    {
        path: '/finance/spt/term/create',
        name: 'SalesPaymentTermCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Create Sales Term',
            breadcrumbs : [
                {
                    text: 'Sales Term',
                    to : '/finance/spt/term'
                },
                {
                    text: 'Create Sales Term',
                },
            ],
        },
        props: true,
    },
]