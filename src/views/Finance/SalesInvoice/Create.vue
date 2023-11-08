<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24" >
                    <v-text-field
                        name="order_code"
                        v-model="form.order_code"
                        required
                        outlined
                        disabled
                        dense
                        :error-messages="error.order_code"
                    >
                        <template v-slot:label>
                            Order Code *
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24" >
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
                        <template v-slot:label>Order Date*</template>
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
                                    <template v-slot:label>Invoice Date<span style="color:red">*</span>
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
                <v-col cols="12" md="6" class="-mt24" >
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
                                    @click:clear="form.invoice_due_date = ''"
                                    v-model="form.invoice_due_date"
                                    maxlength="10"
                                    onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 45"
                                    :error-messages="error.due_date"
                                >
                                    <template v-slot:label>Invoice Due Date<span style="color:red">*</span>
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            no-title
                            v-model="form.invoice_due_date"
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
                <v-col cols="12" md="6" class="-mt24" >
                    <v-text-field
                        name="customer"
                        v-model="form.customer"
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
                <v-col cols="12" md="6" class="-mt24" v-if="this.form.outlet">
                    <v-text-field
                        name="outlet"
                        v-model="form.outlet"
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
                <v-col cols="12" md="6" class="-mt24" >
                    <v-text-field
                        name="payment_term"
                        v-model.number="form.payment_term"
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
                <v-col cols="12" md="6" class="-mt24" >
                    <v-text-field
                        name="invoice_term"
                        v-model="form.invoice_term"
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
                <v-col cols="12" md="6" class="-mt24" >
                    <v-text-field
                        name="payment_group"
                        v-model="form.payment_group"
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
                        required
                        outlined
                        :counter="250"
                        maxlength="250"
                        rows="3"
                        dense
                        :error-messages="error.billing_address"
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
                            <span class="text-black60" v-if="props.item.discount_qty > 0">
                                Qty discount max.  {{ props.item.discount_qty }} {{ props.item.product.uom.name }}
                            </span>
                        </td>
                        <td>{{props.item.product.uom.name}}</td>
                        <td class="right">{{formatPrice(props.item.order_qty)}}</td>
                        <td class="right">{{formatPrice(props.item.delivery_qty)}}</td>
                        <td class="right">{{formatPrice(props.item.receive_qty)}}</td>
                        <td>
                            <vue-numeric
                                name="invoice_qty"
                                class="rounded-sm-form productNumeric"
                                style="margin-left:-10px;"
                                placeholder="0,00"
                                separator="."
                                :precision="2"
                                v-model="input_invoice_qty[props.index]"
                            ></vue-numeric>
                        </td>
                        <td>
                            <vue-numeric
                                name="unit_price"
                                class="rounded-sm-form productNumeric"
                                style="margin-left:-10px;"
                                disabled
                                separator="."
                                :precision="2"
                                v-model="props.item.unit_price"
                            ></vue-numeric>
                        </td>
                        <td class="right">
                            <div v-if="props.item.discount_qty">
                                {{input_invoice_qty[props.index] > 0? formatPrice(props.item.unit_price_discount * (input_invoice_qty[props.index] >= props.item.discount_qty? props.item.discount_qty : input_invoice_qty[props.index])): '-'}}
                            </div>
                            <div v-else>
                                -
                            </div>
                        </td>
                        <td class="right">
                            <div v-if="input_invoice_qty[props.index]">
                                {{formatPrice(props.item.subtotal = (input_invoice_qty[props.index] * props.item.unit_price) - (props.item.unit_price_discount * (input_invoice_qty[props.index] >= props.item.discount_qty? props.item.discount_qty : input_invoice_qty[props.index])))}}
                            </div>
                            <div v-else>
                                {{formatPrice(props.item.subtotal = 0 * props.item.unit_price)}}
                            </div>
                        </td>
                        <td>
                            <v-text-field
                                name="note"
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
                    <DetailRowNew :name="'Voucher Code'" :value="form.vou_redeem_code" v-if="form.vou_redeem_code"/>
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
                                    v-model.number="adj_amount"
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
        name: "CreateSalesInvoice",
        data () {
            return {
                deductionCheck : '',
                disableCheck : false,
                invoice_date_model : '',
                invoice_date_temp : '',
                invoice_date : '',
                invoice_due_date_model : '',
                ordertype: '',
                form:{},
                sendForm:{
                    billing_address:'',
                    adj_note:''
                },
                items:[],
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
                            width: "11%",
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
                            width: "5%",
                            align : 'right',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Delivered Qty',
                            width: "5%",
                            align : 'right',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Received Qty',
                            width: "5%",
                            align : 'right',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Invoice Qty',
                            width: "8%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Unit Price',
                            width: "8%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Discount Amount',
                            width: "8%",
                            class: 'grey--text text--darken-4',
                            align: "right",
                            sortable: false
                        },
                        {
                            text:'Subtotal',
                            width: "8%",
                            align : 'right',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Note',
                            width: "12%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                    ],
                },
                total_price: '',
                voucherType: '',
                so_item_id: '',
                input_invoice_qty : [],
                adj_amount: 0,
                delivery_fee:'',
                point_redeem_amount: 0,
                extraEdenPoint: 0
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
            async renderData(){
                await this.$http.get("/sales/order/"+this.$route.params.id,{params:{
                        embeds:'product',
                        perpage:100,
                        orderby:'-id',
                    }}).then(response => {
                    let d = JSON.parse(JSON.stringify(response.data.data))
                    this.form = d
                    this.items = []

                    this.form.order_code = d.code
                    this.form.order_date = this.$moment(d.recognition_date).format('DD/MM/YYYY')
                    this.invoice_date =  new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10);
                    this.invoice_date_temp =  this.invoice_date
                    this.form.invoice_due_date = this.$moment(this.invoice_date).add(d.term_payment_sls.days_value, 'days').format('YYYY-MM-DD')

                    this.form.days_value = d.term_payment_sls.days_value
                    this.form.customer = d.branch.merchant.name
                    this.form.payment_term = d.term_payment_sls.name
                    this.form.invoice_term = d.term_invoice_sls.name
                    this.form.payment_group = d.payment_group.name
                    this.form.payment_group_id = response.data.data.payment_group.id
                    this.ordertypeSelected(d)

                    if (d.term_invoice_sls.name === 'Direct Invoice'){
                            this.form.note = d.note
                    }

                    if (d.branch.merchant.customer_group == 1) {
                        this.form.outlet = d.branch.name
                    } else {
                        this.form.outlet = ''
                    }

                    if (this.adjustmentType == 2) {
                        this.deductionCheck = true
                    } else {
                        this.deductionCheck = ''
                    }

                    this.items = d.sales_order_items
                    this.items.forEach((item,i) => {
                        if(item.delivery_order_item){
                            this.input_invoice_qty[i] = item.delivery_order_item.receive_qty
                            item.delivery_qty = item.delivery_order_item.deliver_qty
                            item.receive_qty = item.delivery_order_item.receive_qty
                        }
                        else{
                            this.input_invoice_qty[i] = 0
                            item.delivery_qty = 0
                            item.receive_qty = 0
                        }
                    });

                    this.form.redeem_code = d.vou_redeem_code
                    if (d.voucher) {
                        this.voucherType = d.voucher.type
                    }

                    this.delivery_fee = d.delivery_fee
                    if(this.voucherType == 1) {
                        this.total_discount = d.vou_disc_amount
                    } else{
                        this.total_discount = 0
                    }
                    if (this.voucherType == 2) {
                        this.grand_total_discount = d.vou_disc_amount
                    } else{
                        this.grand_total_discount = 0
                    }
                    if (this.voucherType == 3) {
                        this.delivery_discount = d.vou_disc_amount
                    } else{
                        this.delivery_discount = 0
                    }
                    if (this.voucherType == 4) {
                        this.extraEdenPoint = d.voucher.disc_amount
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
                let date1 = this.$moment(this.form.recognition_date);
                let date2 = this.$moment(this.form.invoice_due_date)
                let diff  = date2.diff(date1,'days');
                this.sendForm = {
                    sales_order_id: this.$route.params.id,
                    term_payment_sls_id: this.form.term_payment_sls.id,
                    term_invoice_sls_id: this.form.term_invoice_sls.id,
                    payment_group_sls_id: this.form.payment_group_id,
                    recognition_date: this.invoice_date,
                    due_date: this.form.invoice_due_date,
                    days_value: diff,
                    billing_address: this.form.billing_address,
                    note: this.form.note,
                    delivery_fee: this.delivery_fee,
                    adj_amount: parseFloat(this.adj_amount),
                    adjustment: this.adjustmentType,
                    code_ext: this.form.order_code,
                    invoice_items:[]
                }
                for (let i = 0; i < this.items.length; i++) {
                    if (this.input_invoice_qty[i]) {
                        this.sendForm.invoice_items[i] = {
                            product_id: this.items[i].product.id,
                            invoice_qty: this.input_invoice_qty[i],
                            unit_price: this.items[i].unit_price,
                            sales_order_item_id: this.items[i].id,
                            note: this.items[i].note,
                        }
                    } else {
                        this.sendForm.invoice_items[i] = {
                            product_id: this.items[i].product.id,
                            invoice_qty: 0,
                            unit_price: this.items[i].unit_price,
                            sales_order_item_id: this.items[i].id,
                            note: this.items[i].note,
                        }
                    }
                }

                if (this.adj_amount) {
                    this.ConfirmData = {
                        model : true,
                        title : "Adjustment Note",
                        text : "Please fill with the adjustment reason",
                        urlApi : "/finance/sales/invoice",
                        nextPage : "/finance/si/detail/:id",
                        post : true,
                        data : this.sendForm,
                        adjustmentNote : "Adjustment note"
                    }
                } else {
                    this.ConfirmData = {
                        model : true,
                        title : "Create Sales Invoice",
                        text : "Are you sure want to create this Sales Invoice?",
                        urlApi : "/finance/sales/invoice",
                        nextPage : "/finance/si/detail/:id",
                        post : true,
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
                            this.form.invoice_due_date = this.$moment(this.invoice_date).add(this.form.days_value, 'days').format('YYYY-MM-DD')
                        }else{
                            this.form.invoice_due_date = ''
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
                        if (this.adj_amount > 0) {
                            this.adjustmentType = 1
                        } else {
                            this.adjustmentType = 0
                        }
                    }
                },
                deep: true
            },
            'adj_amount': {
                handler: function (val) {
                    if (val) {
                        this.disableCheck = false
                        this.deductionCheck = true
                    } else {
                        this.disableCheck = true
                        this.deductionCheck = false
                        this.adj_amount = 0
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
                if (this.adj_amount) {
                    if (this.deductionCheck) {
                        this.grand_total = ((parseFloat(this.totalPrice) - parseFloat(this.total_discount)) + (parseFloat(this.delivery_fee) - parseFloat(this.delivery_discount))
                                           - parseFloat(this.grand_total_discount) - parseFloat(this.point_redeem_amount)) - parseFloat(this.adj_amount)
                    } else {
                        this.grand_total = ((parseFloat(this.totalPrice) - parseFloat(this.total_discount)) + (parseFloat(this.delivery_fee) - parseFloat(this.delivery_discount))
                                           - parseFloat(this.grand_total_discount) - parseFloat(this.point_redeem_amount)) + parseFloat(this.adj_amount)
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
