<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mb2">
                <v-col cols="12" class="fs24 bold">Main Outlet</v-col>
                <v-col cols="12" class="fs16 bold">Basic Info</v-col>
            </v-row>
            <div class="hr-title mx-1 mb30"/>
            <v-row class="mt-5">
                <v-col cols="12" md="6" class="-mt24">
                    <SelectArchetype
                        @selected="archetypeSelected"
                        required
                        :customer_group="1"
                        :archetype="archetype"
                        :clear="clearArchetype"
                        :error="error.archetype_id"
                        :aux_data="2"
                        :dense="true"
                    ></SelectArchetype>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="business_type"
                        v-model="business_type_str"
                        label="Business Type*"
                        required
                        outlined
                        dense
                        disabled
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="customer_group"
                        v-model="customer_group_str"
                        required
                        disabled
                        outlined
                        dense
                        label="Customer Group *"
                        :error="error.customer_group_id"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <selectMerchant
                        name="main_outlet"
                        v-if="!showMainOutlet"
                        @selected="merchantSelected"
                        :customerGroup="'1'"
                        required
                        :dense="true"
                        :error="error.merchant_id"
                    ></selectMerchant>
                </v-col>
                <v-col v-if="this.showCheck" cols="12" class="-mt50">
                    <v-checkbox
                        name="create_new_main_outlet"
                        v-model="selected"
                        label="Create New Main Outlet"
                        value="true"
                        @click.native="refreshInput"
                    ></v-checkbox>

                </v-col>
            </v-row>
            <!-- Create New Main Outlet -->
            <v-row v-if="showMainOutlet">
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="merchant_name"
                        v-model="form.merchant_name"
                        required
                        outlined
                        maxlength="50"
                        dense
                        :error-messages="error.merchant_name"
                    >
                        <template v-slot:label>
                            Name<span style="color:red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="merchant_phone_number"
                        v-model="form.merchant_phone_number"
                        required
                        outlined
                        maxlength="15"
                        onkeypress='return event.charCode >= 48 && event.charCode <= 57'
                        dense
                        :error-messages="error.phone_number"
                    >
                        <template v-slot:label>
                            Phone Number<span style="color:red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="merchant_pic_name"
                        v-model="form.merchant_pic_name"
                        required
                        outlined
                        maxlength="30"
                        dense
                        :error-messages="error.pic_name"
                    >
                        <template v-slot:label>
                            PIC Name<span style="color:red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="merchant_alt_phone_number"
                        v-model="form.merchant_alt_phone_number"
                        label="Alternative Phone Number"
                        outlined
                        maxlength="100"
                        onkeypress='return event.charCode >= 48 && event.charCode <= 57'
                        dense
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="email"
                        v-model="form.merchant_email"
                        label="Email"
                        outlined
                        dense
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectCustomerTag
                        name="customer_tag"
                        :norequired="true"
                        :dense="true"
                        v-model="customerTag"
                        :watchCustomerTag="customerTag"
                        @selected="customerTagSelected"
                    ></SelectCustomerTag>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="referrer_by"
                        v-model="form.referrer_code"
                        label="Referrer code"
                        outlined
                        dense
                    ></v-text-field>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <v-textarea
                        name="merchant_note"
                        v-model="form.merchant_note"
                        maxlength="250"
                        :counter="250"
                        rows="3"
                        outlined
                        dense
                    >
                        <template v-slot:label>
                            <div>
                                Note
                            </div>
                        </template>
                    </v-textarea>
                </v-col>
            </v-row>
            <v-row class="mb2" v-if="showMainOutlet">
                <v-col cols="12" class="fs16 bold">Finance Info</v-col>
            </v-row>
            <div class="hr-title mx-1 mb30" v-if="showMainOutlet"/>
            <v-row class="mt-2" v-if="showMainOutlet">
                <v-col cols="12" md="6" class="-mt24">
                    <SelectArea
                        name="area"
                        @selected="areaSelected"
                        required
                        :dense="true"
                        :label="'Finance Area'"
                        :area="area"
                        :aux_data="2"
                        :error="error.finance_area_id"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectSalesTerm
                        name="purchase_payment_term"
                        @selected="salestermSelected"
                        required
                        :dense="true"
                        :label="'Default Payment Term'"
                        :error="error.payment_term_id"
                        :sales_term="sales_term"
                    ></SelectSalesTerm>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectPaymentGroupComb
                        name="sales_invoice_term"
                        @selected="invoicetermSelected"
                        required
                        :dense="true"
                        :disabled="invoice_term_dis"
                        :payment_group="invoice_term"
                        :label="'Default Invoice Term'"
                        :error="error.invoice_term_id"
                        :pt="form.sales_term_id"
                    ></SelectPaymentGroupComb>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
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
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="business_type"
                        required
                        outlined
                        disabled
                        :dense="true"
                        v-model="business_type_credit_limit_str"
                        label="Business Type Credit Limit*"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-switch
                        :true-value="1"
                        :false-value="2"
                        color="#50ABA3"
                        inset
                        class="px-4 -mt1"
                        v-model="form.business_type_credit_limit"
                        @click="switchBusinessTypeCreaditLimit()"
                    ></v-switch>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <v-textarea
                        name="billing_address"
                        v-model="form.billing_address"
                        maxlength="250"
                        outlined
                        rows="3"
                        :error-messages="error.billing_address"
                    >
                        <template v-slot:label>
                            Billing Address<span style="color:red">*</span>
                        </template>
                    </v-textarea>
                </v-col>
            </v-row>
                <!-- Upload Image -->
            <v-row class="mb2" v-if="showMainOutlet">
                <v-col cols="12" class="fs16 bold">Upload Image</v-col>
            </v-row>
            <div class="hr-title mx-1 mb30" v-if="showMainOutlet"/>
            <v-row class="mt-2" v-if="showMainOutlet">
                <v-col cols="12" md="3" class="-mt24">
                    <div class="mb-4">KTP</div>
                    <UploadImage
                        :minWidth="360"
                        :minHeight="180"
                        :maxSize="3000"
                        :forImgName="'ktp'+form.merchant_name"
                        :errorMsg="error.image_url"
                        :type="'merchant'"
                        :extention="'jpeg'"
                        :accept="'image/jpeg,image/jpg'"
                        :notUseLabel="true"
                    ></UploadImage>
                </v-col>
                <v-col cols="12" md="9" class="-mt24">
                    <UploadImageMultiple
                        :name="'outlet'+form.merchant_name"
                        :error="error.images"
                        :dense="true"
                        :type="'merchant'"
                        title="Outlet"
                    />
                </v-col>
            </v-row>
                <!-- Upload Image -->
            <!-- Create New Main Outlet -->
        </div>
        <div class="box">
            <v-row class="mb2">
                <v-col cols="12" class="fs24 bold">Outlet</v-col>
                <v-col cols="12" class="fs16 bold">Basic Info</v-col>
            </v-row>
            <div class="hr-title mx-1 mb30"/>
            <v-row class="mt-2">
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="merchant_name"
                        v-model="form.merchant_name"
                        label="Main Outlet *"
                        outlined
                        disabled
                        dense
                        :error-messages="error.merchant_name"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="branch_name"
                        v-model="form.branch_name"
                        required
                        outlined
                        maxlength="50"
                        dense
                        :error-messages="error.branch_name"
                    >
                        <template v-slot:label>
                            Name<span style="color:red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row class="mb2">
                <v-col cols="12" class="fs16 bold">Sales Info</v-col>
            </v-row>
            <div class="hr-title mx-1 mb30"/>
            <v-row class="mt-2">
               <v-col cols="12" md="6" class="-mt24">
                    <selectSalesPerson 
                        @selected="salespersonSelected" 
                        name="salesperson" 
                        :sales_person="salesperson"
                        required
                        :error="error.salesperson_id" 
                        :dense="true"
                        :clear="clearSalesperson">
                    </selectSalesPerson>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectPriceSet 
                        @selected="pricesetSelected" 
                        name="price_set" 
                        required 
                        :error="error.price_set_id"
                        :dense="true"
                        :clear="clearPrice_set">
                    </SelectPriceSet>
                </v-col>
            </v-row>
            <v-row class="mb2">
                <v-col cols="12" class="fs16 bold">Shipping Info</v-col>
            </v-row>
            <div class="hr-title mx-1 mb30"/>
            <v-row class="mt-2">
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="branch_pic_name"
                        v-model="form.branch_pic_name"
                        required
                        maxlength="20"
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
                        v-model="form.branch_phone_number"
                        required
                        maxlength="15"
                        onkeypress='return event.charCode >= 48 && event.charCode <= 57'
                        outlined
                        :error-messages="error.branch_phone_number"
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
                        v-model="form.branch_alt_phone_number"
                        label="Alt Phone Number"
                        outlined
                        maxlength="100"
                        onkeypress='return event.charCode >= 48 && event.charCode <= 57'
                        :error="error.branch_alt_phone_number"
                        dense
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="area"
                        v-model="form.branch_area_name"
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
                        :dense="true"
                        required
                        :subdistrict_id="form.sub_district_id"
                        :warehouse="default_warehouse"
                        :disabled="disabled_warehouse"
                        :error="error.warehouse_id"
                    ></SelectWarehouseCoverage>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-textarea
                        name="shipping_address"
                        v-model="form.shipping_address"
                        maxlength="350"
                        outlined
                        :error-messages="error.shipping_address"
                        rows="3"
                        class="pt-0 mt-0"
                    >
                        <template v-slot:label>
                            Shipping Address<span style="color:red">*</span>
                        </template>
                    </v-textarea>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-textarea
                        name="branch_note"
                        v-model="form.branch_note"
                        maxlength="250"
                        outlined
                        rows="3"
                        class="pt-0 mt-0"
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
    </v-container>
