export default [
    {
        path: '/operation',
        name: 'Operation',
        component: () => import("./Operation.vue"),
        meta: {
            auth: true,
            title: 'Operations Dashboard'
        }
    },
]