export default [
    {
        path: '/price/product',
        name: 'ProductPrice',
        component: () => import("./Index.vue"),
        alias: '/price/product/v2',
        meta: {
            auth: true,
            title: 'Product Prices List'
        }
    },
    {
        path: '/price/schedule-set',
        name: 'ProductPriceSchedule',
        component: () => import("./ScheduleUpdate/Index.vue"),
        alias: '/price/product/schedule/v2',
        meta: {
            auth: true,
            title: 'Scheduled Price Set List'
        }
    },
]