</template>
<script>
    export default {
        data() {
            return {
                ConfirmData: [],
                permission: [],
                selected: [],
                showCheck: true,

                business_type: '',
                area: {},
                invoice_term: null,
                sales_term: '',
                payment_group: '',

                customerTag: null,
                areaValue: null,

                merchant: '',
                archetype: null,
                salesperson: null,
                price_set: null,
                invoice_term_dis: true,

                outlet_area: null,

                clearArchetype: false,
                clearSalesperson: false,
                clearPrice_set: false,

                province: null,
                clearProvince: false,
                disabled_province: true,

                city: null,
                clearCity: false,
                disabled_city: true,

                district: null,
                clearDistrict: false,
                disabled_district: true,

                sub_district: null,
                clearSub_district: false,
                disabled_sub_district: true,

                postal_code: '',
                default_warehouse: null,
                disabled_warehouse: true,

                form: {
                    // MAIN OUTLET BASIC INFO
                    merchant_id: '',
                    merchant_name: '',
                    merchant_pic_name: '',
                    merchant_phone_number: '',
                    merchant_alt_phone_number: '',
                    merchant_email: '',
                    customer_tag: '',
                    new_merchant_check: '',
                    merchant_note: '',
                    // MAIN OUTLET FINANCE INFO
                    finance_area_id: '',
                    sales_term_id: '',
                    invoice_term_id: '',
                    payment_group_id: '',
                    billing_address: '',
                    // OUTLET BASIC INFO
                    branch_name: '',
                    // OUTLET SALES INFO
                    archetype_id: '',
                    salesperson_id: '',
                    price_set_id: '',
                    // OUTLET SHIPPING INFO
                    branch_pic_name: '',
                    branch_phone_number: '',
                    branch_alt_phone_number: '',
                    shipping_address: '',
                    branch_note: '',
                    branch_area_id: '',
                    province_id: '',
                    city_id: '',
                    district_id: '',
                    sub_district_id: '',
                    warehouse_id: '',
                    business_type_credit_limit: 2,
                },
                error: {},
                customer_group_str: '',
                business_type_str: '',
                upgrade: '',
                business_type_credit_limit_str: 'Personal'
            }
        },
        mounted() {
            let self = this
            this.$root.$on('event_error', function (err) {
                self.error = err
            });
            this.$root.$on('event_uploadImage', function (image) {
                self.form.ktp_photos = [image]
            });
            this.$root.$on("event_multipleImage", function (url) {
                self.form.merchant_photos = url;
            });
        },
        created() {
            let data = this.$store.state.ProspectCustomer
            if (data != null) {
                this.setBefore(data)
            }
        },
        methods: {
            // For set default data
            setBefore(data) {
                let arr = []
                this.$http.get("/customer/prospect_customer/" + data.customer).then(response => {
                    let item = response.data.data;
                    this.selected = ["true"]
                    if (item.merchant) {
                        this.showCheck = false
                        this.upgrade = true
                        this.form = {
                            prospect_customer_id: data.customer,
                            referrer_code: item.referrer_code,
                            reference_info: item.reference_info,
                            archetype_id: data.archetype.id,

                            merchant_id: item.merchant.id,
                            merchant_name: item.merchant.name,
                            merchant_pic_name: item.merchant.pic_name,
                            merchant_email: item.merchant.email,
                            merchant_phone_number: item.merchant.phone_number,
                            merchant_alt_phone_number: item.merchant.alt_phone_number,
                            merchant_note: item.note != undefined ? item.note : item.merchant.note,
                            billing_address: item.billing_address != undefined ? item.billing_address : item.merchant.billing_address,

                            branch_name: item.name,
                            branch_pic_name: item.pic_name,
                            branch_phone_number: item.phone_number,
                            branch_alt_phone_number: item.alt_phone_number,
                            shipping_address: item.street_address,
                            branch_note: item.note,
                        }

                        if (item.merchant.tag_customer) {
                            this.customerTag = []
                            if (item.merchant.tag_customer.includes(",")) {
                                arr = item.merchant.tag_customer.split(',')
                            } else {
                                arr.push(item.merchant.tag_customer)
                            }

                            for (let i = 0; i < arr.length; i++) {
                                this.$http.get("/customer/tag/" + arr[i] * 65536).then(responseTag => {
                                    this.customerTag.push(responseTag.data.data)
                                });
                            }
                        }
                        this.archetypeSelected(item.archetype)
                        this.areaSelected(item.merchant.finance_area)
                        let selected_payment_term = item.payment_term == undefined || item.payment_term.id == 0 ? item.merchant.payment_term : item.payment_term
                        let selected_invoice_term = item.invoice_term == undefined || item.invoice_term.id == 0 ? item.merchant.invoice_term : item.invoice_term
                        this.salestermSelected(selected_payment_term)
                        this.$http.get("/payment/payment_group_comb", {
                            params: {
                                embeds: 'payment_group_sls_id,term_payment_sls_id,term_invoice_sls_id',
                                conditions: 'paymentterm__id.e:' + selected_payment_term.id + '|invoiceterm__id.e:' + selected_invoice_term.id,
                            }
                        }).then(response => {
                            if (response.data.data[0]) {
                                this.invoicetermSelected(response.data.data[0])
                            }
                        });
                    } else {
                        this.showCheck = false
                        this.form = {
                            merchant_name: item.name,
                            merchant_pic_name: item.pic_name,
                            merchant_email: item.email,
                            merchant_phone_number: item.phone_number,
                            merchant_alt_phone_number: item.alt_phone_number,
                            billing_address: item.street_address,
                            prospect_customer_id: data.customer,
                            referrer_code: item.referrer_code,
                            reference_info: item.reference_info,
                            archetype_id: data.archetype.id,

                            branch_name: item.name,
                            branch_pic_name: item.pic_name,
                            branch_phone_number: item.phone_number,
                            branch_alt_phone_number: item.alt_phone_number,
                            shipping_address: item.street_address,
                            branch_note: item.note,
                            business_type_credit_limit: 2,
                        }
                        this.areaSelected(item.sub_district.area)
                        this.archetypeSelected(data.archetype)
                    }
                
                    if(item.salesperson_id > 0 ){
                        this.$http.get("/sales/person", {
                            params: {
                                conditions: 'id.e:' + item.salesperson_id,
                            }
                        }).then(responseSalesperson => {
                            this.salespersonSelected(responseSalesperson.data.data[0])
                        });
                    }

                    let prov = item.sub_district.district.city.province
                    let prov1 = {
                        province_id: prov.id,
                        province_name: prov.name
                    }
                    this.provinceSelected(prov1);
                    let city = item.sub_district.district.city
                    let city1 = {
                        city_id: city.id,
                        city_name: city.name
                    }
                    this.citySelected(city1);
                    let dist = item.sub_district.district
                    let dist1 = {
                        district_id: dist.id,
                        district_name: dist.name
                    }
                    this.districtSelected(dist1);
                    let subd = item.sub_district
                    let subd1 = {
                        sub_district_id: subd.id,
                        sub_district_name: subd.name,
                        postal_code: subd.postal_code,
                        area_id: subd.area.id,
                        area_name: subd.area.name,
                    }
                    this.subdistrictSelected(subd1);
                });
                this.$store.commit('setProspectCustomer', null);
            },
            // For confirm button create branch
            async confirmButton() {
                let id = [];
                if (this.customerTag) {
                    await  this.customerTag.forEach((value) => {
                        id.push(value.id)
                    });
                    this.form.customer_tag = id
                } else {
                    this.form.customer_tag = []
                }
                if (this.upgrade == true) {
                    this.form.new_merchant_check = ''
                } else {
                    this.form.new_merchant_check = this.selected[0]
                }
                this.ConfirmData = {
                    model: true,
                    title: "Create Outlet",
                    text: "Are you sure want to Create this outlet? Outlet name can not be updated afterwards",
                    urlApi: "/customer/branch",
                    nextPage: "/customer/branch",
                    post: true,
                    data: this.form
                }
            },
            // For checked permission checkbox
            permissionChecked(d) {
                if (d !== '') {
                    this.form.permission = d
                }
            },
            // For select customer
            customerTagSelected(d) {
                this.customerTag = null;
                if (d !== '' && d !== undefined) {
                    this.customerTag = d;
                }
            },
            // For select merchant
            merchantSelected(d) {
                this.merchant = null;
                this.form.merchant_id = '';

                this.form.branch_name = ''

                this.clearSalesperson = true
                this.clearPrice_set = true

                this.salesperson = null
                this.form.salesperson_id = ''
                this.price_set = null
                this.price_set_id = ''

                this.form.branch_pic_name = ''
                this.form.branch_phone_number = ''
                this.form.branch_alt_phone_number = ''
                this.form.shipping_address = ''
                this.form.branch_note = ''

                this.areaValue = null
                this.form.branch_area_id = ''
                this.disabled_province = true;
                this.clearProvince = true
                this.disabled_city = true;
                this.clearCity = true
                this.disabled_district = true;
                this.clearDistrict = true
                this.disabled_sub_district = true;
                this.clearSub_district = true
                this.postal_code = ''
                this.disabled_warehouse = true;

                if (d !== '' && d !== undefined) {
                    this.merchant = d;
                    this.form.merchant_id = d.id

                    // if merchant selected
                    this.areaValue = d.finance_area.name
                    this.form.merchant_name = d.name
                    this.form.merchant_pic_name = d.pic_name
                    this.form.merchant_phone_number = d.phone_number
                    this.form.merchant_alt_phone_number = d.alt_phone_number
                    this.form.merchant_email = d.email
                    this.form.customer_tag = d.tag_customer
                    this.form.merchant_note = d.note
                    this.form.finance_area_id = d.finance_area.id
                    this.form.branch_area_id = d.finance_area.id
                    this.form.sales_term_id = d.payment_term.id
                    this.form.invoice_term_id = d.invoice_term.id
                    this.form.billing_address = d.billing_address
                    this.disabled_province = false;
                    this.clearProvince = false
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
                    this.customer_group_str = 'Outlet'
                    this.form.customer_group = 1
                    this.form.business_type = d.business_type.id
                    this.business_type_str = d.business_type.name
                }
            },
            // For select sales person
            salespersonSelected(d) {
                this.salesperson = null;
                this.form.salesperson_id = '';
                if (d !== '' && d !== undefined) {
                    this.salesperson = d;
                    this.form.salesperson_id = d.id
                }
            },
            // For select payment group
            paymentgroupSelected(d) {
                this.payment_group = null;
                this.form.payment_group_id = '';
                if (d !== '' && d !== undefined) {
                    this.payment_group = d;
                    this.form.payment_group_id = d.id
                }
            },
            // For select sales term
            salestermSelected(d) {
                this.sales_term = null;
                this.form.sales_term_id = '';
                this.payment_group = null;
                this.form.payment_group_id = '';
                this.invoice_term = null;
                this.form.invoice_term_id = ''
                this.invoice_term_dis = true
                if (d) {
                    this.invoice_term_dis = false
                    this.sales_term = d;
                    this.form.sales_term_id = d.id
                }
            },
            // For select inovice term
            invoicetermSelected(d) {
                this.payment_group = null;
                this.form.payment_group_id = '';
                this.invoice_term = null;
                this.form.invoice_term_id = ''
                if (d) {
                    this.payment_group = d.payment_group;
                    this.form.payment_group_id = d.payment_group.id
                    this.invoice_term = d
                    this.form.invoice_term_id = d.invoice_term.id
                }
            },
            // For select price set
            pricesetSelected(d) {
                this.price_set = null;
                this.form.price_set_id = '';
                if (d !== '' && d !== undefined) {
                    this.price_set = d;
                    this.form.price_set_id = d.id
                }
            },
            // For select area
            areaSelected(d) {
                this.form.finance_area_id = '';
                this.area = null
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
                this.clearSub_district = true;
                this.sub_district = null;
                this.form.sub_district_id = '';

                this.disabled_city = true;
                this.disabled_district = true;
                this.disabled_sub_district = true;

                this.default_warehouse = null
                this.form.branch_area_name = '';
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
                this.clearDistrict = true;

                this.clearSub_district = true;
                this.sub_district = null;
                this.form.sub_district_id = '';

                this.disabled_district = true;
                this.disabled_sub_district = true;

                this.default_warehouse = null
                this.form.branch_area_name = '';
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

                this.clearSub_district = true;
                this.disabled_sub_district = true;

                this.default_warehouse = null
                this.form.branch_area_name = '';
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

                this.form.branch_area_id = '';
                this.form.shipping_area_id = ''
                this.disabled_warehouse = true
                this.form.branch_area_name = '';

                this.default_warehouse = null;
                this.form.warehouse_id = '';
                if (d) {
                    this.sub_district = d;
                    this.form.sub_district_id = d.sub_district_id
                    this.form.shipping_area_id = d.area_id
                    this.form.branch_area_id = d.area_id;
                    this.form.branch_area_name = d.area_name;
                    this.postal_code = d.postal_code
                    this.disabled_warehouse = false
                    this.$http.get("/config/warehouse/coverage/filter", {
                        params: {
                            perpage: 10,
                            embeds: "warehouse,subdistrict,warehouse.area,warehouse.subdistrict",
                            conditions: 'main_warehouse:1|sub_district_id.e:' + d.sub_district_id,
                            orderby: '-id',
                        }
                    }).then(response => {
                        this.warehouseCovered = response.data.data[0].warehouse
                        this.defaultwarehouseSelected(this.warehouseCovered)
                    });
                }
            },
            // For select default warehouse
            defaultwarehouseSelected(d) {
                this.default_warehouse = null;
                this.form.warehouse_id = '';
                if (d) {
                    this.default_warehouse = d;
                    this.form.warehouse_id = d.id
                }
            },
            // For refresh input
            refreshInput() {
                this.merchant = null
                this.form.merchant_id = ''

                this.areaValue = null
                this.disabled_province = true;
                this.clearProvince = true
                this.disabled_city = true;
                this.clearCity = true
                this.disabled_district = true;
                this.clearDistrict = true
                this.disabled_sub_district = true;
                this.clearSub_district = true
                this.postal_code = ''
                this.disabled_warehouse = true;

                this.form.merchant_name = ''
                this.form.merchant_pic_name = ''
                this.form.merchant_phone_number = ''
                this.form.merchant_alt_phone_number = ''
                this.form.merchant_email = ''
                this.form.customer_tag = ''
                this.form.merchant_note = ''

                this.area = null
                this.form.branch_area_id = ''
                this.sales_term = null
                this.form.sales_term_id = ''
                this.invoice_term = null
                this.form.invoice_term_id = ''
                this.form.billing_address = ''
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
        computed: {
            showMainOutlet() {
                return this.selected.length > 0
            },
        },
        watch: {
            'form.archetype_id': {
                handler: function (val) {
                    this.form.ktp_photos = null
                    this.form.merchant_photos = null
                },
                deep: true
            },
            'selected': {
                handler: function (val) {
                    this.form.ktp_photos = null
                    this.form.merchant_photos = null
                },
                deep: true
            },
        }
    }
</script>
