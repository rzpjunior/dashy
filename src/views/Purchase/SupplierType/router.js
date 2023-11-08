export default [
    {
        path: "/purchase/supplier_type",
        name: "SupplierType",
        component: () => import("./Index.vue"),
        alias: "/purchase/supplier_type/v2",
        meta: {
            auth: true,
            title: "Supplier Type List",
        },
    },
    {
        path: "/purchase/supplier_type/create",
        name: "SupplierTypeCreate",
        component: () => import("./Create.vue"),
        meta: {
            auth: true,
            title: "Create Supplier Type",
            breadcrumbs: [
                {
                    text: "Supplier Type List",
                    to: "/purchase/supplier_type",
                },
                {
                    text: "Create Supplier Type",
                },
            ],
        },
        props: true,
    },
    {
        path: "/purchase/supplier_type/update/:id",
        name: "SupplierTypeUpdate",
        component: () => import("./Update.vue"),
        meta: {
            auth: true,
            title: "Update Supplier Type",
            breadcrumbs: [
                {
                    text: "Supplier Type List",
                    to: "/purchase/supplier_type",
                },
                {
                    text: "Update Supplier Type",
                },
            ],
        },
        props: true,
    },
];  