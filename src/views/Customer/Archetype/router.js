export default [
    {
        path: '/customer/archetype',
        name: 'Archetype',
        component: () => import("./Index.vue"),
        alias: '/customer/tag/v2',
        meta: {
            auth: true,
            title: 'Archetype'
        }
    },
    {
        path: '/customer/archetype/create',
        name: 'ArchetypeCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Archetype Create',
            breadcrumbs : [
                {
                    text: 'Archetype List',
                    to : '/customer/archetype'
                },
                {
                    text: 'Create Archetype',
                },
            ],
        }
    },
]