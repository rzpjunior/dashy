export default [
    {
        path: '/purchase/forecast-demand',
        name: 'ForecastDemand',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Forecast Demand'
        }
    },
]