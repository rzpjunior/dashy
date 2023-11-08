export default [
    {
        path: "/purchase/supplier-relation",
        name: "SupplierRelation",
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: "Supplier Relation",
        },
    },
    {
        path: "/purchase/supplier-relation/create",
        name: "SupplierRelationCreate",
        component: () => import("./Create.vue"),
        meta: {
            auth: true,
            title: "Create Supplier Relation",
            breadcrumbs: [
                {
                    text: "Supplier Relation List",
                    to: "/purchase/supplier-relation",
                },
                {
                    text: "Create Supplier Relation",
                },
            ],
        },
        props: true,
    },
    {
        path: "/purchase/supplier-relation/update/:id",
        name: "SupplierRelationUpdate",
        component: () => import("./Update.vue"),
        meta: {
            auth: true,
            title: "Update Supplier Relation",
            breadcrumbs: [
                {
                    text: "Supplier Relation List",
                    to: "/purchase/supplier-relation",
                },
                {
                    text: "Update Supplier Relation",
                },
            ],
        },
        props: true,
    },
];
