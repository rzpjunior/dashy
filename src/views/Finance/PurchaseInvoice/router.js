export default [
    {
        path: '/finance/purc-invoice',
        name: 'PurchaseInvoice',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Purchase Invoice List'
        }
    },
    {
        path: '/finance/bulk-purchase-invoice',
        name: 'BulkPaymentCreate',
        component: () => import("./BulkPayment.vue"),
        meta: {
            auth: true,
            title: 'Create Bulk Payment',
            breadcrumbs : [
                {
                    text: 'Purchase Invoice List',
                    to : '/finance/purc-invoice'
                },
                {
                    text: 'Create Bulk Payment',
                },
            ],
        }
    },
    {
        path: '/finance/purc-invoice/:id',
        name:'PurchaseInvoiceDetail',
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: 'Purchase Invoice Detail',
            breadcrumbs : [
                {
                    text: 'Purchase Invoice List',
                    to : '/finance/purc-invoice'
                },
                {
                    text: 'Purchase Invoice Detail',
                },
            ],
        },
        props: true,
    },
    {
        path: '/finance/purc-invoice/update/:id',
        name:'PurchaseInvoiceUpdate',
        component: () => import("./Update"),
        meta: {
            auth: true,
            title: 'Purchase Invoice Update',
            breadcrumbs : [
                {
                    text: 'Purchase Invoice List',
                    to : '/finance/purc-invoice'
                },
                {
                    text: 'Purchase Invoice Update',
                },
            ],
        },
        props: true,
    },
    {
        path: '/finance/purc-invoice/create/:id',
        name:'CreatePurchaseInvoice',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Create Purchase Invoice',
            breadcrumbs : [
                {
                    text: 'Purchase Invoice List',
                    to : '/finance/purc-invoice'
                },
                {
                    text: 'Create Purchase Invoice',
                },
            ],
        },
        props: true,
    },
    {
        path: '/finance/purc-invoice/purc-payment/:id',
        name: 'PurchasePaymentList',
        component: () => import("./PurchasePayment/Index.vue"),
        meta: {
            auth: true,
            title: 'Purchase Payment List',
            breadcrumbs : [
                {
                    text: 'Purchase Invoice List',
                    to : '/finance/purc-invoice'
                },
                {
                    text: 'Purchase Invoice Detail',
                    to : '/finance/purc-invoice/:id'
                },
                {
                    text: 'Purchase Payment List',
                },
            ],
        },
        props: true,
    },
]