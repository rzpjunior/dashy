export default [
    {
        path: '/purchase/supplier',
        name: 'Supplier',
        component: () => import("./Index.vue"),
        alias: '/purchase/supplier/v2',
        meta: {
            auth: true,
            title: 'Supplier'
        }
    },
    {
        path: '/purchase/supplier/update/:id',
        name:'SupplierUpdate',
        component: () => import("./Update"),
        alias:'/purchase/supplier/update/v2/:id',
        meta: {
            auth: true,
            title: 'Update Supplier',
            breadcrumbs : [
                {
                    text: 'Supplier List',
                    to : '/purchase/supplier'
                },
                {
                    text: 'Update Supplier',
                },
            ],
        },
        props: true,
    },
    {
        path: '/purchase/supplier/detail/:id',
        name:'SupplierDetail',
        component: () => import("./Detail"),
        alias:'/purchase/supplier/detail/v2',
        meta: {
            auth: true,
            title: 'Supplier Detail',
            breadcrumbs : [
                {
                    text: 'Supplier List',
                    to : '/purchase/supplier'
                },
                {
                    text: 'Supplier Detail',
                },
            ],
        },
        props: true,
    },
    {
        path: '/purchase/supplier/create',
        name: 'SupplierCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Create Supplier',
            breadcrumbs : [
                {
                    text: 'Supplier List',
                    to : '/purchase/supplier'
                },
                {
                    text: 'Create Supplier',
                },
            ],
        }
    }
]