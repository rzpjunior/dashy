<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <form>
                <v-row class="mb2">
                    <v-col class="fs16 bold">Basic Info</v-col>
                </v-row>
                <div class="hr-title mx-1"/>
                <v-row class="mt-10">
                    <v-col cols="12" md="6" class="-mt24">
                        <v-text-field
                            v-model="business_type_name"
                            label="Business Type*"
                            outlined
                            dense
                            disabled
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" class="-mt24">
                        <v-text-field
                            name="code"
                            v-model="form.code"
                            label="Code*"
                            outlined
                            dense
                            disabled
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" class="-mt24">
                        <v-text-field
                            name="name"
                            v-model="form.name"
                            label="Name*"
                            outlined
                            dense
                            disabled
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" class="-mt24">
                        <v-text-field
                            name="pic_name"
                            v-model="form.pic_name"
                            maxlength="20"
                            label="PIC Name*"
                            required
                            outlined
                            dense
                            :error-messages="error.pic_name"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" class="-mt24">
                        <v-text-field
                            name="phone_number"
                            v-model="form.phone_number"
                            label="Phone Number*"
                            outlined
                            dense
                            disabled
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" class="-mt24">
                        <v-text-field
                            name="alt_phone_number"
                            v-model="form.alt_phone_number"
                            maxlength="100"
                            label="Alternative Phone Number*"
                            required
                            outlined
                            dense
                            :error-messages="error.name"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" class="-mt24">
                        <v-text-field
                            name="email"
                            v-model="form.email"
                            label="Email"
                            outlined
                            dense
                            :error-messages="error.email"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" class="-mt24">
                        <v-text-field
                            name="customer_tag"
                            v-model="form.tag_customer_name"
                            label="Customer Tag"
                            outlined
                            dense
                            disabled
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" class="-mt24">
                        <v-text-field
                            name="referral_code"
                            v-model="form.referral_code"
                            label="Referral Code"
                            outlined
                            dense
                            disabled
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" class="-mt24">
                        <v-text-field
                            name="referred_code"
                            v-model="form.referrer_code"
                            label="Referrer Code"
                            outlined
                            dense
                            disabled
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" class="-mt24">
                        <v-text-field
                            name="referred_by"
                            v-model="form.referrer_name"
                            label="Refferer Name"
                            outlined
                            dense
                            disabled
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="-mt24">
                        <v-textarea
                                name="note"
                                v-model="form.note"
                                maxlength="250"
                                outlined
                                dense
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
                <v-row class="mb2">
                    <v-col class="fs16 bold">Finance Info</v-col>
                </v-row>
                <div class="hr-title mx-1"/>
                <v-row class="mt-10">
                    <v-col cols="12" md="6" class="-mt24">
                        <SelectArea
                            name="area"
                            @selected="areaSelected"
                            required
                            :label="'Finance Area'"
                            :area="finance_area"
                            :aux_data="2"
                            :error="error.finance_area_id"
                            :disabled="true"
                            :dense="true"
                        ></SelectArea>
                    </v-col>
                    <v-col cols="12" md="6" class="-mt24">
                        <SelectSalesTerm
                            name="purchase_payment_term"
                            @selected="salestermSelected"
                            required
                            :label="'Default Payment Term'"
                            :error="error.term_payment_sls_id"
                            :sales_term="sales_term"
                            :dense="true"
                        ></SelectSalesTerm>
                    </v-col>
                    <v-col cols="12" md="6" class="-mt24">
                        <SelectPaymentGroupComb
                            name="sales_invoice_term"
                            @selected="invoicetermSelected"
                            required
                            :disabled="invoice_term_dis"
                            :payment_group="invoice_term"
                            :label="'Default Invoice Term'"
                            :error="error.term_invoice_sls_id"
                            :pt="form.term_payment_sls_id"
                            :dense="true"
                        ></SelectPaymentGroupComb>
                    </v-col>
                    <v-col cols="12" md="6" class="-mt24">
                        <SelectPaymentGroup
                            name="payment_group"
                            required
                            :disabled="true"
                            :payment_group="payment_group"
                            :error="error.payment_group_id"
                            :dense="true"
                        ></SelectPaymentGroup>
                    </v-col>

                    <v-col cols="12" md="5" class="-mt24">
                        <v-text-field
                            name="business_type"
                            required
                            outlined
                            disabled
                            dense
                            v-model="business_type_credit_limit_str"
                            label="Business Type Credit Limit*"
                        >
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" md="1">
                        <v-switch 
                            :true-value="1"
                            :false-value="2 || 0"
                            color="#50ABA3"
                            inset
                            dense
                            class="px-4 -mt20"
                            v-model="form.business_type_credit_limit"
                            @click="switchBusinessTypeCreaditLimit()"
                        >
                        </v-switch>
                    </v-col>
                    <v-col cols="12" md="5" class="-mt24">
                        <v-text-field
                            name="business_type"
                            required
                            outlined
                            dense
                            v-model="form.credit_limit_amount"
                            :disabled="form.custom_credit_limit !== 1"
                            type="number"
                        >
                            <template v-slot:label>
                                Credit Limit<span style="color:red">*</span>
                            </template>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" md="1">
                        <v-switch 
                            :true-value="1"
                            :false-value="2 || 0"
                            color="#50ABA3"
                            inset
                            dense
                            class="px-4 -mt20"
                            v-model="form.custom_credit_limit"
                            @click="switchCustomizeCreditLimit()"
                        >
                        </v-switch>
                    </v-col>
                    <v-col cols="12" md="6" class="-mt24">
                        <v-text-field
                            name="remaining_credit_limit_amount"
                            required
                            outlined
                            dense
                            v-model="form.remaining_credit_limit_amount"
                            disabled
                            type="number"
                        >
                            <template v-slot:label>
                                Remaining Credit Limit
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" class="-mt24">
                        <v-textarea
                            name="billing_address"
                            v-model="form.billing_address"
                            :counter="350"
                            outlined
                            :error-messages="error.billing_address"
                            required
                            dense
                            rows="3"
                        >
                            <template v-slot:label>
                                Billing Address<span style="color:red">*</span>
                            </template>
                        </v-textarea>
                    </v-col>
                </v-row>
                <v-row class="mb2">
                    <v-col cols="12" class="fs16 bold">Upload Image</v-col>
                </v-row>
                <div class="hr-title mx-1 mb30"/>
                <v-row class="mt-2">
                    <v-col cols="12" md="3" class="-mt24">
                        <div class="mb-4">KTP</div>
                        <UploadImage
                            :minWidth="360"
                            :minHeight="180"
                            :maxSize="3000"
                            :forImgName="'ktp-'+form.name"
                            :errorMsg="error.image_url"
                            :type="'merchant'"
                            :extention="'jpeg'"
                            :accept="'image/jpeg,image/jpg'"
                            :notUseLabel="true"
                            :imageFromUpdate="photoToUpdate"
                        ></UploadImage>
                    </v-col>
                    <v-col cols="12" md="9" class="-mt24">
                        <UploadImageMultiple
                            :name="'outlet-'+form.name"
                            :error="error.images"
                            :dense="true"
                            :data="arrImg"
                            :type="'merchant'"
                            title="Outlet"
                        />
                    </v-col>
                </v-row>
            </form>
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
                    v-privilege="'main_olt_upd'"
                >Save</v-btn>
            </v-card-actions>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </v-container>
