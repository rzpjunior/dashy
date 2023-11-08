export default [
    {
        path: "/purchase/supplier-commodity",
        name: "SupplierCommodity",
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: "Supplier Commodity List",
        },
    },
    {
        path: "/purchase/supplier-commodity/create",
        name: "SupplierCommodityCreate",
        component: () => import("./Create.vue"),
        meta: {
            auth: true,
            title: "Create Supplier Commodity",
            breadcrumbs: [
                {
                    text: "Supplier List",
                    to: "/purchase/supplier-commodity",
                },
                {
                    text: "Create Supplier Commodity",
                },
            ],
        },
        props: true,
    },
    {
        path: "/purchase/supplier-commodity/update/:id",
        name: "SupplierCommodityUpdate",
        component: () => import("./Update.vue"),
        meta: {
            auth: true,
            title: "Update Supplier Commodity",
            breadcrumbs: [
                {
                    text: "Supplier List",
                    to: "/purchase/supplier-commodity",
                },
                {
                    text: "Update Supplier Commodity",
                },
            ],
        },
        props: true,
    },
];