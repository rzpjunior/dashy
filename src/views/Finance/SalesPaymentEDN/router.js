export default [
    {
        path: "/finance/edn-payment",
        name: "SalesPaymentEDN",
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: "Sales Payment List EDN",
        },
    },
    {
        path: "/finance/edn-payment/create",
        name: "CreateSalesPaymentEDN",
        component: () => import("./CreateBulk.vue"),
        meta: {
            auth: true,
            title: "Create Payment EDN",
            breadcrumbs: [
                {
                    text: "Sales Payment EDN",
                    to: "/finance/edn-payment",
                },
                {
                    text: "Create Payment EDN",
                },
            ],
        },
    },
];