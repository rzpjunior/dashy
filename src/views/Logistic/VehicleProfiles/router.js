export default [
    {
        path: "/logistic/vehicle-profiles",
        name: "VehicleProfiles",
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: "Vehicle Profile",
        },
    },
    {
        path: "/logistic/vehicle-profiles/create",
        name: "VehicleProfilesCreate",
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: "Vehicle Profile Create",
            breadcrumbs: [
                {
                    text: "Vehicle Profile List",
                    to: "/logistic/vehicle-profiles",
                },
                {
                    text: "Create Vehicle Profile",
                },
            ],
        },
    },
    {
        path: "/logistic/vehicle-profiles/update/:id",
        name: "VehicleProfilesUpdate",
        component: () => import("./Update"),
        meta: {
            auth: true,
            title: "Vehicle Profile Update",
            breadcrumbs: [
                {
                    text: "Vehicle Profile List",
                    to: "/logistic/vehicle-profiles",
                },
                {
                    text: "Update Vehicle Profiles",
                },
            ],
        },
    },
    {
        path: "/logistic/vehicle-profiles/detail/:id",
        name: "VehicleProfilesDetail",
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: "Vehicle",
            breadcrumbs: [
                {
                    text: "Vehicle List",
                    to: "/logistic/vehicle-profiles",
                },
                {
                    text: "Vehicle Detail",
                },
            ],
        },
    },
]
