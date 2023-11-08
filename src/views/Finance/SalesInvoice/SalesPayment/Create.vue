<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row>
                <v-col class="fs24 bold">
                    {{salesInvoiceDetail.code}}
                </v-col>
                <v-col class="flex-align-end">
                    <v-btn
                        v-if="salesInvoiceDetail.status == 1"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mt4"
                        :color="statusMaster('active')"
                    >
                        Active
                    </v-btn>
                    <v-btn
                        v-if="salesInvoiceDetail.status == 2"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mt4"
                        :color="statusMaster('finished')"
                    >
                        Finished
                    </v-btn>
                    <v-btn
                        v-if="salesInvoiceDetail.status == 3"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mt4"
                        :color="statusMaster('cancelled')"
                    >
                        Cancelled
                    </v-btn>
                    <v-btn
                        v-if="salesInvoiceDetail.status == 6"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mt4"
                        :color="statusMaster('partial')"
                    >
                        Partial
                    </v-btn>
                    <div class="mx-3"></div>
                </v-col>
            </v-row>
            <div class="hr-title mt15 mb48"/>
            <v-row>
                <v-col cols="12" md="6" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="payment_date_model"
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
                                    required
                                    clearable
                                    dense
                                    @click:clear="payment_date = ''"
                                    v-model="payment_date"
                                    maxlength="10"
                                    onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 45"
                                    :error-messages="error.payment_date"
                                >
                                    <template v-slot:label>
                                        Payment Date<span style="color:red">*</span>
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            name="payment_date"
                            no-title
                            v-model="payment_date"
                            @input="payment_date_model = false"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectPaymentMethod
                        name="payment_method"
                        @selected="paymentmethodSelected"
                        required
                        :dense="true"
                        :error="error.payment_method_id"
                    ></SelectPaymentMethod>
                </v-col>
                <v-col cols="12" md="6" class="-mt24" v-if="show_channel">
                    <SelectPaymentChannel
                        name="payment_channel"
                        :label="'Payment Channel '"
                        :norequired="true"
                        :dense="true"
                        :payment_method_id="payment_method_id"
                        @selected="paymentChannelSelected"
                        required
                        :error="error.payment_channel_id"
                    ></SelectPaymentChannel>
                </v-col>
                <v-col cols="12" md="6" class="-mt45">
                    <div class="fs12">
                        Amount <span style="color:red">*</span>
                    </div>
                    <vue-numeric
                        name="amount"
                        class="productNumeric -ml1 -mt1"
                        placeholder="0,00"
                        separator="."
                        :precision="2"
                        required
                        v-model.number="amount"
                        :error-messages="error.amount"
                    ></vue-numeric>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="bank_receive_num"
                        v-model="bank_receive_num"
                        required
                        outlined
                        maxlength="50"
                        dense
                        :error-messages="error.bank_receive_num"
                    >
                        <template v-slot:label>
                            Bank Receive Voucher Number<span style="color:red;">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24" v-if="!show_channel">
                    <SelectPaymentChannel
                        name="payment_channel"
                        :dense="true"
                        :payment_method_id="payment_method_id"
                        style="display:none;"
                    ></SelectPaymentChannel>
                </v-col>    
            </v-row>
        </div>
        <div class="box">
            <v-row>
                <v-col class="d-flex">
                    <v-checkbox
                        name="paid_off"
                        v-model="paid_off"
                        :label="'Paid Off'"
                    ></v-checkbox>
                    <v-checkbox
                        class="ml26"
                        name="paid_off"
                        v-model="with_image"
                        :label="'With Image'"
                    ></v-checkbox>
                </v-col>
            </v-row>
            <div class="hr-title mt15 mb48"/>
            <v-row>
                <v-col cols="12" class="d-flex -mt20">
                    <v-textarea
                        v-model="adjnote"
                        name="adj_note"
                        required
                        outlined
                        rows="4"
                    >
                        <template v-slot:label>
                            <div>
                                Note
                            </div>
                        </template>
                    </v-textarea>
                    <SelectSingleImageNew 
                        v-if="with_image"
                        class="ml32"
                        :forImgName="salesInvoiceDetail.code" 
                        :errorMsg="error.image" 
                        :maxSize="2" 
                        :extention="'JPG'"
                    ></SelectSingleImageNew>
                </v-col>
            </v-row>
        </div>
        <div class="box-end">
            <v-row>
                <v-col>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            depressed
                            color="#50ABA3"
                            class="only-btn white--text"
                            @click="createSalesPayment()"
                            v-privilege="'sp_crt'"
                        >
                            Create Payment
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </div>
        <LoadingBar :value="overlay"/>
    </v-container>
</template>

