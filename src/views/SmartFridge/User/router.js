export default [
    {
        path: '/smart-fridge/user-fridge',
        name: 'UserFridge',
        component: () => import("./Index"),
        meta: {
            auth: true,
            title: 'User Fridge List'
        }
    },
    {
        path: '/smart-fridge/user-fridge/create',
        name: 'UserFridgeCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'User Fridge Create',
            breadcrumbs : [
                {
                    text: 'User Fridge List',
                    to : '/smart-fridge/user-fridge'
                },
                {
                    text: 'User Fridge Create',
                },
            ],
        }
    }
]