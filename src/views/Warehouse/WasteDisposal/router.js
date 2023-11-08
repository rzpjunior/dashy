export default [
    {
        path: '/warehouse/waste-disposal',
        name: 'WasteDisposalList',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Waste Disposal List'
        }
    },
    {
        path: '/warehouse/waste-disposal/create',
        name: 'WasteDisposalCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Create Waste Disposal',
            breadcrumbs : [
                {
                    text: 'Waste Disposal List',
                    to : '/warehouse/waste-disposal'
                },
                {
                    text: 'Create Waste Disposal',
                },
            ],
        },
        props: true,
    },
    {
        path: '/warehouse/waste-disposal/detail/:id',
        name: 'WasteDisposalDetail',
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: 'Waste Disposal Detail',
            breadcrumbs : [
                {
                    text: 'Waste Disposal List',
                    to : '/warehouse/waste-disposal'
                },
                {
                    text: 'Waste Disposal Detail',
                },
            ],
        }
    },
    // {
    //     path: '/warehouse/waste-disposal/update/:id',
    //     name: 'WasteDisposalUpdate',
    //     component: () => import("./Update"),
    //     meta: {
    //         auth: true,
    //         title: 'Update Waste Disposal',
    //         breadcrumbs : [
    //             {
    //                 text: 'Waste Disposal List',
    //                 to : '/warehouse/waste-disposal'
    //             },
    //             {
    //                 text: 'Waste Disposal Detail',
    //                 to : '/warehouse/waste-disposal/detail/:id'
    //             },
    //             {
    //                 text: 'Update Waste Disposal',
    //             },
    //         ],
    //     }
    // },
]