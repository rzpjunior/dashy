<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mb2">
                <v-col cols="12" class="fs16 bold">Basic Info</v-col>
            </v-row>
            <div class="hr-title mx-1 mb30"/>
            <v-row class="mt-2">
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="code"
                        v-model="form.code"
                        label="Outlet Code"
                        outlined
                        disabled
                        dense
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="name"
                        v-model="form.name"
                        label="Outlet Name"
                        outlined
                        disabled
                        dense
                    ></v-text-field>
                </v-col>
            </v-row>
        </div>
        <div class="box">
            <v-row class="mb2">
                <v-col cols="12" class="fs16 bold">Sales Info</v-col>
            </v-row>
            <div class="hr-title mx-1 mb30"/>
            <v-row class="mt-2">
                <v-col cols="12" md="6" class="-mt24">
                    <SelectArchetype 
                        @selected="archetypeSelected" 
                        name="archetype" 
                        :archetype="archetype" 
                        :norequired="true" 
                        :error="error.archetype_id" 
                        disabled
                        :dense="true"
                    ></SelectArchetype>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <selectSalesPerson 
                        @selected="salespersonSelected" 
                        name="salesperson" 
                        :sales_person="salesperson" 
                        required 
                        :error="error.salesperson_id" 
                        disabled 
                        :dense="true"
                    ></selectSalesPerson>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <selectPriceSet 
                        @selected="pricesetSelected" 
                        name="price_set" 
                        :price_set="price_set" 
                        required 
                        :error="error.price_set_id"
                        :dense="true"
                    ></selectPriceSet>
                </v-col>
            </v-row>
        </div>
        <div class="box">
            <v-row class="mb2">
                <v-col cols="12" class="fs16 bold">Shipping Info</v-col>
            </v-row>
            <div class="hr-title mx-1 mb30"/>
            <v-row class="mt-2">
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="branch_pic_name"
                        v-model="form.pic_name"
                        required
                        outlined
                        dense
                        :error-messages="error.branch_pic_name"
                    >
                        <template v-slot:label>
                            PIC Name<span style="color:red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="branch_phone_number"
                        v-model="form.phone_number"
                        required
                        outlined
                        :error-messages="error.phone_number"
                        dense
                    >
                        <template v-slot:label>
                            Phone Number<span style="color:red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="branch_alt_phone_number"
                        v-model="form.alt_phone_number"
                        label="Alt Phone Number"
                        outlined
                        :error="error.branch_alt_phone_number"
                        dense
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="area"
                        v-model="areaValue"
                        required
                        outlined
                        disabled
                        dense
                        :error-messages="error.area_id"
                    >
                        <template v-slot:label>
                            Area<span style="color:red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectProvince
                        name="province"
                        v-model="province"
                        @selected="provinceSelected"
                        :clear="clearProvince"
                        :province="province"
                        required
                        :dense="true"
                        :error-messages="error.province_id"
                    ></SelectProvince>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectCity
                        name="city"
                        v-model="city"
                        @selected="citySelected"
                        :clear="clearCity"
                        :province_id="form.province_id"
                        :city="city"
                        required
                        :dense="true"
                        :disabled="disabled_city"
                        :error-messages="error.city_id"
                    ></SelectCity>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectDistrict
                        name="district"
                        v-model="district"
                        @selected="districtSelected"
                        :province_id="form.province_id"
                        :city_id="form.city_id"
                        :district="district"
                        :clear="clearDistrict"
                        required
                        :dense="true"
                        :disabled="disabled_district"
                        :error-messages="error.district_id"
                    ></SelectDistrict>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectSubDistrict
                        name="sub_district"
                        v-model="sub_district"
                        @selected="subdistrictSelected"
                        :province_id="form.province_id"
                        :city_id="form.city_id"
                        :district_id="form.district_id"
                        :sub_district="sub_district"
                        :clear="clearSub_district"
                        required
                        :dense="true"
                        :disabled="disabled_sub_district"
                        :error="error.sub_district_id"
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
                    <SelectWarehouseCoverage
                        name="warehouse"
                        v-model="default_warehouse"
                        @selected="defaultwarehouseSelected"
                        required
                        :subdistrict_id="form.sub_district_id"
                        :warehouse="default_warehouse"
                        :disabled="disabled_warehouse"
                        :dense="true"
                        :error="error.warehouse_id"
                    ></SelectWarehouseCoverage>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <v-textarea
                        name="shipping_address"
                        v-model="form.shipping_address"
                        maxlength="250"
                        rows="3"
                        dense
                        outlined
                        :error-messages="error.shipping_address"
                    >
                        <template v-slot:label>
                            Shipping Address<span style="color:red">*</span>
                        </template>
                    </v-textarea>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <v-textarea
                        name="branch_note"
                        v-model="form.note"
                        rows="3"
                        outlined
                        dense
                    >
                        <template v-slot:label>Note</template>
                    </v-textarea>
                </v-col>
            </v-row>
        </div>
        <div class="box">
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
                >Save</v-btn>
            </v-card-actions>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
        <LoadingBar :value="loading"/>
    </v-container>
