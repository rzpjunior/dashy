export default [
    {
        path: '/purchase/order',
        name: 'PurchaseOrder',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Purchase Order'
        }
    },
    {
        path: '/purchase/order/create',
        name: 'PurchaseOrderCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Purchase Order Create',
            breadcrumbs : [
                {
                    text: 'Purchase Order',
                    to : '/purchase/order'
                },
                {
                    text: 'Purchase Order Create',
                },
            ],
        }
    },
    {
        path: '/purchase/order/:id',
        name:'PurchaseOrderDetail',
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: 'Purchase Order Detail',
            breadcrumbs : [
                {
                    text: 'Purchase Order',
                    to : '/purchase/order'
                },
                {
                    text: 'Purchase Order Detail',
                },
            ],
        },
        props: true,
    },
    {
        path: '/purchase/order/update/:id',
        name:'PurchaseOrderUpdate',
        component: () => import("./Update"),
        meta: {
            auth: true,
            title: 'Purchase Order Update',
            breadcrumbs : [
                {
                    text: 'Purchase Order',
                    to : '/purchase/order'
                },
                {
                    text: 'Purchase Order Update',
                },
            ],
        },
        props: true,
    },
    {
        path: '/purchase/order/update-product/:id',
        name:'PurchaseOrderUpdateProduct',
        component: () => import("./UpdateProduct"),
        meta: {
            auth: true,
            title: 'Purchase Order Update Product',
            breadcrumbs : [
                {
                    text: 'Purchase Order',
                    to : '/purchase/order'
                },
                {
                    text: 'Purchase Order Detail',
                    to : '/purchase/order/:id'
                },
                {
                    text: 'Purchase Order Update Product',
                },
            ],
        },
        props: true,
    },
    {
        path: '/purchase/order/market-purchase/:id',
        name:'MarketPurchaseOrder',
        component: () => import("./MarketPurchase"),
        meta: {
            auth: true,
            title: 'Market Purchase Order ',
            breadcrumbs : [
                {
                    text: 'Purchase Order',
                    to : '/purchase/order'
                },
                {
                    text: 'Purchase Order Detail',
                    to : '/purchase/order/:id'
                },
                {
                    text: 'Market Purchase Order',
                },
            ],
        },
        props: true,
    },
]