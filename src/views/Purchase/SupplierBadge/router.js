export default [
    {
        path: "/purchase/supplier-badge",
        name: "SupplierBadge",
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: "Supplier Badge List",
        },
    },
    {
        path: "/purchase/supplier-badge/create",
        name: "SupplierBadgeCreate",
        component: () => import("./Create.vue"),
        meta: {
            auth: true,
            title: "Create Supplier Badge",
            breadcrumbs: [
                {
                    text: "Supplier Bagde List",
                    to: "/purchase/supplier-badge",
                },
                {
                    text: "Create Supplier Badge",
                },
            ],
        },
        props: true,
    },
    {
        path: "/purchase/supplier-badge/update/:id",
        name: "SupplierBadgeUpdate",
        component: () => import("./Update.vue"),
        meta: {
            auth: true,
            title: "Update Supplier Badge",
            breadcrumbs: [
                {
                    text: "Supplier Badge List",
                    to: "/purchase/supplier-badge",
                },
                {
                    text: "Update Supplier Badge",
                },
            ],
        },
        props: true,
    },
  ];
  