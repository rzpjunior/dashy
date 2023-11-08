export default [
    {
        path: '/warehouse/print-label',
        name: 'PrintLabel',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Multipurpose Print'
        }
    },
]