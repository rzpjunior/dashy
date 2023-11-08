export default [
    {
        path: '/customer/branch',
        name: 'Branch',
        component: () => import("./Index.vue"),
        alias: '/customer/Branch/v2',
        meta: {
            auth: true,
            title: 'Outlet'
        }
    },
    {
        path: '/customer/branch/detail/:id',
        name: 'BranchDetail',
        component: () => import("./Detail.vue"),
        meta: {
            auth: true,
            title: 'Outlet Detail',
            breadcrumbs : [
                {
                    text: 'Outlet',
                    to : '/customer/branch'
                },
                {
                    text: 'Outlet Detail',
                },
            ],
        }
    },
    {
        path: '/customer/branch/create',
        name:'BranchCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Create Outlet',
            breadcrumbs : [
                {
                    text: 'Outlet',
                    to : '/customer/branch'
                },
                {
                    text: 'Create Outlet',
                },
            ],
        },
        props: true,
    },
    {
        path: '/customer/branch/create/:id',
        name:'BranchCreateRegister',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Create Outlet',
            breadcrumbs : [
                {
                    text: 'Outlet',
                    to : '/customer/branch'
                },
                {
                    text: 'Create Outlet',
                },
            ],
        },
        props: true,
    },
    {
        path: '/customer/branch/update/:id',
        name:'BranchUpdate',
        component: () => import("./Update"),
        alias:'/customer/branch/update/v2/:id',
        meta: {
            auth: true,
            title: 'Update Outlet',
            breadcrumbs : [
                {
                    text: 'Outlet List',
                    to : '/customer/branch'
                },
                {
                    text: 'Outlet Detail',
                    to : '/customer/branch/detail/:id'
                },
                {
                    text: 'Update Outlet',
                },
            ],
        },
        props: true,
    },
    {
        path: '/customer/branch/convert/:id',
        name: 'BranchConvertArchetype',
        component: () => import("./Convert"),
        meta: {
            auth: true,
            title: 'Convert Archetype',
            breadcrumbs : [
                {
                    text: 'Outlet List',
                    to : '/customer/branch'
                },
                {
                    text: 'Outlet Detail',
                    to : '/customer/branch/detail/:id'
                },
                {
                    text: 'Convert Archetype',
                },
            ],
        }
    }
]