export default [
    {
        path: '/warehouse/inbound',
        name: 'Inbound',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Inbound'
        }
    },
]