import axios from "axios";
import Vue from 'vue'
import store from '../store'
import Router from '../router'
import * as Sentry from "@sentry/vue";

let API_URL = process.env.VUE_APP_API_URL
let API_URL_2 = process.env.VUE_APP_API_URL_2
let APP_URL = process.env.VUE_APP_APP_URL
const ajax = axios.create({
    baseURL: API_URL,
})
ajax.CancelToken = axios.CancelToken
ajax.isCancel = axios.isCancel

/*
 * The interceptor here ensures that we check for the token in local storage every time an ajax request is made
 */
ajax.interceptors.request.use(
    (config) => {
        let token = store.getters.isLoggedIn

        if (token !== '') {
            config.headers['Authorization'] = `Bearer ${token}`;
            ajax.defaults.headers.post['Content-Type'] = "application/json;charset=utf-8";
        } else {
            window.location.href = APP_URL
        }

        return config
    },
    (error) => {
        return Promise.reject(error.message);
    }
);

/*
 * The interceptor takes care of auth
 */
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return errorHandling(error);
    }
);

/*
 * The interceptor takes care of all responses except auth
 */
ajax.interceptors.response.use((response) => {
    return response;
}, (error) => {
    return errorHandling(error);
});

// FOR USING ANOTHER API URL
const ajax2 = axios.create({
    baseURL: API_URL_2,
})
ajax2.CancelToken = axios.CancelToken
ajax2.isCancel = axios.isCancel

/*
 * The interceptor here ensures that we check for the token in local storage every time an ajax request is made
 */
ajax2.interceptors.request.use(
    (config) => {
        let token = store.getters.isLoggedIn

        if (token !== '') {
            config.headers['Authorization'] = `Bearer ${token}`;
            ajax2.defaults.headers.post['Content-Type'] = "application/json;charset=utf-8";
        } else {
            window.location.href = APP_URL
        }

        return config
    },
    (error) => {
        return Promise.reject(error.message);
    }
);

/*
 * The interceptor takes care of auth
 */
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return errorHandling(error);
    }
);

/*
 * The interceptor takes care of all responses except auth
 */
ajax2.interceptors.response.use((response) => {
    return response;
}, (error) => {
    return errorHandling(error);
});

export default {
    install() {
        Vue.prototype.$http = ajax
        Vue.prototype.$http2 = ajax2
    }
}; // Check debug/build mode

function errorHandling(error) {
    let message = "Something went wrong, please try again";
    if (!error.response) {
        message = "Network connection unstable";
        errorToast(message)
        return Promise.reject(error.message)
    } else {
        switch (error.response.status) {
            case 400:
                // **Temporary coment for ignore sentry error
                // Sentry.addBreadcrumb({category: "response", data: error.response.data});
                // Sentry.captureException(new Error("API 400"));
                errorToast(message)
                return Promise.reject(error.response.data);
            case 401:
                store.dispatch('logout');
                Router.push('/').catch(error => {
                    if (error.name !== "NavigationDuplicated") throw error;
                });
                break;
            case 403:
                // **Temporary coment for ignore sentry error
                // Sentry.addBreadcrumb({category: "response", data: error.response.data});
                // Sentry.addBreadcrumb({category: "priv", message: localStorage.getItem('priv')},);
                // Sentry.captureException(new Error("API 403"));
                Router.push('/403').catch(error => {
                    if (error.name !== "NavigationDuplicated") throw error;
                });
                break;
            case 422:
                if(getKey(error.response.data.errors)){
                    message = getKey(error.response.data.errors)
                    warningToast(message)
                }
                else{
                    if (error.response.data.errors.id)
                        message = error.response.data.errors.id
                    else if (error.response.data.errors.message)
                        message = error.response.data.errors.message
                    else if (error.response.data.errors.customer)
                        message = error.response.data.errors.customer
                    else if (error.response.data.errors.credit_limit_amount)
                        message = error.response.data.errors.credit_limit_amount
                    else if (error.response.data.errors.warehouse_coverage)
                        message = error.response.data.errors.warehouse_coverage
                    else if (error.response.data.errors.warehouse_creation)
                        message = error.response.data.errors.warehouse_creation
                    else
                        message = "Something wrong with your input"
                    errorToast(message)
                }
                return Promise.reject(error.response.data);
            case 423:
                Sentry.addBreadcrumb({category: "response", data: error.response.data});
                Sentry.captureException(new Error("API 423"));
                message = error.response.data.errors.message
                errorToast(message)
                return Promise.reject(error.response.data);
            case 404:
                // **Temporary coment for ignore sentry error
                // Sentry.addBreadcrumb({category: "response", data: error.response.data});
                // Sentry.captureException(new Error("API 404"));
                message = "This resource couldn't be found";
                errorToast(message)
                return Promise.reject(error.response.data);
            case 500:
                // **Temporary coment for ignore sentry error
                // Sentry.addBreadcrumb({category: "response", data: error.response});
                // Sentry.captureException(new Error("API 500"));
                errorToast(message)
                return Promise.reject(error.response.data);
            case 503: // Maintenance mode
                Router.push('/503').catch(error => {
                    if (error.name !== "NavigationDuplicated") throw error;
                });
                break;
        }
    }
}

function errorToast(message) {
    Vue.$toast.open({
        position: 'top-right',
        message: message,
        type: 'error',
    });
}

function warningToast(message) {
    Vue.$toast.open({
        position: 'top-right',
        message: message,
        type: 'warning',
    });
}

function getKey(errors) {
    for (var key in errors) {
        if (key.includes('rem_qty')) {
            return errors[key]
        }
    }
}