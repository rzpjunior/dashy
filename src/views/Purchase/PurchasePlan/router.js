export default [
    {
        path: "/purchase/plan",
        name: "PurchasePlan",
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: "Purchase Plan",
        },
    },
    {
        path: "/purchase/plan/create",
        name: "PurchasePlanCreate",
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: "Create Purchase Plan",
            breadcrumbs: [
                {
                    text: "Purchase Plan List",
                    to: "/purchase/plan",
                },
                {
                    text: "Create Purchase Plan",
                },
            ],
        },
    },
    {
        path: "/purchase/plan/update/:id",
        name: "PurchasePlanUpdate",
        component: () => import("./Update"),
        meta: {
            auth: true,
            title: "Purchase Plan Update",
            breadcrumbs: [
                {
                    text: "Purchase Plan",
                    to: "/purchase/plan",
                },
                {
                    text: "Purchase Plan Update",
                },
            ],
        },
        props: true,
    },
    {
        path: "/purchase/plan/:id",
        name: "PurchasePlanDetail",
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: "Purchase Plan Detail",
            breadcrumbs: [
                {
                    text: "Purchase Plan",
                    to: "/purchase/plan",
                },
                {
                    text: "Purchase Plan Detail",
                },
            ],
        },
        props: true,
    },
];
