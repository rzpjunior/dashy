export default [
    {
        path: "/logistic/courier",
        name: "Courier",
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: "Courier",
        },
    },
    {
        path: "/logistic/courier/create",
        name: "CourierCreate",
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: "Courier Create",
            breadcrumbs: [
                {
                    text: "Courier List",
                    to: "/logistic/courier",
                },
                {
                    text: "Create Courier",
                },
            ],
        },
    },
    {
        path: "/logistic/courier/update/:id",
        name: "CourierUpdate",
        component: () => import("./Update"),
        meta: {
            auth: true,
            title: "Courier Update",
            breadcrumbs: [
                {
                    text: "Courier List",
                    to: "/logistic/courier",
                },
                {
                    text: "Update Courier",
                },
            ],
        },
    },
    {
        path: "/logistic/courier/detail/:id",
        name: "CourierDetail",
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: "Courier",
            breadcrumbs: [
                {
                    text: "Courier List",
                    to: "/logistic/courier",
                },
                {
                    text: "Courier Detail",
                },
            ],
        },
    },
]
