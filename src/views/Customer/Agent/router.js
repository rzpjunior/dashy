export default [
    {
        path: '/customer/agent',
        name: 'Agent',
        component: () => import("./Index.vue"),
        alias: '/customer/agent/v2',
        meta: {
            auth: true,
            title: 'Agent'
        }
    },
    {
        path: '/customer/agent/create',
        name: 'AgentCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Create Agent',
            breadcrumbs : [
                {
                    text: 'Agent List',
                    to : '/customer/agent'
                },
                {
                    text: 'Create Agent',
                },
            ],
        }
    },
    {
        path: '/customer/agent/update/:id',
        name: 'AgentUpdate',
        component: () => import("./Update"),
        meta: {
            auth: true,
            title: 'Update Agent',
            breadcrumbs : [
                {
                    text: 'Agent List',
                    to : '/customer/agent'
                },
                {
                    text: 'Agent Detail',
                    to : '/customer/agent/detail/:id'
                },
                {
                    text: 'Update Agent',
                },
            ],
        }
    },
    {
        path: '/customer/agent/detail/:id',
        name: 'AgentDetail',
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: 'Agent',
            breadcrumbs : [
                {
                    text: 'Agent List',
                    to : '/customer/agent'
                },
                {
                    text: 'Agent Detail',
                },
            ],
        }
    },
    {
        path: '/customer/agent/shipping-address/detail/:id',
        name: 'ShippingAddressDetail',
        component: () => import("./ShippingAddress/Detail"),
        meta: {
            auth: true,
            title: 'Shipping Address Detail',
        }
    },
    {
        path: '/customer/agent/shipping-address/update/:id',
        name: 'ShippingAddressUpdate',
        component: () => import("./ShippingAddress/Update"),
        meta: {
            auth: true,
            title: 'Update Shipping Address',
        }
    },
    {
        path: '/customer/agent/shipping-address/create/:id',
        name: 'ShippingAddressCreate',
        component: () => import("./ShippingAddress/Create"),
        meta: {
            auth: true,
            title: 'Create Shipping Address',
            breadcrumbs : [
                {
                    text: 'Agent List',
                    to : '/customer/agent'
                },
                {
                    text: 'Agent Detail',
                    to : '/customer/agent/detail/:id'
                },
                {
                    text: 'Create Shipping Address',
                },
            ],
        }
    },
    {
        path: '/customer/agent/archetype/convert/:id',
        name: 'ConvertArchetype',
        component: () => import("./Archetype/Convert"),
        meta: {
            auth: true,
            title: 'Convert Archetype',
            breadcrumbs : [
                {
                    text: 'Agent List',
                    to : '/customer/agent'
                },
                {
                    text: 'Agent Detail',
                    to : '/customer/agent/detail/:id'
                },
                {
                    text: 'Convert Archetype',
                },
            ],
        }
    },
    {
        path: '/customer/agent/customer-tag/update/:id',
        name: 'UpdateCustomerTag',
        component: () => import("./CustomerTag/Update"),
        meta: {
            auth: true,
            title: 'Update Customer Tag',
            breadcrumbs : [
                {
                    text: 'Agent List',
                    to : '/customer/agent'
                },
                {
                    text: 'Agent Detail',
                    to : '/customer/agent/detail/:id'
                },
                {
                    text: 'Update Customer Tag',
                },
            ],
        }
    },
    {
        path: '/customer/agent/salesperson/update/:id',
        name: 'UpdateSalesperson',
        component: () => import("./Salesperson/Update"),
        meta: {
            auth: true,
            title: 'Update Salesperson',
            breadcrumbs : [
                {
                    text: 'Agent List',
                    to : '/customer/agent'
                },
                {
                    text: 'Agent Detail',
                    to : '/customer/agent/detail/:id'
                },
                {
                    text: 'Update Salesperson',
                },
            ],
        }
    },
    {
        path: '/customer/agent/phone-number/update/:id',
        name: 'UpdatePhoneNumber',
        component: () => import("./PhoneNumber/Update"),
        meta: {
            auth: true,
            title: 'Update Phone Number',
            breadcrumbs : [
                {
                    text: 'Agent List',
                    to : '/customer/agent'
                },
                {
                    text: 'Agent Detail',
                    to : '/customer/agent/detail/:id'
                },
                {
                    text: 'Update Phone Number',
                },
            ],
        }
    },
]