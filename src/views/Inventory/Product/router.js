export default [
    {
        path: '/inventory/product',
        name: 'Product',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Product List'
        },
        props: true,
    },
    {
        path: '/inventory/product/create',
        name: 'ProductCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Create Product',
            breadcrumbs : [
                {
                    text: 'Product List',
                    to : '/inventory/product'
                },
                {
                    text: 'Create Product',
                },
            ],
        },
        props: true,
    },
    {
        path: '/inventory/product/detail/:id',
        name: 'ProductDetail',
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: 'Product Detail',
            breadcrumbs : [
                {
                    text: 'Product List',
                    to : '/inventory/product'
                },
                {
                    text: 'Product Detail'
                },
            ],
        }
    },
    {
        path: '/inventory/product/update/:id',
        name: 'ProductUpdate',
        component: () => import("./Update"),
        meta: {
            auth: true,
            title: 'Update Product',
            breadcrumbs : [
                {
                    text: 'Product List',
                    to : '/inventory/product'
                },
                {
                    text: 'Product Detail',
                    to : '/inventory/product/detail/:id'
                },
                {
                    text: 'Update Product',
                },
                
            ]
        },
    },
    {
        path: '/inventory/product/salability/update/:id',
        name: 'SalabilityUpdate',
        component: () => import("./UpdateSalability"),
        meta: {
            auth: true,
            title: 'Update Salability',
            breadcrumbs : [
                {
                    text: 'Product List',
                    to : '/inventory/product'
                },
                {
                    text: 'Product Detail',
                    to : '/inventory/product/detail/:id'
                },
                {
                    text: 'Update Salabiity',
                },
                
            ],
        },
    },
    {
        path: '/inventory/product/purchasability/update/:id',
        name: 'PurchasabilityUpdate',
        component: () => import("./UpdatePurchasability"),
        meta: {
            auth: true,
            title: 'Update Purchasability',
            breadcrumbs : [
                {
                    text: 'Product List',
                    to : '/inventory/product'
                },
                {
                    text: 'Product Detail',
                    to : '/inventory/product/detail/:id'
                },
                {
                    text: 'Update Purchasability',
                },
                
            ],
        },
    },
    {
        path: '/inventory/product/storability/update/:id',
        name: 'StorabilityUpdate',
        component: () => import("./UpdateStorability"),
        meta: {
            auth: true,
            title: 'Update Storability',
            breadcrumbs : [
                {
                    text: 'Product List',
                    to : '/inventory/product'
                },
                {
                    text: 'Product Detail',
                    to : '/inventory/product/detail/:id'
                },
                {
                    text: 'Update Storability',
                },
                
            ],
        },
    },

    // {
    //     path: '/finance/spt/term/archive/:id',
    //     name: 'SalesPaymentTermArchive',
    //     component: () => import("./Archive"),
    //     meta: {
    //         auth: true,
    //     }
    // },
    // {
    //     path: '/finance/spt/term/unarchive/:id',
    //     name: 'SalesPaymentTermUnarchive',
    //     component: () => import("./Unarchive"),
    //     meta: {
    //         auth: true,
    //     }
    // },
]