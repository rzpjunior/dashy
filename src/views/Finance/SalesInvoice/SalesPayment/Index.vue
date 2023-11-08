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
            <v-row>
                <v-col cols="12" md="6">
                    <DetailRowNew :name="'Invoice Date'" :value="formatDate(salesInvoiceDetail.recognition_date)"/>
                    <DetailRowNew :name="'Payment Term'" :value="salesInvoiceDetail.term_payment_sls.name"/>
                    <DetailRowNew :name="'Payment Group'" :value="salesInvoiceDetail.payment_group_sls.name"/>
                </v-col>
                <v-col cols="12" md="6">
                    <DetailRowNew :name="'Total Invoice'" :value="formatPrice(salesInvoiceDetail.total_charge)"/>
                    <DetailRowNew :name="'Invoice Term'" :value="salesInvoiceDetail.term_invoice_sls.name"/>
                </v-col>
                <v-col cols="12" class="-mt25">
                    <DetailRowNew :name="'Billing Address'" :value="salesInvoiceDetail.billing_address" :align="true"/>
                    <DetailRowNew :name="'Note'" :value="salesInvoiceDetail.note" :align="true"/>
                </v-col>
            </v-row>
        </div>
        
        <div class="box-start">
            <v-row>
                <v-col class="fs16 bold">
                    Sales Order
                </v-col>
                <v-col class="d-flex justify-end align-end">
                    <v-btn
                        v-if="salesInvoiceDetail.sales_order.status == 1"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('active')"
                    >
                        Active
                    </v-btn>
                    <v-btn
                        v-if="salesInvoiceDetail.sales_order.status == 2"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('finished')"
                    >
                        Finished
                    </v-btn>
                    <v-btn
                        v-if="salesInvoiceDetail.sales_order.status == 3"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('cancelled')"
                    >
                        Cancelled
                    </v-btn>
                    <v-btn
                        v-if="salesInvoiceDetail.sales_order.status == 7"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('on_delivery')"
                    >
                        On Delivery
                    </v-btn>
                    <v-btn
                        v-if="salesInvoiceDetail.sales_order.status == 8"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('delivered')"
                    >
                        Delivered
                    </v-btn>
                    <v-btn
                        v-if="salesInvoiceDetail.sales_order.status == 9"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('invoiced_not_delivered')"
                    >
                        Invoiced Not Delivered
                    </v-btn>
                    <v-btn
                        v-if="salesInvoiceDetail.sales_order.status == 10"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('invoiced_on_delivery')"
                    >
                        Invoiced On Delivery
                    </v-btn>
                    <v-btn
                        v-if="salesInvoiceDetail.sales_order.status == 11"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('invoiced_delivered')"
                    >
                        Invoiced Delivered
                    </v-btn>
                    <v-btn
                        v-if="salesInvoiceDetail.sales_order.status == 12"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('paid_not_delivered')"
                    ><span>Paid not Delivered</span>
                    </v-btn>
                    <v-btn
                        v-if="salesInvoiceDetail.sales_order.status == 13"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('paid_on_delivery')"
                    >
                        Paid on Delivery
                    </v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6">
                    <DetailRowNew :name="'Order Code'" :value="salesInvoiceDetail.sales_order.code"/>
                    <DetailRowNew :name="'Delivery Date'" :value="formatDate(salesInvoiceDetail.sales_order.delivery_date)"/>
                    <DetailRowNew :name="'Customer'" :value="salesInvoiceDetail.sales_order.branch.merchant.name"/>
                </v-col>
                <v-col cols="12" md="6">
                    <DetailRowNew :name="'Order Date'" :value="formatDate(salesInvoiceDetail.sales_order.recognition_date)"/>
                    <DetailRowNew :name="'Area'" :value="salesInvoiceDetail.sales_order.branch.area.name"/>
                    <DetailRowNew :name="'Outlet'" :value="salesInvoiceDetail.sales_order.branch.merchant.name"/>
                </v-col>
                <v-col cols="12" class="-mt25">
                    <DetailRowNew :name="'Shipping Address'" :value="salesInvoiceDetail.sales_order.shipping_address" :align="true"/>
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table -mt4">
            Payment List
        </div>
        <div class="box-body-table">
            <v-data-table
                :mobile-breakpoint="0"
                :headers="table.fields"
                :items="items"
                :hide-default-footer="true"
                :items-per-page="items.length"
            >
                <template v-slot:item="props">
                    <tr>
                        <td>{{ props.index + 1 }}</td>
                        <td>{{ props.item.code }}</td>
                        <td>{{ props.item.bank_receive_num }}</td>
                        <td class="right">{{ formatPrice(props.item.amount) }}</td>
                        <td>{{ props.item.payment_method.name }}</td>
                        <td>
                            <div v-if="props.item.payment_channel">{{ props.item.payment_channel.name }}</div>
                            <div v-else>-</div>
                        </td>
                        <td>
                            <span>{{ formatDate(props.item.recognition_date) }}</span>
                            /
                            <span
                                class="text-black60"
                                v-if="props.item.received_date"
                            >
                                {{
                                    formatDate(props.item.received_date)
                                }}
                            </span>
                            <span class="text-black60" v-else>-</span>
                        </td>
                        <td>{{ props.item.cancellation_note }}</td>
                        <td>{{ props.item.paid_off === 1 ? 'Paid Off' : '-' }}</td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                > <span class="pa-md-2"> Active </span></v-chip>
                            </div>
                            <div v-else-if="props.item.status == 2">
                                <v-chip
                                    :color="statusMaster('finished')"
                                > Finished </v-chip>
                            </div>
                            <div v-else-if="props.item.status == 3">
                                <v-chip
                                    :color="statusMaster('cancelled')"
                                > Cancelled </v-chip>
                            </div>
                            <div v-else-if="props.item.status == 5">
                                <v-chip
                                    :color="statusMaster('in_progress')"
                                > In Progress </v-chip>
                            </div>
                            <div v-else-if="props.item.status == 6">
                                <v-chip
                                    :color="statusMaster('partial')"
                                > Partial </v-chip>
                            </div>
                        </td>
                        <td>
                            <v-img
                                v-if="props.item.image_url"
                                class="rounded-form my-3"
                                height="130"
                                width="200"
                                :src="props.item.image_url"
                            ></v-img>
                            <span v-else>-</span>
                        </td>
                        <td>
                            <v-menu offset-y>
                                <template v-slot:activator="{ on: menu }">
                                    <v-btn
                                        icon
                                        v-on="{ ...menu }"
                                    ><v-icon dark>mdi-dots-vertical</v-icon></v-btn>
                                </template>
                                <v-list style="background: #E8EFF2">
                                    <v-list-item v-privilege="'sp_can'" v-if="props.item.status== 2 || props.item.status== 5" @click="cancelPayment(props.item.id)">
                                        <v-list-item-content>
                                            <v-list-item-title>Cancel</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <div class="px-md-2" v-if="props.item.status== 2 || props.item.status== 5" >
                                        <hr>
                                    </div>
                                    <v-list-item v-privilege="'sp_can'" v-if="props.item.status== 1" @click="cancelPaymentActive(props.item.id)">
                                        <v-list-item-content>
                                            <v-list-item-title>Cancel</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <div class="px-md-2" v-if="props.item.status== 1" >
                                        <hr>
                                    </div>
                                    <v-list-item v-privilege="'sp_edn_can'" v-if="props.item.status== 5" @click="cancelPaymentEDN(props.item.id)">
                                        <v-list-item-content>
                                            <v-list-item-title>Cancel</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <div class="px-md-2" v-privilege="'sp_edn_can'" v-if="props.item.status== 5" >
                                        <hr>
                                    </div>
                                    <v-list-item @click="printPdf(props.item.id)" v-privilege="'sp_edn_prt'">
                                        <v-list-item-content>
                                            <v-list-item-title>Print Kwitansi</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <div v-privilege="'sp_edn_prt'">
                                        <hr />
                                    </div>
                                    <v-list-item @click="printPdfTermal(props.item.id)" v-privilege="'sp_edn_prt'">
                                        <v-list-item-content>
                                            <v-list-item-title>Print Kwitansi Thermal</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <div v-privilege="'sp_edn_prt'">
                                        <hr />
                                    </div>
                                    <v-list-item @click="seeHistory(props.item.id)">
                                        <v-list-item-content>
                                            <v-list-item-title>See History</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <div class="px-md-2" v-if="props.item.status== 1 || props.item.status== 5">
                                        <hr>
                                    </div>
                                    <v-list-item 
                                        v-if="props.item.status== 1 || props.item.status== 5"
                                        v-privilege="'sp_cnf'"
                                        @click="confirmPayment(props.item)"
                                    >
                                        <v-list-item-content>
                                            <v-list-item-title>Confirm Payment</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <div class="box-end">
            <v-row>
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
                            <span class="text-black80">Back</span>
                        </v-btn>
                        <v-btn
                            depressed
                            color="#50ABA3"
                            class="only-btn white--text"
                            v-if="salesInvoiceDetail.status == 1 || salesInvoiceDetail.status == 6"
                            @click="dialog = true"
                            v-privilege="'sp_crt'"
                        >
                            Create Payment
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
        <ConfirmPaymentDialog :sendData="ConfirmPayment" />
        <AuditLogNew :data="dataAuditLog"/>
        <v-dialog
            v-model="dialog"
            max-width="1037px"
        >
            <LoadingBar :value="overlay"/>
            <v-card class="OpenSans">
                <v-card-title>
                    <v-row>
                        <v-col class="text-title-modal" cols="12" md="11">
                            Create Payment
                        </v-col>
                        <v-col class="flex-align-end" cols="12" md="1">
                            <v-btn
                                icon
                                @click="dialog = false"
                            >
                                <v-img src="/icon/close-new.png" max-height="24px" max-width="24px"></v-img>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <div class="hr-title-modal mt1"/>
                <v-card-text class="mt-6">
                    <v-row>
                        <v-col cols="12" md="6">
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
                        <v-col cols="12" md="6">
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
                </v-card-text>
                <div class="hr-title-modal -mt28"/>
                <v-card-text>
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
                </v-card-text>
                <div class="hr-title-modal -mt10"/>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        depressed
                        color="#50ABA3"
                        class="main-btn white--text mt8"
                        @click="createSalesPayment()"
                    >Pay</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="errorModalIsVisible"
            max-width="30%"
        >
            <LoadingBar :value="overlay"/>
            <v-card class="OpenSans">
                <v-card-title>Cancel Regular Payment</v-card-title>
                <v-card-text>{{errorMsg}}</v-card-text>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        depressed
                        color="#50ABA3"
                        class="main-btn white--text mt8"
                        @click="errorModalIsVisible = false"
                    >Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    export default {
        name: "SalesInvoiceDetail",
        data() {
            return {
                dialog: false,
                loading: false,
                overlay: false,
                table: {
                    fields: [
                        {
                            text:'No.',
                            width: "3%",
                            sortable: false,
                            class: 'grey--text text--darken-4',
                        },
                        {
                            text:'Code',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                        },
                        {
                            text:'Bank Receive Voucher Number',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                        },
                        {
                            text:'Amount (Rp)',
                            sortable: false,
                            align : 'right',
                            class: 'grey--text text--darken-4',
                        },
                        {
                            text:'Payment Method',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Payment Channel',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Payment Date',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Cancellation Note',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Paid Off',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Status',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Image',
                            width: "20%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            width: "5%",
                            class: 'grey--text text--darken-4',
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
                ConfirmData : {},
                ConfirmPayment : {},
                dataAuditLog : {},
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
                loading:true,
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
                errorModalIsVisible: false,
                errorMsg: '',
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
                this.loading=true
                    await this.$http.get("/finance/sales/invoice/"+this.$route.params.id)
                    .then(response => {
                        this.salesInvoiceDetail = response.data.data
                        this.total_charge = response.data.data.total_charge
                        this.amount = response.data.data.remaining_amount
                        this.$http.get("/sales/payment",{params:{
                                embeds:'paymentmethod,paymentchannel,salesinvoice,salesinvoice.paymentgroup,salesinvoice.salesterm,salesinvoice.invoiceterm,salesinvoice.salesorder,salesinvoice.salesorder.area,salesinvoice.salesorder.branch,salesinvoice.salesorder.branch.merchant',
                                conditions:"salesinvoice.id.e:"+this.$route.params.id,
                            }}).then(responsePayment => {
                                this.items = responsePayment.data.data === null ? [] : responsePayment.data.data
                                this.overlay = false

                        });
                        this.loading = false
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
                    window.location.reload()
                })
                .catch(e => {
                    this.overlay = false
                    this.error = e.errors
                });
            },
            //For cancel payment
            cancelPayment(id) {
                this.ConfirmData = {
                    model : true,
                    status: true,
                    statusMsg : "Success to Cancel this Payment",
                    title : "Cancel Payment",
                    text : "Why was this payment cancelled?",
                    urlApi : "/sales/payment/cancel/"+id,
                    cancelNote : "Note",
                    data : {}
                }
            },
            //For cancel payment active
            cancelPaymentActive(id) {
                this.ConfirmData = {
                    model: true,
                    status: true,
                    statusMsg: "Success to Cancel this Payment",
                    title: "Cancel Payment",
                    text: "Why was this payment cancelled?",
                    urlApi: "/sales/payment/cancel/active/" + id,
                    cancelNote: "Note",
                    data: {},
                };
            },
            //For cancel payment edn
            cancelPaymentEDN(id) {
                this.ConfirmData = {
                    model: true,
                    status: true,
                    statusMsg: "Success to Cancel this Payment",
                    title: "Cancel Payment",
                    text: "Why was this payment cancelled?",
                    urlApi: "/sales/payment-edn/cancel/" + id,
                    cancelNote: "Note",
                    data: {},
                };
            },
            //For print kwitansi
            printPdf(id) {
                this.overlay = true
                this.$http.get("/sales/payment-edn/print/" + id,{
                        params: {
                            format: 1
                        },
                    }).then(response => {
                        window.open(response.data.file, '_blank');
                        this.overlay = false
                })
            },
            //For print kwitansi termal
            printPdfTermal(id) {
                this.overlay = true
                this.$http.get("/sales/payment-edn/print/" + id, {
                        params: {
                            format: 2
                        },
                    }).then(response => {
                        window.open(response.data.file, '_blank');
                        this.overlay = false
                })
            },
            confirmPayment(item) { // confirm single payment
                this.ConfirmPayment = {
                    model : true,
                    data: item
                }
            },
            //For see history audit log
            seeHistory(id) {
                this.dataAuditLog = {
                    model : true,
                    id: id,
                    type: "sales_payment"
                }
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
                if (d !== '') {
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
            error: {
                handler: function (val) {
                    if(val){
                        if (val.sales_payment) {
                            this.errorModalIsVisible = true
                            this.errorMsg = 'Cancel the "Paid-Off Payment" first before cancelling the "Regular Payment"'
                        }
                    }
                },
                deep: true
            },
            dialog: {
                handler: function (val) {
                    if (val) {
                        this.error = {}
                    }
                },
                deep: true
            },
        },
    }
</script>
