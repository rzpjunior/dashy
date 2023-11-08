<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row>
                <v-col cols="12" md="4" class="h70">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on:tooltip }">
                            <v-text-field
                                dense
                                v-model="search"
                                outlined
                                filled
                                placeholder="Search..."
                                prepend-inner-icon="search"
                                v-on="{ ...tooltip }"
                            ></v-text-field>
                        </template>
                        <span>Search by code and planner name</span>
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row class="hr-title" />
            <v-row :class="filter ? 'mb24':''">
                <v-col>
                    Filter
                    <v-btn
                        depressed
                        x-small
                        @click="filter = !filter"
                        v-if="filter"
                        class="no-caps fs12"
                    >
                        Hide
                        <v-icon right>
                            mdi-chevron-up
                        </v-icon>
                    </v-btn>
                    <v-btn
                        depressed
                        x-small
                        @click="filter = !filter"
                        v-else
                        class="no-caps fs12"
                    >
                        Show
                        <v-icon right>
                            mdi-chevron-down
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row :class="filter ? '' : 'hidden'">
                <v-col cols="12" md="3" class="-mt24">
                    <v-select
                        v-model="statuses"
                        :items="status2"
                        item-text="text"
                        item-value="value"
                        outlined
                        dense
                    ></v-select>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="delivery_date_model"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-text-field
                                    prepend-inner-icon="mdi-calendar"
                                    outlined
                                    maxlength="24"
                                    dense
                                    @click:clear="delivery_date = [],delivery_date_input = '',renderData(search,statuses)"
                                    v-model="delivery_date_input"
                                    clearable
                                >
                                    <template v-slot:label>
                                        Delivery Date
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            persistent-hint
                            v-model="delivery_date"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectWarehouse
                        :norequired="true"
                        :aux_data="2"
                        name="warehouse"
                        @selected="warehouseSelected"
                        :dense="true"
                        :warehouse="warehouse"
                        :warehouse_type="'1.2.3.4.5.6.7.8.9.10.11.12.13.14.15.16.17.18.19.20'"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectWrt
                        :norequired="true"
                        :dense="true"
                        @selected="wrtSelected"
                    ></SelectWrt>
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row>
                <v-col class="right">
                    <v-btn
                        name="RoutingCreate"
                        v-privilege="'rou_crt'"
                        depressed
                        color="#50ABA3"
                        class="no-caps bold"
                        to="/logistic/routing/createroute"
                    >
                        <span class="text-white">Generate Routing</span>
                    </v-btn>
                </v-col>
            </v-row>
        </div>
        <div class="box-body-table">
            <v-data-table
                :headers="table.fields"
                :items="items"
                :loading="loading"
                :items-per-page="10"
                mobile-breakpoint="0"
            >
                <template v-slot:item="props">
                    <tr style="height: 48px">
                        <td>
                            <router-link :to="{ path: `/logistic/routing/detail/${props.item.id}`}"
                                class="routerLink" v-privilege="'rou_rdd'"
                            >
                                {{props.item.code}}
                            </router-link>
                        </td>
                        <td>{{ props.item.created_by.name }}</td>
                        <td>{{ props.item.warehouse.name}}</td>
                        <td>{{ formatDate(props.item.delivery_date) }}</td>
                        <td>{{ props.item.wrt}}</td>
                        <td>{{ props.item.routing_goal }}</td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                    :text-color="statusMasterText('active')"
                                ><span class="pa-md-2">Active</span></v-chip>
                            </div>
                            <div v-else-if="props.item.status == 2">
                                <v-chip
                                    :color="statusMaster('archived')"
                                    :text-color="statusMasterText('archived')"
                                ><span class="pa-md-2">Archived</span></v-chip>
                            </div>
                            <div v-else-if="props.item.status == 3">
                                <v-chip
                                    :color="statusMaster('on_delivery')"
                                    :text-color="statusMasterText('on_delivery')"
                                ><span class="pa-md-2">Generating</span></v-chip>
                            </div>
                            <div v-else-if="props.item.status == 4">
                                <v-chip
                                    :color="statusMaster('cancelled')"
                                    :text-color="statusMasterText('cancelled')"
                                ><span class="pa-md-2">Failed</span></v-chip>
                            </div>
                        </td>
                        <td>
                            <v-menu>
                                <template v-slot:activator="{ on: menu }">
                                    <v-btn
                                        icon
                                        v-on="{ ...menu }"
                                    ><v-icon dark>mdi-dots-vertical</v-icon></v-btn>
                                </template>
                                <v-list class="bg-white">
                                    <v-list-item  :to="{name: 'RoutingDetail', params: { id: props.item.id }}" v-privilege="'rou_rdd'">
                                        <v-list-item-content>
                                            <v-list-item-title>Detail</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <div v-if="props.item.status == '1'"><hr/></div>
                                    <v-list-item
                                        v-if="props.item.status == '1'"
                                        @click="modalDownloadExcel(props.item)"
                                        v-privilege="'rou_exp'"
                                    >
                                        <v-list-item-content>
                                            <v-list-item-title>Download</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <div v-if="props.item.status=='1' || props.item.status == '3'"><hr/></div>
                                    <v-list-item v-privilege="'rou_arc'" @click="changeStatus(props.item.id)" v-if="props.item.status=='1' || props.item.status == '3'">
                                        <v-list-item-content>
                                            <v-list-item-title>Archive</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
        <LoadingBar :value="overlay"/>
    </v-container>
</template>

