export default [
    {
        path: '/warehouse/delivery-order',
        name: 'DeliveryOrder',
        component: () => import("./Index"),
        meta: {
            auth: true,
            title: 'Delivery Order List'
        }
    },
    {
        path: '/warehouse/delivery-order/create/:id',
        name: 'DeliveryOrderCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Create Delivery Order',
            breadcrumbs : [
                {
                    text: 'Delivery Order List',
                    to : '/warehouse/delivery-order'
                },
                {
                    text: 'Create Delivery Order',
                },
            ],
        }
    },
    {
        path: '/warehouse/delivery-order/confirm/:id',
        name: 'DeliveryOrderConfirm',
        component: () => import("./Confirm"),
        meta: {
            auth: true,
            title: 'Confirm Delivery Order',
            breadcrumbs : [
                {
                    text: 'Delivery Order List',
                    to : '/warehouse/delivery-order'
                },
                {
                    text: 'Confirm Delivery Order',
                },
            ],
        }
    },
    {
        path: '/warehouse/delivery-order/detail/:id',
        name: 'DeliveryOrderDetail',
        component: () => import("./Detail.vue"),
        meta: {
            auth: true,
            title: 'Delivery Order Detail',
            breadcrumbs: [
                {
                    text: 'Delivery Order List',
                    to: '/warehouse/delivery-order'
                },
                {
                    text: 'Deliver Order Detail'
                }
            ]
        }
    },
    {
        path: '/warehouse/delivery-order/update/:id',
        name: 'DeliveryOrderUpdate',
        component: () => import("./Update.vue"),
        meta: {
            auth: true,
            title: 'Update Delivery Order',
            breadcrumbs: [
                {
                    text: 'Delivery Order List',
                    to: '/warehouse/delivery-order'
                },
                {
                    text: 'Delivery Order Detail',
                    to: '/warehouse/delivery-order/detail/:id'
                },
                {
                    text: 'Deliver Order Update'
                }
            ]
        }
    }
]
