export default [
    {
        path: '/customer/merchant',
        name: 'Merchant',
        component: () => import("./Index.vue"),
        alias: '/customer/merchant/v2',
        meta: {
            auth: true,
            title: 'Main Outlet List'
        }
    },
    {
        path: '/customer/merchant/detail/:id',
        name: 'MerchantDetail',
        component: () => import("./Detail.vue"),
        meta: {
            auth: true,
            title: 'Main Outlet Detail',
            breadcrumbs : [
                {
                    text: 'Main Outlet List',
                    to : '/customer/merchant'
                },
                {
                    text: 'Main Outlet Detail',
                },
            ],
        }
    },
    {
        path: '/customer/merchant/update/:id',
        name:'MerchantUpdate',
        component: () => import("./Update"),
        alias:'/customer/merchant/update/v2/:id',
        meta: {
            auth: true,
            title: 'Main Outlet Update',
            breadcrumbs : [
                {
                    text: 'Main Outlet List',
                    to : '/customer/merchant'
                },
                {
                    text: 'Main Outlet Detail',
                    to : '/customer/merchant/detail/:id'
                },
                {
                    text: 'Main Outlet Update',
                },
            ],
        },
        props: true,
    },
    {
        path: '/customer/merchant/update/tag/:id',
        name:'MerchantUpdateTag',
        component: () => import("./UpdateTag"),
        alias:'/customer/merchant/update/tag/v2/:id',
        meta: {
            auth: true,
            title: 'Update Customer Tag',
            breadcrumbs : [
                {
                    text: 'Main Outlet List',
                    to : '/customer/merchant'
                },
                {
                    text: 'Main Outlet Detail',
                    to : '/customer/merchant/detail/:id'
                },
                {
                    text: 'Update Customer Tag',
                },
            ],
        },
        props: true,
    },
    {
        path: '/customer/merchant/update/phone/:id',
        name:'MerchantUpdatePhone',
        component: () => import("./UpdatePhone"),
        alias:'/customer/merchant/update/phone/v2/:id',
        meta: {
            auth: true,
            title: 'Update Phone Number',
            breadcrumbs : [
                {
                    text: 'Main Outlet List',
                    to : '/customer/merchant'
                },
                {
                    text: 'Main Outlet Detail',
                    to : '/customer/merchant/detail/:id'
                },
                {
                    text: 'Update Phone Number',
                },
            ],
        },
        props: true,
    },
]