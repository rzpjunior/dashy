export default [
    {
        path: '/finance/debit-note',
        name: 'DebitNote',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Debit Note'
        }
    },
    {
        path: '/finance/debit-note/detail/:id',
        name: 'DebitNoteDetail',
        component: () => import("./Detail.vue"),
        meta: {
            auth: true,
            title: 'Debit Note Detail',
            breadcrumbs : [
                {
                    text: 'Debit Note List',
                    to : '/finance/debit-note'
                },
                {
                    text: 'Debit Note Detail',
                },
            ],
        }
    },
]
