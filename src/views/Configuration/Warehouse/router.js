export default [
    {
        path: '/configuration/wh',
        name: 'WarehouseList',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Warehouse'
        }
    },
    {
        path: '/configuration/wh/detail/:id',
        name: 'WarehouseDetail',
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: 'Warehouse Detail',
            breadcrumbs : [
                {
                    text: 'Warehouse List',
                    to : '/configuration/wh'
                },
                {
                    text: 'Warehouse Detail',
                },
            ],
        }
    },
    {
        path: '/configuration/wh/update/:id',
        name: 'WarehouseUpdate',
        component: () => import("./Update.vue"),
        meta: {
            auth: true,
            title: 'Warehouse Update',
            breadcrumbs : [
                {
                    text: 'Warehouse List',
                    to : '/configuration/wh'
                },
                {
                    text: 'Update Warehouse',
                },
            ],
        }
    },
    {
        path: "/configuration/wh/create",
        name: "WarehouseCreate",
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: "Warehouse Create",
            breadcrumbs: [
                {
                    text: "Warehouse List",
                    to: "/configuration/wh",
                },
                {
                    text: "Create Warehouse",
                },
            ],
        },
    },
]