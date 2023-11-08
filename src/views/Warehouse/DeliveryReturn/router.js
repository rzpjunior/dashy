export default [
    {
        path: '/warehouse/delivery-return',
        name: 'DeliveryReturn',
        component: () => import("./Index"),
        meta: {
            auth: true,
            title: 'Delivery Return List'
        }
    },
    {
        path: '/warehouse/delivery-return/create',
        name: 'DeliveryReturnCreate',
        component: () => import("./Create.vue"),
        meta: {
            auth: true,
            title: 'Create Delivery Return',
            breadcrumbs : [
                {
                    text: 'Delivery Return',
                    to : '/warehouse/delivery-return'
                },
                {
                    text: 'Create Delivery Return',
                },
            ],
        },
        props: true,
    },
    {
        path: '/warehouse/delivery-return/detail/:id',
        name: 'DeliveryReturnDetail',
        component: () => import("./Detail.vue"),
        meta: {
            auth: true,
            title: 'Delivery Return Detail',
            breadcrumbs: [
                {
                    text: 'Delivery Return List',
                    to: '/warehouse/delivery-return'
                },
                {
                    text: 'Delivery Return Detail'
                }
            ]
        }
    },
    {
        path: '/warehouse/delivery-return/update/:id',
        name: 'DeliveryReturnUpdate',
        component: () => import("./Update.vue"),
        meta: {
            auth: true,
            title: 'Update Delivery Return',
            breadcrumbs : [
                {
                    text: 'Delivery Return',
                    to : '/warehouse/delivery-return'
                },
                {
                    text: 'Update Delivery Return',
                },
            ],
        },
        props: true,
    },
]
