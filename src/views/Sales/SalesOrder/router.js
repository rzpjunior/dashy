export default [
    {
        path: '/sales-order',
        name: 'SalesOrderList',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Sales Order List'
        }
    },
    {
        path: '/sales-order/create',
        name: 'SalesOrderCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Create Sales Order',
            breadcrumbs: [
                {
                    text: 'Sales Order List',
                    to: '/sales-order'
                },
                {
                    text: 'Create Sales Order',
                },
            ],
        },
        props: true,
    },
    {
        path: '/sales-order/mobile/create',
        name: 'SalesOrderMobileCreate',
        component: () => import("./MobileView/Create"),
        meta: {
            auth: true,
            title: 'Create Sales Order',
            breadcrumbs: [
                {
                    text: 'Sales Order List',
                    to: '/sales-order'
                },
                {
                    text: 'Create Sales Order',
                },
            ],
        },
        props: true,
    },
    {
        path: '/sales-order/detail/:id',
        name: 'SalesOrderDetail',
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: 'Sales Order Detail',
            breadcrumbs: [
                {
                    text: 'Sales Order List',
                    to: '/sales-order'
                },
                {
                    text: 'Sales Order Detail',
                },
            ],
        }
    },
    {
        path: '/sales/sales-order-edn/detail/:id',
        name: 'SalesOrderEDNDetail',
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: 'Sales Order EDN Detail',
            breadcrumbs: [
                {
                    text: 'Sales Order EDN List',
                    to: '/sales/sales-order-edn'
                },
                {
                    text: 'Sales Order EDN Detail',
                },
            ],
        }
    },
    {
        path: '/sales-order/update/:id',
        name: 'SalesOrderUpdate',
        component: () => import("./Update"),
        meta: {
            auth: true,
            title: 'Update Sales Order',
            breadcrumbs: [
                {
                    text: 'Sales Order List',
                    to: '/sales-order'
                },
                {
                    text: 'Sales Order Detail',
                    to: '/sales-order/detail/:id'
                },
                {
                    text: 'Update Sales Order',
                },
            ],
        }
    },
    {
        path: '/sales-order/update-price/:id',
        name: 'SalesOrderUpdatePrice',
        component: () => import("./UpdatePrice"),
        meta: {
            auth: true,
            title: 'Update Price Sales Order',
            breadcrumbs: [
                {
                    text: 'Sales Order List',
                    to: '/sales-order'
                },
                {
                    text: 'Sales Order Detail',
                    to: '/sales-order/detail/:id'
                },
                {
                    text: 'Update Price Sales Order',
                },
            ],
        }
    },
]