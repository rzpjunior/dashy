export default [
    {
        path: '/purchase/prospective/supplier',
        name: 'ProspectSupplier',
        component: () => import("./Index.vue"),
        alias: '/purchase/prospective/supplier/v2',
        meta: {
            auth: true,
            title: 'Prospect Supplier'
        }
    },
    {
        path: '/purchase/prospective/supplier/detail/:id',
        name:'ProspectSupplierDetail',
        component: () => import("./Detail"),
        alias:'/purchase/prospective/supplier/detail/v2',
        meta: {
            auth: true,
            title: 'Prospect Supplier Detail',
            breadcrumbs : [
                {
                    text: 'Prospect Supplier',
                    to: '/purchase/prospective/supplier'
                },
                {
                    text: 'Detail'
                }
            ]
        },
        props: true,
    }
]
