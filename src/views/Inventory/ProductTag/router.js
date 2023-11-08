export default [
    {
        path: '/inventory/product-tag',
        name: 'ProductTag',
        component: () => import("./Index.vue"),
        alias: '/uom',
        meta: {
            auth: true,
            title: 'Product Tag List'
        }
    },
    {
        path: '/inventory/product-tag/create',
        name: 'ProductTagCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Create Product Tag',
            breadcrumbs : [
                {
                    text: 'Product Tag List',
                    to : '/inventory/product-tag'
                },
                {
                    text: 'Create Product Tag',
                },
            ],
        },
    },
    {
        path: '/inventory/product-tag/detail/:id',
        name: 'ProductTagDetail',
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: 'Product Tag Detail',
            breadcrumbs : [
                {
                    text: 'Product Tag List',
                    to : '/inventory/product-tag'
                },
                {
                    text: 'Product Details',
                },
            ],
        }
    },
    {
        path: '/inventory/product-tag/update/:id',
        name: 'ProductTagUpdate',
        component: () => import("./Update"),
        meta: {
            auth: true,
            title: 'Update Product Tag',
            breadcrumbs : [
                {
                    text: 'Product Tag List',
                    to : '/inventory/product-tag'
                },
                {
                    text: 'Product Tag Detail',
                    to : '/inventory/product-tag/detail/:id'
                },
                {
                    text: 'Update Product Tag'
                },
                
            ],
        },
    },
    // {
    //     path: '/inventory/uom/create',
    //     name: 'UomCreate',
    //     component: () => import("./Create"),
    //     meta: {
    //         auth: true,
    //         title: 'UOM Create'
    //     }
    // },
]