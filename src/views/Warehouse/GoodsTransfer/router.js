export default [
    {
        path: '/warehouse/goods-transfer',
        name: 'GoodsTransferList',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Goods Transfer List'
        }
    },
    {
        path: '/warehouse/goods-transfer/create',
        name: 'GoodsTransferCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Request Goods Transfer',
            breadcrumbs : [
                {
                    text: 'Goods Transfer List',
                    to : '/warehouse/goods-transfer'
                },
                {
                    text: 'Request Goods Transfer',
                },
            ],
        },
        props: true,
    },
    {
        path: '/warehouse/goods-transfer/detail/:id',
        name: 'GoodsTransferDetail',
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: 'Goods Transfer Detail',
            breadcrumbs : [
                {
                    text: 'Goods Transfer List',
                    to : '/warehouse/goods-transfer'
                },
                {
                    text: 'Goods Transfer Detail',
                },
            ],
        }
    },
    {
        path: '/warehouse/goods-transfer/update/:id',
        name: 'GoodsTransferUpdate',
        component: () => import("./Update"),
        meta: {
            auth: true,
            title: 'Update Goods Transfer',
            breadcrumbs : [
                {
                    text: 'Goods Transfer List',
                    to : '/warehouse/goods-transfer'
                },
                {
                    text: 'Goods Transfer Detail',
                    to : '/warehouse/goods-transfer/detail/:id'
                },
                {
                    text: 'Update Goods Transfer',
                },
            ],
        }
    },
    {
        path: '/warehouse/goods-transfer/commit/:id',
        name: 'GoodsTransferCommit',
        component: () => import("./Commit"),
        meta: {
            auth: true,
            title: 'Commit Goods Transfer',
            breadcrumbs : [
                {
                    text: 'Goods Transfer List',
                    to : '/warehouse/goods-transfer'
                },
                {
                    text: 'Goods Transfer Detail',
                    to : '/warehouse/goods-transfer/detail/:id'
                },
                {
                    text: 'Commit Goods Transfer',
                },
            ],
        }
    },
]