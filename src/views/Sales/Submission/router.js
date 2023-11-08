export default [
    {
        path: '/sales/submission',
        name: 'Submission',
        component: () => import("./Index.vue"),
        alias: '/sales/submission/v2',
        meta: {
            auth: true,
            title: 'Submission List'
        }
    },
    {
        path: '/sales/submission/detail/:id/:task',
        name: 'SubmissionDetail',
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: 'Submission Detail',
            breadcrumbs: [
                {
                    text: 'Submission List',
                    to: '/sales/submission'
                },
                {
                    text: 'Submission Detail',
                },
            ],
        }
    },
]