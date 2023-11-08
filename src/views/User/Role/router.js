export default [
    {
        path: '/user/role',
        name: 'Role',
        component: () => import("./Index.vue"),
        alias: '/role/index',
        meta: {
            auth: true,
            title: 'Role List'
        }
    },
    {
        path: '/user/role/detail/:id',
        name: 'RoleDetail',
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: 'Role Detail',
            breadcrumbs : [
                {
                    text: 'Role',
                    to : '/user/role'
                },
                {
                    text: 'Role Detail'
                }
            ],
        }
    },
    {
        path: '/user/role/update/:id',
        name:'RoleUpdate',
        component: () => import("./Update"),
        alias:'/role/update',
        meta: {
            auth: true,
            title: 'Role Update',
            breadcrumbs : [
                {
                    text: 'Role',
                    to : '/user/role'
                },
                {
                    text: 'Update Role'
                }
            ],
        },
        props: true,
    },
    {
        path: '/user/role/create',
        name: 'RoleCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Role Create',
            breadcrumbs : [
                {
                    text: 'Role',
                    to : '/user/role'
                },
                {
                    text: 'Create Role'
                }
            ],
        }
    },
]