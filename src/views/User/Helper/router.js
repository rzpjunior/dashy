export default [
    {
        path: '/user/helper',
        name: 'Helper',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Helper List'
        },
        props: true,
    },
    {
        path: '/user/helper/create',
        name: 'HelperCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Create Helper',
            breadcrumbs : [
                {
                    text: 'Helper List',
                    to : '/user/helper'
                },
                {
                    text: 'Create Helper',
                },
            ],
        },
        props: true,
    },
    {
        path: '/user/helper/update/:id',
        name: 'HelperUpdate',
        component: () => import("./Update"),
        meta: {
            auth: true,
            title: 'Update Helper',
            breadcrumbs : [
                {
                    text: 'Helper List',
                    to : '/user/helper'
                },
                {
                    text: 'Update Helper',
                },

            ]
        },
    },
]