export default [
    {
        path: '/finance/term',
        name: 'PurchaseTerm',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Purchase Term'
        }
    },
    {
        path: '/finance/term/create',
        name: 'PurchaseTermCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Create Purchase Term',
            breadcrumbs : [
                {
                    text: 'Purchase Term',
                    to : '/finance/term'
                },
                {
                    text: 'Create Purchase Term',
                },
            ],
        }
    },
]