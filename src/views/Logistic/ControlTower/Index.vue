<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row>
                <v-col cols="12" md="4" class="h70">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on:tooltip }">
                            <v-text-field
                                v-model="search"
                                dense
                                outlined
                                filled
                                placeholder="Search..."
                                prepend-inner-icon="search"
                                v-on="{ ...tooltip }"
                            ></v-text-field>
                        </template>
                        <span>Search by Route Code or SO Code</span>
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
                    <SelectWarehouse
                        :norequired="true"
                        @selected="warehouseSelected"
                        :dense="true"
                        :warehouse="warehouse"
                    ></SelectWarehouse>
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
                                    @blur="setDateValidation()"
                                    v-model="delivery_date_input"
                                    maxlength="24"
                                    dense
                                >
                                    <template v-slot:label>
                                        Delivery Date
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            v-model="delivery_date"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectVendor
                        name="vendor"
                        :vendor="vendor"
                        @selected="vendorSelected"
                        :norequired="true"
                        :dense="true"
                        :disabled="vendorDisabled"
                        :warehouse="warehouse_id"
                    ></SelectVendor>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectCourier
                        name="courier"
                        :courier="courier"
                        @selected="courierSelected"
                        :norequired="true"
                        :dense="true"
                        :disabled="courierDisabled"
                        :vendor_id="courier_vendor_id"
                    >
                    </SelectCourier>
                </v-col>
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
            </v-row>
        </div>
        <div class="box-title">
            <v-row>
                <v-col class="flex-justify-center fs25 bold">
                    <div>
                        <v-chip :color="statusMaster('cancelled')">
                            Emergency Courier: {{total_emergency}}
                        </v-chip>
                    </div>
                </v-col>
                <v-col class="d-flex justify-end">
                    <div class="mt20 mr16">Auto Refresh Every 1 Minutes</div>
                    <v-switch
                        color="#50ABA3"
                        inset
                        v-model="auto_refresh"
                        :true-value="1"
                        :false-value="2"
                    ></v-switch>
                </v-col>
            </v-row>
        </div>
        <div class="box-body">
            <v-row>
                <v-col cols="12" md="5">
                    <div class="scroll-list fill-height">
                        <div
                            class="d-flex justify-center"
                            v-if="isLoadingItems"
                        >
                            <div class="mt15">
                                <div class="text-center">
                                    <v-progress-circular
                                        :size="20"
                                        indeterminate
                                        color="#50ABA3"
                                    />
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <div class="ma12 wp100" v-if="items != ''">
                                <v-row
                                    v-for="(item, index) in dataItems"
                                    :key="index"
                                >
                                    <v-col>
                                        <div class="box-col-ep -mt10 -ml15 mr15">
                                            <v-row class="-mr30">
                                                <v-col>
                                                    <router-link
                                                        :to="{ path: `/logistic/control-tower/detail/${item.delivery_run_sheet.id}` }"
                                                        v-privilege="'ctrl_twr_rdd'"
                                                        target="_blank"
                                                    >
                                                        {{item.delivery_run_sheet.code}}
                                                    </router-link>
                                                </v-col>
                                                <v-col class="d-flex justify-end align-end">
                                                    <v-btn
                                                        v-if="item.delivery_run_sheet.status == 1"
                                                        elevation="0"
                                                        rounded
                                                        depressed
                                                        small
                                                        class="no-caps mb4"
                                                        :color="statusMaster('new')"
                                                    >
                                                        New
                                                    </v-btn>
                                                    <v-btn
                                                        v-if="item.delivery_run_sheet.status == 2"
                                                        elevation="0"
                                                        rounded
                                                        depressed
                                                        small
                                                        class="no-caps mb4"
                                                        :color="statusMaster('on_delivery')"
                                                    >
                                                        On Progress
                                                    </v-btn>
                                                    <v-btn
                                                        v-if="item.delivery_run_sheet.status == 3"
                                                        elevation="0"
                                                        rounded
                                                        depressed
                                                        small
                                                        class="no-caps mb4"
                                                        :color="statusMaster('finished')"
                                                    >
                                                        Finished
                                                    </v-btn>
                                                    <v-menu offset-y>
                                                        <template v-slot:activator="{ on }">
                                                            <v-btn icon v-on="on">
                                                                <v-icon>mdi-dots-vertical</v-icon>
                                                            </v-btn>
                                                        </template>
                                                        <v-list class="bg-white">
                                                            <v-list-item
                                                                v-privilege="'ctrl_twr_rdd'"
                                                                :to="{ path: `/logistic/control-tower/detail/${item.delivery_run_sheet.id}` }"
                                                                target="_blank"
                                                            >
                                                                <v-list-item-content>
                                                                    <v-list-item-title>Detail</v-list-item-title>
                                                                </v-list-item-content>
                                                                <v-list-item-icon>
                                                                    <v-icon>mdi-open-in-new</v-icon>
                                                                </v-list-item-icon>
                                                            </v-list-item>
                                                            <div v-if="item.delivery_run_sheet.status != 3">
                                                                <hr />
                                                            </div>
                                                            <v-list-item
                                                                v-if="item.delivery_run_sheet.status != 3"
                                                                v-privilege="'ctrl_twr_can'"
                                                                @click="cancelData = item.delivery_run_sheet.id, modelDialog = true"
                                                            >
                                                                <v-list-item-content>
                                                                    <v-list-item-title>Cancel</v-list-item-title>
                                                                </v-list-item-content>
                                                            </v-list-item>
                                                        </v-list>
                                                    </v-menu>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="6" class="-mt15">
                                                    Courier:
                                                </v-col>
                                                <v-col class="d-flex justify-end align-end -mt15">
                                                    {{item.courier.code}} - {{ item.courier.name }}
                                                </v-col>
                                                <v-col cols="6" class="-mt24">
                                                    Total SO:
                                                </v-col>
                                                <v-col class="d-flex justify-end align-end -mt24">
                                                    {{item.completed_sales_order}} / {{item.total_sales_order}}
                                                </v-col>
                                                <v-col cols="6" class="-mt24">
                                                    Delivery Date:
                                                </v-col>
                                                <v-col class="d-flex justify-end align-end -mt24">
                                                    {{ formatDate(item.sales_order.delivery_date) }}
                                                </v-col>
                                            </v-row>
                                        </div>
                                    </v-col>
                                </v-row>
                                <div class="d-flex justify-center mr25 mt20">
                                    <v-btn
                                        @click="showData += loadData"
                                        v-if="showData < items.length"
                                        class="no-caps fs12 white--text"
                                        rounded
                                        depressed
                                        color="#50ABA3"
                                    >
                                        Show More Data
                                    </v-btn>
                                </div>
                            </div>
                            <div v-else>
                                <div class="d-flex justify-center">
                                    <v-col>
                                        <div class="box-col-ep -mt10 -ml15 -mr15">
                                            <div class="text-center bold">No Data Available</div>
                                        </div>
                                    </v-col>
                                </div>
                            </div>
                        </div>
                    </div>
                </v-col>
                <v-col cols="12" md="7">
                    <l-map
                        :options="options"
                        style="height: 500px; width: 100%;"
                        :center="[
                            warehouseLocation.lat || userLocation.lat,
                            warehouseLocation.lng || userLocation.lng
                        ]"
                    >
                        <l-tile-layer
                            :options="options"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                            <v-marker-cluster
                                :options="clusterOptions"
                            >
                                <l-marker
                                    v-for="(item, idx) in courier"
                                    :key="idx"
                                    :visible="true"
                                    :draggable="false"
                                    :lat-lng="[
                                        item.latitude,
                                        item.longitude
                                    ]"
                                >
                                    <l-icon
                                        :icon-size="[30, 40]"
                                        :icon-anchor="staticAnchor"
                                        icon-url="../../../img/emergency.png"
                                        v-if="item.emergency_mode == 1 && item.latitude && item.longitude"
                                    ></l-icon>
                                    <l-icon
                                        :icon-size="[25, 40]"
                                        :icon-anchor="staticAnchor"
                                        icon-url="../../../img/car.png"
                                        v-if="item.emergency_mode == 2 && item.vehicle_profiles.routing_profile.value_name == 'car' && item.latitude && item.longitude"
                                    ></l-icon>
                                    <l-icon
                                        :icon-size="[30, 40]"
                                        :icon-anchor="staticAnchor"
                                        icon-url="../../../img/motorcycle.png"
                                        v-if="item.emergency_mode == 2 && item.vehicle_profiles.routing_profile.value_name == 'bike' && item.latitude && item.longitude"
                                    ></l-icon>
                                    <l-popup
                                        v-if="item.latitude && item.longitude"
                                    >
                                        {{ item.name }} <br>
                                        {{ '+62' + item.phone_number }} <br>
                                        {{ item.license_plate }} <br>
                                        {{ formatDateTime(item.last_updated) }} ({{ formatHumanDiff(item.last_updated) }})
                                    </l-popup>
                                </l-marker>
                            </v-marker-cluster>
                    </l-map>
                </v-col>
            </v-row>
        </div>
        <v-dialog
            v-model="modelDialog"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans">
                <LoadingBar :value="overlay" />
                <v-card-title>
                    <span class="text-title-modal">Cancel Delivery Run Sheet</span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">Why was this delivery run sheet cancelled?</span>
                    <v-textarea
                        name="note"
                        v-model="note.note"
                        :counter="100"
                        outlined
                        required
                        maxlength="100"
                        class="mt-6"
                        rows="3"
                    >
                        <template v-slot:label>
                            Note<span style="color:red">*</span>
                        </template>
                    </v-textarea>
                </v-card-text>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="modelDialog = false"
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                    >
                        <span class="text-black80">Cancel</span>
                    </v-btn>
                    <v-btn
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                        @click="cancelDrs()"
                    >Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import Vue from 'vue'
    export default {
        name: "ControlTower",
        data() {
            return {
                search: '',
                filter: false,
                warehouse: null,
                warehouse_id: '',
                vendor: null,
                courier_vendor_id: '',
                vendorDisabled: true,
                courier: null,
                courier_id: '',
                courierDisabled: true,
                showData: 10,
                loadData: 10,
                auto_refresh: 2,
                total_emergency: 0,
                modelDialog: false,
                isLoadingItems: false,
                statuses: 2.1,
                status2: [
                    {
                        text: 'All Status',
                        value: 999
                    },
                    {
                        text: 'On Progress',
                        value: 2.1
                    },
                    {
                        text: 'Finished',
                        value: 3
                    }
                ],
                overlay: false,
                cancelData: '',
                delivery_date_model : '',
                delivery_date : [new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10)],
                delivery_date_input : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                options: {
                    zoom: 10,
                    maxZoom: 19,
                    minZoom: 5 ,
                    maxNativeZoom: 19
                },
                userLocation: {
                    lat: 0,
                    lng: 0,
                },
                warehouseLocation: {
                    lat: 0,
                    lng: 0,
                },
                clusterOptions: {
                    disableClusteringAtZoom: 20,
                    maxClusterRadius: 50
                    
                },
                staticAnchor: [16, 37],
                items: [{
                    total_sales_order: 0,
                    completed_sales_order: 0,
                    delivery_run_sheet: {
                        name: ''
                    },
                    courier: {
                        code: '',
                        name: ''
                    },
                    sales_order: {
                        code: '',
                        delivery_date: ''
                    }
                }],
                courier: [{
                    latitude: 0,
                    longitude: 0
                }],
                note: {
                    note: ''
                }
            }
        },
        mounted() {
            let self = this
            self.getUserPosition()
            self.getDataDRS('')
            self.getdataMaps()
            self.getWarehouse()
            setInterval(function() { // setting interval in Maps
                if (self.auto_refresh == 1) {
                    self.getdataMaps()
                }
            }, 60000)
        },
        computed: {
            dataItems() { // data Items for Load More Data
                return this.items.slice(0, this.showData)
            },
            //to get staff id
            staff() {
                return this.$store.getters.getStaff
            },
        },
        methods: {
            getWarehouse() { // get data warehouse from User ID
                this.$http.get("/user/staff/" + this.staff.id)
                    .then(response => {
                        this.vendorDisabled = false
                        this.warehouse = response.data.data.warehouse
                        this.warehouse_id = response.data.data.warehouse.id
                        this.getDataDRS(this.search)
                        this.getdataMaps()
                        this.warehouseLocation = {
                            lat: this.warehouse.latitude,
                            lng: this.warehouse.longitude
                        }
                    });
            },
            cancelDrs() { // cancel DRS
                this.overlay = true
                this.$http2.put("/logistic/control_tower", {
                    delivery_run_sheet_id: this.cancelData,
                    note: this.note.note
                }).then(response => {
                    Vue.$toast.open({
                        position: 'top-right',
                        message: 'Data has been archived successfully',
                        type: 'success',
                    });
                    this.note = {
                        note : "",
                    }
                    this.getDataDRS(this.search)
                    this.modelDialog = false
                    this.overlay = false
                }).catch(error => {
                    this.modelDialog = false
                    this.overlay = false
                })
            },
            async getUserPosition() { // get user default location
                if (navigator.geolocation) {
                    // get GPS position
                    navigator.geolocation.getCurrentPosition(pos => {
                        // set the user location
                        this.userLocation = {
                            lat: pos.coords.latitude,
                            lng: pos.coords.longitude
                        };
                    });
                }
            },
            getDataDRS(search) { // get data DRS from API
                this.isLoadingItems = true
                let statuses = ''
                if (this.statuses === 999) {
                    statuses = ''
                } else {
                    statuses = "|status__in:" + this.statuses
                }
                let deliverydate = ''
                if (this.delivery_date.length > 0) {
                    if (this.delivery_date.length == 1) {
                        deliverydate = '|salesorder.delivery_date:' + this.delivery_date[0]
                    } else {
                        let date = this.delivery_date[0]
                        let date2 = this.delivery_date[1]
                        if (date > date2) {
                            deliverydate = '|salesorder.delivery_date.gte:' + date2 + '|salesorder.delivery_date.lte:' + date
                        } else {
                            deliverydate = '|salesorder.delivery_date.gte:' + date + '|salesorder.delivery_date.lte:' + date2
                        }
                    }
                } else {
                    deliverydate = '|salesorder.delivery_date:' + new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10)
                }
                let warehouse = ''
                if (this.warehouse_id) {
                    warehouse = '|salesorder.warehouse.id.e:' + this.warehouse_id
                }
                let vendor = ''
                if (this.courier_vendor_id) {
                    vendor = '|courier.vehicleprofiles.couriervendor.id.e:' + this.courier_vendor_id
                }
                let courier = ''
                if (this.courier_id) {
                    courier = '|courier.id.e:' + this.courier_id
                }
                this.$http2.get("/logistic/control_tower", {
                    params: {
                        perpage: 100,
                        conditions: 'salesorder.code.icontains:' + search + deliverydate + warehouse + vendor + courier + statuses,
                    }
                }).then(response => {
                    this.isLoadingItems = false
                    this.items = response.data.data
                    if (this.items === null) {
                        this.items = []
                    }
                }).catch(error => {
                    this.isLoadingItems = false
                })
            },
            getdataMaps() { // get data Maps from API
                this.$http2.post("/logistic/control_tower", { // get data Courier
                    warehouse_id: this.warehouse_id,
                    courier_vendor_id: this.courier_vendor_id,
                    courier_id: this.courier_id,
                }).then(response => {
                    this.courier = response.data.data.couriers
                    this.total_emergency = response.data.data.on_emergency
                    if (this.courier === null) {
                        this.courier = []
                    }
                })
            },
            warehouseSelected(d) { // warehouse Selected
                this.warehouse = null;
                this.warehouse_id = '';
                this.vendor = null
                this.courier_vendor_id = ''
                this.courier = null
                this.courier_id = ''
                this.vendorDisabled = true
                this.courierDisabled = true
                if (d) {
                    this.warehouse = d;
                    this.warehouse_id = d.id;
                    this.vendorDisabled = false
                }
                this.getdataMaps()
                this.getDataDRS(this.search)
            },
            vendorSelected(d) { // for filter vendor
                this.vendor = null;
                this.courier_vendor_id = ''
                this.courierDisabled = true
                if (d) {
                    this.vendor = d;
                    this.courier_vendor_id = d.id
                    this.courierDisabled = false
                }
                this.getdataMaps()
                this.getDataDRS(this.search)
            },
            courierSelected(d) { // for filter courier
                this.courier = null;
                this.courier_id = ''
                if (d) {
                    this.courier = d;
                    this.courier_id = d.id
                }
                this.getdataMaps()
                this.getDataDRS(this.search)
            },
            setDateValidation() { // For validation and change date format
                if (this.delivery_date_input == '' || !this.delivery_date_input) {
                    this.delivery_date_input = new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10)
                    this.delivery_date = [new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10)]
                }
                Vue.nextTick(() => {
                    this.items = []
                    this.getDataDRS(this.search)
                });
            },
        },
        watch: {
            'search': { // watch search box
                handler: function(val) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function() {
                        that.getDataDRS(val)
                    }, 1000);
                },
                deep: true
            },
            'delivery_date_input': { // watch delivery date input
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            this.items = []
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.delivery_date[0] = this.$moment(val).format('YYYY-MM-DD')
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0, 10)
                            let date2 = val.substr(14, 23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                if (this.delivery_date.length == 2) {
                                    let date3 = new Date(this.delivery_date[0])
                                    let date4 = new Date(this.delivery_date[1])
                                    if (parseInt((date4 - date3) / (24 * 3600 * 1000)) > 30 || parseInt((date4 - date3) / (24 * 3600 * 1000)) < -30) {
                                        if (date4 < date3) {
                                            this.delivery_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                            this.delivery_date.splice(1, 1)
                                        } else {
                                            this.delivery_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                            this.delivery_date.splice(1, 1)
                                        }
                                    } else {
                                        Vue.nextTick(() => {
                                            this.items = []
                                            this.getDataDRS(this.search)
                                        });
                                    }
                                }
                            }
                        }
                    }
                },
                deep: true
            },
            'delivery_date': { // watch delivery date
                handler: function (val) {
                    if (val) {
                        this.delivery_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
            'statuses': { // filter status
                handler: function(val) {
                    let that = this
                    that.getDataDRS(this.search)
                },
                deep: true
            },
        }
    }
</script>

<style>
.marker-cluster-small {
    background-color: #49afa5 !important;
}

.marker-cluster-small div {
    background-color: #1c9489 !important;
    color: #fff !important;
}
</style>