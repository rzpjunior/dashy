export default [
    {
        path: "/purchase/supplier-organization",
        name: "SupplierOrganization",
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: "Supplier Organization List",
        },
    },
    {
        path: "/purchase/supplier-organization/create",
        name: "SupplierOrganizationCreate",
        component: () => import("./Create.vue"),
        meta: {
            auth: true,
            title: "Create Supplier Organization",
            breadcrumbs: [
                {
                    text: "Supplier Organization List",
                    to: "/purchase/supplier-organization",
                },
                {
                    text: "Create Supplier Organization",
                },
            ],
        },
        props: true,
    },
    {
        path: "/purchase/supplier-organization/update/:id",
        name: "SupplierOrganizationUpdate",
        component: () => import("./Update.vue"),
        meta: {
            auth: true,
            title: "Update Supplier Organization",
            breadcrumbs: [
                {
                    text: "Supplier Organization List",
                    to: "/purchase/supplier-organization",
                },
                {
                    text: "Update Supplier Organization",
                },
            ],
        },
        props: true,
    },
    {
        path: "/purchase/supplier-organization/:id",
        name: "SupplierOrganizationDetail",
        component: () => import("./Detail.vue"),
        meta: {
            auth: true,
            title: "Detail Supplier Organization",
            breadcrumbs: [
                {
                    text: "Supplier Organization List",
                    to: "/purchase/supplier-organization",
                },
                {
                    text: "Detail Supplier Organization",
                },
            ],
        },
        props: true,
    },
];
