export default [
    {
        path: "/finance/sp",
        name: "SalesPayment",
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: "Sales Payment List",
        },
    },
    {
        path: "/finance/sp/spb",
        name: "CreateActiveSalesPayment",
        component: () => import("./CreateBulk.vue"),
        meta: {
            auth: true,
            title: "Create Active Payment",
            breadcrumbs: [
                {
                    text: "Sales Payment",
                    to: "/finance/sp",
                },
                {
                    text: "Create Active Payment",
                },
            ],
        },
    },
    {
        path: "/finance/sp/confirm",
        name: "ConfirmPayment",
        component: () => import("./Confirm.vue"),
        meta: {
            auth: true,
            title: "Confirm Payment",
            breadcrumbs: [
                {
                    text: "Sales Payment",
                    to: "/finance/sp",
                },
                {
                    text: "Confirm Payment",
                },
            ],
        },
    },
];