<script>
    export default {
        name: "Routing",
        data() {
            return {
                search: '',
                filter: false,
                overlay: false,
                ConfirmData: {},
                delivery_date_model: '',
                delivery_date: [],
                delivery_date_input: "",
                items: [],
                loading: false,
                statuses: 3.1,
                warehouse: null,
                wrt: null,
                status2: [
                    {
                        text: 'All Status',
                        value: 999
                    },
                    {
                        text: 'Active',
                        value: 3.1
                    },
                    {
                        text: 'Archived',
                        value: 2
                    },
                    {
                        text: 'Failed',
                        value: 4
                    }
                ],
                table: {
                    fields: [
                        {
                            text: 'Code',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text: 'Planner Name',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text: 'Warehouse',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text: 'Delivery Date',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text: 'WRT',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text: 'Routing Note',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text: 'Status',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            width: "5%",
                            sortable: false,
                        }
                    ]
                }
            }
        },
        mounted() { // mounted
            this.renderData('', '')
            let self = this
            this.$root.$on('event_success', function(res) {
                if (res) {
                    self.renderData('', '')
                }
            });
        },
        computed: {
            format_delivery_date() { // format delivery date
                if (this.delivery_date.length > 0) {
                    let ret = ''
                    if (this.delivery_date.length == 1) {
                        let date = this.delivery_date[0]
                        ret = this.$moment(date).format('DD/MM/YYYY')
                    } else {
                        let date = this.delivery_date[0]
                        let date2 = this.delivery_date[1]
                        if (date > date2) {
                            ret = this.$moment(date2).format('DD/MM/YYYY') + ' - ' + this.$moment(date).format('DD/MM/YYYY')
                        } else {
                            ret = this.$moment(date).format('DD/MM/YYYY') + ' - ' + this.$moment(date2).format('DD/MM/YYYY')
                        }
                    }
                    return ret
                }
            },
        },
        methods: {
            warehouseSelected(d) { // for filter warehouse
                this.warehouse = null;
                if (d) {
                    this.warehouse = d;
                }
                this.renderData(this.search)
            },
            wrtSelected(d) { // for filter wrt
                this.wrt = null;
                if (d) {
                    this.wrt = d;
                }
                this.renderData(this.search)
            },
            changeStatus(id) { // change status to archive
                this.ConfirmData = {
                    model: true,
                    status: true,
                    statusMsg: "Success to Archive this Routing",
                    title: "Archive Routing",
                    text: "Are you sure want to Archive this Routing?",
                    urlApi: "/logistic/routing/archive/" + id,
                    data: {},
                    label: 'URL_2'
                }
            },
            renderData(search) { // renderdata
                this.loading = true;
                this.items = []
                let statuses = ''
                if (this.statuses === 999) {
                    statuses = ''
                } else {
                    statuses = "|status__in:" + this.statuses
                }
                let warehouse = ''
                if (this.warehouse !== null) {
                    warehouse = "|warehouse.id.e:" + this.warehouse.id
                }
                let wrt = ''
                if (this.wrt !== null) {
                    wrt = "|wrt.icontains:" + this.wrt.name
                }
                let deliverydate = ''
                if (this.delivery_date.length > 0) {
                    if (this.delivery_date.length == 1) {
                        deliverydate = '|delivery_date:' + this.delivery_date[0]
                    } else {
                        let date = this.delivery_date[0]
                        let date2 = this.delivery_date[1]
                        if (date > date2) {
                            deliverydate = '|delivery_date.gte:' + date2 + '|delivery_date.lte:' + date
                        } else {
                            deliverydate = '|delivery_date.gte:' + date + '|delivery_date.lte:' + date2
                        }
                    }
                }
                this.$http2.get("/logistic/routing", { // get data dari API
                    params: {
                        perpage: 100,
                        conditions: 'Or.created_by.name.icontains:' + search + '%2COr.code.icontains:'
                            + search + statuses + warehouse + wrt + deliverydate,
                        orderby: '-id'
                    }
                }).then(response => {
                    this.loading = false;
                    this.items = response.data.data
                    if (this.items === null) {
                        this.items = []
                    }
                });
            },
            modalDownloadExcel(d) { // download excel per indeks
                this.overlay = true
                this.$http2.get("/report/tms/routing-detail?export=1", {
                    params: {
                        code: d.code
                    }
                })
                .then(response => {
                    this.overlay = false
                    window.location.href = response.data.file
                })
                .catch(error => {
                    this.overlay = false
                })
            }
        },
        watch: {
            'delivery_date_input': { // watch untuk delivery date ketika input
                handler: function(val) {
                    if (val) {
                        if (val.length == 10) {
                            this.items = []
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.delivery_date[0] = this.$moment(val).format('YYYY-MM-DD')
                                this.renderData(this.search,this.statuses)
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0, 10)
                            let date2 = val.substr(14, 23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                this.delivery_date[0] = this.$moment(date1).format('YYYY-MM-DD')
                                this.delivery_date[1] = this.$moment(date2).format('YYYY-MM-DD')
                                if (this.delivery_date.length == 2) {
                                    this.renderData(this.search,this.statuses)
                                }
                            }
                        }
                    }
                },
                deep: true
            },
            'delivery_date': { // model untuk delivery date
                handler: function(val) {
                    if (val) {
                        this.delivery_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
            'search': { // search
                handler: function(val) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function() {
                        that.renderData(val)
                    }, 1000);
                },
                deep: true
            },
            'statuses': { // filter status
                handler: function(val) {
                    let that = this
                    that.renderData(this.search)
                },
                deep: true
            },
            'wrt': { // filter wrt
                handler: function(val) {
                    let that = this
                    that.renderData(this.search)
                },
                deep: true
            },
            'warehouse': { // filter warheouse
                handler: function(val) {
                    let that = this
                    that.renderData(this.search)
                },
                deep: true
            },
        }
    }
</script>