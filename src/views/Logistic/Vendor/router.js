export default [
    {
        path: "/logistic/vendor",
        name: "Vendor",
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: "Vendor",
        },
    },
    {
        path: "/logistic/vendor/create",
        name: "VendorCreate",
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: "Vendor Create",
            breadcrumbs: [
                {
                    text: "Vendor List",
                    to: "/logistic/vendor",
                },
                {
                    text: "Create Vendor",
                },
            ],
        },
    },
    {
        path: "/logistic/vendor/update/:id",
        name: "VendorUpdate",
        component: () => import("./Update"),
        meta: {
            auth: true,
            title: "Vendor Update",
            breadcrumbs: [
                {
                    text: "Vendor List",
                    to: "/logistic/vendor",
                },
                {
                    text: "Update Vendor",
                },
            ],
        },
    },
    {
        path: "/logistic/vendor/detail/:id",
        name: "VendorDetail",
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: "Vendor",
            breadcrumbs: [
                {
                    text: "Vendor List",
                    to: "/logistic/vendor",
                },
                {
                    text: "Vendor Detail",
                },
            ],
        },
    },
]
