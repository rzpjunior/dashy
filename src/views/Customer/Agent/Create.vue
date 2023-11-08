<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mb2">
                <v-col cols="12" class="fs16 bold">Basic Info</v-col>
            </v-row>
            <div class="hr-title mx-1 mb30"/>
            <v-row class="mt-5">
                <v-col cols="12" md="6" class="-mt24">
                    <SelectArchetype
                        name="archetype_name"
                        v-model="archetype"
                        @selected="archetypeSelected"
                        required
                        :dense="true"
                        :customer_group="2"
                        :archetype ="archetype"
                        :aux_data="2"
                        :error="error.archetype_id"
                    ></SelectArchetype>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="business_type"
                        v-model="business_type_str"
                        required
                        disabled
                        outlined
                        dense
                        label="Business Type *"
                        :error-messages="error.business_type_id"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="mtn24">
                    <v-text-field
                        name="customer_group"
                        v-model="customer_group_str"
                        required
                        disabled
                        dense
                        outlined
                        label="Customer Group *"
                        :error-messages="error.customer_group"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="mtn24">
                    <v-text-field
                        name="merchant_name"
                        v-model="form.name"
                        maxlength="50"
                        required
                        outlined
                        dense
                        :error-messages="error.name"
                    >
                        <template v-slot:label>
                            Name<span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="mtn24">
                    <v-text-field
                        name="merchant_pic_name"
                        v-model="form.pic_name"
                        maxlength="30"
                        required
                        outlined
                        dense
                        :error-messages="error.pic_name"
                    >
                        <template v-slot:label>
                            PIC Name<span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="mtn24">
                    <v-text-field
                        name="merchant_phone_number"
                        v-model="form.phone_number"
                        maxlength="15"
                        dense
                        required
                        onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                        outlined
                        :error-messages="error.phone_number"
                    >
                        <template v-slot:label>
                            Phone Number<span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="mtn24">
                    <v-text-field
                        name="merchant_alt_phone_number"
                        v-model="form.alt_phone_number"
                        maxlength="100"
                        onkeypress="return (event.charCode >= 48 && event.charCode <= 57) || event.charCode === 32"
                        label="Alternative Phone Number"
                        outlined
                        dense
                        :error-messages="error.alt_phone_number"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="mtn24">
                    <v-text-field
                        name="email"
                        v-model="form.email"
                        label="Email"
                        :rules="val_email"
                        outlined
                        dense
                        :error-messages="error.email"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="mtn24">
                    <SelectCustomerTag
                        name="customer_tag"
                        v-model="customerTag"
                        :dense="true"
                        :norequired="true"
                        :watchCustomerTag="customerTag"
                        @selected="customerTagSelected"
                        :error="error.customer_tag"
                    ></SelectCustomerTag>
                </v-col>
                <v-col cols="12" md="6" class="mtn24">
                    <v-text-field
                        name="referrer_code"
                        v-model="form.referrer_code"
                        label="Referrer Code"
                        outlined
                        dense
                        :error-messages="error.referrer_code"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" class="mtn24">
                    <v-textarea
                        name="merchant_note"
                        v-model="form.note"
                        :counter="250"
                        maxlength="250"
                        outlined
                        label="Note"
                        dense
                        rows="3"
                    />
                </v-col>
            </v-row>
        </div>
        <div class="box">
            <v-row class="mb2">
                <v-col cols="12" class="fs16 bold">Finance Info</v-col>
            </v-row>
            <div class="hr-title mx-1 mb30"/>
            <v-row class="mt-5">
                <v-col cols="12" md="6" class="-mt24">
                    <SelectArea
                        name="area"
                        @selected="areaSelected"
                        required
                        :label="'Finance Area'"
                        :aux_data="2"
                        :dense="true"
                        :error="error.finance_area_id"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectSalesTerm
                        name="purchase_payment_term"
                        @selected="salestermSelected"
                        required
                        :label="'Default Payment Term'"
                        :dense="true"
                        :error="error.term_payment_sls_id"
                        :sales_term="sales_term"
                    ></SelectSalesTerm>
                </v-col>
                <v-col cols="12" md="6" class="mtn24">
                    <SelectPaymentGroupComb
                        name="sales_invoice_term"
                        @selected="invoicetermSelected"
                        required
                        :dense="true"
                        :disabled="invoice_term_dis"
                        :payment_group="invoice_term"
                        :label="'Default Invoice Term'"
                        :error="error.term_invoice_sls_id"
                        :pt="form.term_payment_sls_id"
                    ></SelectPaymentGroupComb>
                </v-col>
                <v-col cols="12" md="6" class="mtn24">
                    <SelectPaymentGroup
                        name="payment_group"
                        @selected="paymentgroupSelected"
                        required
                        :dense="true"
                        :disabled="true"
                        :payment_group="payment_group"
                        :error="error.payment_group_id"
                    ></SelectPaymentGroup>
                </v-col>
                <v-col cols="10" md="5" class="mtn24">
                    <v-text-field
                        name="business_type"
                        required
                        outlined
                        disabled
                        dense
                        label="Business Type Credit Limit*"
                        v-model="business_type_credit_limit_str"
                    >
                    </v-text-field>
                </v-col>
                <v-col cols="2" md="1">
                    <v-switch
                        :true-value="1"
                        :false-value="2"
                        color="#50ABA3"
                        inset
                        dense
                        class="px-4 -mt20"
                        v-model="form.business_type_credit_limit"
                        @click="switchBusinessTypeCreaditLimit()"
                    >
                    </v-switch>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="-mt24">
                    <v-textarea
                        name="billing_address"
                        v-model="form.billing_address"
                        :counter="250"
                        maxlength="250"
                        outlined
                        :error-messages="error.billing_address"
                        required
                        dense
                        rows="3"
                    >
                        <template v-slot:label>
                            Billing Address<span class="text-red">*</span>
                        </template>
                    </v-textarea>
                </v-col>
            </v-row>
        </div>
        <div class="box">
            <v-row class="mb2">
                <v-col cols="12" class="fs16 bold">Sales Info</v-col>
            </v-row>
            <div class="hr-title mx-1 mb30"/>
            <v-row class="mt-5">
                <v-col cols="12" md="6" class="mtn24">
                    <SelectSalesPerson
                        name="salesperson"
                        v-model="salesperson"
                        :sales_person="salesperson"
                        @selected="salespersonSelected"
                        required
                        :dense="true"
                        :error="error.salesperson_id"
                    ></SelectSalesPerson>
                </v-col>
            </v-row>
            <div>
                <v-col cols="12" class="fs16 bold">Price Set per Area</v-col>
            </div>
            <v-row class="second-color mt10 mx6">
                <v-col>
                    <div v-for="(item, idx) in allArea" :key="idx">
                        <v-row v-if="idx%2==0">
                            <v-col cols="12" class="-mt24">
                                <div class="mb10 mx6">
                                    {{item.name}}
                                </div>
                                <SelectPriceSet
                                    v-model="price_set_area[idx].price_set"
                                    name="price_set"
                                    :dense="true"
                                    :idx="idx"
                                    @deleted="pricesetDeleted"
                                    @selected="pricesetSelected"
                                    v-on:click.native="setIdx(idx)"
                                    :price_set="price_set"
                                    required
                                    :error="err(idx)"
                                ></SelectPriceSet>
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
                <v-col>
                    <div v-for="(item, idx) in allArea" :key="idx">
                        <v-row v-if="idx%2!==0">
                            <v-col cols="12" class="-mt24">
                                <div class="mb10 mx6">
                                    {{item.name}}
                                </div>
                                <SelectPriceSet
                                    v-model="price_set_area[idx].price_set"
                                    name="price_set"
                                    :idx="idx"
                                    :dense="true"
                                    @deleted="pricesetDeleted"
                                    @selected="pricesetSelected"
                                    :price_set="price_set"
                                    v-on:click.native="setIdx(idx)"
                                    required
                                    :error="err(idx)"
                                ></SelectPriceSet>
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
            </v-row>
        </div>
        <div class="box">
            <v-row class="mb2">
                <v-col cols="12" class="fs16 bold">Shipping Info</v-col>
            </v-row>
            <div class="hr-title mx-1 mb30"/>
            <v-row class="mt-5">
                <v-col cols="12" md="6" class="-mt24">
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
                            Recipient Name<span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="recipient_phone"
                        v-model="form.recipient_phone_number"
                        required
                        dense
                        outlined
                        onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                        maxlength="15"
                        max
                        :error-messages="error.recipient_phone_number"
                    >
                        <template v-slot:label>
                            Recipient Phone Number<span class="text-red">*</span>
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
                        :error-messages="error.shipping_area_id"
                    >
                        <template v-slot:label>
                            Area<span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="mtn24">
                    <SelectProvince
                        name="province"
                        v-model="province"
                        @selected="provinceSelected"
                        :clear="clearProvince"
                        :province="province"
                        :dense="true"
                        required
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
                        :city="city"
                        :dense="true"
                        required
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
                        :district="district"
                        :dense="true"
                        required
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
                        :sub_district="sub_district"
                        :dense="true"
                        required
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
                            Postal Code<span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="0" md="12" class="mtn24"></v-col>
                <v-col cols="12" md="6" class="mtn24">
                    <v-textarea
                        name="shipping_address"
                        v-model="form.shipping_address"
                        :counter="250"
                        maxlength="250"
                        outlined
                        dense
                        required
                        :error-messages="error.shipping_address"
                    >
                        <template v-slot:label>
                            Shipping Address<span class="text-red">*</span>
                        </template>
                    </v-textarea>
                </v-col>
                <v-col cols="12" md="6" class="mtn24">
                    <v-textarea
                        name="branch_note"
                        v-model="form.shipping_note"
                        dense
                        :counter="250"
                        label="Note"
                        maxlength="250"
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
        name: 'CreateAgent',
        data () {
            return {
                permission:[],
                price_set:'',
                area:{},
                areaValue:'',
                archetype:'',
                salesperson:'',
                invoice_term:'',
                payment_group:'',
                sales_term:'',
                customerTag:null,

                invoice_term_dis:true,
                sales_term_dis:true,

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

                business_type:{
                    name:'',
                },
                form:{
                    archetype_id:'',
                    business_type_id:'',
                    customer_group : "",
                    name: '',
                    pic_name : '',
                    phone_number : '',
                    alt_phone_number:'',
                    email:'',
                    tag_customer:[],
                    referrer_code:'',
                    note:'',
                    business_type_credit_limit: 2,
                    finance_area_id:'',
                    term_invoice_sls_id:'',
                    term_payment_sls_id:'',
                    payment_group_id:'',
                    billing_address:'',

                    salesperson_id:'',

                    recipient_name:'',
                    recipient_phone_number :'',
                    recipient_alt_phone_number :'',
                    shipping_address :'',
                    shipping_note :'',

                    price_set_area : [],

                    shipping_area_id:'',
                    province_id:'',
                    city_id:'',
                    district_id:'',
                    sub_district_id:'',
                },
                error:{},
                ConfirmData : {},
                allArea : [],
                idxPriceSet : '',
                customer_group_str : '',
                business_type_str : '',
                price_set_area : [{price_set : ''}],
                clear : true,
                business_type_credit_limit_str: 'Personal',
            }
        },
        mounted () {
            let self = this
            this.$root.$on('event_error', function(err){
                self.error = err
            });
        },
        created() {
            this.getArea()
            let data = this.$store.state.ProspectCustomer
            if (data != null) {
                this.setBefore(data)
            }
        },
        methods:{
            // For set default data
            setBefore(data) {
                this.$http.get("/customer/prospect_customer/" + data.customer).then(response => {
                    let item = response.data.data;
                    this.form = {
                        prospect_customer_id : data.customer,
                        archetype_id:'',
                        business_type_id:'',
                        business_type_credit_limit: 2,
                        customer_group : "",
                        name: item.name,
                        pic_name : item.pic_name,
                        phone_number : item.phone_number,
                        alt_phone_number:item.alt_phone_number,
                        email:item.email,
                        tag_customer:[],
                        note:'',

                        referrer_code:item.referrer_code,
                        reference_info:item.reference_info,

                        finance_area_id:'',
                        term_invoice_sls_id:'',
                        term_payment_sls_id:'',
                        payment_group_id:'',
                        billing_address:item.street_address,

                        salesperson_id:'',

                        recipient_name:item.pic_name,
                        recipient_phone_number :item.phone_number,
                        recipient_alt_phone_number :item.alt_phone_number,
                        shipping_address :item.street_address,
                        shipping_note :'',

                        price_set_area : [],

                        shipping_area_id:'',
                        province_id:'',
                        city_id:'',
                        district_id:'',
                        sub_district_id:'',
                    }
                    this.$http.get("/config/area/filter",{params:{
                            conditions:'status:1|aux_data:2'
                        }}).then(response => {
                        this.allArea = response.data.data
                        this.form.price_set_area = []
                        for (let i = 0; i < this.allArea.length; i++) {
                            this.form.price_set_area.push({
                                    "price_set_id": "",
                                    "area_id":this.allArea[i].id
                                });

                        }
                    });

                    if(item.salesperson_id > 0){
                        this.$http.get("/sales/person", {
                            params: {
                                conditions: 'id.e:' + item.salesperson_id,
                            }
                        }).then(responseSalesperson => {
                            this.salespersonSelected(responseSalesperson.data.data[0])
                        });
                    }
                    
                    this.archetypeSelected(data.archetype)
                    this.areaSelected(item.sub_district.area)
                    let prov = item.sub_district.district.city.province
                        let prov1 = {
                            province_id : prov.id,
                            province_name : prov.name
                        }
                        this.provinceSelected(prov1);
                        let city = item.sub_district.district.city
                        let city1 = {
                            city_id : city.id,
                            city_name : city.name
                        }
                        this.citySelected(city1);
                        let dist = item.sub_district.district
                        let dist1 = {
                            district_id : dist.id,
                            district_name : dist.name
                        }
                        this.districtSelected(dist1);
                        let subd = item.sub_district
                        let subd1 = {
                            sub_district_id : subd.id,
                            sub_district_name : subd.name,
                            postal_code : subd.postal_code,
                            area_id : subd.area.id,
                            area_name : subd.area.name,
                        }
                        this.subdistrictSelected(subd1);
                })
                this.$store.commit('setProspectCustomer', null);
            },
            // For handle error
            err(idx) {
                for (var key in this.error) {
                    if (key=='price_set_area'+idx) {
                        return this.error[key]
                    }
                }
            },
            // For submit button create
            confirmButton() {
                if (this.form.prospect_customer_id) {
                    this.ConfirmData = {
                        model : true,
                        title : "Create Agent",
                        text : "Are you sure want to create this Agent?",
                        urlApi : "/customer/agent",
                        nextPage : "/customer/prospect-customer",
                        post : true,
                        data : this.form
                    }
                } else {   
                    this.ConfirmData = {
                        model : true,
                        title : "Create Agent",
                        text : "Are you sure want to create this Agent?",
                        urlApi : "/customer/agent",
                        nextPage : "/customer/agent/detail/:id",
                        post : true,
                        data : this.form
                    }
                }
            },
            // For get area
            getArea() {
                this.$http.get("/config/area/filter",{params:{
                        conditions:'status:1|aux_data:2'
                    }}).then(response => {
                    this.allArea = response.data.data
                    this.form.price_set_area = []
                    for (let i = 0; i < this.allArea.length; i++) {
                        this.form.price_set_area.push({
                                "price_set_id": "",
                                "area_id":this.allArea[i].id
                            });
                            this.price_set_area.push({
                                "price_set": ""
                            });

                    }
                });
            },
            // For select business type
            BusinessTypeSelected(d) {
                this.business_type = null;
                this.form.business_type_id = ''
                if (d !== '' && d !== undefined) {
                    this.business_type = d
                    this.form.business_type_id = d.id
                }
            },
            // For select archetype
            archetypeSelected(d) {
                this.customer_group_str = ''
                this.business_type_str = ''
                this.archetype = null;
                this.form.archetype_id = '';
                if (d) {
                    this.archetype = d;
                    this.form.archetype_id = d.id
                    this.customer_group_str = 'Agent'
                    this.form.customer_group = "2"
                    this.form.business_type_id = d.business_type.id
                    this.business_type_str = d.business_type.name
                }
            },
            // For select sales person
            salespersonSelected(d) {
                this.salesperson = null;
                this.form.salesperson_id = '';
                if (d) {
                    this.salesperson = d;
                    this.form.salesperson_id = d.id
                }
            },
            // For select customer tag
            customerTagSelected(d) {
                this.customerTag = null;
                let arr = []
                if (d) {
                    this.customerTag = d;
                    for (let i = 0; i < d.length; i++) {
                        arr.push(d[i].id);
                    }
                }
                this.form.tag_customer = arr
            },
            // For select sales term
            salestermSelected(d) {
                this.sales_term = null;
                this.form.term_payment_sls_id = '';
                this.payment_group = null;
                this.form.payment_group_id = '';
                this.invoice_term = null;
                this.form.term_invoice_sls_id = ''
                this.invoice_term_dis = true
                if (d) {
                    this.invoice_term_dis = false
                    this.sales_term = d;
                    this.form.term_payment_sls_id = d.id
                }
            },
            // For select invoice term
            invoicetermSelected(d){
                this.payment_group = null;
                this.form.payment_group_id = '';
                this.invoice_term = null;
                this.form.term_invoice_sls_id = ''
                if (d) {
                    this.payment_group = d.payment_group;
                    this.form.payment_group_id = d.payment_group.id
                    this.invoice_term = d
                    this.form.term_invoice_sls_id = d.invoice_term.id
                }
            },
            // For select payment group
            paymentgroupSelected(d){
                this.payment_group = null;
                this.form.payment_group_id = '';
                if (d) {
                    this.payment_group = d;
                    this.form.payment_group_id = d.id
                }
            },
            // For set index
            setIdx(id) {
                this.idxPriceSet = id
            },
            // For delete price set
            pricesetDeleted(idx){
                this.idxPriceSet = idx
                this.form.price_set_area[idx].price_set_id = '';
            },
            // For select price set
            pricesetSelected(d) {
                this.price_set_area[this.idxPriceSet].price_set = null;
                if (d) {
                    this.price_set_area[this.idxPriceSet].price_set = d;
                    this.form.price_set_area[this.idxPriceSet].price_set_id = d.id;
                }
            },
            // For select area
            areaSelected(d) {
                this.form.finance_area_id = '';
                this.area = ''
                if (d) {
                    this.area = d
                    this.form.finance_area_id = d.id;
                }
            },
            // For select province
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
            // For select city
            citySelected(d) {
                this.areaValue = '';
                this.form.shipping_area_id = ''
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
            // For select district
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
                if (d) {
                    this.district = d;
                    this.form.district_id = d.district_id

                    this.disabled_sub_district = false
                    this.clearSub_district = false;
                }
            },
            // For select subdistrict
            subdistrictSelected(d) {
                this.sub_district = null;
                this.form.sub_district_id = '';
                this.postal_code = null

                this.sub_district = null;
                this.form.sub_district_id = '';

                this.areaValue = '';
                this.form.shipping_area_id = ''
                if (d) {
                    this.form.shipping_area_id = d.area_id
                    this.areaValue = d.area_name;
                    this.sub_district = d;
                    this.form.sub_district_id = d.sub_district_id
                    this.postal_code = d.postal_code
                }
            },
            // For select warehouse
            warehouseSelected(d) {
                this.warehouse = null;
                this.form.warehouse_id = '';
                if (d !== ''  && d !== undefined) {
                    this.warehouse = d;
                    this.form.warehouse_id = d.id
                }
            },
            // For change value business type credit limit
            switchBusinessTypeCreaditLimit() {
                if(this.form.business_type_credit_limit === 1) {
                    this.business_type_credit_limit_str = "Badan Usaha"
                } else {
                    this.business_type_credit_limit_str = "Personal"
                }
            }
        },
    }
</script>
