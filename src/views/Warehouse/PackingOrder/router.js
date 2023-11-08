export default [
    {
        path: '/warehouse/packing-order',
        name: 'PackingOrderList',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Packing Order List'
        }
    },
    {
        path: '/warehouse/weigh-scale',
        name: 'WeighScale',
        component: () => import("./WeighScale.vue"),
        meta: {
            auth: true,
            title: 'Weigh Scale'
        }
    },
    {
        path: '/warehouse/pack-list',
        name: 'PackList',
        component: () => import("./PackList.vue"),
        meta: {
            auth: true,
            title: 'Pack List',
            breadcrumbs : [
                {
                    text: 'Packing Order List',
                    to : '/warehouse/packing-order'
                },
                {
                    text: 'Pack List',
                },
            ],
        }
    },
    {
        path: '/warehouse/packing-order/create',
        name: 'PackingOrderCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Generate Packing Order',
            breadcrumbs : [
                {
                    text: 'Packing Order List',
                    to : '/warehouse/packing-order'
                },
                {
                    text: 'Generate Packing Order',
                },
            ],
        },
        props: true,
    },
    {
        path: '/warehouse/packing-order/commit/:id',
        name: 'PackingOrderCommit',
        component: () => import("./Commit"),
        meta: {
            auth: true,
            title: 'Commit Packing Order',
            breadcrumbs : [
                {
                    text: 'Packing Order',
                    to : '/warehouse/packing-order'
                },
                {
                    text: 'Commit Packing Order',
                },
            ],
        },
        props: true,
    },
    {
        path: '/warehouse/packing-order/detail/:id',
        name: 'PackingOrderDetail',
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: 'Packing Order Detail',
            breadcrumbs : [
                {
                    text: 'Packing Order List',
                    to : '/warehouse/packing-order'
                },
                {
                    text: 'Packing Order Detail',
                },
            ],
        }
    },
    // {
    //     path: '/warehouse/packing-order/update/:id',
    //     name: 'PackingOrderUpdate',
    //     component: () => import("./Update"),
    //     meta: {
    //         auth: true,
    //         title: 'Update Packing Order',
    //         breadcrumbs : [
    //             {
    //                 text: 'Packing Order List',
    //                 to : '/warehouse/packing-order'
    //             },
    //             {
    //                 text: 'Packing Order Detail',
    //                 to : '/warehouse/packing-order/detail/:id'
    //             },
    //             {
    //                 text: 'Update Packing Order',
    //             },
    //         ],
    //     }
    // },
]