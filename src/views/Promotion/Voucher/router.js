export default [
    {
        path: '/promotion/voucher',
        name: 'Voucher',
        component: () => import("./Index.vue"),
        alias: '/role/index',
        meta: {
            auth: true,
            title: 'Voucher'
        }
    },
    {
        path: '/promotion/voucher/create',
        name: 'VoucherCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Create Voucher',
            breadcrumbs : [
                {
                    text: 'Voucher',
                    to : '/promotion/voucher'
                },
                {
                    text: 'Create Voucher',
                },
            ],
        }
    },
    {
        path: '/promotion/voucher/:id',
        name:'VoucherDetail',
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: 'Voucher Detail',
            breadcrumbs : [
                {
                    text: 'Voucher',
                    to : '/promotion/voucher'
                },
                {
                    text: 'Voucher Detail',
                },
            ],
        },
        props: true,
    },
]