<script>
    export default {
        name: "CreatePayment",
        data() {
            return {
                dialog: false,
                overlay: false,
                table: {
                    fields: [
                        {
                            text:'No.',
                            width: "3%",
                            sortable: false,
                        },
                        {
                            text:'Code',
                            sortable: false,
                        },
                        {
                            text:'Bank Receive Voucher Number',
                            sortable: false,
                        },
                        {
                            text:'Amount (Rp)',
                            sortable: false,
                        },
                        {
                            text:'Payment Method',
                            sortable: false
                        },
                        {
                            text:'Payment Channel',
                            sortable: false
                        },
                        {
                            text:'Payment Date',
                            sortable: false
                        },
                        {
                            text:'Cancellation Note',
                            sortable: false
                        },
                        {
                            text:'Status',
                            sortable: false
                        },
                        {
                            text:'Image',
                            width: "20%",
                            sortable: false
                        },
                        {
                            width: "5%",
                            sortable: false
                        },
                    ],
                },
                items: [
                    {
                        status : '',
                        sales_invoice : {
                            term_payment_sls : {
                                name : '',
                            }
                        },
                        payment_channel : {
                            name : '',
                        },
                        payment_method : {
                            name : '',
                        }
                    }
                ],
                form : {},
                salesInvoiceDetail:{
                    term_payment_sls : {
                        name : '',
                    },
                    payment_group_sls : {
                        name : '',
                    },
                    term_invoice_sls : {
                        name : '',
                    },
                    sales_order : {
                        status : '',
                        branch : {
                            merchant : {
                                name : '',
                            },
                            area : {
                                name : '',
                            }
                        }
                    }
                },
                error:{},
                payment_date_model : '',
                payment_date : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                payment_method:'',
                payment_method_id: '',
                payment_channel:'',
                payment_channel_id: '',
                amount : 0,
                bank_receive_num : '',
                paid_off : false,
                with_image : false,
                adjnote : '',
                note : '',
                image : '',
                total_amount : 0,
                total_charge : 0,
                channel_status:false,
            }
        },
        computed: {
            staff () {
                return this.$store.getters.getStaff
            },
            show_channel: function () {
                if(this.channel_status && this.payment_method_id){
                    return true
                }else{
                    return false
                }
            }
        },
        methods:{
            //Get detail Sales Invoice and Sales Payment data
            async renderData(){
                this.overlay = true
                await this.$http.get("/finance/sales/invoice/"+this.$route.params.id)
                .then(response => {
                    this.salesInvoiceDetail = response.data.data
                    this.total_charge = response.data.data.total_charge
                    this.$http.get("/sales/payment",{params:{
                        embeds:'paymentmethod,paymentchannel,salesinvoice,salesinvoice.paymentgroup,salesinvoice.salesterm,salesinvoice.invoiceterm,salesinvoice.salesorder,salesinvoice.salesorder.area,salesinvoice.salesorder.branch,salesinvoice.salesorder.branch.merchant',
                        conditions:"salesinvoice.id.e:"+this.$route.params.id,
                    }}).then(responsePayment => {
                        this.items = responsePayment.data.data
                        if(this.items === null){
                            this.items = []
                        }
                        for (let i=0;i<responsePayment.data.data.length; i++) {
                            if(responsePayment.data.data[i].amount && (responsePayment.data.data[i].status === 2)){
                                this.total_amount += parseFloat(responsePayment.data.data[i].amount)
                                this.amount = this.total_charge -  this.total_amount
                            }
                        }
                        if (this.amount == 0) {
                            this.amount = this.total_charge
                        }
                        this.overlay = false
                    });
                });
            },
            //Send payment form to create sales payment
            createSalesPayment() {
                this.overlay = true
                let paidOff = ''
                if (this.paid_off == true) {
                    paidOff = 1
                } else {
                    paidOff = 2
                }
                this.form = {
                    payment_date : this.payment_date,
                    payment_method_id: this.payment_method_id,
                    payment_channel_id: this.payment_channel_id,
                    amount: this.amount,
                    bank_receive_num: this.bank_receive_num,
                    paid_off: paidOff,
                    note: this.adjnote,
                    image_url: this.image,
                    sales_invoice_id: this.salesInvoiceDetail.id,
                }
                this.$http.post('/sales/payment',this.form)
                .then(response => {
                    this.dialog = false
                    this.overlay = false
                    this.$router.push('/finance/si/sp/'+this.$route.params.id)
                })
                .catch(e => {
                    this.overlay = false
                    this.error = e.errors
                });
            },
            //For select payment method
            paymentmethodSelected(d) {
                this.payment_method = '';
                this.payment_method_id = '';
                this.payment_channel = '';
                this.payment_channel_id = '';
                this.channel_status = false;
                if (d !== '') {
                    this.disabledChanneldisabledChannel = d;
                    this.payment_method_id = d.id
                }
            },
            //For select payment channel
            paymentChannelSelected(d) {
                this.payment_channel = '';
                this.payment_channel_id = '';
                if (d) {
                    this.payment_channel = d;
                    this.payment_channel_id = d.id
                }
            },
        },
        created() {
            let data = this.$store.state.CreateSalesPayment
            if(data){
                this.overlay = true
                this.dialog = true
            }
            this.$store.commit('setCreatePayment', null);
        },
        mounted () {
            this.renderData()
            let self = this
            this.$root.$on('event_success', function(res){
                if (res) {
                    window.location.reload()
                }
            });
            this.$root.$on('event_error', function(err){
                self.error = err
                self.imageError = err.image;
            });
            this.$root.$on('event_singleImage', function(image){
                self.image = image
            });
            this.$root.$on('empty_channel', function(val){
                if (val === 2) {
                    self.channel_status = true
                } else if (val === 1) {
                    self.channel_status = false
                }
            });
        },
        watch: {
            // watch check box value want to send form with image or not
            with_image: {
                handler: function (val) {
                    //for clear image
                    if(val == false){
                        this.image = ''
                    }
                },
                deep: true
            },
        },
    }
</script>
