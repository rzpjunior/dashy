<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mb2">
                <v-col cols="12" class="fs16 bold">Basic Info</v-col>
            </v-row>
            <div class="hr-title mx-1 mb30"/>
            <v-row>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="archetype_name"
                        v-model="archetype.name"
                        required
                        disabled
                        outlined
                        dense
                        label="Archetype *"
                        :error="error.archetype_id"
                    ></v-text-field>
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
                        :error="error.business_type_id"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
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
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="merchant_code"
                        v-model="form.code"
                        label="Code"
                        outlined
                        disabled
                        dense
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="merchant_name"
                        v-model="form.name"
                        maxlength="20"
                        disabled
                        required
                        outlined
                        dense
                        :error-messages="error.name"
                    >
                        <template v-slot:label>
                            Name
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="merchant_pic_name"
                        v-model="items.pic_name"
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
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="merchant_phone_number"
                        v-model="form.phone_number"
                        maxlength="15"
                        dense
                        required
                        disabled
                        type="number"
                        outlined
                        :error-messages="error.phone_number"
                    >
                        <template v-slot:label>
                            Phone Number
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="merchant_alt_phone_number"
                        v-model="items.alt_phone_number"
                        maxlength="100"
                        label="Alternative Phone Number"
                        onkeypress="return (event.charCode >= 48 && event.charCode <= 57) || event.charCode === 32"
                        outlined
                        dense
                        :error-messages="error.alt_phone_number"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="email"
                        v-model="items.email"
                        label="Email"
                        outlined
                        :rules="val_email"
                        dense
                        :error-messages="error.email"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectCustomerTag
                        name="customer_tag"
                        v-model="customerTag"
                        :norequired="true"
                        :dense="true"
                        :watchCustomerTag="customerTag"
                        disabled
                    ></SelectCustomerTag>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="referral_code"
                        v-model="form.referral_code"
                        label="Referral Code"
                        outlined
                        disabled
                        dense
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }">
                            <div v-on="{ ...tooltip }">
                                <v-text-field
                                    name="referred_code"
                                    v-model="form.referrer.referral_code"
                                    label="Referrer Code"
                                    outlined
                                    disabled
                                    dense
                                ></v-text-field>
                            </div>
                            </template>
                        <span>Referral code of reffering merchant</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="referred_by"
                        v-model="form.referrer.name"
                        label="Refferer Name"
                        outlined
                        disabled
                        dense
                    ></v-text-field>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <v-textarea
                        name="merchant_note"
                        v-model="items.note"
                        :counter="250"
                        maxlength="250"
                        rows="3"
                        outlined
                        label="Note"
                        dense
                    />
                </v-col>
            </v-row>
        </div>
        <div class="box">
            <v-row class="mb2">
                <v-col cols="12" class="fs16 bold">Finance Info</v-col>
            </v-row>
            <div class="hr-title mx-1 mb30"/>
             <v-row>
                <v-col cols="12" md="6">
                    <SelectArea
                        name="area"
                        @selected="areaSelected"
                        required
                        :label="'Finance Area'"
                        :area="area"
                        :aux_data="2"
                        :dense="true"
                        disabled
                        :error="error.finance_area_id"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="6">
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
                <v-col cols="12" md="6" class="mtn24">
                    <SelectPaymentGroupComb
                        name="sales_invoice_term"
                        @selected="invoicetermSelected"
                        required
                        :disabled="invoice_term_dis"
                        :payment_group="invoice_term"
                        :label="'Default Invoice Term'"
                        :error="error.term_invoice_sls_id"
                        :pt="items.term_payment_sls_id"
                        :dense="true"
                    ></SelectPaymentGroupComb>
                </v-col>
                <v-col cols="12" md="6" class="mtn24">
                    <SelectPaymentGroup
                        name="payment_group"
                        @selected="paymentgroupSelected"
                        required
                        :disabled="true"
                        :payment_group="payment_group"
                        :error="error.payment_group_id"
                        :dense="true"
                    ></SelectPaymentGroup>
                </v-col>
                <v-col cols="12" md="5" class="mtn24">
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
                <v-col cols="12" md="1">
                    <v-switch
                        :true-value="1"
                        :false-value="2"
                        color="#50ABA3"
                        inset
                        dense
                        class="px-4 -mt20"
                        v-model="items.business_type_credit_limit"
                        @click="switchBusinessTypeCreaditLimit"
                    >
                    </v-switch>
                </v-col>
                <v-col cols="12" md="5" class="mtn24">
                    <v-text-field
                        name="credit_limit"
                        required
                        outlined
                        dense
                        v-model="items.credit_limit_amount"
                        :disabled="items.custom_credit_limit !== 1"
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
                        v-model="items.custom_credit_limit"
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
                        v-model="items.remaining_credit_limit_amount"
                        disabled
                    >
                        <template v-slot:label>
                            Remaining Credit Limit
                        </template>
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="-mt24">
                    <v-textarea
                        name="billing_address"
                        v-model="items.billing_address"
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
            <v-row>
                <v-col cols="12" md="6" class="mtn24">
                    <SelectSalesPerson
                        name="salesperson"
                        v-model="salesperson"
                        @selected="salespersonSelected"
                        required
                        :sales_person="salesperson"
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
                                    {{item.area.name}}
                                </div>
                                <SelectPriceSet
                                    v-model="price_set_area[idx].price_set"
                                    name="price_set"
                                    :dense="true"
                                    @selected="pricesetSelected"
                                    :idx="idx"
                                    @deleted="pricesetDeleted"
                                    :price_set="price_set_area[idx].price_set"
                                    v-on:click.native="setIdx(idx)"
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
                                    {{item.area.name}}
                                </div>
                                <SelectPriceSet
                                    :idx="idx"
                                    v-model="price_set_area[idx].price_set"
                                    name="price_set"
                                    :dense="true"
                                    @selected="pricesetSelected"
                                    @deleted="pricesetDeleted"
                                    :price_set="price_set_area[idx].price_set"
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
                    v-privilege="'agt_upd'"
                    @click="confirmButton()"
                >Save</v-btn>
            </v-card-actions>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
        <LoadingBar :value="overlay"/>
    </v-container>
