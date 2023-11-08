export default [
    {
        path: '/customer/acquisition',
        name: 'Acquisition',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Customer Acquisition List'
        }
    },
    {
        path: '/customer/acquisition/detail/:id',
        name: 'AcquisitionDetail',
        component: () => import("./Detail.vue"),
        meta: {
            auth: true,
            title: 'Customer Acquisition Detail',
            breadcrumbs : [
                {
                    text: 'Customer Acquisition List',
                    to : '/customer/acquisition'
                },
                {
                    text: 'Customer Acquisition Detail',
                },
            ],
        }
    },
]