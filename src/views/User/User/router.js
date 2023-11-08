export default [
    {
        path: '/user/user',
        name: 'User',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'User'
        }
    },
    {
        path: '/user/user/create',
        name: 'UserCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'User Create',
            breadcrumbs : [
                {
                    text: 'User',
                    to : '/user/user'
                },
                {
                    text: 'Create User'
                },
            ],
        }
    },
    {
        path: '/user/user/reset-password/:id',
        name: 'UserResetPassword',
        component: () => import("./ResetPassword"),
        meta: {
            auth: true,
            title: 'User Reset Password',
            breadcrumbs : [
                {
                    text: 'User',
                    to : '/user/user'
                },
                {
                    text: 'User Detail',
                    to : '/user/user/detail/:id'
                },
                {
                    text: 'Reset Password'
                },
            ],
        }
    },
    {
        path: '/user/user/detail/:id',
        name: 'UserDetail',
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: 'User Detail',
            breadcrumbs : [
                {
                    text: 'User',
                    to : '/user/user'
                },
                {
                    text: 'User Detail',
                },
            ],
        }
    },
    {
        path: '/user/user/update/:id',
        name:'UserUpdate',
        component: () => import("./Update"),
        meta: {
            auth: true,
            title: 'User Update',
            breadcrumbs : [
                {
                    text: 'User',
                    to : '/user/user'
                },
                {
                    text: 'Detail User',
                    to : '/user/user/detail/:id'
                },
                {
                    text: 'Update User'
                },
            ],
        },
        props: true,
    },
    {
        path: '/user/user/update/permission/:id',
        name:'UserUpdatePermission',
        component: () => import("./UpdatePermission"),
        meta: {
            auth: true,
            title: 'User Update Permission',
            breadcrumbs : [
                {
                    text: 'User',
                    to : '/user/user'
                },
                {
                    text: 'Detail User',
                    to : '/user/user/detail/:id'
                },
                {
                    text: 'Update Permission'
                },
            ],
        },
        props: true,
    },
]