</template>

<script>
    export default {
        data () {
            return {
                loading:true,
                ConfirmData:[],
                selected:[],

                business_type:'',
                finance_area:null,
                invoice_term:'',
                sales_term:'',
                payment_group:'',

                customerTag:null,
                areaValue:null,

                merchant:'',
                archetype:null,
                salesperson:null,
                price_set:null,

                outlet_area:null,

                clearArchetype:false,
                clearSalesperson:false,
                clearPrice_set:false,

                province:null,
                clearProvince:false,
                disabled_province:true,

                city:null,
                clearCity:false,
                disabled_city:true,

                district:null,
                clearDistrict:false,
                disabled_district:true,

                sub_district:null,
                clearSub_district:false,
                disabled_sub_district:true,

                postal_code:'',
                default_warehouse:null,
                disabled_warehouse:true,

                form:{
                    code:'',
                    archetype_id:'',
                    salesperson_id:'',
                    price_set_id:'',
                    pic_name:'',
                    phone_number:'',
                    alt_phone_number:'',
                    shipping_address:'',
                    note:'',
                    province_id:'',
                    area_id:'',
                    sub_district_id:'',
                    warehouse_id:'',
                },
                error:{},
                customer_group_str : '',
                business_type_str : '',
            }
        },
        created() {
            this.renderData()
        },
        mounted () {
            let self = this
            this.$root.$on('event_error', function(err){
                self.error = err
            });
        },
        methods:{
            renderData(){
                this.$http.get("/customer/branch/"+ this.$route.params.id,{
                    params:{
                        embeds:'sub_district_id,sub_district_id.area,sub_district_id.district_id.city_id.province_id'
                    }
                })
                    .then(response => {
                        this.form = response.data.data

                        let prov = response.data.data.sub_district.district.city.province
                        let prov1 = {
                            province_id : prov.id,
                            province_name : prov.name,
                            id : prov.id,
                        }
                        this.provinceSelected(prov1);

                        let city = response.data.data.sub_district.district.city
                        let city1 = {
                            city_id : city.id,
                            city_name : city.name
                        }
                        this.citySelected(city1);

                        let dist = response.data.data.sub_district.district
                        let dist1 = {
                            district_id : dist.id,
                            district_name : dist.name
                        }
                        this.districtSelected(dist1);

                        let subd = response.data.data.sub_district
                        let subd1 = {
                            sub_district_id : subd.id,
                            sub_district_name : subd.name,
                            postal_code : subd.postal_code,
                        }
                        this.subdistrictSelected(subd1);
                        this.areaSelected(response.data.data.sub_district.area)
                        this.defaultwarehouseSelected(this.form.warehouse)

                        this.archetypeSelected(response.data.data.archetype)
                        this.salespersonSelected(response.data.data.salesperson)
                        this.pricesetSelected(response.data.data.price_set)
                        this.loading= false
                    });
            },
            async confirmButton() {
                let putData = {
                    price_set_id: this.form.price_set_id,
                    pic_name: this.form.pic_name,
                    phone_number: this.form.phone_number,
                    alt_phone_number: this.form.alt_phone_number,
                    shipping_address: this.form.shipping_address,
                    note: this.form.note,
                    sub_district_id: this.form.sub_district_id,
                    area_id: this.form.area.id,
                    warehouse_id: this.form.warehouse_id,
                }

                this.ConfirmData = {
                    model : true,
                    title : "Update Outlet",
                    text : "Are you sure want to Update this outlet?",
                    urlApi : "/customer/branch/"+ this.$route.params.id,
                    nextPage : "/customer/branch",
                    data : putData
                }
            },
            archetypeSelected(d) {
                this.archetype = null;
                this.form.archetype_id = '';
                if (d !== '' && d !== undefined) {
                    this.archetype = d;
                    this.form.archetype_id = d.id
                }
            },
            salespersonSelected(d) {
                this.salesperson = null;
                this.form.salesperson_id = '';
                if (d !== '' && d !== undefined) {
                    this.salesperson = d;
                    this.form.salesperson_id = d.id
                }
            },
            pricesetSelected(d) {
                this.price_set = null;
                this.form.price_set_id = '';
                if (d !== '' && d !== undefined) {
                    this.price_set = d;
                    this.form.price_set_id = d.id
                }
            },
            areaSelected(d) {
                this.areaValue = '';
                if (d) {
                    this.areaValue = d.name;
                }
            },
            provinceSelected(d) {
                this.areaValue = '';
                this.form.shipping_area_id = ''
                this.postal_code = null
                this.province = null;
                this.form.province_id = '';

                this.city = null;
                this.form.city_id = '';

                this.clearCity = true;
                this.clearDistrict = true;
                this.clearSub_district =true;
                this.sub_district = null;
                this.form.sub_district_id = '';

                this.disabled_city = true;
                this.disabled_district = true;
                this.disabled_sub_district = true;
                
                this.default_warehouse = null
                if (d) {
                    this.province = d;
                    this.form.province_id = d.province_id

                    this.disabled_city = false
                    this.clearCity = false
                }
            },
            citySelected(d) {
                this.areaValue = '';
                this.form.shipping_area_id = ''
                this.postal_code = null
                this.city = null;
                this.form.city_id = '';

                this.district = null;
                this.form.district_id = '';
                this.clearDistrict = true;

                this.clearSub_district =true;
                this.sub_district = null;
                this.form.sub_district_id = '';

                this.disabled_district = true;
                this.disabled_sub_district = true;

                this.default_warehouse = null
                if (d) {
                    this.city = d;
                    this.form.city_id = d.city_id

                    this.disabled_district = false
                    this.clearDistrict = false
                }
            },
            districtSelected(d) {
                this.areaValue = '';
                this.form.shipping_area_id = ''
                this.postal_code = null
                this.district = null;
                this.form.district_id = '';

                this.sub_district = null;
                this.form.sub_district_id = '';

                this.clearSub_district =true;
                this.disabled_sub_district = true;
                
                this.default_warehouse = null
                if (d) {
                    this.district = d;
                    this.form.district_id = d.district_id

                    this.disabled_sub_district = false
                    this.clearSub_district = false;
                }
            },
            subdistrictSelected(d) {
                this.sub_district = null;
                this.form.sub_district_id = '';
                this.postal_code = null

                this.sub_district = null;
                this.form.sub_district_id = '';

                this.areaValue = '';
                this.form.shipping_area_id = ''
                this.disabled_warehouse = true

                this.default_warehouse = null
                if(d){
                    this.sub_district = d;
                    this.form.sub_district_id = d.sub_district_id
                    this.form.shipping_area_id = d.area_id
                    this.areaValue = d.area_name;
                    this.postal_code = d.postal_code
                    this.disabled_warehouse = false
                        this.$http.get("/config/warehouse/coverage/filter",{params:{
                                perpage:10,
                                embeds:"warehouse,subdistrict,warehouse.area,warehouse.subdistrict",
                                conditions:'main_warehouse:1|sub_district_id.e:'+d.sub_district_id,
                                orderby:'-id',
                            }}).then(response => {
                            this.warehouseCovered = response.data.data[0].warehouse
                            this.defaultwarehouseSelected(this.warehouseCovered)
                        });
                }
            },
            defaultwarehouseSelected(d) {
                this.default_warehouse = null;
                this.form.warehouse_id = '';
                if (d !== '' && d !== undefined) {
                    this.default_warehouse = d;
                    this.form.warehouse_id = d.id
                }
            },
        },
    }
</script>
<style scoped>
    h3 {
        color: #4ABFB2;
    }
</style>