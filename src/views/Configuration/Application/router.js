export default [
    {
        path: '/configuration/application',
        name: 'WrtApp',
        component: () => import("./Index.vue"),
        alias: '/configurationApplication',
        meta: {
            auth: true,
            title: 'Application Config'
        }
    },
    {
        path: '/configuration/application/update/:id',
        name: 'ApplicationUpdate',
        component: () => import("./Update.vue"),
        meta: {
            auth: true,
            title: 'Update Application Config',
            breadcrumbs : [
                {
                    text: 'Application Config List',
                    to : '/configuration/application'
                },
                {
                    text: 'Update Application Config',
                },
            ],
        }
    },
]