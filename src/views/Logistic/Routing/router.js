export default [
	{
		path: "/logistic/routing",
		name: "Routing",
		component: () => import("./Index.vue"),
		meta: {
			auth: true,
			title: "Routing",
		},
	},
	{
		path: "/logistic/routing/createroute",
		name: "RoutingCreate",
		component: () => import("./Create"),
		meta: {
			auth: true,
			title: "Generate Routing",
			breadcrumbs: [
				{
					text: "Routing List",
					to: "/logistic/routing",
				},
				{
					text: "Generate Routing",
				},
			],
		},
	},
	{
        path: '/logistic/routing/detail/:id',
        name: 'RoutingDetail',
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: 'Routing',
            breadcrumbs : [
                {
                    text: 'Routing List',
                    to : '/logistic/routing'
                },
                {
                    text: 'Routing Detail'
                },
            ],
        }
    },
]
