export default [
    {
        path: '/smart-fridge/fridges',
        name: 'FridgeList',
        component: () => import("./Index"),
        meta: {
            auth: true,
            title: 'Fridge List'
        }
    },
]