export default [
    {
        path: '/warehouse/goods-receipt',
        name: 'GoodsReceiptList',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Goods Receipt List'
        }
    },
    {
        path: '/warehouse/goods-receipt/create',
        name: 'GoodsReceiptCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Create Goods Receipt',
            breadcrumbs : [
                {
                    text: 'Goods Receipt List',
                    to : '/warehouse/goods-receipt'
                },
                {
                    text: 'Create Goods Receipt',
                },
            ],
        },
        props: true,
    },
    {
        path: '/warehouse/goods-receipt/detail/:id',
        name: 'GoodsReceiptDetail',
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: 'Goods Receipt Detail',
            breadcrumbs : [
                {
                    text: 'Goods Receipt List',
                    to : '/warehouse/goods-receipt'
                },
                {
                    text: 'Goods Receipt Detail',
                },
            ],
        }
    },
    {
        path: '/warehouse/goods-receipt/update/:id',
        name: 'GoodsReceiptUpdate',
        component: () => import("./Update"),
        meta: {
            auth: true,
            title: 'Update Goods Receipt',
            breadcrumbs : [
                {
                    text: 'Goods Receipt List',
                    to : '/warehouse/goods-receipt'
                },
                {
                    text: 'Goods Receipt Detail',
                    to : '/warehouse/goods-receipt/detail/:id'
                },
                {
                    text: 'Update Goods Receipt',
                },
            ],
        }
    },
    {
        path: "/warehouse/goods-receipt/detail/:id/transfer-sku",
        name: "GoodsReceiptTransferSKU",
        component: () => import("./TransferSku"),
        meta: {
            auth: true,
            title: "Goods Receipt Transfer SKU",
            breadcrumbs: [
                {
                    text: "Goods Receipt List",
                    to: "/warehouse/goods-receipt",
                },
                {
                    text: "Goods Receipt Detail",
                    to: "/warehouse/goods-receipt/detail/:id",
                },
                {
                    text: "Goods Receipt Transfer SKU",
                },
            ],
        },
    },
]