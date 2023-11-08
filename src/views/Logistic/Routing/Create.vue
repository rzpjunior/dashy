<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                            <div v-on="{ ...tooltip }">
                                <SelectWarehouse
                                    name="warehouse"
                                    :aux_data="2"
                                    @selected="warehouseSelected"
                                    required
                                    :error="error.warehouse_id || error.warehouse_coverage"
                                    :dense="true"
                                    :warehouse_type="'1.2.3.4.5.6.7.8.9.10.11.12.13.14.15.16.17.18.19.20'"
                                ></SelectWarehouse>
                            </div>
                        </template>
                        <span>Warehouse to be routed</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="delivery_date_model"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on:menu }">
                            <v-tooltip top>
                                <template v-slot:activator="{ on:tooltip }">
                                    <div v-on="{ ...menu, ...tooltip}">
                                        <v-text-field
                                            name="delivery_date"
                                            prepend-inner-icon="mdi-calendar"
                                            outlined
                                            :dense="true"
                                            clearable
                                            required
                                            :error-messages="error.delivery_date"
                                            @click:clear="form.delivery_date = '', renderData()"
                                            v-model="form.delivery_date"
                                            maxlength="10"
                                            onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 45"
                                        >
                                            <template v-slot:label>Delivery date<span class="text-red">*</span></template>
                                        </v-text-field>
                                    </div>
                                </template>
                                <span>Delivery date to be routed</span>
                            </v-tooltip>
                        </template>
                        <v-date-picker
                            v-model="form.delivery_date"
                            @input="delivery_date_model = false, renderData() "
                        ></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                            <div v-on="{ ...tooltip }">
                                <MultiSelectWrt
                                    :error="error.wrt_id"
                                    :dense="true"
                                    :disabled="wrtDisabled"
                                    @selected="wrtSelected"
                                    :area_id="area_id"
                                    :wrt="wrt"
                                    :label="'Multiselect WRT'"
                                    :checkbox="true"
                                ></MultiSelectWrt>
                            </div>
                        </template>
                        <span>Which WRT will be routed</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12" class="-mt30">
                    <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                            <div v-on="{ ...tooltip }">
                                <v-text-field
                                    label="Routing Note" 
                                    outlined 
                                    dense
                                    maxlength="255"
                                    v-model="form.routing_goal"
                                ></v-text-field>
                            </div>
                        </template>
                        <span>The purpose of the routing to be created</span>
                    </v-tooltip>
                </v-col>
            </v-row>
        </div>
        <div class="box-start">
            <v-row>
                <v-col cols="12" md="6" class="left fs16 bold mb10">
                    Selected Filter Summary
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6" class="-mt10">
                    <v-row class="-mb1">
                        <v-col >
                            <div class="text-black60">Total SO :</div>
                        </v-col>
                            <v-col>
                                <v-progress-linear
                                    v-if="loader"
                                    indeterminate
                                    class="mt10"
                                >
                                </v-progress-linear>
                                <div v-if="loader == false" class="d-flex justify-end">
                                    {{items.total_sales_order}}
                                </div>
                            </v-col>
                    </v-row>
                    <v-divider/>
                </v-col>
                <v-col cols="12" md="6" class="-mt10">
                    <v-row class="-mb1">
                        <v-col >
                            <div class="text-black60">Total Branch :</div>
                        </v-col>
                            <v-col>
                                <v-progress-linear
                                    v-if="loader"
                                    indeterminate
                                    class="mt10"
                                >
                                </v-progress-linear>
                                <div v-if="loader == false" class="d-flex justify-end">
                                    {{items.total_branch}}
                                </div>
                            </v-col>
                    </v-row>
                    <v-divider/>
                </v-col>
                <v-col cols="12" md="6" class="-mt10">
                    <v-row class="-mb1">
                        <v-col >
                            <div class="text-black60">Total Weight (KG) :</div>
                        </v-col>
                            <v-col>
                                <v-progress-linear
                                    v-if="loader"
                                    indeterminate
                                    class="mt10"
                                >
                                </v-progress-linear>
                                <div v-if="loader == false" class="d-flex justify-end">
                                    {{items.total_weight}}
                                </div>
                            </v-col>
                    </v-row>
                    <v-divider/>
                </v-col>
                <v-col cols="12" md="6" class="-mt10">
                    <v-row class="-mb1">
                        <v-col >
                            <div class="text-black60">Total Koli :</div>
                        </v-col>
                            <v-col>
                                <v-progress-linear
                                    v-if="loader"
                                    indeterminate
                                    class="mt10"
                                >
                                </v-progress-linear>
                                <div v-if="loader == false" class="d-flex justify-end">
                                    {{items.total_koli}}
                                </div>
                            </v-col>
                    </v-row>
                    <v-divider/>
                </v-col>
                <v-col cols="12" md="6" class="-mt10">
                    <v-row class="-mb1">
                        <v-col >
                            <div class="text-black60">Total Fragile Weight (KG) :</div>
                        </v-col>
                            <v-col>
                                <v-progress-linear
                                    v-if="loader"
                                    indeterminate
                                    class="mt10"
                                >
                                </v-progress-linear>
                                <div v-if="loader == false" class="d-flex justify-end">
                                    {{items.total_fragile}}
                                </div>
                            </v-col>
                    </v-row>
                    <v-divider/>
                </v-col>
            </v-row>
        </div>
        <div class="box-start">
            <v-row class="-mt32 -mb45">
                <v-col class="flex-justify-center fs16 bold mb40 mt24">
                    Advanced Options
                </v-col>
                <v-col cols="3">
                    <div class="d-flex justify-end mt5">
                        <v-switch
                            v-model="switchOptions"
                            color="#50ABA3"
                            inset
                            :false-value="0"
                            :true-value="1"
                            @click="advancedOptions()"
                        >
                        </v-switch>
                    </div>
                </v-col>
            </v-row>
            <hr class="hr-title mt10" v-show="switchOptions == 1">
            <v-row class="mt20" v-show="switchOptions == 1">
                <v-col cols="12" md="6">
                    <v-row>
                        <v-col>
                            <div class="text-black60">
                                Retase Routing
                                <v-tooltip bottom>
                                    <template v-slot:activator="{on: tooltip}">
                                        <v-icon right dark v-on="{...tooltip}">mdi-information-outline</v-icon>
                                    </template>
                                    <span>Allow couriers to be used multiple times within the same routing</span>
                                </v-tooltip>
                            </div>
                        </v-col>
                        <v-col class="-mt20">
                            <div class="d-flex justify-end">
                                <v-switch
                                    v-model="form.advanced_options.multi_batch"
                                    color="#50ABA3"
                                    inset
                                    :false-value="2"
                                    :true-value="1"
                                    @click="multiBatch(form.advanced_options.multi_batch)"
                                ></v-switch>
                            </div>
                        </v-col>
                    </v-row>
                    <v-divider/>
                </v-col>
                <v-col cols="12" md="6">
                    <v-row>
                        <v-col>
                            <v-row>
                                <v-col>
                                    <div class="text-black60">
                                        Enable COD Skill
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{on: tooltip}">
                                                <v-icon right dark v-on="{...tooltip}">mdi-information-outline</v-icon>
                                            </template>
                                            <span>Only profiles that have the COD skill will be able to perform deliveries that require COD</span>
                                        </v-tooltip>
                                    </div>
                                </v-col>
                                <v-col class="-mt20">
                                    <div class="d-flex justify-end">
                                        <v-switch
                                            v-model="form.advanced_options.enable_cod"
                                            color="#50ABA3"
                                            inset
                                            :false-value="2"
                                            :true-value="1"
                                            @click="codSkill(form.advanced_options.enable_cod)"
                                        ></v-switch>
                                    </div>
                                </v-col>
                            </v-row>
                            <v-divider/>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12" md="6">
                    <v-row>
                        <v-col>
                            <div class="text-black60">
                                Service Time (Minutes)
                                <v-tooltip bottom>
                                    <template v-slot:activator="{on: tooltip}">
                                        <v-icon right dark v-on="{...tooltip}">mdi-information-outline</v-icon>
                                    </template>
                                    <span>Time at location to serve the customer</span>
                                </v-tooltip>
                            </div>
                        </v-col>
                        <v-col>
                            <div class="d-flex justify-end -mt15 mb5">
                                <vue-numeric
                                    name="service_time"
                                    v-model="form.advanced_options.service_time"
                                    class="rounded-sm-form productNumeric text-center"
                                    :error-messages="error.service_time"
                                ></vue-numeric>
                            </div>
                        </v-col>
                    </v-row>
                    <v-divider/>
                </v-col>
                <v-col cols="12" md="6">
                    <v-row>
                        <v-col>
                            <div class="text-black60">
                                Setup Time (Minutes)
                                <v-tooltip bottom>
                                    <template v-slot:activator="{on: tooltip}">
                                        <v-icon right dark v-on="{...tooltip}">mdi-information-outline</v-icon>
                                    </template>
                                    <span>Time at location to serve the customer</span>
                                </v-tooltip>
                            </div>
                        </v-col>
                        <v-col>
                            <div class="d-flex justify-end -mt15 mb5">
                                <vue-numeric
                                    name="setup_time"
                                    v-model="form.advanced_options.setup_time"
                                    class="rounded-sm-form productNumeric text-center"
                                    :error-messages="error.setup_time"
                                ></vue-numeric>
                            </div>
                        </v-col>
                    </v-row>
                    <v-divider/>
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table">
            Armada Required
        </div>
        <div class="box-body-table">
            <v-data-table
                :headers="table.fields"
                :items="form.vehicles"
                :hide-default-footer="true"
                :items-per-page="-1"
                mobile-breakpoint="0"
            >
                <template v-slot:item="props">
                    <tr style="height: 48px">
                        <td>{{props.index + 1}}</td>
                        <td>
                            <SelectVehicleTable
                                :name="`vehicle_profile_${props.index}`"
                                :vehicle="props.item.vehicle_profiles"
                                @click.native="setVehicleIdx(props.index)"
                                @selected="vehicleSelected"
                                :error="errVhp(props.index)"
                                :warehouse="form.warehouse_id"
                            ></SelectVehicleTable>
                        </td>
                        <td>
                            <v-tooltip bottom>
                                <template v-slot:activator="{on: tooltip}">
                                    <v-icon v-on="{...tooltip}">mdi-information-outline</v-icon>
                                </template>
                                <span v-if="props.item.id != ''">
                                    Profile: {{detail_profile[props.index].vehicle_profiles.name}}<br>
                                    Max Koli: {{detail_profile[props.index].vehicle_profiles.max_koli}} <br>
                                    Max Weight (KG): {{detail_profile[props.index].vehicle_profiles.max_weight}} <br>
                                    Max Fragile Goods (KG): {{detail_profile[props.index].vehicle_profiles.max_fragile}} <br>
                                    Routing Profile: {{routing_profile[props.index].vehicle_profiles.routing_profile.value_name == 'car' ? 'Highway' : 'No Highway'}} <br>
                                    Skills: {{routing_profile[props.index].vehicle_profiles.skills}}
                                </span>
                                <span v-else>
                                    Please select Vehicle Profile
                                </span>
                            </v-tooltip>
                        </td>
                        <td>
                            <vue-numeric
                                :name="`qty_${props.index}`"
                                :class="errQty(props.index) ? 'productNumericErr' : 'productNumeric'"
                                @focus="VehicleIdx = props.index"
                                v-model="props.item.qty"
                                onkeypress='return event.charCode >= 48 && event.charCode <= 57'
                                :disabled="props.item.qtyDisabled"
                                v-if="props.item.checkBox == false"
                            ></vue-numeric>
                            <div class="mt-1 ml-3 fs12 text-red">{{errQty(props.index)}}</div>
                        </td>
                        <td>
                            <div class="d-flex justify-center">
                                <v-checkbox
                                    v-model="props.item.checkBox"
                                    @focus="VehicleIdx = props.index"
                                    :value="true"
                                    multiple
                                    @click="checkRecommended(props.item.checkBox, props.index)"
                                    :disabled="props.item.checkDisabled"
                                ></v-checkbox>
                            </div>
                        </td>
                        <td>
                            <v-tooltip bottom>
                                <template v-slot:activator="{on: tooltip}">
                                    <v-icon v-on="{...tooltip}">mdi-information-outline</v-icon>
                                </template>
                                <span>
                                    Measure of speed in the vehicle profile. <br /> Fill in the range number = 0.1 - 5. <br />
                                    "0.1" if the vehicle speed is slow and "5" if it fast. 
                                </span>
                            </v-tooltip>
                        </td>
                        <td>
                            <vue-numeric
                                :name="`speed_factor_${props.index}`"
                                :class="errSpeed(props.index) ? 'productNumericErr' : 'productNumeric'"
                                @focus="VehicleIdx = props.index"
                                v-model="props.item.speed_factor"
                                onkeypress='return event.charCode >= 48 && event.charCode <= 57 || event.charCode <= 44'
                                :disabled="props.item.speedDisabled"
                                :precision="2"
                                separator="."
                                :max="5"
                                :min="0.1"
                            ></vue-numeric>
                        </td>
                        <td>
                            <div class="d-flex justify-end">
                                <div v-if="props.index == form.vehicles.length-1">
                                    <v-btn
                                        v-if="form.vehicles.length < 10"
                                        icon
                                        name="addProfile"
                                        @click="addProfile()"
                                    >
                                        <img src="/icon/plus.png" height="22px" width="22px"/>
                                    </v-btn>
                                </div>
                                <div v-if="form.vehicles.length != 1">
                                    <v-btn
                                        icon
                                        :name="`removeprofile_${props.index}`"
                                        @click="removeVehicleProfile(props.index)"
                                    >
                                        <img src="/icon/close-new.png" height="20px" width="20px"/>
                                    </v-btn>
                                </div>
                            </div>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <div class="box-table" v-if="error.fail_geocode">
            <v-data-table
                :headers="headersFailGeocode"
                :items="transformedToList"
                :items-per-page="5"
            >
                <template v-slot:item="props">
                    <tr style="height: 30px">
                        <td>{{props.item.item}}</td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <div class="box">
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    v-privilege="'rou_rdl'"
                    depressed
                    outlined
                    color="#EBEBEB"
                    class="main-btn"
                    @click="$router.go(-1)"
                >
                    <span class="text-black80">Cancel</span>
                </v-btn>
                <v-btn
                    depressed
                    color="#50ABA3"
                    class="main-btn white--text"
                    @click="confirmButton()"
                    v-privilege="'rou_crt'"
                >
                    Generate
                </v-btn>
            </v-card-actions>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData" />
    </v-container>
