export default [
    {
        path: '/configuration/usr_profile',
        name: 'UserProfile',
        component: () => import("./Detail.vue"),
        meta: {
            auth: true,
            title: 'User Profile'
        }
    },
    {
        path: '/configuration/usr_profile/update',
        name:'UserProfileUpdate',
        component: () => import("./Update"),
        meta: {
            auth: true,
            title: 'Update User Profile',
            breadcrumbs : [
                {
                    text: 'User Profile',
                    to : '/configuration/usr_profile'
                },
                {
                    text: 'Update User Profile',
                },
            ],
        },
        props: true,
    },
    {
        path: '/configuration/usr_profile/password',
        name:'UserProfilePassword',
        component: () => import("./UpdatePassword"),
        meta: {
            auth: true,
            title: 'Update Password',
            breadcrumbs : [
                {
                    text: 'User Profile',
                    to : '/configuration/usr_profile'
                },
                {
                    text: 'Update Password',
                },
            ],
        },
        props: true,
    },
]