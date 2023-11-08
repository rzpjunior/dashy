<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="invoice_code"
                        v-model="form.code"
                        required
                        outlined
                        disabled
                        dense
                        :error-messages="error.code"
                    >
                        <template v-slot:label>
                            Invoice Code *
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="invoice_customer_code"
                        v-model="form.code_ext"
                        required
                        outlined
                        dense
                        :error-messages="error.code_ext"
                    >
                        <template v-slot:label>
                            Invoice Customer Code<span style="color:red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="order_code"
                        v-model="form.sales_order.code"
                        required
                        outlined
                        disabled
                        dense
                        :error-messages="error.sales_order"
                    >
                        <template v-slot:label>
                            Order Code *
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="order_date"
                        v-model="form.order_date"
                        required
                        outlined
                        disabled
                        prepend-inner-icon="mdi-calendar"
                        dense
                        :error-messages="error.order_date"
                    >
                        <template v-slot:label>
                            Order Date *
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="invoice_date_model"
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
                                    @click:clear="invoice_date = ''"
                                    v-model="invoice_date"
                                    maxlength="10"
                                    onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 45"
                                    :error-messages="error.recognition_date"
                                >
                                    <template v-slot:label>
                                        Invoice Date<span style="color:red">*</span>
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            no-title
                            v-model="invoice_date"
                            @input="invoice_date_model = false"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="invoice_due_date_model"
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
                                    clearable
                                    dense
                                    @click:clear="invoice_due_date = ''"
                                    v-model="invoice_due_date"
                                    maxlength="10"
                                    onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 45"
                                    :error-messages="error.due_date"
                                >
                                    <template v-slot:label>
                                        Invoice Due Date<span style="color:red">*</span>
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            no-title
                            v-model="invoice_due_date"
                            @input="invoice_due_date_model = false"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectOrderType
                        :ordertype="ordertype"
                        name="ordertype"
                        :error="error.order_type_id"
                        @selected="ordertypeSelected"
                        disabled
                        :norequired="true"
                        :dense="true"
                    ></SelectOrderType>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="customer"
                        v-model.number="form.sales_order.branch.merchant.name"
                        required
                        outlined
                        disabled
                        dense
                        :error-messages="error.customer"
                    >
                        <template v-slot:label>
                            Customer *
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24" v-if="form.outlet">
                    <v-text-field
                        v-if="form.outlet"
                        name="outlet"
                        v-model.number="form.outlet"
                        required
                        outlined
                        disabled
                        dense
                        :error-messages="error.outlet"
                    >
                        <template v-slot:label>
                            Outlet *
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="payment_term"
                        v-model.number="form.term_payment_sls.name"
                        required
                        outlined
                        disabled
                        dense
                        :error-messages="error.payment_term"
                    >
                        <template v-slot:label>
                            Payment Term *
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="invoice_term"
                        v-model.number="form.term_invoice_sls.name"
                        required
                        outlined
                        disabled
                        dense
                        :error-messages="error.invoice_term"
                    >
                        <template v-slot:label>
                            Invoice Term *
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="payment_group"
                        v-model.number="form.payment_group_sls.name"
                        required
                        outlined
                        disabled
                        dense
                        :error-messages="error.payment_group"
                    >
                        <template v-slot:label>
                            Payment Group *
                        </template>
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6" class="-mt24">
                    <v-textarea
                        name="billing_address"
                        v-model="form.billing_address"
                        :counter="250"
                        maxlength="250"
                        outlined
                        rows="3"
                    >
                    
                        <template v-slot:label>
                            Billing Address<span style="color:red">*</span>
                        </template>
                    </v-textarea>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-textarea
                        name="note"
                        v-model="form.note"
                        :counter="250"
                        maxlength="250"
                        outlined
                        label="Note"
                        rows="3"
                    />
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table">
            Products
        </div>
        <div class="box-body-table">
            <v-data-table
                :headers="table.fields"
                :items="items"
                :hide-default-footer="true"
                :items-per-page="-1"
                style="background:#FCFCFC"
                :mobile-breakpoint="0"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{props.index + 1}}</td>
                        <td>
                            {{props.item.product.code}} - {{props.item.product.name}}<br>
                            <span class="text-black60" v-if="props.item.sales_order_item.discount_qty > 0">
                                Qty discount max. {{ props.item.sales_order_item.discount_qty }} {{ props.item.product.uom.name }}
                            </span>
                        </td>
                        <td>{{props.item.product.uom.name}}</td>
                        <td class="right">{{formatPrice(props.item.sales_order_item.order_qty)}}</td>
                        <td class="right">{{formatPrice(props.item.delivery_qty)}}</td>
                        <td class="right">{{formatPrice(props.item.receive_qty)}}</td>
                        <td>
                            <vue-numeric
                                :name="`invoice_qty_${props.index}`"
                                v-model.number="props.item.invoice_qty"
                                required
                                class="rounded-sm-form productNumeric"
                                style="margin-left:-10px;"
                                placeholder="0,00"
                                separator="."
                                :precision="2"
                                :error-messages="error.invoice_qty"
                            ></vue-numeric>
                        </td>
                        <td class="right">{{formatPrice(props.item.unit_price)}}</td>
                        <td class="right">
                            <div v-if="props.item.sales_order_item.discount_qty">
                                {{props.item.invoice_qty > 0? formatPrice(props.item.sales_order_item.unit_price_discount * (props.item.invoice_qty >= props.item.sales_order_item.discount_qty? props.item.sales_order_item.discount_qty : props.item.invoice_qty)): '-'}}
                            </div>
                            <div v-else>
                                -
                            </div>
                        </td>
                        <td class="right">{{formatPrice(props.item.subtotal = (props.item.invoice_qty * props.item.unit_price) - (props.item.sales_order_item.unit_price_discount * (props.item.invoice_qty >= props.item.sales_order_item.discount_qty? props.item.sales_order_item.discount_qty : props.item.invoice_qty)))}}</td>
                        <td>
                            <v-text-field
                                :name="`note_${props.index}`"
                                v-model="props.item.note"
                                required
                                outlined
                                dense
                                class="rounded-sm-form mt-6"
                                :error-messages="error.note"
                            >
                            </v-text-field>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <div class="box-end">
            <v-row>
                <v-col>
                    <DetailRowNew :name="'Voucher Code'" :value="redeem_code" v-if="redeem_code"/>
                    <DetailRowNew :name="'Voucher Code'" :value="'-'" v-else/>
                    <v-alert
                        v-if="extraEdenPoint"
                        color="#EBEBEB"
                        dark
                        outlined
                        style="border-radius: 10px; padding: 10px;"
                    >
                        <img
                            src="/icon/EdenPoint-Icon.svg"
                            alt="icon buy"
                            height="26px"
                            width="26px"
                            class="ml10 vertical-middle"
                        />
                        <span class="text-black pl8">Cashback EdenPoint {{formatUnitPrice(extraEdenPoint)}}</span>
                    </v-alert>
                </v-col>
                <div style="width:5%"/>
                <v-col class="text-black60">
                    <div class="row">
                        <div class="col">
                            Total :
                        </div>
                        <div class="col d-flex justify-end text-black">
                            {{formatPrice(totalPrice)}}
                        </div>
                    </div>
                    <div class="-mt20">
                        <div class="row" v-if="voucherType == 1">
                            <div class="col">
                                Total Discount :
                            </div>
                            <div class="col d-flex justify-end text-black">
                                - {{formatPrice(total_discount)}}
                            </div>
                        </div>
                    </div>
                    <div class="-mt20">
                        <div class="row">
                            <div class="col">
                                Delivery Fee :
                            </div>
                            <div class="col d-flex justify-end text-black">
                                {{formatPrice(delivery_fee)}}
                            </div>
                        </div>
                    </div>
                    <div class="-mt20">
                        <div class="row" v-if="voucherType == 3">
                            <div class="col">
                                Delivery Discount :
                            </div>
                            <div class="col d-flex justify-end text-black">
                                - {{formatPrice(delivery_discount)}}
                            </div>
                        </div>
                    </div>
                    <div class="-mt20">
                        <div class="row" v-if="point_redeem_amount != 0">
                            <div class="col">
                                EdenPoint :
                            </div>
                            <div class="col d-flex justify-end text-black">
                                - {{formatPrice(point_redeem_amount)}}
                            </div>
                        </div>
                    </div>
                    <div class="-mt20">
                        <div class="row">
                            <div class="col d-flex justify-end text-black">
                                <v-checkbox
                                    v-model="deductionCheck"
                                    label="Deduction"
                                    :value="deductionCheck"
                                    :disabled="disableCheck"
                                    style="margin:0px;"
                                ></v-checkbox>
                            </div>
                        </div>
                    </div>
                    <div class="-mt30">
                        <div class="row">
                            <div class="col flex-justify-center">
                                Adjustment (Rp) :
                            </div>
                            <div class="col d-flex justify-end text-black">
                                <div class="mr5 flex-justify-center" v-if="this.deductionCheck">
                                -
                                </div>
                                <vue-numeric
                                    name="adjustment"
                                    class="vue-number-def"
                                    placeholder="0,00"
                                    separator="."
                                    :precision="2"
                                    style="max-width:70%;"
                                    v-model="form.adj_amount"
                                ></vue-numeric>
                            </div>
                        </div>
                    </div>
                    <div class="-mt20">
                        <div class="row" v-if="voucherType == 2">
                            <div class="col">
                                Grand Total Discount :
                            </div>
                            <div class="col d-flex justify-end text-black">
                                - {{formatPrice(grand_total_discount)}}
                            </div>
                        </div>
                    </div>
                    <v-divider class="my-4"/>
                    <div class="row fs20 text-black bold -mt10 mb2">
                        <div class="col">
                            Grand Total Invoice :
                        </div>
                        <div class="col d-flex justify-end">
                            {{formatPrice(grandTotalInvoice)}}
                        </div>
                    </div>
                </v-col>
            </v-row>
            <v-row class="hr-title"/>
            <v-row>
                <v-col>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            to="/finance/si"
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
        <ConfirmationDialogNew :sendData="ConfirmData" :updateNote="this.form.adj_note"/>
    </v-container>
