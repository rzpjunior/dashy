export default [
    {
        path: '/sales/group',
        name: 'SalesGroup',
        component: () => import("./Index.vue"),
        alias: '/sales/group/v2',
        meta: {
            auth: true,
            title: 'Sales Group List'
        }
    },
    {
        path: '/sales/group/create',
        name: 'SalesGroupeCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Sales Group Create',
            breadcrumbs : [
                {
                    text: 'Sales Group List',
                    to : '/sales/group'
                },
                {
                    text: 'Sales Group Create',
                },
            ],
        }
    },
    {
        path: '/sales/group/detail/:id',
        name: 'SalesGroupeDetail',
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: 'Sales Group Detail',
            breadcrumbs : [
                {
                    text: 'Sales Group List',
                    to : '/sales/group'
                },
                {
                    text: 'Sales Group Detail',
                },
            ],
        }
    },
    {
        path: '/sales/group/update/:id',
        name: 'SalesGroupeUpdate',
        component: () => import("./Update"),
        meta: {
            auth: true,
            title: 'Sales Group Update',
            breadcrumbs : [
                {
                    text: 'Sales Group List',
                    to : '/sales/group'
                },
                {
                    text: 'Sales Group Update',
                },
            ],
        }
    },
]