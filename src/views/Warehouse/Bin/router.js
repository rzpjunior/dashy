export default [
    {
        path: '/warehouse/bin',
        name: 'BinList',
        component: () => import("./Index"),
        meta: {
            auth: true,
            title: 'Bin List'
        }
    },
    {
        path: '/warehouse/bin/create',
        name: 'CreateBin',
        component: () => import("./Create.vue"),
        meta: {
            auth: true,
            title: 'Create Bin',
            breadcrumbs : [
                {
                    text: 'Bin List',
                    to : '/warehouse/bin'
                },
                {
                    text: 'Create Bin',
                },
            ],
        },
    },
    {
        path: '/warehouse/bin/update/:id',
        name: 'UpdateBin',
        component: () => import("./Update.vue"),
        meta: {
            auth: true,
            title: 'Update Bin',
            breadcrumbs : [
                {
                    text: 'BIN List',
                    to : '/warehouse/bin'
                },
                {
                    text: 'Update Bin',
                },
            ],
        },
    },
    {
        path: '/warehouse/bin/detail/:id',
        name: 'DetailBin',
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: 'Bin Detail',
            breadcrumbs : [
                {
                    text: 'Bin List',
                    to : '/warehouse/bin'
                },
                {
                    text: 'Bin Detail'
                },
            ],
        }
    },
]