export default [
    {
        path: '/smart-fridge/product-box',
        name: 'ProductBox',
        component: () => import("./Index"),
        meta: {
            auth: true,
            title: 'Product Box List'
        }
    },
    {
        path: '/smart-fridge/product-box/create',
        name: 'ProductBoxCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Product Box Create',
            breadcrumbs : [
                {
                    text: 'Product Box List',
                    to : '/smart-fridge/product-box'
                },
                {
                    text: 'Product Box Create',
                },
            ],
        }
    },
    {
        path: '/smart-fridge/product-box/confirm',
        name: 'ProductBoxConfirm',
        component: () => import("./Confirm"),
        meta: {
            auth: true,
            title: 'Confirm Product Box',
            breadcrumbs : [
                {
                    text: 'Product Box List',
                    to : '/smart-fridge/product-box'
                },
                {
                    text: 'Confirm Product Box',
                },
            ],
        }
    }
]