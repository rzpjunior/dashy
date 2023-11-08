export default [
    {
        path: "/warehouse/transfer-sku",
        name: "TransferSKUList",
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: "Transfer SKU List",
        },
    },
    {
        path: "/warehouse/transfer-sku/detail/:id",
        name: "TransferSKUDetail",
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: "Transfer SKU Detail",
            breadcrumbs: [
                {
                    text: "Transfer SKU List",
                    to: "/warehouse/transfer-sku",
                },
                {
                    text: "Transfer SKU Detail",
                },
            ],
        },
    },
    {
        path: "/warehouse/transfer-sku/create",
        name: "TransferSKUCreate",
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: "Transfer SKU Create",
            breadcrumbs: [
                {
                    text: "Transfer SKU List",
                    to: "/warehouse/transfer-sku",
                },
                {
                    text: "Transfer SKU Create",
                },
            ],
        },
    },
];
