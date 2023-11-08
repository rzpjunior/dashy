export default [
    {
        path: '/report/pricing-inbound-item',
        name: 'PricingInboundItemReport',
        component: () => import("./PricingInboundItem/PricingInboundItemReport.vue"),
        meta: {
            auth: true,
            title: 'Pricing Inbound Item Report'
        }
    },
    {
        path: '/report/price-change-history',
        name: 'PriceChangeHistoryReport',
        component: () => import("./PriceChangeHistory/PriceChangeHistoryReport.vue"),
        meta: {
            auth: true,
            title: 'Price Change History Report'
        }
    },
]