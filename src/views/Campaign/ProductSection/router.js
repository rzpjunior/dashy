export default [
    {
        path: '/campaign/product-section',
        name: 'ProductSectionList',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Product Section List'
        }
    },
    {
        path: '/campaign/product-section/create',
        name: 'ProductSectionCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Create Product Section',
            breadcrumbs : [
                {
                    text: 'Product Section List',
                    to : '/campaign/product-section'
                },
                {
                    text: 'Create Product Section',
                },
            ],
        }
    },
    {
        path: '/campaign/product-section/:id',
        name:'ProductSectionDetail',
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: 'Product Section Detail',
            breadcrumbs : [
                {
                    text: 'Product Section List',
                    to : '/campaign/product-section'
                },
                {
                    text: 'Product Section Detail',
                },
            ],
        },
        props: true,
    },
    {
        path: '/campaign/product-section/update/:id',
        name: 'ProductSectionUpdate',
        component: () => import("./Update"),
        meta: {
            auth: true,
            title: 'Update Product Section',
            breadcrumbs: [
                {
                    text: 'Product Section List',
                    to: '/campaign/product-section'
                },
                {
                    text: 'Product Section Detail',
                    to: '/campaign/product-section/:id'
                },
                {
                    text: 'Update Product Section',
                },
            ],
        }
    },
]