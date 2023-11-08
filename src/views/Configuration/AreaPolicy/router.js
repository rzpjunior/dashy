export default [
    {
        path: '/configuration/area_policy',
        name: 'ConfigurationAreaPolicy',
        component: () => import("./Index.vue"),
        alias: '/area/policy/v2',
        meta: {
            auth: true,
            title: 'Area Policy'
        }
    },
    {
        path: '/configuration/area_policy/update/:id',
        name: 'AreaPolicyUpdate',
        component: () => import("./Update.vue"),
        meta: {
            auth: true,
            title: 'Update Area Policy',
            breadcrumbs : [
                {
                    text: 'Area Policy List',
                    to : '/configuration/area_policy'
                },
                {
                    text: 'Update Area Policy',
                },
            ],
        }
    },
]