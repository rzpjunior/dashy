export default [
    {
        path: '/promotion/sku-discount',
        name: 'SKUDiscountList',
        component: () => import("./Index.vue"),
        alias: '/role/index',
        meta: {
            auth: true,
            title: 'SKU Discount List'
        }
    },
    {
        path: '/promotion/sku-discount/create',
        name: 'SKUDiscountCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Create SKU Discount',
            breadcrumbs : [
                {
                    text: 'SKU Discount List',
                    to : '/promotion/sku-discount'
                },
                {
                    text: 'Create SKU Discount',
                },
            ],
        }
    },
    {
        path: '/promotion/sku-discount/:id',
        name:'SKUDiscountDetail',
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: 'SKU Discount Detail',
            breadcrumbs : [
                {
                    text: 'SKU Discount List',
                    to : '/promotion/sku-discount'
                },
                {
                    text: 'SKU Discount Detail',
                },
            ],
        },
        props: true,
    },
]