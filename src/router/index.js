import Vue from "vue";
import Router from "vue-router";
import Login from "../views/Login.vue";
import Home from "../views/Home.vue";
import Error401 from "../views/Error/401.vue";
import Error403 from "../views/Error/403.vue";
import Error404 from "../views/Error/404.vue";
import Error500 from "../views/Error/500.vue";
import Error503 from "../views/Error/503.vue";
import store from "../store/index.js";
import * as Sentry from "@sentry/vue";
import VueGtag from "vue-gtag";
import {Integrations} from "@sentry/tracing";

Vue.use(Router);
const SENTRY_DSN = process.env.VUE_APP_SENTRY_DSN;
const SENTRY_RELEASE_TAG = process.env.VUE_APP_RELEASE_TAG;
let SENTRY_ENVIROMENT = process.env.VUE_APP_SENTRY_ENVIROMENT;
if (!SENTRY_ENVIROMENT) {
    SENTRY_ENVIROMENT = "development"
}
// Sentry Integration
Sentry.init({
    Vue,
    dsn: SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 0.1,
    release: (SENTRY_ENVIROMENT === 'production' ? "dashboard@" + SENTRY_RELEASE_TAG : "dashboard@staging"),
    environment: SENTRY_ENVIROMENT,
    beforeSend(event) { // Don't log Unhandled Promise Rejection (passing object Instead of Error)
        const firstException = event.exception.values.find(x => x !== undefined);
        if (firstException && firstException.type === 'UnhandledRejection') return null;
        return event;
    },
});

/**
 * Auto register other routes
 * setiap file.js di directory views yang mempunyai route.js
 * akan diregisterkan sebagai route
 */
let path = []
let route = []
const comps = require.context('../views/', true, /\.(js)$/i);
comps.keys().map(key => {
    path.push(comps(key).default)

});
path.forEach((value, index) => {
    if (value !== undefined) {
        value.forEach((c, index) => {
            route.push(c)
        });

    }

});
route.push({
    path: "/",
    name: "Login",
    component: Login,
    meta: {
        title: "Login",
        guest: true
    }
})
route.push({
    path: "/Home",
    name: "Home",
    component: Home,
    meta: {
        title: "Home",
    }
})
route.push({
    path: "/401",
    name: "Unauthorized",
    component: Error401,
    meta: {
        title: "Unauthorized",
    }
})
route.push({
    path: "/403",
    name: "Forbidden",
    component: Error403,
    meta: {
        title: "Forbidden",
    }
})
route.push({
    path: "/404",
    name: "PageNotFound",
    component: Error404,
    meta: {
        title: "Page not found!",
    }
})
route.push({
    path: "/500",
    name: "InternalServerError",
    component: Error500,
    meta: {
        title: "Internal server error",
    }
})
route.push({
    path: "/503",
    name: "Maintenance",
    component: Error503,
    meta: {
        title: "Dashboard is under maintenance",
    }
})
let router = new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: route,
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.auth)) {
        if (store.getters.isLoggedIn !== '' && to.path !== '/') {
            next();
        } else {
            next({
                path: "/",
            });
        }
    } else if (to.matched.some(record => record.meta.guest)) {
        if (store.getters.isLoggedIn !== '' && to.path === '/') {
            next({
                path: "/home",
            });
        } else {
            next();
        }
    } else {
        next();
    }
});

Vue.use(VueGtag, {
    config: {id: process.env.VUE_APP_GOOGLE_ANALYTICS_TAG}
}, router);

export default router;