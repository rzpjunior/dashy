<template>
    <v-container fill-height class="main-container">
        <v-breadcrumbs :items="breadcrumbs" class="box-breadcrumbs">
            <v-breadcrumbs-item
                slot="item"
                slot-scope="{ item }"
                exact
                v-if="item.to"
                :to="item.to">
                {{ item.text }}
            </v-breadcrumbs-item>
            <v-breadcrumbs-item
                style="color:#9C9C9C"
                v-else>
                {{ item.text }}
            </v-breadcrumbs-item>
        </v-breadcrumbs>
        <div class="box">
            <v-row class="mt-5"> 
                <v-col cols="12" md="6" class="mtn24">
                    <v-text-field
                        name="code"
                        v-model="forms.code"
                        required
                        outlined
                        dense
                        disabled
                    >
                        <template v-slot:label>
                            Code
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="mtn24">
                    <v-text-field
                        name="name"
                        v-model="forms.name"
                        required
                        outlined
                        dense
                        disabled
                    >
                        <template v-slot:label>
                            Name
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="mtn24">
                    <SelectArea
                        name="area"
                        @selected="areaSelected"
                        required
                        :label="'Finance Area'"
                        :dense="true"
                        :area="area"
                        disabled
                        :error="error.finance_area_id"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="6" class="mtn24">
                    <v-text-field
                        name="recipient_name"
                        v-model="form.recipient_name"
                        maxlength="20"
                        dense
                        required
                        outlined
                        :error-messages="error.recipient_name"
                    >
                        <template v-slot:label>
                            Recipient Name<span style="color:red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="mtn24">
                    <v-text-field
                        name="recipient_phone"
                        v-model="form.recipient_phone_number"
                        required
                        dense
                        outlined
                        onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                        maxlength="15"
                        :error-messages="error.recipient_phone_number"
                    >
                        <template v-slot:label>
                            Recipient Phone Number<span style="color:red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="mtn24">
                    <v-text-field
                        name="recipient_alt_phone_number"
                        v-model="form.recipient_alt_phone_number"
                        label="Recipient Alternative Phone Number"
                        outlined
                        onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                        maxlength="15"
                        dense
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="mtn24">
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
                <v-col cols="12" md="6" class="mtn24">
                    <SelectProvince
                        name="province"
                        v-model="province"
                        @selected="provinceSelected"
                        :clear="clearProvince"
                        :dense="true"
                        required
                        :province="province"
                        :error-messages="error.province_id"
                    ></SelectProvince>
                </v-col>
                <v-col cols="12" md="6" class="mtn24">
                    <SelectCity
                        name="city"
                        v-model="city"
                        @selected="citySelected"
                        :clear="clearCity"
                        :province_id="form.province_id"
                        :dense="true"
                        required
                        :city="city"
                        :disabled="disabled_city"
                        :error-messages="error.city_id"
                    ></SelectCity>
                </v-col>
                <v-col cols="12" md="6" class="mtn24">
                    <SelectDistrict
                        name="district"
                        v-model="district"
                        @selected="districtSelected"
                        :province_id="form.province_id"
                        :city_id="form.city_id"
                        :clear="clearDistrict"
                        :dense="true"
                        required
                        :district="district"
                        :disabled="disabled_district"
                        :error-messages="error.district_id"
                    ></SelectDistrict>
                </v-col>
                <v-col cols="12" md="6" class="mtn24">
                    <SelectSubDistrict
                        name="sub_district"
                        v-model="sub_district"
                        @selected="subdistrictSelected"
                        :province_id="form.province_id"
                        :city_id="form.city_id"
                        :district_id="form.district_id"
                        :clear="clearSub_district"
                        :dense="true"
                        required
                        :sub_district="sub_district"
                        :disabled="disabled_sub_district"
                        :error="error.sub_district_id"
                    ></SelectSubDistrict>
                </v-col>
                <v-col cols="12" md="6" class="mtn24">
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
                <v-col cols="12" md="6" class="mtn24">
                    <v-textarea
                        name="shipping_address"
                        v-model="form.shipping_address"
                        :counter="350"
                        maxlength="350"
                        rows="3"
                        outlined
                        dense
                        required
                        :error-messages="error.shipping_address"
                    >
                        <template v-slot:label>
                            Shipping Address<span style="color:red">*</span>
                        </template>
                    </v-textarea>
                </v-col>
                <v-col cols="12" md="6" class="mtn24">
                    <v-textarea
                        name="branch_note"
                        v-model="form.shipping_note"
                        dense
                        :counter="100"
                        rows="3"
                        label="Note"
                        maxlength="100"
                        outlined
                        :error-messages="error.shipping_note"
                    ></v-textarea>
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
    </v-container>
