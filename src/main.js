import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import http from './plugins/axios.js'
import './assets/custom/main.css'
import './assets/css/main.scss'
// toast for axios notification
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import DatetimePicker from 'vuetify-datetime-picker'
import VuetifyMoney from "vuetify-money";
import VueNumericInput from 'vue-numeric-input';
import VueNumeric from 'vue-numeric'
import VueFileAgent from 'vue-file-agent';
import VueFileAgentStyles from 'vue-file-agent/dist/vue-file-agent.css';
import vueXlsxTable from 'vue-xlsx-table'
import VueObserveVisibility from 'vue-observe-visibility'
// leaflet js for map
import { LMap, LTileLayer, LMarker, LTooltip, LImageOverlay, LIcon, LPolygon, LPopup } from 'vue2-leaflet';
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster';
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { Icon } from 'leaflet';

Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);
Vue.component('l-tooltip', LTooltip);
Vue.component('l-image-overlay', LImageOverlay);
Vue.component('l-icon', LIcon);
Vue.component('l-polygon', LPolygon);
Vue.component('l-popup', LPopup);
Vue.component('v-marker-cluster', Vue2LeafletMarkerCluster);

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

Vue.use(VueObserveVisibility)
Vue.use(VueFileAgent);

Vue.use(VueNumeric)
Vue.use(VueNumericInput)

Vue.use(vueXlsxTable, {rABS: false})
Vue.use(DatetimePicker)
Vue.use(require('vue-moment'));
Vue.config.productionTip = false;
Vue.use(http)
Vue.use(VueToast);
Vue.use(VuetifyMoney);

// Auto Register setiap Component didalam folder 'com'
const comps = require.context('./views/', true, /\.(js|vue)$/i);
comps.keys().map(key => {
    if (key.includes('com')) {
        if (typeof comps(key).default.name !== "undefined") {
            return Vue.component(comps(key).default.name, () => import('./views' + key.substring(1)))
        }
    }
});
const comps2 = require.context('./components/', true, /\.(js|vue)$/i);
comps2.keys().map(key => {
    if (key.includes('com')) {
        if (typeof comps2(key).default.name !== "undefined") {
            return Vue.component(comps2(key).default.name, () => import('./components' + key.substring(1)))
        }
    }
});

// ini untuk privilege
Vue.directive('privilege', {
    inserted: function (el, binding, vnode) {
        let priv = localStorage.getItem('priv')
        if (store.getters.getStaff) {
            let superAdmin = store.getters.getStaff
            superAdmin.user.email = store.getters.getStaff.user.email
            if (superAdmin.user.email !== 'superadmin') {
                if (typeof binding.value !== 'undefined') {
                    priv = "," + priv + ","
                    binding.value = "," + binding.value + ","
                    if (priv.indexOf(binding.value) < 0) {
                        vnode.elm.parentElement.removeChild(vnode.elm)
                    }
                }
            }
        }
    }
})

