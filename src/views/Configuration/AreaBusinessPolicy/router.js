export default [
    {
        path: '/configuration/area-business-policy',
        name: 'ConfigurationBusinessAreaPolicy',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Area Business Policy'
        }
    },
    {
        path: '/configuration/area-business-policy/update/:id',
        name: 'AreaPolicyBusinessUpdate',
        component: () => import("./Update.vue"),
        meta: {
            auth: true,
            title: 'Update Area Business Policy',
            breadcrumbs : [
                {
                    text: 'Area Business Policy List',
                    to : '/configuration/area-business-policy'
                },
                {
                    text: 'Update Area Business Policy',
                },
            ],
        }
    },
]