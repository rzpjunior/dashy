<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="name"
                        v-model="form.name"
                        required
                        outlined
                        dense
                        :error-messages="error.warehouse_name"
                    >
                        <template v-slot:label>
                            <div>
                                Name<span class="text-red">*</span>
                            </div>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="pic_name"
                        v-model="form.pic_name"
                        :error-messages="error.pic_name"
                        maxlength="30"
                        required
                        outlined
                        dense
                        v-on:keypress="letterOnly($event)"
                    >
                        <template v-slot:label>
                            <div>
                                PIC Name<span class="text-red">*</span>
                            </div>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="phone_number"
                        v-model="form.phone_number"
                        label="PIC Phone Number"
                        :error-messages="error.phone_number"
                        maxlength="15"
                        onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                        required
                        outlined
                        dense
                        :rules="phoneRules"
                    >
                        <template v-slot:label>
                            <div>
                                PIC Phone Number<span class="text-red">*</span>
                            </div>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="alt_phone_number"
                        v-model="form.alt_phone_number"
                        label="PIC Alternate Phone Number"
                        maxlength="15"
                        onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                        required
                        outlined
                        :rules="phoneRules"
                        dense
                    >
                        <template v-slot:label>
                            <div>
                                PIC Alternate Phone Number
                            </div>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectGlossary
                        v-model="form.warehouse_type"
                        outlined
                        :dense="true"
                        :norequired="false"
                        :error="error.warehouse_type"
                        label="Warehouse Type"
                        @selected="whtypeSelected"
                        table="warehouse"
                        attribute="warehouse_type"
                    >
                    </SelectGlossary>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectWarehouse
                        name="copy_warehouse"
                        :norequired="true"
                        :aux_data="2"
                        @selected="copyConfigWarehouse"
                        :label="'Copy Configuration Warehouse'"
                        :error="error.warehouse_id"
                        :dense="true"
                        :warehouse_type="'1.2.3.4.5.6.7.8.9.10.11.12.13.14.15.16.17.18.19.20'"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="6" class="-mt24" v-show="form.warehouse_type == 'HUB'">
                    <SelectWarehouse
                        name="parent_warehouse"
                        :norequired="false"
                        :aux_data="2"
                        @selected="parentWarehouse"
                        :label="'Parent Warehouse'"
                        :error="error.parent_warehouse_id"
                        :dense="true"
                        :clear="clearParentWh"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="6" class="-mt20 mb20" v-show="form.warehouse_type == 'HUB'">
                    <v-row>
                        <v-col>
                            <div class="text-black60 fs14 -mt20">
                                Processing Times for Hub (Hours)
                            </div>
                            <vue-numeric
                                name="service_hours"
                                :class="!error.hub_processing_time ? 'formNumericNew' : 'formNumericErrNew'"
                                placeholder="00"
                                v-model="service_hours"
                                dense
                            ></vue-numeric>
                            <div v-if="error.hub_processing_time" class="-mb10 fs12 text-red">
                                {{error.hub_processing_time}}
                            </div>
                        </v-col>
                        <v-col>
                            <div class="text-black60 fs14 -mt20">
                                Processing Times for Hub (Minutes)
                            </div>
                            <vue-numeric
                                name="service_minutes"
                                :class="!error.hub_processing_time ? 'formNumericNew' : 'formNumericErrNew'"
                                placeholder="00"
                                v-model="service_minutes"
                                dense
                                :min="0"
                                :max="59"
                            ></vue-numeric>
                            <div v-if="error.hub_processing_time" class="-mb10 fs12 text-red">
                                {{error.hub_processing_time}}
                            </div>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectArea 
                        :area="area"
                        @selected="areaSelected"
                        :dense="true"
                        :norequired="true"
                        :aux_data="2"
                        :disabled="disabledArea"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectProvince
                        name="province"
                        v-model="province"
                        @selected="provinceSelected"
                        :area_id="form.area_id"
                        :province="province"
                        required
                        :dense="true"
                        :error-messages="error.province_id"
                        :disabled="disabledProvince"
                        :clear="clearProvince"
                    ></SelectProvince>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectCity
                        name="city"
                        v-model="city"
                        @selected="citySelected"
                        :area_id="form.area_id"
                        :province_id="form.province_id"
                        :city="city"
                        required
                        :dense="true"
                        :disabled="disabledCity"
                        :error-messages="error.city_id"
                        :clear="clearCity"
                    ></SelectCity>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectDistrict
                        name="district"
                        v-model="district"
                        @selected="districtSelected"
                        :area_id="form.area_id"
                        :province_id="form.province_id"
                        :city_id="form.city_id"
                        :district="district"
                        required
                        :dense="true"
                        :disabled="disabledDistrict"
                        :error-messages="error.district_id"
                        :clear="clearDistrict"
                    ></SelectDistrict>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectSubDistrict
                        name="sub_district"
                        v-model="sub_district"
                        @selected="subdistrictSelected"
                        :area_id="form.area_id"
                        :province_id="form.province_id"
                        :city_id="form.city_id"
                        :district_id="form.district_id"
                        :sub_district="sub_district"
                        required
                        :dense="true"
                        :disabled="disabledSubDistrict"
                        :error="error.sub_district_id"
                        :polygon="1"
                        :clear="clearSub_district"
                    ></SelectSubDistrict>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="postal_code"
                        v-model="postal_code"
                        required
                        dense
                        outlined
                        disabled
                        :error-messages="error.postal_code"
                    >
                        <template v-slot:label>
                            Postal Code<span style="color:red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="floor_plan"
                        v-model="form.floor_plan_link"
                        required
                        dense
                        outlined
                    >
                        <template v-slot:label>
                            Floor Plan
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-row>
                        <v-col cols="12" md="6" class="-mt24">
                            <v-textarea
                                name="address"
                                v-model="form.street_address"
                                :error-messages="error.street_address"
                                counter="350"
                                maxlength="350"
                                required
                                outlined
                                rows="3"
                            >
                                <template v-slot:label>
                                    <div>
                                        Address<span class="text-red">*</span>
                                    </div>
                                </template>
                            </v-textarea>
                        </v-col>
                        <v-col cols="12" md="6" class="-mt24">
                            <v-textarea
                                name="note"
                                v-model="form.note"
                                :error-messages="error.note"
                                counter="100"
                                outlined
                                maxlength="100"
                                rows="3"
                            >
                                <template v-slot:label>
                                    <div>
                                        Note
                                    </div>
                                </template>
                            </v-textarea>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </div>
        <div class="box-start" v-show="sub_district">
            <v-row>
                <v-col cols="12" md="6" class="left fs16 bold">
                    Maps
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" class="-mt10 mb10">
                    <v-alert
                        color="#2A89A7"
                        dark
                        outlined
                    > 
                        <v-row>
                            <v-col class="flex-align-center">
                                <v-img
                                    width="15"
                                    src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png"
                                />
                                <span class="text-green">For Courier Pin Point</span>
                            </v-col>
                            <v-col class="flex-align-center">
                                <v-img
                                    width="15"
                                    src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png"
                                />
                                <span class="text-blue">For Start Picking Pin Point</span>
                            </v-col>
                        </v-row>
                    </v-alert>
                </v-col>
                <v-col cols="12" class="-mt24 mb10">
                    <v-alert color="error" icon="warning" v-if="error.latitude_longitude || error.picking_latitude_longitude">
                        <span class="text-white">
                            {{ error.latitude_longitude }}
                        </span>
                    </v-alert>
                </v-col>
            </v-row>
            <Maps
                :createWarehouse="sub_district"
            >
            </Maps>
        </div>
        <div class="box-end">
            <v-row class="-ma16">
                <v-col>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            @click="$router.go(-1)"
                            depressed
                            outlined
                            color="#EBEBEB"
                            class="main-btn"
                        >
                            <span class="text-black80">Cancel</span>
                        </v-btn>
                        <v-btn
                            depressed
                            color="#50ABA3"
                            class="main-btn white--text"
                            @click="confirmButton()"
                            v-privilege="'wrh_crt'"
                        >
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </v-container>
</template>