</template>
<script>
    export default {
        name: 'AgentUpdate',
        data () {
            return {
                overlay: false,
                business_type : '',
                business_type_str : '',
                customer_group_str : '',
                allArea : [],
                price_set_area : [{price_set : ''}],
                payment_group:'',
                idxPriceSet : '',

                invoice_term_dis:true,

                price_set:'',
                area:{},
                areaValue:'',
                archetype:'',
                salesperson:'',
                invoice_term:'',
                sales_term:'',
                customerTag:null,

                form : {
                    referrer : {
                        name : ""
                    },
                },
                items:{
                    pic_name: "",
                    alt_phone_number: "",
                    email: "",
                    billing_address: "",
                    note: "",
                    term_payment_sls_id: "",
                    payment_group_id: "",
                    term_invoice_sls_id: "",
                    salesperson_id: "",
                    business_type_credit_limit: "",
                    credit_limit_amount: 0,
                    custom_credit_limit: 2,
                    remaining_credit_limit_amount: 0
                },
                error:{},
                ConfirmData: {},
                business_type_credit_limit_str: "",
            }
        },
        mounted () {
            let self = this
            this.$root.$on('event_error', function(err){
                self.error = err
            });
        },
        methods:{
            // For submit button update
            confirmButton() {
                let data = {...this.items,
                    credit_limit_amount: Number(this.items.credit_limit_amount)
                }
                delete data.remaining_credit_limit_amount
                delete data.credit_limit
                this.ConfirmData = {
                    model : true,
                    title : "Update Agent",
                    text : "Are you sure want to update this Agent?",
                    urlApi : "/customer/agent/"+this.$route.params.id,
                    nextPage : "/customer/agent/detail/"+this.$route.params.id,
                    data : data
                }
            },
            // For get data agent
            renderData(){
                this.overlay = true
                let arr = []
                this.$http.get("/customer/agent/"+this.$route.params.id).then(response => {
                    this.form = response.data.data[0].merchant;
                    if (!this.form.referrer) {
                        this.form.referrer = {
                            name : "",
                            referral_code : "",
                        }
                    }
                    this.items={
                        pic_name: this.form.pic_name,
                        alt_phone_number: this.form.alt_phone_number,
                        email: this.form.email,
                        billing_address: this.form.billing_address,
                        note: this.form.note,
                        term_payment_sls_id: "",
                        payment_group_id: "",
                        term_invoice_sls_id: "",
                        salesperson_id: "",
                        price_set_area : [
                            {
                                "price_set_id": "",
                                "area_id":"",
                                "price_set" : "",
                            }
                        ],
                        business_type_credit_limit: this.form.business_type_credit_limit,
                        custom_credit_limit: this.form.custom_credit_limit,
                        remaining_credit_limit_amount: this.form.remaining_credit_limit_amount ? this.form.remaining_credit_limit_amount : 0,
                        credit_limit: this.form.credit_limit ? this.form.credit_limit : { amount_credit_limit : 0 },
                        credit_limit_amount: this.form.custom_credit_limit !== 1 && this.form.credit_limit ? this.form.credit_limit.amount_credit_limit : this.form.credit_limit_amount
                    }
                    if(this.items.business_type_credit_limit === 1) {
                        this.business_type_credit_limit_str = "Badan Usaha"
                    } else {
                        this.business_type_credit_limit_str = "Personal"
                    }
                    this.archetypeSelected(response.data.data[0].archetype)
                    this.areaSelected(response.data.data[0].merchant.finance_area)
                    this.salespersonSelected(response.data.data[0].salesperson)
                    this.salestermSelected(response.data.data[0].merchant.payment_term)
                    this.$http.get("/payment/payment_group_comb",{params:{
                        embeds:'payment_group_sls_id,term_payment_sls_id,term_invoice_sls_id',
                        conditions:'paymentterm__id.e:'+response.data.data[0].merchant.payment_term.id+'|invoiceterm__id.e:'+response.data.data[0].merchant.invoice_term.id,
                    }}).then(response => {
                        this.invoicetermSelected(response.data.data[0])
                    });
                    this.paymentgroupSelected(response.data.data[0].merchant.payment_group)
                    this.BusinessTypeSelected(response.data.data[0].merchant.business_type)
                    this.customerTag = []
                    if(this.form.tag_customer.includes(",")) {
                        arr = this.form.tag_customer.split(',')
                    } else if(this.form.tag_customer != ""){
                        arr.push(this.form.tag_customer)
                    }
                    if (arr.length>0) { 
                        for (let i = 0; i < arr.length; i++) {
                            this.$http.get("/customer/tag/"+arr[i]).then(response => {
                                this.customerTag.push(response.data.data)
                            });
                        }
                    }

                    this.allArea = this.form.price_set_area
                    this.items.price_set_area = []
                    this.price_set_area = []
                    for (let i = 0; i < this.allArea.length; i++) {
                        this.items.price_set_area.push({
                            "price_set_id": this.allArea[i].price_set.id,
                            "area_id":this.allArea[i].area.id
                        });
                        this.price_set_area.push({
                            "price_set": this.allArea[i].price_set
                        });
                    }
                    this.overlay = false
                });
            },
            // For handle error
            err(idx) {
                for (var key in this.error) {
                    if (key=='price_set_area'+idx) {
                        return this.error[key]
                    }
                }
            },
            // For set price set
            setPriceSet() {
                let arr = JSON.parse(JSON.stringify(this.price_set_area))
                this.price_set_area = arr
            },
            // For set index
            setIdx(id) {
                this.idxPriceSet = id
            },
            // For delete price set
            pricesetDeleted(idx){
                this.idxPriceSet = idx
                this.items.price_set_area[idx].price_set_id = '';
            },
            // For select price set
            pricesetSelected(d) {
                this.price_set_area[this.idxPriceSet].price_set = null;
                if (d) {
                    this.price_set_area[this.idxPriceSet].price_set = d;
                    this.items.price_set_area[this.idxPriceSet].price_set_id = d.id;
                }
            },
            // For select business type
            BusinessTypeSelected(d) {
                this.business_type_str = "";
                this.form.business_type = ''
                if (d) {
                    this.form.business_type = d.id
                    this.business_type_str = d.name
                }
            },
            // For select archetype
            archetypeSelected(d) {
                this.customer_group_str = ''
                this.archetype = null;
                this.form.archetype_id = '';
                if (d) {
                    this.archetype = d;
                    this.form.archetype_id = d.id
                    this.customer_group_str = 'Agent'
                    this.form.customer_group = 2
                }
            },
            // For select sales person
            salespersonSelected(d) {
                this.salesperson = null;
                this.items.salesperson_id = '';
                if (d) {
                    this.salesperson = d;
                    this.items.salesperson_id = d.id
                }
            },
            // For select customer tag
            customerTagSelected(d) {
                this.customerTag = null;
                if (d) {
                    this.customerTag = d;
                }
            },
            // For select sales term
            salestermSelected(d) {
                this.sales_term = null;
                this.items.term_payment_sls_id = '';
                this.payment_group = null;
                this.items.payment_group_id = '';
                this.invoice_term = null;
                this.items.term_invoice_sls_id = ''
                this.invoice_term_dis = true
                if (d) {
                    this.invoice_term_dis = false
                    this.sales_term = d;
                    this.items.term_payment_sls_id = d.id
                }
            },
            // For select invoice term
            invoicetermSelected(d){
                this.payment_group = null;
                this.items.payment_group_id = '';
                this.invoice_term = null;
                this.items.term_invoice_sls_id = ''
                if (d) {
                    this.payment_group = d.payment_group;
                    this.items.payment_group_id = d.payment_group.id
                    this.invoice_term = d
                    this.items.term_invoice_sls_id = d.invoice_term.id
                }
            },
            // For select payment group
            paymentgroupSelected(d){
                this.payment_group = null;
                this.items.payment_group_id = '';
                if (d) {
                    this.payment_group = d;
                    this.items.payment_group_id = d.id
                }
            },
            // For select area
            areaSelected(d) {
                this.area = null;
                this.form.area_id = '';
                if (d !== ''  && d !== undefined) {
                    this.area = d;
                    this.form.area_id = d.id;
                }
            },
            // For change value business type credit limit
            switchBusinessTypeCreaditLimit() {
                if(this.items.business_type_credit_limit === 1) {
                    this.business_type_credit_limit_str = "Badan Usaha"
                } else {
                    this.business_type_credit_limit_str = "Personal"
                }
            },
            // For enable & disable input credit limit
            switchCustomizeCreditLimit() {
                if (this.items.custom_credit_limit !== 1) {
                    this.items.credit_limit_amount = this.items.credit_limit.amount_credit_limit
                }
                return
            }
        },
        created(){
            this.renderData()
            let self = this
            setTimeout(function(){
                self.setPriceSet()
            }, 500);
        },
    }
</script>
