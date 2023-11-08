export default [
    {
        path: '/customer/prospect-customer',
        name: 'ProspectCustomer',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Prospect Customer'
        }
    },
    {
        path: '/customer/prospect-customer/:id',
        name:'ProspectCustomerDetail',
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: 'Prospect Customer',
            breadcrumbs : [
                {
                    text: 'Prospect Customer',
                    to: '/customer/prospect-customer'
                },
                {
                    text: 'Detail'
                }
            ]
        },
        props: true,
    },
]