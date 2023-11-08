<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row>
                <v-col cols="12" md="4" class="h70">
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
                        <span>Search by name</span>
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
                        Hide <v-icon right>mdi-chevron-up</v-icon>
                    </v-btn>
                    <v-btn depressed x-small @click="filter = !filter" v-else class="no-caps fs12">
                        Show <v-icon right>mdi-chevron-down</v-icon>
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
                    >
                    </v-select>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectWarehouse
                        :norequired="true"
                        :aux_data="2"
                        @selected="warehouseSelected"
                        :label="'Warehouse'"
                        :dense="true"
                        :warehouse_type="'1.2.3.4.5.6.7.8.9.10.11.12.13.14.15.16.17.18.19.20'"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectVendor
                        name="vendor"
                        :vendor="vendor"
                        @selected="vendorSelected"
                        :norequired="true"
                        :dense="true"
                        :disabled="vendorDisabled"
                        :warehouse="selectWarehouse"
                    >
                    </SelectVendor>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectVehicle
                        name="vehicle"
                        @selected="vehicleProfilesSelected"
                        :dense="true"
                        :norequired="true"
                        :vehicle="vehicle"
                        :disabled="vehicleDisabled"
                        :warehouse_id="selectWarehouse"
                        :vendor_id="vendor_id"
                    >
                    </SelectVehicle>
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row>
                <v-col class="right">
                    <v-btn
                        v-privilege="'cou_crt'"
                        depressed
                        color="#50ABA3"
                        class="no-caps bold mr-4"
                        :to="{ name: 'CourierCreate' }"
                    >
                        <span class="text-white">Create Courier</span>
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
                            <router-link
                                :to="{ path: `/logistic/courier/detail/${props.item.id}`}"
                                class="routerLink"
                                v-privilege="'cou_rdd'"
                            >
                                {{props.item.code}} <br />
                            </router-link>
                            <span class="text-black60">{{ props.item.name }}</span>
                        </td>
                        <td>{{ props.item.phone_number }}</td>
                        <td>{{ props.item.vehicle_profiles && props.item.vehicle_profiles.courier_vendor ? props.item.vehicle_profiles.courier_vendor.name : ''}}</td>
                        <td>{{ props.item.vehicle_profiles && props.item.vehicle_profiles.courier_vendor ? props.item.vehicle_profiles.courier_vendor.warehouse.name : '' }}</td>
                        <td>{{ props.item.vehicle_profiles != null ? props.item.vehicle_profiles.name : '' }}</td>
                        <td>{{ props.item.license_plate }}</td>
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
                                    <v-list-item v-privilege="'cou_rdd'" :to="`/logistic/courier/detail/${props.item.id}`">
                                        <v-list-item-content>
                                            <v-list-item-title>Detail</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <v-list-item
                                        v-privilege="'cou_upd'"
                                        :to="`/logistic/courier/update/${props.item.id}`"
                                        v-if="props.item.status == 1"
                                    >
                                        <v-list-item-content>
                                            <v-list-item-title>Update</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <div v-privilege="'cou_rdd'">
                                        <hr />
                                    </div>
                                    <v-list-item
                                        v-privilege="'cou_arc'"
                                        @click="changeStatus(props.item.status, props.item.id)"
                                        v-if="props.item.status == '1'"
                                    >
                                        <v-list-item-content>
                                            <v-list-item-title>Archive</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item
                                        v-privilege="'cou_urc'"
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
        name: 'Courier',
        data() {
            return {
                ConfirmData: {},
                vendor_id: '',
                vendor: null,
                vendorDisabled: true,
                vehicle: null,
                vehicleDisabled: true,
                loading: false,
                search: '',
                statuses: 1,
                filter: false,
                selectWarehouse: '',
                table: {
                    fields: [
                        {
                            text: 'Code',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },

                        {
                            text: 'Phone Number',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
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
                            text: 'Vehicle Profile',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'License Plate',
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
                    vehicle_profiles: {
                        courier_vendor: {
                            name: '',
                            warehouse: {
                                name: ''
                            }
                        }
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
            warehouseSelected(d) { // warehouse selected
                this.selectWarehouse = ""
                this.vendor = null
                this.vendor_id = ''
                this.vehicle = null
                this.vendorDisabled = true
                if (d) {
                    this.selectWarehouse = d.id
                    this.vendorDisabled = false
                }
                this.renderData(this.search)
            },
            vendorSelected(d) { // for filter vendor
                this.vendor = null;
                this.vendor_id = ''
                this.vehicleDisabled = true
                if (d) {
                    this.vendor = d;
                    this.vendor_id = d.id
                    this.vehicleDisabled = false
                }
                this.renderData(this.search)
            },
            vehicleProfilesSelected(d) { // vehicle profile selected
                this.vehicle = null;
                if (d) {
                    this.vehicle = d.id;
                }
                this.renderData(this.search)
            },
            changeStatus(val, id) { // change status
                if (val == '1') {
                    this.ConfirmData = {
                        model: true,
                        status: true,
                        statusMsg: "Success to Archive this Courier",
                        title: "Archive Courier",
                        text: "Are you sure want to Archive this Courier?",
                        urlApi: "/logistic/courier/archive/" + id,
                        data: {},
                        label: 'URL_2'
                    }
                } else {
                    this.ConfirmData = {
                        model: true,
                        status: true,
                        statusMsg: "Success to Unarchive this Courier",
                        title: "Unarchive Courier",
                        text: "Are you sure want to Unarchive this Courier?",
                        urlApi: "/logistic/courier/unarchive/" + id,
                        data: {},
                        label: 'URL_2'
                    }
                }
            },
            renderData(search) { // get data from api
                this.loading = true;
                this.items = []
                let statuses = ''
                if (this.statuses === 999) {
                    statuses = ''
                } else {
                    statuses = "|status:" + this.statuses
                }
                let warehouse = ''
                if (this.selectWarehouse) {
                    warehouse = "|vehicleprofiles.couriervendor.warehouse.id.e:" + this.selectWarehouse
                }
                let vehicle = ''
                if (this.vehicle) {
                    vehicle = "|vehicle_profiles_id.e:" + this.vehicle
                }
                let vendor = ''
                if (this.vendor_id) {
                    vendor = "|vehicleprofiles.couriervendor.id.e:" + this.vendor_id
                }
                this.$http2.get("/logistic/courier", {
                    params: {
                        perpage: 100,
                        conditions: 'Or.name.icontains:' + search + '%2COr.code.icontains:'
                            + search + statuses + vehicle + warehouse + vendor,
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
        },
        watch: {
            'search': {
                handler: function(val) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function() {
                        that.renderData(val)
                    }, 1000);
                },
                deep: true
            },
            'statuses': {
                handler: function(val) {
                    let that = this
                    that.renderData(this.search)
                },
                deep: true
            },
        },
    }
</script>
