export default [
    {
        path: '/warehouse/waste-entry',
        name: 'WasteEntry',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Waste Entry'
        }
    },
    {
        path: '/warehouse/waste-entry/create',
        name: 'WasteEntryCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Waste Entry Create',
            breadcrumbs : [
                {
                    text: 'Waste Entry',
                    to : '/warehouse/waste-entry'
                },
                {
                    text: 'Waste Entry Create',
                },
            ],
        }
    },
    {
        path: '/warehouse/waste-entry/:id',
        name:'WasteEntryDetail',
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: 'Waste Entry Detail',
            breadcrumbs : [
                {
                    text: 'Waste Entry',
                    to : '/warehouse/waste-entry'
                },
                {
                    text: 'Waste Entry Detail',
                },
            ],
        },
        props: true,
    },
]