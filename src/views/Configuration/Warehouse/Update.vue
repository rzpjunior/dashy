<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="code"
                        v-model="form.code"
                        label="Code*"
                        required
                        disabled
                        outlined
                        dense
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="name"
                        v-model="form.name"
                        label="Name*"
                        required
                        disabled
                        outlined
                        dense
                    ></v-text-field>
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
                        :glossary="warehouse_type"
                    >
                    </SelectGlossary>
                </v-col>
                <v-col cols="12" md="6" class="-mt24" v-show="form.warehouse_type == 'HUB'">
                    <SelectWarehouse
                        name="parent_warehouse"
                        :norequired="false"
                        :aux_data="2"
                        v-model="warehouse"
                        :warehouse="warehouse"
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
                        v-model="area"
                        :area="area"
                        @selected="areaSelected"
                        :dense="true"
                        :norequired="true"
                        :aux_data="2"
                        disabled
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="city"
                        v-model="form.sub_district.district.city.name"
                        label="City*"
                        required
                        disabled
                        outlined
                        dense
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="district"
                        v-model="form.sub_district.district.name"
                        label="District*"
                        required
                        disabled
                        outlined
                        dense
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="sub_district"
                        v-model="form.sub_district.name"
                        label="Sub District*"
                        required
                        disabled
                        outlined
                        dense
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="postal_code"
                        v-model="form.sub_district.postal_code"
                        label="Postal Code*"
                        required
                        disabled
                        outlined
                        dense
                    ></v-text-field>
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
        <div class="box-start">
            <v-row>
                <v-col cols="12" md="6" class="left fs16 bold">
                    Maps
                </v-col>
            </v-row>
            <v-row>
                <v-col class="-mt10 mb10">
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
                            {{ error.latitude_longitude || error.picking_latitude_longitude }}
                        </span>
                    </v-alert>
                </v-col>
            </v-row>
            <Maps
                :update="form"
                :updateWarehouse="sub_district"
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
                form:{
                    phone_number: '',
                    alt_phone_number: '',
                    area: {},
                    sub_district: {
                        district: {
                            city: {},
                        }
                    },
                    warehouse_type: '',
                    parent_warehouse: '',
                    area_id: '',
                    floor_plan_link: '',
                    latitude: 0,
                    longitude: 0,
                    picker_starting_latitude: 0,
                    picker_starting_longitude: 0,
                    hub_processing_time: '',
                },
                error:{},
                phoneRules: [
                    v => (v && v.length >= 8) || 'Phone number at least 8 digits',
                ],
                service_hours: 0,
                service_minutes: 0,
                sub_district: '',
                warehouse_type: null,
                clearParentWh: false,
                area: '',
                warehouse: ''
            }
        },
        methods:{
            confirmButton(){ // save to db
                this.form.hub_processing_time = this.service_hours + ':' + this.service_minutes
                this.ConfirmData = {
                    model : true,
                    title : "Update Warehouse",
                    text : "Are you sure want to update this warehouse?",
                    urlApi : "/config/warehouse/"+ this.$route.params.id,
                    nextPage : "/configuration/wh/detail/"+this.$route.params.id,
                    data : this.form
                }
            },
            permissionChecked(d) { // checking permission
                if (d !== '') {
                    this.form.permission = d
                }
            },
            renderData(){ // get data from endpoint
                this.$http.get("/config/warehouse/"+ this.$route.params.id)
                .then(response => {
                    if (response.data !== false) {
                        this.form = response.data.data
                        this.district = response.data.data
                        this.parentWarehouse(response.data.data.parent_id)
                        this.areaSelected(response.data.data.area)
                        this.form.floor_plan_link = response.data.data.bin_info.image_url
                        this.$http.get("/adm/division/filter", {
                            params: {
                                conditions: 'sub_district_id.e:' + this.district.sub_district.id,
                                fields:'sub_district_id,sub_district_name,postal_code,area_name,area_id',
                                groupby:'sub_district_id',
                                polygon: 1
                            }
                        })
                        .then(res => {
                            this.sub_district = res.data.data[0]
                            this.$root.$emit('updateWarehouse', res.data.data[0]) // sending data to component
                        })
                        if (this.form.warehouse_type) { // get data for glossary from detail ID
                            this.$http.get("/config/glossary?conditions=table:warehouse|attribute:warehouse_type|value_int:" + this.form.warehouse_type)
                            .then(res => {
                                this.form.warehouse_type = res.data.data[0].value_name
                                this.warehouse_type = res.data.data[0].id
                            })
                        }
                        if (this.form.hub_processing_time) { // convert time seconds to minutes
                            let service_time = this.$moment.duration({"seconds": this.form.hub_processing_time})
                            this.service_hours = service_time.hours()
                            this.service_minutes = service_time.minutes()
                        }
                    }
                });
            },
            whtypeSelected(d) { // select warehouse type
                this.form.warehouse_type = '';
                this.clearParentWh = true
                if (d && d.value_name != 'HUB') {
                    this.form.hub_processing_time = ''
                    this.form.warehouse_type = d.value_name
                } else {
                    this.form.warehouse_type = d.value_name
                }
            },
            parentWarehouse(d) { // select parent warehouse related
                this.warehouse = ''
                this.form.parent_warehouse = '';
                if (d) {
                    this.warehouse = d
                    this.form.parent_warehouse = d.id
                }
            },
            areaSelected(d) { // select area
                this.area = ''
                this.form.area_id = '';
                if (d) {
                    this.area = d
                    this.form.area_id = d.id;
                }
            }
        },
        mounted() {
            this.renderData()
            let self = this
            this.$root.$on('position', data => { // mounted data dari komponen untuk disimpan pada form
                this.form.latitude = data.lat
                this.form.longitude = data.lng
            })
            this.$root.$on('pickerPosition', data => { // mounted data dari komponen untuk disimpan pada form
                this.form.picker_starting_latitude = data.lat
                this.form.picker_starting_longitude = data.lng
            })
            this.$root.$on('event_error', function(err){
                self.error = err
            });
        },
    }
</script>
