export default [
    {
        path: '/warehouse/checker-weight-scale',
        name: 'CheckerWeighScale',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Checker Weight Scale'
        }
    },
]