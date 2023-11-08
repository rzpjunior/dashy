export default [
    {
        path: '/logistic/dispatch',
        name: 'Dispatch',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Dispatch'
        }
    },
    {
        path: '/logistic/dispatch/assign-courier',
        name: 'AssignCourier',
        component: () => import("./AssignCourier.vue"),
        meta: {
            auth: true,
            title: 'Assign Courier',
            breadcrumbs : [
                {
                    text: 'Dispatch List',
                    to : '/logistic/dispatch'
                },
                {
                    text: 'Assign Courier',
                },
            ],
        },
        props: true,
    },
    {
        path: '/logistic/dispatch/outgoing',
        name: 'Outgoing',
        component: () => import("./Outgoing.vue"),
        meta: {
            auth: true,
            title: 'Outgoing',
            breadcrumbs : [
                {
                    text: 'Dispatch List',
                    to : '/logistic/dispatch'
                },
                {
                    text: 'Outgoing',
                },
            ],
        },
        props: true,
    },
]