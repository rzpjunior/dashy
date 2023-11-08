export default [
    {
        path: '/configuration/area',
        name: 'ConfigurationArea',
        component: () => import("./Index.vue"),
        alias: '/configuration/area/v2',
        meta: {
            auth: true,
            title: 'Area'
        }
    },
    {
        path: '/configuration/area/detail/:id',
        name: 'ConfigurationAreaDetail',
        component: () => import("./Detail.vue"),
        meta: {
            auth: true,
            title: 'Area Detail',
            breadcrumbs : [
                {
                    text: 'Area List',
                    to : '/configuration/area'
                },
                {
                    text: 'Area Detail',
                },
            ],
        }
    },
]