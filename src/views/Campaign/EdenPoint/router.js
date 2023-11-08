export default [
    {
        path: '/campaign/eden-point',
        name: 'EdenPointCampaignList',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'EdenPoint Campaign List'
        }
    },
    {
        path: '/campaign/eden-point/create',
        name: 'EdenPointCampaignCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Create EdenPoint Campaign',
            breadcrumbs : [
                {
                    text: 'EdenPoint Campaign List',
                    to : '/campaign/eden-point'
                },
                {
                    text: 'Create EdenPoint Campaign',
                },
            ],
        }
    },
    {
        path: '/campaign/eden-point/:id',
        name:'EdenPointCampaignDetail',
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: 'EdenPoint Campaign Detail',
            breadcrumbs : [
                {
                    text: 'EdenPoint Campaign List',
                    to : '/campaign/eden-point'
                },
                {
                    text: 'EdenPoint Campaign Detail',
                },
            ],
        },
        props: true,
    },
]