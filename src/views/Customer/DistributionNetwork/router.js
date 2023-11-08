export default [
    {
        path: '/customer/distribution-network',
        name: 'DistributionNetwork',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Distribution Network'
        }
    },
    {
        path: '/customer/distribution-network/detail/:id',
        name: 'DistributionNetworkDetail',
        component: () => import("./Detail.vue"),
        meta: {
            auth: true,
            title: 'Distribution Network Detail',
            breadcrumbs : [
                {
                    text: 'Distribution Network List',
                    to : '/customer/distribution-network'
                },
                {
                    text: 'Distribution Network Detail',
                },
            ],
        }
    },
    {
        path: '/customer/distribution-network/create',
        name:'DistributionNetworkCreate',
        component: () => import("./Create.vue"),
        meta: {
            auth: true,
            title: 'Create Distribution Network',
            breadcrumbs : [
                {
                    text: 'Distribution Network List',
                    to : '/customer/distribution-network'
                },
                {
                    text: 'Create Distribution Network',
                },
            ],
        },
        props: true,
    },
    {
        path: '/customer/distribution-network/update/:id',
        name:'DistributionNetworkUpdate',
        component: () => import("./Update"),
        meta: {
            auth: true,
            title: 'Distribution Network Update',
            breadcrumbs : [
                {
                    text: 'Distribution Network List',
                    to : '/customer/distribution-network'
                },
                {
                    text: 'Distribution Network Detail',
                    to : '/customer/distribution-network/detail/:id'
                },
                {
                    text: 'Distribution Network Update',
                },
            ],
        },
        props: true,
    },
]