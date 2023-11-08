export default [
    {
        path: '/report/cogs',
        name: 'ReportCOGS',
        component: () => import("./COGS/COGSReport.vue"),
        meta: {
            auth: true,
            title: 'Cost of Goods Sold Report'
        }
    },
    {
        path: '/report/inbound-time',
        name: 'ReportInboundTime',
        component: () => import("./InboundTime/InboundTimeReport.vue"),
        meta: {
            auth: true,
            title: 'Inbound Time Report'
        }
    },
    {
        path: '/report/price-comparison',
        name: 'ReportPriceComparison',
        component: () => import("./PriceComparison/PriceComparisonReport.vue"),
        meta: {
            auth: true,
            title: 'Price Comparison'
        }
    },
    {
        path: '/report/po',
        name: 'ReportPO',
        component: () => import("./PurchaseOrder/POReport.vue"),
        meta: {
            auth: true,
            title: 'Purchase Order Report'
        }
    },
    {
        path: '/report/po-item',
        name: 'ReportPOItem',
        component: () => import("./PurchaseOrder/POItemReport.vue"),
        meta: {
            auth: true,
            title: 'Purchase Order Item Report'
        }
    },
    {
        path: '/report/pi',
        name: 'ReportPI',
        component: () => import("./PurchaseInvoice/PIReport.vue"),
        meta: {
            auth: true,
            title: 'Purchase Invoice Report'
        }
    },
    {
        path: '/report/pii',
        name: 'ReportPII',
        component: () => import("./PurchaseInvoice/PIItemReport.vue"),
        meta: {
            auth: true,
            title: 'Purchase Invoice Item Report'
        }
    },
    {
        path: '/report/pp',
        name: 'ReportPP',
        component: () => import("./PurchasePayment/PPReport.vue"),
        meta: {
            auth: true,
            title: 'Purchase Payment Report'
        }
    },
    {
        path: '/report/field-purchase-order-item',
        name: 'FieldPurchaserReport',
        component: () => import("./FieldPurchaser/FieldPurchaser.vue"),
        meta: {
            auth: true,
            title: 'Field Purchase Order Item Report'
        }
    },
    {
        path: '/report/item-recap',
        name: 'ReportRecap',
        component: () => import("./ItemRecapReport/IRecapReport.vue"),
        meta: {
            auth: true,
            title: 'Item Recap Report'
        }
    },
]