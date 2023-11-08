<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row>
                <v-col cols="12" md="4" class="-mb24">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }">
                            <v-text-field
                                dense
                                v-model="search"
                                outlined
                                filled
                                placeholder="Search..."
                                prepend-inner-icon="search"
                                v-on="{ ...tooltip }"
                            >
                            </v-text-field>
                        </template>
                        <span>Search by code, name</span>
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row class="hr-title" />
            <v-row :class="filter ? 'mb24' : ''">
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
                        <v-icon right> mdi-chevron-up </v-icon>
                    </v-btn>
                    <v-btn depressed x-small @click="filter = !filter" v-else class="no-caps fs12">
                        Show
                        <v-icon right> mdi-chevron-down </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row :class="filter ? '' : 'hidden'">
                <v-col cols="12" md="3" class="-mt24">
                    <v-select
                        v-model="statuses"
                        :items="status"
                        item-text="text"
                        item-value="value"
                        outlined
                        dense
                    ></v-select>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectWarehouse
                        name="warehouse"
                        :warehouse="warehouse"
                        :aux_data="2"
                        :label="'Warehouse'"
                        @selected="warehouseSelected"
                        :dense="true"
                        :warehouse_type="'1.2.3.4.5.6.7.8.9.10.11.12.13.14.15.16.17.18.19.20'"
                        :norequired="true"
                    ></SelectWarehouse>
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row>
                <v-col class="right">
                    <v-btn
                        v-privilege="'ven_crt'"
                        depressed
                        color="#50ABA3"
                        class="no-caps bold mr-4"
                        :to="{ name: 'VendorCreate' }"
                    >
                        <span class="text-white">Create Vendor</span>
                    </v-btn>
                </v-col>
            </v-row>
        </div>
        <div class="box-body-table">
            <v-data-table
                :mobile-breakpoint="0"
                :headers="table.fields"
                :items="items"
                :loading="loading"
                :items-per-page="10"
            >
                <template v-slot:item="props">
                    <tr style="height: 48px">
                        <td>
                            <router-link :to="{ path: `/logistic/vendor/detail/${props.item.id}`}"
                                class="routerLink" v-privilege="'ven_rdd'"
                            >
                                {{ props.item.code }} <br />
                            </router-link>
                            <span class="text-black60">{{ props.item.name }}</span>
                        </td>
                        <td>{{props.item.warehouse ? props.item.warehouse.name : ''}}</td>
                        <td>{{ props.item.note }}</td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip :color="statusMaster('active')">
                                    <span class="pa-md-2">Active</span>
                                </v-chip>
                            </div>
                            <div v-else>
                                <v-chip :color="statusMaster('archived')">Archived</v-chip>
                            </div>
                        </td>
                        <td>
                            <v-menu offset-y>
                                <template v-slot:activator="{ on: menu }">
                                    <v-btn icon v-on="{ ...menu }">
                                        <v-icon dark>mdi-dots-vertical</v-icon>
                                    </v-btn>
                                </template>
                                <v-list class="bg-white">
                                    <v-list-item v-privilege="'ven_rdd'" :to="`/logistic/vendor/detail/${props.item.id}`">
                                        <v-list-item-content>
                                            <v-list-item-title>Detail</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <v-list-item
                                        v-privilege="'ven_upd'"
                                        :to="`/logistic/vendor/update/${props.item.id}`"
                                        v-if="props.item.status == 1"
                                    >
                                        <v-list-item-content>
                                            <v-list-item-title>Update</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <div v-privilege="'ven_rdd'">
                                        <hr />
                                    </div>
                                    <v-list-item
                                        v-privilege="'ven_arc'"
                                        @click="changeStatus(props.item.status, props.item.id)"
                                        v-if="props.item.status == '1'"
                                    >
                                        <v-list-item-content>
                                            <v-list-item-title>Archive</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item
                                        v-privilege="'ven_urc'"
                                        @click="changeStatus(props.item.status, props.item.id)"
                                        v-else
                                    >
                                        <v-list-item-content>
                                            <v-list-item-title>Unarchive</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData" />
    </v-container>
</template>

<script>
    export default {
        name: "Vendor",
        data() {
            return {
                ConfirmData: {},
                filter: false,
                loading: false,
                warehouse: '',
                statuses: 1,
                search: '',
                table: {
                    fields: [
                        {
                            text: 'Vendor',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Warehouse',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Note',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Status',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            width: "5%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                    ]
                },
                items: [{
                    warehouse: {
                        name: ''
                    }
                }]
            }
        },
        mounted() {
            this.renderData('', '')
            let self = this
            this.$root.$on('event_success', function(res) {
                if (res) {
                    self.renderData('', '')
                }
            });
        },
        methods: {
            warehouseSelected(d) { // for filter warehouse
                this.warehouse = null;
                if (d) {
                    this.warehouse = d;
                }
                this.renderData(this.search)
            },
            changeStatus(val, id) { // change status (archive / unarchive)
                if (val == '1') {
                    this.ConfirmData = {
                        model: true,
                        status: true,
                        statusMsg: "Success to Archive this Vendor",
                        title: "Archive Vendor",
                        text: "Are you sure want to Archive this Vendor?",
                        urlApi: "/logistic/vendor/archive/" + id,
                        data: {},
                        label: 'URL_2'
                    }
                } else {
                    this.ConfirmData = {
                        model: true,
                        status: true,
                        statusMsg: "Success to Unarchive this Vendor",
                        title: "Unarchive Vendor",
                        text: "Are you sure want to Unarchive this Vendor?",
                        urlApi: "/logistic/vendor/unarchive/" + id,
                        data: {},
                        label: 'URL_2'
                    }
                }
            },
            renderData(search) { // get data from API
                this.loading = true;
                this.items = []
                let statuses = ''
                if (this.statuses === 999) {
                    statuses = ''
                } else {
                    statuses = "|status:" + this.statuses
                }
                let warehouse = ''
                if (this.warehouse) {
                    warehouse = "|warehouse.id.e:" + this.warehouse.id
                }
                this.$http2.get("/logistic/vendor", {
                    params: {
                        perpage: 100,
                        conditions: 'Or.name.icontains:' + search + '%2COr.code.icontains:' + search + statuses + warehouse,
                        embeds: 'warehouse_id',
                        orderby: '-id'
                    }
                }).then(response => {
                    this.loading = false;
                    this.items = response.data.data
                    if (this.items === null) {
                        this.items = []
                    }
                })
            }
        },
        watch: {
            'search': { // watch search
                handler: function(val) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function() {
                        that.renderData(val)
                    }, 1000);
                },
                deep: true
            },
            'statuses': { // watch status
                handler: function(val) {
                    let that = this
                    that.renderData(this.search)
                },
                deep: true
            },
        }
    }
</script>