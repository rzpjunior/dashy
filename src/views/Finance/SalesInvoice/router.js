export default [
    {
        path: '/finance/si',
        name: 'SalesInvoice',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Sales Invoice'
        },
        props: true,
    },
    {
        path: '/finance/si/create/:id',
        name: 'SalesInvoiceCreate',
        component: () => import("./Create.vue"),
        meta: {
            auth: true,
            title: 'Create Sales Invoice',
            breadcrumbs : [
                {
                    text: 'Sales Invoice',
                    to : '/finance/si'
                },
                {
                    text: 'Create Sales Invoice',
                },
            ],
        },
        props: true,
    },
    {
        path: '/finance/si/detail/:id',
        name: 'SalesInvoiceDetail',
        component: () => import("./Detail.vue"),
        meta: {
            auth: true,
            title: 'Sales Invoice Detail',
            breadcrumbs: [
                {
                    text: 'Sales Invoice List',
                    to: '/finance/si'
                },
                {
                    text: 'Sales Invoice Detail'
                }
            ]
        }
    },
    {
        path: '/finance/si/update/:id',
        name: 'SalesInvoiceUpdate',
        component: () => import("./Update.vue"),
        meta: {
            auth: true,
            title: 'Update Sales Invoice',
            breadcrumbs : [
                {
                    text: 'Sales Invoice',
                    to : '/finance/si'
                },
                {
                    text: 'Update Sales Invoice',
                },
            ],
        },
        props: true,
    },
    {
        path: '/finance/si/sp/create/:id',
        name: 'CreateSalesPayment',
        component: () => import("./SalesPayment/Create.vue"),
        meta: {
            auth: true,
            title: 'Create Payment',
            breadcrumbs : [
                {
                    text: 'Sales Invoice',
                    to : '/finance/si'
                },
                {
                    text: 'Create Payment',
                },
            ],
        },
        props: true,
    },
    {
        path: '/finance/si/sp/:id',
        name: 'SalesPaymentList',
        component: () => import("./SalesPayment/Index.vue"),
        meta: {
            auth: true,
            title: 'Sales Payment List',
            breadcrumbs : [
                {
                    text: 'Sales Invoice',
                    to : '/finance/si'
                },
                {
                    text: 'Sales Invoice Detail',
                    to : '/finance/si/detail/:id'
                },
                {
                    text: 'Sales Payment List',
                },
            ],
        },
        props: true,
    },
    {
        path: '/finance/si/spb',
        name: 'CreateBulkSalesPayment',
        component: () => import("./SalesPayment/CreateBulk.vue"),
        meta: {
            auth: true,
            title: 'Create Bulk Payment',
            breadcrumbs : [
                {
                    text: 'Sales Invoice',
                    to : '/finance/si'
                },
                {
                    text: 'Create Bulk Payment',
                },
            ],
        },
        props: true,
    },
]
