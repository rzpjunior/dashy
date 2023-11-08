export default [
    {
        path: '/report/pg',
        name: 'ReportPG',
        component: () => import("./PGTransaction/PGReport.vue"),
        meta: {
            auth: true,
            title: 'PG Transaction Report'
        }
    },
    {
        path: '/report/vl',
        name: 'ReportVL',
        component: () => import("./VoucherLogReport/VLReport.vue"),
        meta: {
            auth: true,
            title: 'Voucher Log Report'
        }
    },
    {
        path: '/report/submission',
        name: 'ReportSubmission',
        component: () => import("./Submission/SubmissionReport.vue"),
        meta: {
            auth: true,
            title: 'Submission Report'
        }
    },
]