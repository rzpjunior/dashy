export default [
    {
        path: '/price/set',
        name: 'PriceSet',
        component: () => import("./Index.vue"),
        // alias: '/price/set',
        meta: {
            auth: true,
            title: 'PriceSet'
        }
    },
    {
        path: '/price/set/create',
        name: 'PriceSetCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Price Set Create',
            breadcrumbs : [
                {
                    text : 'Price Set',
                    to : '/price/set',
                },
                {
                    text: 'Price Set Create',
                },
            ],
        }
    },
    {
        path: '/price/set/update/:id',
        name:'PriceSetUpdate',
        component: () => import("./Update"),
        alias:'/price/set/update/v2/:id',
        meta: {
            auth: true,
            title: 'Price Set Update',
            breadcrumbs : [
                {
                    text : 'Price Set',
                    to : '/price/set',
                },
                {
                    text: 'Price Set Update',
                },
            ],
        },
        props: true,
    },
]