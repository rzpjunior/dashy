export default [
    {
        path: '/campaign/banner',
        name: 'BannerList',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Banner List'
        }
    },
    {
        path: '/campaign/banner/create',
        name: 'BannerCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Create Banner',
            breadcrumbs : [
                {
                    text: 'Banner List',
                    to : '/campaign/banner'
                },
                {
                    text: 'Create Banner',
                },
            ],
        }
    },
    {
        path: '/campaign/banner/:id',
        name:'BannerDetail',
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: 'Banner Detail',
            breadcrumbs : [
                {
                    text: 'Banner List',
                    to : '/campaign/banner'
                },
                {
                    text: 'Banner Detail',
                },
            ],
        },
        props: true,
    },
]