<script>
    export default {
        name: "WarehouseUpdate",
        data () {
            return {
                ConfirmData: [],
                form: {
                    name: '',
                    pic_name: '',
                    phone_number: '',
                    alt_phone_number: '',
                    area_id: '',
                    street_address: '',
                    note: '',
                    province_id: '',
                    city_id: '',
                    district_id: '',
                    sub_district_id: '',
                    warehouse_type: '',
                    hub_processing_time: '',
                    latitude: 0,
                    longitude: 0,
                    picker_starting_latitude: 0,
                    picker_starting_longitude: 0,
                    parent_warehouse: '',
                    copy_config_warehouse: '',
                    floor_plan_link: '',
                },
                error:{},
                phoneRules: [
                    v => (v && v.length >= 8) || 'Phone number at least 8 digits',
                ],
                area: '',
                disabledArea: true,
                clearParentWh: false,
                warehouse: '',
                province: null,
                disabledProvince: true,
                clearProvince: false,
                city: null,
                disabledCity: true,
                clearCity: false,
                district: null,
                disabledDistrict: true,
                clearDistrict: false,
                sub_district: '',
                disabledSubDistrict: true,
                clearSub_district: false,
                postal_code: '',
                default_warehouse: null,
                service_hours: 0,
                service_minutes: 0
            }
        },
        methods:{
            confirmButton(){ // save to db
                this.form.hub_processing_time = this.service_hours + ':' + this.service_minutes
                this.ConfirmData = {
                    model: true,
                    title: "Create Warehouse",
                    text: "Are you sure want to Create this warehouse?",
                    urlApi: "/config/warehouse/produce_create",
                    nextPage: "/configuration/wh",
                    post: true,
                    data: this.form
                }
            },
            warehouseSelected(d) { // select warehouse  
                this.warehouse = ""
                if (d) {
                    this.warehouse = d
                }
                
            },
            provinceSelected(d) { // select province
                this.province = null
                this.form.province_id = ''
                this.city = null
                this.form.city_id = ''
                this.sub_district = null
                this.form.sub_district_id = ''
                this.postal_code = ''
                this.disabledCity = true
                this.disabledDistrict = true
                this.disabledSubDistrict = true
                this.clearCity = true
                this.clearDistrict = true
                this.clearSub_district = true
                if (d) {
                    this.province = d
                    this.form.province_id = d.province_id
                    this.disabledCity = false
                    this.clearCity = false
                }
            },
            citySelected(d) { // select city
                this.city = null
                this.form.city_id = ''
                this.district = null
                this.form.district_id = ''
                this.sub_district = null
                this.form.sub_district_id = ''
                this.postal_code = ''
                this.disabledDistrict = true
                this.disabledSubDistrict = true
                this.clearDistrict = true
                this.clearSub_district = true
                if (d) {
                    this.city = d
                    this.form.city_id = d.city_id
                    this.disabledDistrict = false
                    this.clearDistrict = false
                }
            },
            districtSelected(d) { //select district
                this.district = null;
                this.form.district_id = ''
                this.sub_district = null
                this.form.sub_district_id = ''
                this.postal_code = ''
                this.disabledSubDistrict = true
                this.clearSub_district = true
                if (d) {
                    this.district = d;
                    this.form.district_id = d.district_id
                    this.disabledSubDistrict = false
                    this.clearSub_district = false
                }
            },
            subdistrictSelected(d) { // select subdistrict
                this.sub_district = null
                this.form.sub_district_id = ''
                this.postal_code = ''
                if (d) {
                    this.sub_district = d;
                    this.form.sub_district_id = d.sub_district_id
                    this.postal_code = d.postal_code
                }
            },
            whtypeSelected(d) { // select warehouse type
                this.area = ''
                this.form.warehouse_type = ''
                this.province = null
                this.form.province_id = ''
                this.city = null
                this.form.city_id = ''
                this.district = null
                this.form.district_id = ''
                this.sub_district = null
                this.form.sub_district_id = ''
                this.postal_code = ''
                this.disabledArea = false
                this.clearParentWh = true
                this.disabledProvince = true
                this.disabledCity = true
                this.disabledDistrict = true
                this.disabledSubDistrict = true
                this.clearProvince = true
                this.clearCity = true
                this.clearDistrict = true
                this.clearSub_district = true
                if (d && d.value_name != 'HUB') {
                    this.disabledArea = false
                    this.form.warehouse_type = d.value_name
                } else {
                    this.clearParentWh = false
                    this.disabledArea = true
                    this.form.warehouse_type = d.value_name
                }
            },
            parentWarehouse(d) { // select parent warehouse related
                this.form.parent_warehouse = ''
                this.area = ''
                this.form.area_id = ''
                this.province = null
                this.form.province_id = ''
                this.city = null
                this.form.city_id = ''
                this.district = null
                this.form.district_id = ''
                this.sub_district = null
                this.form.sub_district_id = ''
                this.postal_code = ''
                this.disabledProvince = true
                this.disabledCity = true
                this.disabledDistrict = true
                this.disabledSubDistrict = true
                this.clearProvince = true
                this.clearCity = true
                this.clearDistrict = true
                this.clearSub_district = true
                if (d) {
                    this.area = d.area
                    this.form.area_id = d.area.id;
                    this.form.parent_warehouse = d.id
                    this.disabledProvince = false
                }
            },
            copyConfigWarehouse(d) { // copy config warehouse
                this.form.copy_config_warehouse = ''
                if (d) {
                    this.form.copy_config_warehouse = d.id
                }
            },
            areaSelected(d) { // select area
                this.area = ''
                this.form.area_id = ''
                this.province = null
                this.form.province_id = ''
                this.city = null
                this.city_id = ''
                this.district = null
                this.form.district_id = ''
                this.sub_district = null
                this.sub_district_id = ''
                this.postal_code = ''
                this.form.area_id = ''
                this.disabledProvince = true
                this.disabledCity = true
                this.disabledDistrict = true
                this.disabledSubDistrict = true
                this.clearProvince = true
                this.clearCity = true
                this.clearDistrict = true
                this.clearSub_district = true
                if (d) {
                    this.area = d
                    this.form.area_id = d.id
                    this.disabledProvince = false
                }
            }
        },
        mounted() {
            this.$root.$on('pickerPosition', data => { // mounted data dari komponen untuk disimpan pada form
                this.form.picker_starting_latitude = data.lat
                this.form.picker_starting_longitude = data.lng
            })
            this.$root.$on('warehousePosition', data => { // mounted data dari komponen untuk disimpan pada form
                this.form.latitude = data.lat
                this.form.longitude = data.lng
            })
            let self = this
            this.$root.$on('event_error', function(err){
                self.error = err
            });
        },
    }
</script>
