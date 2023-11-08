export default [
    {
        path: '/sales/assignment',
        name: 'Assignment',
        component: () => import("./Index"),
        alias: '/sales/assignment/v2',
        meta: {
            auth: true,
            title: 'Assignment List'
        }
    },
    {
        path: '/sales/assignment/create',
        name: 'AssignmentCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Assignment Create',
            breadcrumbs : [
                {
                    text: 'Assignment List',
                    to : '/sales/assignment'
                },
                {
                    text: 'Assignment Create',
                },
            ],
        }
    },
    {
        path: '/sales/assignment/detail/:id',
        name: 'SalesAssignmentDetail',
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: 'Assignment Detail',
            breadcrumbs : [
                {
                    text: 'Assignment List',
                    to : '/sales/assignment'
                },
                {
                    text: 'Assignment Detail',
                },
            ],
        }
    },
    // Objective Route
    {
        path: '/sales/assignment/objective',
        name: 'AssignmentObjective',
        component: () => import("./Objective/Index"),
        meta: {
            auth: true,
            title: 'Assignment Objective List'
        }
    },
    {
        path: '/sales/assignment/objective/create',
        name: 'AssignmentObjectiveCreate',
        component: () => import("./Objective/Create"),
        meta: {
            auth: true,
            title: 'Assignment Objective Create',
            breadcrumbs : [
                {
                    text: 'Assignment Objective List',
                    to : '/sales/assignment/objective'
                },
                {
                    text: 'Assignment Objective Create',
                },
            ],
        }
    },
    {
        path: '/sales/assignment/objective/update/:id',
        name: 'AssignmentObjectiveUpdate',
        component: () => import("./Objective/Update"),
        meta: {
            auth: true,
            title: 'Assignment Objective Update',
            breadcrumbs : [
                {
                    text: 'Assignment Objective List',
                    to : '/sales/assignment/objective'
                },
                {
                    text: 'Assignment Objective Update',
                },
            ],
        }
    },
]