</template>

<script>
    import Vue from 'vue'
    export default {
        name: 'RoutingCreate',
        data() {
            return {
                ConfirmData: {},
                detail_profile: "",
                routing_profile: "",
                excludeSelect: 1,
                onlySelect: 2,
                radios: 1,
                dialog: false,
                overlay: false,
                switchOptions: 0,
                form: {
                    delivery_date: new Date(Date.now() + (3600 * 1000 * 24) + (3600 * 1000 * 7)).toISOString().substr(0, 10),
                    vehicles: [],
                    wrt_id: [],
                    warehouse_id: '',
                    select_status: 1,
                    routing_goal: '',
                    advanced_options: {
                        multi_batch: 2,
                        service_time: 5,
                        enable_cod: 2,
                        setup_time: 10
                    }
                },
                area_id: "",
                all_wrt: false,
                wrt: null,
                wrtDisabled: true,
                delivery_date_model: '',
                VehicleIdx: '',
                table: {
                    fields: [
                        {
                            text: 'No.',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                            width: '5px'
                        },
                        {
                            text: 'Vehicle Profile',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text: 'Vehicle Qty',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                            width: '20%',
                            align: "right"
                        },
                        {
                            text: 'Suggest Qty',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                            width: '20%',
                            align: "center"
                        },
                        {
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text: 'Speed Factor',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                            width: '20%',
                            align: "right"
                        },
                        {
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                    ]
                },
                error: {},
                headersFailGeocode: [{
                    text: 'Routed Error',
                    class: 'error--text'
                }],
                rowGeocodeError: [],
                items: {},
                loader: true,
                apply: '',
            }
        },
        computed: {
            transformedToList() { // transform row fail geocode error
                return this.rowGeocodeError.map(item => ({ item }));
            }
        },
        methods: {
            warehouseSelected(d) { // select komponen warehouse
                this.form.warehouse_id = ""
                this.wrtDisabled = true
                this.form.wrt_id = []
                this.area_id = ""
                this.form.vehicles = []
                this.wrt = ""
                this.error.warehouse_id = ""
                this.error.warehouse_coverage = ""
                if (d) {
                    this.wrtDisabled = false
                    this.area_id = d.area.id
                    this.form.warehouse_id = d.id
                    this.addProfile()
                } 
                this.renderData()
            },
            wrtSelected(d) { // select komponen wrt
                this.form.wrt_id = []
                this.error.wrt_id = ""
                if(d) {
                    let arr = []
                    if (d !== '') {
                        for (let i = 0; i < d.length; i++) {
                            arr.push(d[i].id);
                        }
                        this.form.wrt_id = arr
                    }
                }
                this.renderData()
            },
            setVehicleIdx(idx) { // set index table
                this.VehicleIdx = idx
            },
            checkRecommended(d, idx) { // checkbox untuk recommended
                this.form.vehicles[idx].qty = this.form.vehicles[idx].vehicle_profiles.max_available_vehicle
                this.form.vehicles[idx].qtyDisabled = false
                if (d[0] == true) {
                    this.form.vehicles[idx].qtyDisabled = true
                    this.form.vehicles[idx].qty = 999
                }
            },
            vehicleSelected(d) { // select vehicle availabe armada
                this.form.vehicles[this.VehicleIdx].vehicle_profiles = ''
                this.form.vehicles[this.VehicleIdx].id = ''
                this.form.vehicles[this.VehicleIdx].qty = 0
                this.form.vehicles[this.VehicleIdx].speed_factor = 1
                this.form.vehicles[this.VehicleIdx].checkDisabled = true
                this.form.vehicles[this.VehicleIdx].qtyDisabled = true
                this.form.vehicles[this.VehicleIdx].speedDisabled = true
                if (d) {
                    this.form.vehicles[this.VehicleIdx].checkDisabled = false
                    this.form.vehicles[this.VehicleIdx].qtyDisabled = false
                    this.form.vehicles[this.VehicleIdx].speedDisabled = false
                    this.form.vehicles[this.VehicleIdx].vehicle_profiles = d
                    this.form.vehicles[this.VehicleIdx].qty = d.max_available_vehicle
                    this.form.vehicles[this.VehicleIdx].id = d.id
                    this.form.vehicles[this.VehicleIdx].speed_factor = d.speed_factor
                }
                this.detail_profile = this.form.vehicles
                this.routing_profile = this.form.vehicles
            },
            errVhp(idx) { // error vehicle profile
                for (var key in this.error) {
                    if (key == 'vehicle_id' + idx) {
                        return this.error[key]
                    }
                }
            },
            errQty(idx) { // error qty
                for (var key in this.error) {
                    if (key == 'vehicle_qty' + idx) {
                        return this.error[key]
                    }
                }
            },
            errSpeed(idx) { // error qty
                for (var key in this.error) {
                    if (key == 'speed_factor' + idx) {
                        return this.error[key]
                    }
                }
            },
            addProfile() { // add profile table
                this.form.vehicles.push(
                    {
                        qty: 0,
                        id: "",
                        speed_factor: 1,
                        checkBox: false,
                        qtyDisabled: true,
                        checkDisabled: true,
                        speedDisabled: true
                    }
                )
                this.refs = false
                Vue.nextTick(() => {
                    this.refs = true
                    this.setVehicleIdx(this.form.vehicles.length - 1)
                });
            },
            excludeSelected(d) { // radio button exclude
                this.form.select_status = d
                this.renderData()
            },
            onlySelected(d) { // radio button include
                this.form.select_status = d
                this.renderData()
            },
            removeVehicleProfile(idx) { // hapus vehicle profile
                this.form.vehicles.splice(idx, 1)
                for (var key in this.error) {
                    if (key.includes(idx) && key.includes('qty')) {
                        delete this.error[key];
                    }
                    if (key.includes(idx) && key.includes('id')) {
                        delete this.error[key];
                    }
                }
            },
            confirmButton() {
                this.ConfirmData = {
                    model: true,
                    title: "Generate Routing",
                    text: "Are you sure want to Generate Routing?",
                    urlApi: "/logistic/routing/createroute",
                    nextPage: "/logistic/routing",
                    post: true,
                    data: this.form,
                    label: 'URL_2'
                }
            },
            multiBatch(d) { // methods switch for multi batch
                if (d == 1) {
                    this.form.advanced_options.multi_batch = 1
                } else {
                    this.form.advanced_options.multi_batch = 2
                }
            },
            codSkill(d) { // methods switch for cod skill
                if (d == 1) {
                    this.form.advanced_options.enable_cod = 1
                } else {
                    this.form.advanced_options.enable_cod = 2
                }
            },
            advancedOptions() { // methods switch for advanced options
                this.form.advanced_options.multi_batch = 2
                this.form.advanced_options.enable_cod = 2
                this.form.advanced_options.service_time = 5
                this.form.advanced_options.setup_time = 10
            },
            renderData() { // get detail filtered summary
                this.loader = true
                this.$http2.post('/logistic/routing/summaryroute', {
                   warehouse_id: this.form.warehouse_id,
                   delivery_date: this.form.delivery_date,
                   wrt_id: this.form.wrt_id,
                   select_status: this.form.select_status
                }).then(response => {
                    this.items = response.data.data
                    this.loader = false
                }).catch(err => {
                    this.loader = false
                    this.error = err.errors
                })
            }
        },
        mounted() { // mounted
            let self = this;
            self.renderData()
            this.$root.$on("event_error", function(err) {
                self.error = err;
                if (self.error.sales_order) {
                    Vue.$toast.open({
                        position: 'top-right',
                        message: err.sales_order,
                        type: 'error',
                    });
                }
                self.rowGeocodeError = err.fail_geocode != null? err.fail_geocode.slice(0, -1).split('|') : [];
            });
        }
    }
</script>