Vue.mixin({
    data: function () {
        return {
            status: [{
                text: 'All Status',
                value: 999
            }, {
                text: 'Active',
                value: 1
            }, {
                text: 'Archived',
                value: 2
            }],

            salable: [{
                text: 'Salable',
                value: 1
            }, {
                text: 'Non Salable',
                value: 2
            }, {
                text: 'All',
                value: 0
            }],

            purchasable: [{
                text: 'Purchasable',
                value: 1
            }, {
                text: 'Non Purchasable',
                value: 2
            }, {
                text: 'All',
                value: 0
            }],

            status_prospect: [{
                text: 'All Status',
                value: 999
            }, {
                text: 'New',
                value: 1
            }, {
                text: 'Registered',
                value: 2
            }, {
                text: 'Decline',
                value: 3
            }],

            //  rules input validation
            val_alphabet: [
                value => !!value || 'Field is required.',
                value => {
                    const pattern = /^([a-zA-Z])+$/
                    return pattern.test(value) || 'Alphabet Input Only.'
                },
            ],
            val_alphabet_space: [
                value => !!value || 'Field is required.',
                value => {
                    const pattern = /^([a-zA-Z\s])+$/
                    return pattern.test(value) || 'Alphabet & Space Input Only.'
                },
            ],
            val_alphabet_spec_char: [
                value => !!value || 'Field is required.',
                value => {
                    const pattern = /^([a-zA-Z.,?!,><])+$/
                    return pattern.test(value) || 'Alphabet & Special Character Input Only.'
                },
            ],
            val_alphanumeric: [
                value => !!value || 'Field is required.',
                value => {
                    const pattern = /^([a-zA-Z0-9])+$/
                    return pattern.test(value) || 'Alphanumeric Input Only.'
                },
            ],
            val_alphanumeric_space: [
                value => !!value || 'Field is required.',
                value => {
                    const pattern = /^([a-zA-Z0-9\s])+$/
                    return pattern.test(value) || 'Alphanumeric & Space Input Only.'
                },
            ],
            val_alphanumeric_spec_char_space: [
                value => !!value || 'Field is required.',
                value => {
                    const pattern = /^([a-zA-Z0-9.,?!><\s])+$/
                    return pattern.test(value) || 'Alphanumeric, Space & Special Character Input Only.'
                },
            ],
            val_numeric: [
                value => !!value || 'Field is required.',
                value => {
                    const pattern = /^([0-9])+$/
                    return pattern.test(value) || 'Numeric Input Only.'
                },
            ],
            val_numeric_space: [
                value => !!value || 'Field is required.',
                value => {
                    const pattern = /^([0-9\s])+$/
                    return pattern.test(value) || 'Numeric & Space Input Only.'
                },
            ],
            val_numeric_spec_char: [
                value => !!value || 'Field is required.',
                value => {
                    const pattern = /^([0-9.,?!><])+$/
                    return pattern.test(value) || 'Numeric & Special Character Input Only.'
                },
            ],
            val_phone_number: [
                value => (value || '').length >= 8 && (value || '').length <= 15 || 'Min 8, Max 15 characters',
                value => {
                    const pattern = /^([0-9])+$/
                    return pattern.test(value) || 'Numeric Input Only.'
                },
            ],
            val_ric_number: [
                value => !!value || 'Field is required.',
                value => (value || '').length == 16 || '16 Digit characters',
                value => {
                    const pattern = /^([0-9])+$/
                    return pattern.test(value) || 'Numeric Input Only.'
                },
            ],
            val_pass_int: [
                value => !!value || 'Field is required.',
                value => (value || '').length >= 8 && (value || '').length <= 32 || 'Min 8, Max 32 characters',
                value => {
                    const pattern = /^([a-zA-Z0-9!@#$%^&*)(}{][])+$/
                    return pattern.test(value) || 'Alphanumeric & Special Character Input Only.'
                },
            ],
            val_pass_int: [
                value => !!value || 'Field is required.',
                value => (value || '').length >= 8 && (value || '').length <= 32 || 'Min 8, Max 32 characters',
                value => {
                    const pattern = /^([a-zA-Z0-9.,?!><])+$/
                    return pattern.test(value) || 'Alphanumeric & Special Character Input Only.'
                },
            ],
            val_name_person: [
                value => (value || '').length >= 1 && (value || '').length <= 30 || 'Min 1, Max 30 characters',
                value => {
                    const pattern = /^([a-zA-Z\s])+$/
                    return pattern.test(value) || 'Alphabet & Space Input Only.'
                },
            ],
            val_name_merchant: [
                value => !!value || 'Required.',
                value => (value || '').length >= 1 && (value || '').length <= 20 || 'Min 1, Max 20 characters',
            ],
            val_email: [
                value => {
                    const pattern = /^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || 'E-mail must be valid'
                },
            ],
            val_name_master: [
                value => !!value || 'Field is required.',
                value => (value || '').length >= 1 && (value || '').length <= 20 || 'Min 1, Max 20 characters',
                value => {
                    const pattern = /^([a-zA-Z0-9.,?!><\s])+$/
                    return pattern.test(value) || 'Alphanumeric, Space & Special Characte Input.'
                },
            ],
            val_note_long: [
                value => (value || '').length <= 250 || 'Max 250 characters',
                value => {
                    const pattern = /^([a-zA-Z0-9.,?!><\s])+$/
                    return pattern.test(value) || 'Alphanumeric, Space & Special Characte Input.'
                },
            ],
            val_note_short: [
                value => (value || '').length <= 100 || 'Max 100 characters',
                value => {
                    const pattern = /^([a-zA-Z0-9.,?!><\s])+$/
                    return pattern.test(value) || 'Alphanumeric, Space & Special Characte Input.'
                },
            ],
            val_code_voucher: [
                value => !!value || 'Field is required.',
                value => (value || '').length >= 5 && (value || '').length <= 20 || 'Min 5, Max 20 characters',
                value => {
                    const pattern = /^([a-zA-Z0-9])+$/
                    return pattern.test(value) || 'Alphanumeric Input Only.'
                },
            ],
            val_alt_phone_number: [
                value => (value || '').length >= 8 && (value || '').length <= 100 || 'Min 8, Max 100 characters',
                value => {
                    const pattern = /^([0-9\s])+$/
                    return pattern.test(value) || 'Numeric Input Only.'
                },
            ],
            val_address: [
                value => !!value || 'Field is required.',
                value => (value || '').length <= 350 || 'Max 350 characters',
                value => {
                    const pattern = /^([a-zA-Z0-9.,?!><\s])+$/
                    return pattern.test(value) || 'Numeric Input Only.'
                },
            ],
            money: {
                locale: "in-ID",
                prefix: "Rp. ",
                suffix: "",
                length: 20,
                precision: 2
            },
            qtyInteger: {
                locale: "in-ID",
                prefix: "",
                suffix: "",
                length: 10,
                precision: 0
            },
            qtyFloat: {
                locale: "in-ID",
                prefix: "",
                suffix: "",
                length: 20,
                precision: 2
            },
        }
    },
    methods: {
        statusMaster(str) {
            if (str === 'active') {
                str = '#C6EB93'
            } else if (str === 'finished') {
                str = '#9DDCFF'
            } else if (str === 'cancelled') {
                str = '#FF9D9D'
            } else if (str === 'deleted') {
                str = '#868686'
            } else if (str === 'draft') {
                str = '#E9EDEF'
            } else if (str === 'partial') {
                str = '#CBBBE9'
            } else if (str === 'on_delivery') {
                str = '#8FE8CD'
            } else if (str === 'delivered') {
                str = '#CBBBE9'
            } else if (str === 'invoiced_not_delivered') {
                str = '#FBE8AE'
            } else if (str === 'invoiced_on_delivery') {
                str = '#8FE8CD'
            } else if (str === 'invoiced_delivered') {
                str = '#CBBBE9'
            } else if (str === 'paid_not_delivered') {
                str = '#FFD34D'
            } else if (str === 'paid_on_delivery') {
                str = '#8FE8CD'
            } else if (str === 'on_process') {
                str = '#E8EA93'
            } else if (str === 'archived') {
                str = '#FFCC9D'
            } else if (str === 'new') {
                str = '#C6EB93'
            } else if (str === 'registered') {
                str = '#9DDCFF'
            } else if (str === 'declined') {
                str = '#868686'
            } else if (str === 'failed') {
                str = '#868686'
            } else if (str === 'picked') {
                str = '#7CEBA8'
            } else if (str === 'in_progress') {
                str = '#E8EA93'
            }
            return str
        },
        statusMasterText(str) {
            if (str === 'active') {
                str = '#333333'
            } else if (str === 'finished') {
                str = '#333333'
            } else if (str === 'cancelled') {
                str = '#333333'
            } else if (str === 'deleted') {
                str = '#FFFFFF'
            } else if (str === 'draft') {
                str = '#333333'
            } else if (str === 'partial') {
                str = '#333333'
            } else if (str === 'on_delivery') {
                str = '#333333'
            } else if (str === 'delivered') {
                str = '#333333'
            } else if (str === 'invoiced_not_delivered') {
                str = '#333333'
            } else if (str === 'invoiced_on_delivery') {
                str = '#333333'
            } else if (str === 'invoiced_delivered') {
                str = '#333333'
            } else if (str === 'paid_not_delivered') {
                str = '#333333'
            } else if (str === 'paid_on_delivery') {
                str = '#333333'
            } else if (str === 'archived') {
                str = '#333333'
            } else if (str === 'new') {
                str = '#333333'
            } else if (str === 'registered') {
                str = '#333333'
            } else if (str === 'declined') {
                str = '#ffffff'
            } else if (str === 'picked') {
                str = '#333333'
            }else if (str === 'in_progress') {
                str = '#333333'
            }
            return str
        },
        formatPrice(value) {
            let val = (value / 1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        formatUnitPrice(value) {
            let val = (value / 1).toFixed(0).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        formatDate(val) {
            if (val) {
                return this.$moment(val).format('YYYY-MM-DD')
            }
        },
        formatDateRange(val) {
            if (val.length > 0) {
                let ret = ''
                if (val.length == 1) {
                    let date = val[0]
                    ret = this.$moment(date).format('YYYY-MM-DD')
                } else {
                    let date = val[0]
                    let date2 = val[1]
                    if (date > date2) {
                        ret = this.$moment(date2).format('YYYY-MM-DD') + ' to ' + this.$moment(date).format('YYYY-MM-DD')
                    } else {
                        ret = this.$moment(date).format('YYYY-MM-DD') + ' to ' + this.$moment(date2).format('YYYY-MM-DD')
                    }
                }
                return ret
            }
        },
        formatTime(val) {
            if (val) {
                return this.$moment(val).format('HH:mm')
            }
        },
        formatDateTime(val) {
            if (val) {
                return this.$moment(val).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        formatHumanDiff(val) {
            if (val) {
                return this.$moment(val).fromNow()
            }
        },
        toUpperCase(val) {
            return val.toUpperCase()
        },
        capitalizeFirstLetter(val) {
            return val.charAt(0).toUpperCase() + val.slice(1);
        },
        capitalizeFirstLetterEveryWords(val) {
            let arr = val.split(" ");
            for (var i = 0; i < arr.length; i++) {
                arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
            }
            return arr.join(" ");
        },
        letterOnly(e) {
            let char = String.fromCharCode(e.keyCode);
            if (/^[a-zA-Z\s]*$/.test(char)) return true;
            else e.preventDefault();
        },
        br2nl(val) {
            return val.replace(/(<br>|<\/br>|<br \/>)/mgi, "\n");
        },
        async auditLog(id, type, open) {
            let datas = {id: id, type: type, open: open}
            await this.$root.$emit('auditLogs', datas);
            return false
        },
        elipsis(x) {
            return x.slice(0, 18) + '...'
        },
    }
})

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app');
