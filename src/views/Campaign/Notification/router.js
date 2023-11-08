export default [
    {
        path: '/campaign/push-notification',
        name: 'NotificationList',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Push Notification List'
        }
    },
    {
        path: '/campaign/push-notification/create',
        name: 'NotificationCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Create Push Notification',
            breadcrumbs: [
                {
                    text: 'Push Notification List',
                    to: '/campaign/push-notification'
                },
                {
                    text: 'Create Push Notification',
                },
            ],
        },
        props: true,
    },
    {
        path: '/campaign/push-notification/detail/:id',
        name: 'NotificationDetail',
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: 'Push Notification Detail',
            breadcrumbs: [
                {
                    text: 'Push Notification List',
                    to: '/campaign/push-notification'
                },
                {
                    text: 'Push Notification Detail',
                },
            ],
        }
    },
    {
        path: '/campaign/push-notification/update/:id',
        name: 'NotificationUpdate',
        component: () => import("./Update"),
        meta: {
            auth: true,
            title: 'Update Push Notification',
            breadcrumbs: [
                {
                    text: 'Push Notification List',
                    to: '/campaign/push-notification'
                },
                {
                    text: 'Push Notification Detail',
                    to: '/campaign/push-notification/detail/:id'
                },
                {
                    text: 'Update Push Notification',
                },
            ],
        }
    },
]