</template>

<script>
    export default {
        data () {
            return {
                ConfirmData : {},
                permission:[],
                business_type:null,
                business_type_name:null,
                finance_area:null,
                sales_term:null,
                invoice_term:null,
                payment_method:null,
                invoice_term_dis:true,
                sales_term_dis:true,
                payment_group:'',
                form:{
                    pic_name:'',
                    alt_phone_number:'',
                    note:'',
                    finance_area_id:'',
                    sales_term_id:'',
                    invoice_term_id:'',
                    payment_method_id:'',
                    billing_address:'',
                    term_invoice_sls_id:'',
                    term_payment_sls_id:'',
                    payment_group_id:'',
                    referrer_name: '',
                    referrer_code:'',
                    referral_code:'',
                    custom_credit_limit: 2,
                    credit_limit_amount: 0,
                    remaining_credit_limit_amount: 0,
                    ktp_photos: null,
                    merchant_photos: [],
                },
                error:{},
                business_type_credit_limit_str: '',
                arrImg: [],
                photoToUpdate: null
            }
        },
        mounted () {
            let self = this
            this.$root.$on('event_error', function(err){
                self.error = err
            });
            this.$root.$on('event_uploadImage', function (image) {
                self.form.update_ktp = true
                self.form.ktp_photos = image
                self.photoToUpdate = image
            });
            this.$root.$on("event_multipleImage", function (url) {
                self.form.merchant_photos = url;
            });
        },
        methods:{
            // For confirm button update merchant
            confirmButton() {
                let data = {...this.form,
                    credit_limit_amount: Number(this.form.credit_limit_amount),
                }
                delete data.credit_limit
                delete data.remaining_credit_limit_amount
                data.ktp_photos = data.ktp_photos === '' ? [] : [data.ktp_photos]
                delete data.ktp_photos_url
                delete data.merchant_photos_url
                this.ConfirmData = {
                    model : true,
                    title : "Update Main Outlet",
                    text : "Are you sure want to update this Main Outlet?",
                    urlApi : "/customer/merchant/"+this.$route.params.id,
                    nextPage : "/customer/merchant",
                    data : data
                }
            },
            // For push to previous page
            cancel(){
                this.$router.push('/customer/merchant');
            },
            // For check permission checkbox
            permissionChecked(d) {
                if (d !== '') {
                    this.form.permission = d
                }
            },
            // For select area
            areaSelected(d) {
                this.finance_area = null;
                this.form.finance_area_id = '';
                if (d !== ''  && d !== undefined) {
                    this.finance_area = d;
                    this.form.finance_area_id = d.id;
                }
            },
            // For select business type
            businesstypeSelected(d) {
                this.business_type = null;
                this.form.business_type_id = '';
                if (d !== '' && d !== undefined) {
                    this.business_type = d;
                    this.form.business_type_id = d.id
                    this.business_type_name = d.name;
                }
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
            // For select payment method
            paymentmethodSelected(d) {
                this.payment_method = null;
                this.form.payment_method_id = '';
                if (d !== '' && d !== undefined) {
                    this.payment_method = d;
                    this.form.payment_method_id = d.id
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
            // For get data merchant
            renderData(){
                this.$http.get("/customer/merchant/"+ this.$route.params.id,{
                    params:{
                        embeds:'user_merchant_id,business_type_id,payment_method_id,finance_area_id'
                    }
                })
                    .then(response => {
                        this.form = response.data.data
                        if (response.data.data.credit_limit) {
                            this.form.credit_limit = response.data.data.credit_limit
                        } else {
                            this.form.credit_limit = { amount_credit_limit: 0 }
                        }
                        if(this.form.custom_credit_limit !== 1) {
                            this.form.credit_limit_amount = response.data.data.credit_limit.amount_credit_limit
                        }
                        if(response.data.data.business_type_credit_limit === 1) {
                            this.business_type_credit_limit_str = "Badan Usaha"
                        } else {
                            this.business_type_credit_limit_str = "Personal"
                        }
                        this.businesstypeSelected(response.data.data.business_type)
                        this.areaSelected(response.data.data.finance_area)
                        this.salestermSelected(response.data.data.payment_term)

                        let ktp_img = this.form.ktp_photos_url
                        this.form.ktp_photos = ktp_img ? ktp_img[0] : null
                        this.photoToUpdate = ktp_img ? ktp_img[0] : null

                        let merchant_img = this.form.merchant_photos_url;
                        if (merchant_img) {
                            for (let i = 0; i < merchant_img.length; i++) {
                                this.arrImg.push({
                                    image: true,
                                    imageError: "",
                                    imgUrl: merchant_img[i],
                                    nameFile: merchant_img[i],
                                });
                            }
                        }
                        this.form.merchant_photos = this.arrImg.length > 0 ? merchant_img : []

                        this.$http.get("/payment/payment_group_comb",{params:{
                            embeds:'payment_group_sls_id,term_payment_sls_id,term_invoice_sls_id',
                            conditions:'paymentterm__id.e:'+response.data.data.payment_term.id+'|invoiceterm__id.e:'+response.data.data.invoice_term.id,
                        }}).then(response => {
                            this.invoicetermSelected(response.data.data[0])
                        });
                    });
            },
            // For change value business type credit limit
            switchBusinessTypeCreaditLimit() {
                if(this.form.business_type_credit_limit === 1) {
                    this.business_type_credit_limit_str = "Badan Usaha"
                } else {
                    this.business_type_credit_limit_str = "Personal"
                }
            },
            // For enable & disable input credit limit
            switchCustomizeCreditLimit() {
                if (this.form.custom_credit_limit !== 1) {
                    this.form.credit_limit_amount = this.form.credit_limit.amount_credit_limit
                }
                return
            }
        },
        created() {
            this.renderData()
        },
    }
</script>
