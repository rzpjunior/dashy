export default [
    {
        path: '/report/si',
        name: 'ReportSI',
        component: () => import("./SalesInvoice/SIReport.vue"),
        meta: {
            auth: true,
            title: 'Sales Invoice Report'
        }
    },
    {
        path: '/report/sp',
        name: 'ReportSP',
        component: () => import("./SalesPayment/SPReport.vue"),
        meta: {
            auth: true,
            title: 'Sales Payment Report'
        }
    },
    {
        path: '/report/so',
        name: 'ReportSalesOrder',
        component: () => import("./SalesOrder/SOReport.vue"),
        meta: {
            auth: true,
            title: 'Sales Order Report'
        }
    },
    {
        path: '/report/so-item',
        name: 'ReportSalesOrderItem',
        component: () => import("./SalesOrder/SOItemReport.vue"),
        meta: {
            auth: true,
            title: 'Sales Order Item Report'
        }
    },
    {
        path: '/report/so-feedback',
        name: 'ReportSalesOrderFeedback',
        component: () => import("./SalesOrder/SOFeedbackReport.vue"),
        meta: {
            auth: true,
            title: 'Sales Order Feedback Report'
        }
    },
    {
        path: '/report/sku-discount',
        name: 'ReportSKUDiscount',
        component: () => import("./SKUDiscount/ReportSKUDiscount.vue"),
        meta: {
            auth: true,
            title: 'SKU Discount Report'
        }
    },
    {
        path: '/report/sku-discount-item',
        name: 'ReportSKUDiscountItem',
        component: () => import("./SKUDiscount/ReportSKUDiscountItem.vue"),
        meta: {
            auth: true,
            title: 'SKU Discount Item Report'
        }
    },
    {
        path: '/report/eden-point',
        name: 'ReportEdenPoint',
        component: () => import("./EdenPoint/EdenPointReport.vue"),
        meta: {
            auth: true,
            title: 'EdenPoint Report'
        }
    },
]