</template>
<script>
    export default {
        name: 'ShippingAddressUpdate',
        data () {
            return {
                ConfirmData : {},
                area:{},
                areaValue:'',
                postal_code:'',

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

                warehouse:null,
                clearWarehouse:false,
                disabled_warehouse:true,
                forms:{
                    merchant : {
                        business_type:{
                            id:""
                        }
                    }
                },
                form:{
                    recipient_name:"",
                    recipient_phone_number:"",
                    recipient_alt_phone_number:"",
                    shipping_address:"",
                    shipping_note:"",
                    merchant_id:"",
                    archetype_id:"",
                    price_set_id:"",
                    salesperson_id:"",
                    area_id:"",
                    sub_district_id:"",
                    warehouse_id:""
                },
                error:{},
                breadcrumbs : [
                    {
                        text: 'Agent List',
                        to : '/customer/agent'
                    },
                    {
                        text: 'Agent Detail',
                        to : ''
                    },
                    {
                        text: 'Update Shipping Address',
                    },
                ],
            }
        },
        mounted () {
            let self = this
            this.$root.$on('event_error', function(err){
                self.error = err
            });
        },
        methods:{
            confirmButton() {
                this.ConfirmData = {
                    model : true,
                    title : "Update Shipping Address",
                    text : "Are you sure want to update this Shipping Address?",
                    urlApi : "/customer/agent/shipping/address/"+this.$route.params.id,
                    nextPage : "/customer/agent/detail/"+this.forms.merchant.id,
                    data : this.form
                }
            },
            renderData(){
                this.$http.get("/customer/agent/shipping/address/"+this.$route.params.id).then(response => {
                    this.forms = response.data.data
                    this.breadcrumbs[1].to = '/customer/agent/detail/'+this.forms.merchant.id
                    this.form={
                        recipient_name:this.forms.pic_name,
                        recipient_phone_number:this.forms.phone_number,
                        recipient_alt_phone_number:this.forms.alt_phone_number,
                        shipping_address:this.forms.shipping_address,
                        shipping_note:this.forms.note,
                        area_id:"",
                        sub_district_id:""
                    }
                    this.areaSelected(response.data.data.merchant.finance_area);
                    let prov = response.data.data.sub_district.district.city.province
                    let prov1 = {
                        province_id : prov.id,
                        province_name : prov.name
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
                        area_id : subd.area.id,
                        area_name : subd.area.name,
                    }
                    this.subdistrictSelected(subd1);
                });
            },
            areaSelected(d) {
                this.area = null;
                if (d) {
                    this.area = d;
                }
            },
            provinceSelected(d) {
                this.areaValue = '';
                this.form.area_id = ''
                this.postal_code = null
                this.province = null;
                this.form.province_id = '';

                this.city = null;
                this.form.city_id = '';

                this.clearCity = true;
                this.clearDistrict = true;
                this.clearSub_district =true;

                this.disabled_city = true;
                this.disabled_district = true;
                this.disabled_sub_district = true;
                if (d) {
                    this.province = d;
                    this.form.province_id = d.province_id

                    this.disabled_city = false
                    this.clearCity = false
                }
            },
            citySelected(d) {
                this.areaValue = '';
                this.form.area_id = ''
                this.postal_code = null
                this.city = null;
                this.form.city_id = '';

                this.district = null;
                this.form.district_id = '';

                this.clearDistrict = true
                this.clearSub_district =true;

                this.disabled_district = true;
                this.disabled_sub_district = true;
                if (d) {
                    this.city = d;
                    this.form.city_id = d.city_id

                    this.disabled_district = false
                    this.clearDistrict = false
                }
            },
            districtSelected(d) {
                this.areaValue = '';
                this.form.area_id = ''
                this.postal_code = null
                this.district = null;
                this.form.district_id = '';

                this.sub_district = null;
                this.form.sub_district_id = '';

                this.clearSub_district =true;
                this.disabled_sub_district = true;
                if (d) {
                    this.district = d;
                    this.form.district_id = d.district_id

                    this.disabled_sub_district = false
                    this.clearSub_district = false;
                }
            },
            subdistrictSelected(d) {
                this.areaValue = '';
                this.form.area_id = ''
                this.sub_district = null;
                this.form.sub_district_id = '';
                this.postal_code = null

                this.sub_district = null;
                this.form.sub_district_id = '';

                if (d) {
                    this.form.area_id = d.area_id
                    this.areaValue = d.area_name;
                    this.sub_district = d;
                    this.form.sub_district_id = d.sub_district_id
                    this.postal_code = d.postal_code
                }
            },
            warehouseSelected(d) {
                this.warehouse = null;
                this.form.warehouse_id = '';
                if (d !== ''  && d !== undefined) {
                    this.warehouse = d;
                    this.form.warehouse_id = d.id
                }
            },
        },
        created(){
            this.renderData()
        },
    }
</script>
