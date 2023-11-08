export default [
    {
        path: '/warehouse/picking-order',
        name: 'PickingOrderList',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Picking Order List'
        }
    },
    {
        path: '/warehouse/picking-order/create',
        name: 'PickingOrderCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Create Picking Order',
            breadcrumbs : [
                {
                    text: 'Picking Order List',
                    to : '/warehouse/picking-order'
                },
                {
                    text: 'Create Picking Order',
                },
            ],
        },
        props: true,
    },
    {
        path: '/warehouse/picking-order/generate',
        name: 'GeneratePickingList',
        component: () => import("./Generate"),
        meta: {
            auth: true,
            title: 'Generate Picking List',
            breadcrumbs : [
                {
                    text: 'Picking Order List',
                    to : '/warehouse/picking-order'
                },
                {
                    text: 'Generate Picking List',
                },
            ],
        },
        props: true,
    },
    {
        path: '/warehouse/picking-order/detail/:id',
        name: 'PickingOrderDetail',
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: 'Picking Order Detail',
            breadcrumbs : [
                {
                    text: 'Picking Order List',
                    to : '/warehouse/picking-order'
                },
                {
                    text: 'Picking Order Detail',
                },
            ],
        }
    },
    {
        path: '/warehouse/picking-order/assignment/:id',
        name: 'AssignmentPicker',
        component: () => import("./Assignment"),
        meta: {
            auth: true,
            title: 'Assign Lead Picker',
            breadcrumbs : [
                {
                    text: 'Picking Order List',
                    to : '/warehouse/picking-order'
                },
                {
                    text: 'Assign Lead Picker',
                },
            ],
        },
        props: true,
    },
]