</template>

<script>
    export default {
        data () {
            return {
                deductionCheck : '',
                disableCheck : false,
                invoice_date_model : '',
                invoice_date : '',
                invoice_date_temp : '',
                invoice_due_date_model : '',
                invoice_due_date : '',
                ordertype: '',
                permission:[],
                redeem_code: '',
                form:{
                    sales_order : {
                        code : '',
                        branch : {
                            merchant : {
                                name : '',
                            }
                        },
                    },
                    term_invoice_sls : {
                        name : '',
                        branch: {
                            merchant: {
                                name: ''
                            }
                        }
                    },
                    payment_group_sls : {
                        name: ''
                    },
                    term_payment_sls: {
                        name: ''
                    },
                },
                sendForm:{
                    adj_note:'',
                },
                items:[{
                    product: {
                        name: '',
                        code : '',
                        uom: {
                            name: ''
                        }
                    },
                    sales_order_item : {
                        order_qty : 0,
                    },
                    delivery_qty : 0,
                    receive_qty : 0,
                }],
                error:{},
                ConfirmData:{},
                table: {
                    fields: [
                        {
                            text:'No',
                            width: "3%",
                            sortable: false,
                            class: 'grey--text text--darken-4',
                        },
                        {
                            text:'Product',
                            width: "12%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'UOM',
                            width: "5%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Ordered Qty',
                            class: 'grey--text text--darken-4',
                            width: "5%",
                            align : 'right',
                            sortable: false
                        },
                        {
                            text:'Delivered Qty',
                            class: 'grey--text text--darken-4',
                            width: "5%",
                            align : 'right',
                            sortable: false
                        },
                        {
                            text:'Received Qty',
                            class: 'grey--text text--darken-4',
                            width: "5%",
                            align : 'right',
                            sortable: false
                        },
                        {
                            text:'Invoice Qty',
                            class: 'grey--text text--darken-4',
                            width: "7%",
                            sortable: false
                        },
                        {
                            text:'Unit Price',
                            class: 'grey--text text--darken-4',
                            width: "8%",
                            align : 'right',
                            sortable: false
                        },
                        {
                            text:'Discount Amount',
                            class: 'grey--text text--darken-4',
                            align : 'right',
                            width: "8%",
                            sortable: false
                        },
                        {
                            text:'Subtotal',
                            class: 'grey--text text--darken-4',
                            align : 'right',
                            width: "8%",
                            sortable: false
                        },
                        {
                            text:'Note',
                            class: 'grey--text text--darken-4',
                            width: "12%",
                            sortable: false
                        },
                    ],
                },
                total_price: '',
                grand_total: '',
                voucherType: '',
                delivery_fee: '',
                si_item_id: '',
                so_item_id : '',
                do_items: [],
                days_value: '',
                point_redeem_amount: 0
            }
        },
        created () {
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
                this.$http.get("/finance/sales/invoice/"+this.$route.params.id,{params:{
                        perpage:100,
                        orderby:'-id',
                    }}).then(response => {
                    let that = this
                    let d = response.data.data
                    this.form = response.data.data
                    let arr = response.data.data.sales_invoice_items

                    this.days_value = d.sales_order.term_payment_sls.days_value
                    this.invoice_date = this.$moment(d.recognition_date).format('YYYY-MM-DD')
                    this.invoice_due_date = this.$moment(d.due_date).format('YYYY-MM-DD')
                    this.invoice_date_temp = this.invoice_date
                    this.adjustmentType = d.adjustment
                    this.ordertypeSelected(d.sales_order)

                    this.redeem_code = d.sales_order.vou_redeem_code

                    this.form.order_date = this.$moment(d.sales_order.recognition_date).format('DD/MM/YYYY')
                    if (d.sales_order.branch.merchant.customer_group == 1) {
                        this.form.outlet = d.sales_order.branch.name
                    } else {
                        this.form.outlet = ''
                    }
                    if (d.adjustment == 2) {
                        this.deductionCheck = true
                    } else {
                        this.deductionCheck = ''
                    }

                    this.items = d.sales_invoice_items
                    this.items.forEach((item) => {
                        if(item.sales_order_item.delivery_order_item){
                            item.delivery_qty = item.sales_order_item.delivery_order_item.deliver_qty
                            item.receive_qty = item.sales_order_item.delivery_order_item.receive_qty
                        }
                        else{
                            item.delivery_qty = 0
                            item.receive_qty = 0
                        }
                    });


                    this.form.adj_amount = d.adj_amount
                    this.form.adj_note = d.adj_note

                    this.delivery_fee = d.delivery_fee
                    if (d.sales_order.voucher) {
                        this.voucherType = d.sales_order.voucher.type
                    }
                    if(this.voucherType == 1) {
                        this.total_discount = d.sales_order.voucher.disc_amount
                    } else{
                        this.total_discount = 0
                    }
                    if (this.voucherType == 2) {
                        this.grand_total_discount = d.sales_order.voucher.disc_amount
                    } else{
                        this.grand_total_discount = 0
                    }
                    if (this.voucherType == 3) {
                        this.delivery_discount = d.sales_order.voucher.disc_amount
                    } else{
                        this.delivery_discount = 0
                    }
                    if (this.voucherType == 4) {
                        this.extraEdenPoint = d.sales_order.voucher.disc_amount
                    } else{
                        this.extraEdenPoint = 0
                    }
                    if(d.point_redeem_amount == 0){
                        this.point_redeem_amount = 0
                    }else{
                        this.point_redeem_amount = d.point_redeem_amount
                    }
                });
            },
            confirmButton() {
                let disableSave = false
                if(this.form.adj_note){
                    disableSave = true
                }
                this.sendForm = {
                    sales_order_id: this.form.sales_order.id,
                    term_payment_sls_id: this.form.term_payment_sls.id,
                    term_invoice_sls_id: this.form.term_invoice_sls.id,
                    recognition_date: this.invoice_date,
                    due_date: this.invoice_due_date,
                    billing_address: this.form.billing_address,

                    note: this.form.note,
                    delivery_fee: this.delivery_fee,
                    adj_amount: parseFloat(this.form.adj_amount),
                    adj_note : this.form.adj_note,
                    adjustment: this.adjustmentType,
                    code_ext: this.form.code_ext,
                    invoice_items:[]
                }
                for (let i = 0; i < this.items.length; i++) {
                    if (this.items[i].invoice_qty) {
                        this.sendForm.invoice_items[i] = {
                            product_id: this.items[i].product.id,
                            invoice_qty: this.items[i].invoice_qty,
                            unit_price: this.items[i].unit_price,
                            id: this.items[i].id,
                            note: this.items[i].note,
                        }
                    } else {
                        this.sendForm.invoice_items[i] = {
                            product_id: this.items[i].product.id,
                            invoice_qty: 0,
                            unit_price: this.items[i].unit_price,
                            id: this.items[i].id,
                            note: this.items[i].note,
                        }
                    }
                }

                if (this.form.adj_amount) {
                    this.ConfirmData = {
                        model : true,
                        title : "Adjustment Note",
                        text : "Please fill with the adjustment reason",
                        urlApi : "/finance/sales/invoice/"+this.$route.params.id,
                        nextPage : "/finance/si/detail/"+this.$route.params.id,
                        data : this.sendForm,
                        noDisable : disableSave,
                        adjustmentNote : "Adjustment note"
                    }
                } else {
                    this.ConfirmData = {
                        model : true,
                        title : "Update Sales Invoice",
                        text : "Are you sure want to update this Sales Invoice?",
                        urlApi : "/finance/sales/invoice/"+this.$route.params.id,
                        nextPage : "/finance/si/detail/"+this.$route.params.id,
                        data : this.sendForm,
                    }
                }
            },
            ordertypeSelected(d) {
                this.ordertype = null;
                this.form.order_type_id = ""
                if (d) {
                    this.ordertype = d.order_type
                    this.form.order_type_id = d.order_type.id
                }
            }
        },
        watch: {
            'invoice_date': {
                handler: function (val) {
                    if (val !==  this.invoice_date_temp){
                        this.invoice_date_temp = val;
                        if(val){
                            this.invoice_due_date = this.$moment(this.invoice_date).add(this.days_value, 'days').format('YYYY-MM-DD')
                        }else{
                            this.invoice_due_date = ''
                        }
                    }
                },
                deep: true
            },
            'deductionCheck': {
                handler: function (val) {
                    if (val) {
                        this.adjustmentType = 2
                    } else {
                        if (this.form.adj_amount > 0) {
                            this.adjustmentType = 1
                        } else {
                            this.adjustmentType = 0
                        }
                    }
                },
                deep: true
            },
            'form.adj_amount': {
                handler: function (val) {
                    if (val) {
                        if(this.adjustmentType == 2){
                            this.disableCheck = false
                            this.deductionCheck = true
                        }
                    } else {
                        this.disableCheck = false
                        this.deductionCheck = false
                    }
                },
                deep: true
            },
        },
        computed: {
            totalPrice(){
                this.total_price = 0
                if (this.items.length > 0) {
                    this.items.forEach((r) => {
                        if(r.subtotal){
                            this.total_price += parseFloat(r.subtotal)
                        }
                    });
                }
                return this.total_price
            },
            grandTotalInvoice(){
                this.grand_total = 0
                if (this.form.adj_amount) {
                    if (this.deductionCheck) {
                        this.grand_total = ((parseFloat(this.totalPrice) - parseFloat(this.total_discount)) + (parseFloat(this.delivery_fee) - parseFloat(this.delivery_discount))
                                           - parseFloat(this.grand_total_discount) - parseFloat(this.point_redeem_amount)) - parseFloat(this.form.adj_amount)
                    } else {
                        this.grand_total = ((parseFloat(this.totalPrice) - parseFloat(this.total_discount)) + (parseFloat(this.delivery_fee) - parseFloat(this.delivery_discount))
                                           - parseFloat(this.grand_total_discount) - parseFloat(this.point_redeem_amount)) + parseFloat(this.form.adj_amount)
                    }
                } else {
                    this.grand_total =  (parseFloat(this.totalPrice) - parseFloat(this.total_discount)) + (parseFloat(this.delivery_fee) - parseFloat(this.delivery_discount))
                                        - parseFloat(this.grand_total_discount) - parseFloat(this.point_redeem_amount)
                }
                return this.grand_total
            },
        },
    }
</script>
