export default [
    {
        path: '/warehouse/supplier-return',
        name: 'SupplierReturn',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Supplier Return'
        }
    },
    {
        path: '/warehouse/supplier-return/create',
        name: 'SupplierReturnCreate',
        component: () => import("./Create.vue"),
        meta: {
            auth: true,
            title: 'Create Supplier Return',
            breadcrumbs : [
                {
                    text: 'Supplier Return List',
                    to : '/warehouse/supplier-return'
                },
                {
                    text: 'Create Supplier Return',
                },
            ],
        },
        props: true,
    },
    {
        path: '/warehouse/supplier-return/detail/:id',
        name: 'SupplierReturnDetail',
        component: () => import("./Detail.vue"),
        meta: {
            auth: true,
            title: 'Supplier Return Detail',
            breadcrumbs : [
                {
                    text: 'Supplier Return List',
                    to : '/warehouse/supplier-return'
                },
                {
                    text: 'Supplier Return Detail',
                },
            ],
        }
    },
    {
        path: '/warehouse/supplier-return/update/:id',
        name: 'SupplierReturnUpdate',
        component: () => import("./Update"),
        meta: {
            auth: true,
            title: 'Update Supplier Return',
            breadcrumbs : [
                {
                    text: 'Supplier Return List',
                    to : '/warehouse/supplier-return'
                },
                {
                    text: 'Supplier Return Detail',
                    to : '/warehouse/supplier-return/detail/:id'
                },
                {
                    text: 'Update Supplier Return',
                },
            ],
        }
    },
]
