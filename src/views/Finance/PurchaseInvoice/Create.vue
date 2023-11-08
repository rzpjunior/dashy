<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="px-3">
                <v-col class="fs25"></v-col>
                <v-col class="d-flex justify-end align-end"></v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6" >
                    <v-text-field
                        name="po_code"
                        v-model="form.po_code"
                        required
                        outlined
                        disabled
                        dense
                        :error-messages="error.po_code"
                    >
                        <template v-slot:label>
                            Purchase Order Code <span class="text-red">*</span>
                        </template>
                    </v-text-field>
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
                                    name="invoice_date"
                                    prepend-inner-icon="mdi-calendar"
                                    dense
                                    outlined
                                    required
                                    clearable
                                    @click:clear="form.invoice_date = ''"
                                    v-model="form.invoice_date"
                                    maxlength="10"
                                    onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 45"
                                    :error="error.recognition_date"
                                >
                                    <template v-slot:label>
                                        Purchase Invoice Date <span class="text-red">*</span>
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            v-model="form.invoice_date"
                            @input="invoice_date_model = false"
                        ></v-date-picker>
                    </v-menu>
                    <v-text-field
                        name="supplier"
                        v-model="form.supplier"
                        required
                        outlined
                        disabled
                        dense
                        :error-messages="error.supplier"
                    >
                        <template v-slot:label>
                            Supplier <span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                    <v-menu
                        ref="menu"
                        v-model="order_date_model"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-text-field
                                    name="order_date"
                                    prepend-inner-icon="mdi-calendar"
                                    outlined
                                    required
                                    disabled
                                    clearable
                                    :value="$moment(form.order_date).format('DD/MM/YYYY')"
                                    :error-messages="error.order_date"
                                    dense
                                >
                                    <template v-slot:label>
                                        Purchase Order Date <span class="text-red">*</span>
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            @input="order_date_model = false"
                            v-model="form.order_date"
                        ></v-date-picker>
                    </v-menu>
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
                                    name="invoice_due_date"
                                    prepend-inner-icon="mdi-calendar"
                                    outlined
                                    required
                                    clearable
                                    dense
                                    @click:clear="form.invoice_due_date = ''"
                                    v-model="form.invoice_due_date"
                                    maxlength="10"
                                    onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 45"
                                    :error-messages="error.due_date"
                                >
                                    <template v-slot:label>
                                        Purchase Invoice Due Date <span class="text-red">*</span>
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            v-model="form.invoice_due_date"
                            @input="invoice_due_date_model = false"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <v-textarea
                        name="note"
                        v-model="form.note"
                        :counter="250"
                        maxlength="250"
                        outlined
                        required
                        :rows="3"
                        :error-messages="error.note"
                    >
                        <template v-slot:label>
                            Note
                        </template>
                    </v-textarea>
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table">Products</div>
        <div class="box-body-table">
            <v-data-table
                :headers="table.fields"
                :items="items"
                :hide-default-footer="true"
                :items-per-page="-1"
                :mobile-breakpoint="0"
            >
                <template v-slot:item="props">
                    <tr>
                        <td>{{props.index + 1}}</td>
                        <td>{{props.item.product.code}} - {{props.item.product.name}}</td>
                        <td>{{props.item.product.uom.name}}</td>
                        <td>{{ formatPrice(props.item.order_qty) }}</td>
                        <td>
                            <span v-if="props.item.receive_qty">{{ formatPrice(props.item.receive_qty) }}</span>
                            <span v-else>{{ formatPrice(0) }}</span>
                        </td>
                        <td>
                            <vue-numeric
                                :name="`invoice_qty_${props.index}`"
                                v-model.number="product_invoice_qty[props.index]"
                                required
                                dense
                                placeholder="0,00"
                                separator="."
                                :precision="2"
                                class="rounded-sm-form productNumeric"
                                :error-messages="error.invoice_qty"
                            ></vue-numeric>
                        </td>
                        <td>
                            <vue-numeric
                                :name="`tax_${props.index}`"
                                class="productNumeric"
                                separator="."
                                placeholder="0"
                                @focus="productIdx = props.index"
                                dense
                                v-model="props.item.tax_percentage"
                                :disabled="props.item.taxable_item !== 1"
                            ></vue-numeric>
                        </td>
                        <td>
                            <span v-if="props.item.include_tax === 1">Yes</span>
                            <span v-else>No</span>
                        </td>
                        <td>
                            <div v-if="props.item.include_tax === 1">
                                <span>{{ formatPrice(props.item.unit_price_non_tax = Math.round(props.item.unit_price_tax *  (100 / (100 + props.item.tax_percentage)))) }}</span>
                                /
                                <span v-if="props.item.tax_percentage">{{ formatPrice(props.item.unit_price_tax = Math.round(props.item.unit_price_tax)) }}</span>
                                <span v-else>0</span>
                            </div>
                            <div v-else>
                                <span>{{ formatPrice(props.item.unit_price_non_tax = Math.round(props.item.unit_price)) }}</span>
                                /
                                <span v-if="props.item.tax_percentage">{{ formatPrice(props.item.unit_price_tax = Math.round(props.item.unit_price * (100 + props.item.tax_percentage) / 100)) }}</span>
                                <span v-else>0</span>
                            </div>
                        </td>
                        <td>
                            <span v-if="props.item.include_tax === 1">{{ formatPrice(props.item.tax_amount = Math.round((props.item.unit_price_tax - props.item.unit_price_non_tax) * product_invoice_qty[props.index])) }}</span>
                            <span v-else>{{ formatPrice(props.item.tax_amount = Math.round((props.item.unit_price * props.item.tax_percentage / 100 * product_invoice_qty[props.index]))) }}</span>
                        </td>
                        <td>
                            <span>{{ formatPrice(props.item.subtotal = Math.round(product_invoice_qty[props.index] * props.item.unit_price_non_tax)) }}</span>
                        </td>
                        <td>
                            <v-text-field
                                :name="`note_${props.index}`"
                                v-model="props.item.note"
                                outlined
                                dense
                                class="rounded-sm-form mt-6"
                            >
                            </v-text-field>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <div class="box-end">
            <v-row>
                <v-col class="text-black60">
                    <div class="row">
                        <div class="col">
                            <MultiSelectDN
                                name="debit_note"
                                :dense="true"
                                :sr_id="supp_id"
                                :total_price="grandTotalInvoice"
                                @selected="dnSelected"
                            >
                            </MultiSelectDN>
                        </div>
                        <div class="box-header-table custom-table">List of Selected Debit Notes</div>
                        <div class="box-body-table">
                            <v-data-table
                                :headers="tableDN.fields"
                                :items="debit_notes"
                                :hide-default-footer="true"
                                :items-per-page="-1"
                                :mobile-breakpoint="0"
                            >
                                <template v-slot:item="props">
                                    <tr style="padding: -20px;">
                                        <td>{{ props.index + 1 }}</td>
                                        <td>{{ props.item.code }}</td>
                                        <td>{{ formatPrice(props.item.total_price) }}</td>
                                        <td>
                                            <v-btn
                                                icon
                                                @click="removeDebitNote(props.index)"
                                            >
                                                <img
                                                    src="/icon/close-new.png"
                                                    height="20px"
                                                    width="20px"
                                                />
                                            </v-btn>
                                        </td>
                                    </tr>
                                </template>
                            </v-data-table>
                        </div>
                    </div>
                </v-col>
                <v-col class="text-black60">
                    <div class="row">
                        <div class="col">Total:</div>
                        <div class="col d-flex justify-end text-black" name="total">{{formatPrice(totalPrice)}}</div>
                    </div>
                    <div class="-mt10">
                        <div class="row">
                            <div class="col">Total Tax Amount:</div>
                            <div class="col d-flex justify-end text-black" name="total">{{formatPrice(totalTaxAmount)}}</div>
                        </div>
                    </div>
                    <div class="-mt10">
                        <div class="row">
                            <div class="col">Total Debit Note:</div>
                            <div class="col d-flex justify-end text-black" name="total">{{formatPrice(totalDebitNote)}}</div>
                        </div>
                    </div>
                    <div class="-mt10">
                        <div class="row">
                            <div class="col flex-justify-center">Delivery Fee:</div>
                            <div class="col d-flex justify-end text-black">
                                <vue-numeric
                                    name="delivery_fee"
                                    v-model.number="delivery_fee"
                                    class="vueNumeric"
                                    placeholder="0,00"
                                    separator="."
                                    :precision="2"
                                    :error-messages="error.delivery_fee"
                                ></vue-numeric>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col d-flex align-center">Adjustment (Rp):</div>
                        <div class="col d-flex justify-end align-center text-black">
                            <div class="pr-4" v-if="this.deductionCheck">
                                -
                            </div>
                            <vue-numeric
                                name="adjustment"
                                class="vueNumeric"
                                placeholder="0,00"
                                separator="."
                                :precision="2"
                                v-model.number="adj_amount"
                                :error-messages="error.adj_amount"
                            ></vue-numeric>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col flex-justify-center"></div>
                        <div class="col flex-align-end">
                            <v-checkbox
                                name="adj_deduction"
                                v-model.number="deductionCheck"
                                label="Deduction"
                                :value="deductionCheck"
                                :disabled="disableCheck"
                                class="ma-0"
                            ></v-checkbox>
                        </div>
                    </div>
                    <v-divider class="my-4" />
                    <div class="row fs20 text-black bold -mt10 mb2">
                        <div class="col">Grand Total Invoice (Rp):</div>
                        <div class="col d-flex justify-end">
                            {{formatPrice(grandTotalInvoice)}}
                        </div>
                    </div>
                </v-col>
            </v-row>
            <v-row class="hr-title" />
            <v-row>
                <v-col>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            depressed
                            outlined
                            color="#EBEBEB"
                            class="main-btn"
                            @click="$router.go(-1)"
                        >
                            <span class="text-black80">Cancel</span>
                        </v-btn>
                        <v-btn
                            @click="confirmButton()"
                            depressed
                            color="#50ABA3"
                            class="main-btn white--text"
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
<style scoped>
.custom-table{
    margin-top: -30px;
}
</style>
<script>
    export default {
        data () {
            return {
                deductionCheck : '',
                disableCheck : false,
                order_date_model : '',
                order_date : '',
                invoice_date_model : '',
                invoice_date : '',
                invoice_due_date_model : '',
                invoice_due_date : '',
                form : {
                    po_code : "",
                    invoice_date : new Date().toISOString().substr(0, 10),
                    supplier : "",
                    order_date : "",
                    invoice_due_date : new Date().toISOString().substr(0, 10),
                    note : "",
                    products : [
                        {
                            invoice_qty : 0,
                            note : ""
                        }
                    ],
                },
                sendForm:{
                    adj_note:'',
                },
                items:[],
                itemGR:[],
                error:{},
                ConfirmData:{},
                tableDN:{
                    fields: [
                        {
                            text:'No',
                            width: "3%",
                            sortable: false,
                            class: "grey--text text--darken-4",
                        },
                        {
                            text:'Code',
                            sortable: false,
                            class: "grey--text text--darken-4",
                        },
                        {
                            text:'Total Amount',
                            sortable: false,
                            class: "grey--text text--darken-4",
                        },
                        {
                            width:'5%',
                            sortable: false,
                            class: "grey--text text--darken-4",
                        }
                    ]
                },
                table: {
                    fields: [
                        {
                            text:'No',
                            width: "3%",
                            sortable: false,
                            class: "grey--text text--darken-4",
                        },
                        {
                            text:'Product',
                            width: "12%",
                            sortable: false,
                            class: "grey--text text--darken-4",
                        },
                        {
                            text:'UOM',
                            width: "5%",
                            sortable: false,
                            class: "grey--text text--darken-4",
                        },
                        {
                            text:'Order Qty',
                            width: "5%",
                            sortable: false,
                            class: "grey--text text--darken-4",
                        },
                        {
                            text:'Receive Qty',
                            width: "5%",
                            sortable: false,
                            class: "grey--text text--darken-4",
                        },
                        {
                            text:'Invoice Qty',
                            width: "7%",
                            sortable: false,
                            class: "grey--text text--darken-4",
                        },
                        {
                            text:'Tax',
                            width: "5%",
                            sortable: false,
                            class: "grey--text text--darken-4"
                        },
                        {
                            text:'Include Tax',
                            width: "5%",
                            sortable: false,
                            class: "grey--text text--darken-4"
                        },
                        {
                            text:'Unit Price non Tax / Unit Price Tax',
                            width: "12%",
                            sortable: false,
                            class: "grey--text text--darken-4"
                        },
                        {
                            text:'Tax Amount',
                            width: "5%",
                            sortable: false,
                            class: "grey--text text--darken-4"
                        },
                        {
                            text:'Subtotal',
                            width: "8%",
                            sortable: false,
                            class: "grey--text text--darken-4",
                        },
                        {
                            text:'Note',
                            width: "12%",
                            sortable: false,
                            class: "grey--text text--darken-4",
                        },
                    ],
                },
                po_item_id: '',
                gr_item_id: '',
                total_price: 0,
                total_tax_amount: 0,
                total_debit_note: 0,
                tax_percentage: 0,
                delivery_fee: 0,
                adj_amount: 0,
                product_invoice_qty : [],
                SelectDN: '',
                supp_id: '',
                debit_notes: []
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
            //select DN based on id
            dnSelected(d){
                if(d){
                    this.SelectDN = d.id
                    this.debit_notes.push({
                        debit_note_id: d.id,
                        code: d.code,
                        total_price: d.total_price
                    })
                }
            },
            //remove dn from table
            removeDebitNote(idx){
                this.debit_notes.splice(idx, 1)
            },
            renderData(){
                this.$http.get("/purchase/order/"+this.$route.params.id,{params:{
                        perpage:100,
                        orderby:'-id',
                    }}).then(response => {
                    let that = this
                    let d = response.data.data
                    this.form = response.data.data
                    let arr = response.data.data.purchase_order_items

                    this.supp_id = d.supplier.id
                    this.form.po_code = d.code
                    this.form.order_date = d.recognition_date
                    this.form.supplier = d.supplier.name

                    this.form.invoice_date = new Date().toISOString().substr(0, 10)
                    this.form.invoice_due_date = this.$moment(this.form.invoice_date).add('days', d.term_payment_pur.days_value).format('YYYY-MM-DD')

                    for (let i=0;i<arr.length; i++) {
                        this.po_item_id = arr[i].id
                        this.$http.get("/warehouse/goods/receipt/item",{params:{
                            conditions: 'purchaseorderitem.id.e:'+this.po_item_id,
                            embeds: 'goodsreceipt,purchaseorderitem,product',
                            orderby:'-id',
                        }}).then(responseGR => {
                                if (responseGR){
                                    arr[i].receive_qty = parseFloat(responseGR.data.data[0].receive_qty)
                                    arr[i].note = responseGR.data.data[0].note
                                    if (responseGR.data.data[0].goods_receipt.status == 2) {
                                        if (response.data.data.purchase_order_items[i].product.id == responseGR.data.data[0].product.id) {
                                            this.product_invoice_qty[i] = parseFloat(responseGR.data.data[0].receive_qty)
                                        } else{
                                            this.product_invoice_qty[i] = parseFloat(0)
                                        }
                                    } else {
                                        this.product_invoice_qty[i] = parseFloat(0)
                                    }
                                } else {
                                    this.product_invoice_qty[i] = parseFloat(0)
                                    arr[i].receive_qty = parseFloat(0)
                                }
                            });
                    }
                    setTimeout(function(){
                        that.items = arr
                    }, 1500);
                    this.tax_percentage = d.tax_pct
                    this.delivery_fee = d.delivery_fee
                });
            },
            confirmButton() {
                this.sendForm = {
                    purchase_order_id: this.form.id,
                    recognition_date: this.form.invoice_date,
                    due_date: this.form.invoice_due_date,
                    note: this.form.note,
                    tax_pct: this.tax_percentage,
                    delivery_fee: this.delivery_fee,
                    adj_amount: this.adj_amount,
                    deduction: this.adjustmentType,
                    adj_note: this.form.note,
                    debit_notes: this.debit_notes,
                    invoice_items:[]
                }
                for (let i = 0; i < this.items.length; i++) {
                    if(this.items[i].taxable_item === 1){
                        if (this.items[i].include_tax === 1) {
                            this.sendForm.invoice_items[i] = {
                                product_id: this.items[i].product.id,
                                purchase_order_item_id: this.items[i].id,
                                invoice_qty: this.product_invoice_qty[i],
                                uom: this.items[i].product.uom.name,
                                unit_price: this.items[i].unit_price_tax,
                                include_tax: this.items[i].include_tax,
                                tax_percentage: this.items[i].tax_percentage,
                                note: this.items[i].note,
                            }
                        } else {
                            this.sendForm.invoice_items[i] = {
                                product_id: this.items[i].product.id,
                                purchase_order_item_id: this.items[i].id,
                                invoice_qty: this.product_invoice_qty[i],
                                uom: this.items[i].product.uom.name,
                                unit_price: this.items[i].unit_price,
                                include_tax: this.items[i].include_tax,
                                tax_percentage: this.items[i].tax_percentage,
                                note: this.items[i].note,
                            }
                        }
                    } else {
                        this.sendForm.invoice_items[i] = {
                            product_id: this.items[i].product.id,
                            purchase_order_item_id: this.items[i].id,
                            invoice_qty: this.product_invoice_qty[i],
                            uom: this.items[i].product.uom.name,
                            unit_price: this.items[i].unit_price,
                            include_tax: this.items[i].include_tax,
                            tax_percentage: this.items[i].tax_percentage,
                            note: this.items[i].note,
                        }
                    }
                }
                if (this.adj_amount) {
                    this.ConfirmData = {
                        model : true,
                        title : "Adjustment Note",
                        text : "Please fill with the adjustment reason",
                        urlApi : "/finance/purchase/invoice",
                        nextPage : "/finance/purc-invoice",
                        data : this.sendForm,
                        post : true,
                        adjustmentNote : "Adjustment note"
                    }
                } else {
                    this.ConfirmData = {
                        model : true,
                        title : "Create Purchase Invoice",
                        text : "Are you sure want to create this purchase invoice?",
                        urlApi : "/finance/purchase/invoice",
                        nextPage : "/finance/purc-invoice",
                        post : true,
                        data : this.sendForm,
                    }
                }
            },
        },
        watch: {
            'deductionCheck': {
                handler: function (val) {
                    if (val) {
                        this.adjustmentType = 1
                    } else {
                        this.adjustmentType = 0
                    }
                },
                deep: true
            },
            'adj_amount': {
                handler: function (val) {
                    if (val) {
                        if(this.adjustmentType == 2){
                            this.disableCheck = false
                            this.deductionCheck = true
                        } else {
                            this.disableCheck = false
                            this.deductionCheck = false
                        }
                    } else {
                        this.disableCheck = true
                        this.deductionCheck = false
                    }
                },
                deep: true
            },
        },
        computed: {
            totalPrice(){
                this.total_price = 0
                this.items.forEach((r) => {
                    if(r.subtotal){
                        this.total_price += Math.round(r.subtotal)
                    }
                });
                return this.total_price
            },
            totalTaxAmount(){
                this.total_tax_amount = 0
                this.items.forEach((r) => {
                    if(r.tax_amount){
                        this.total_tax_amount += Math.round(r.tax_amount)
                    }
                });
                return this.total_tax_amount
            },
            totalDebitNote(){ //count total debitnote from selected debit note
                this.total_debit_note = 0
                this.debit_notes.forEach((r) => {
                    if(r.total_price){
                        this.total_debit_note += Math.round(r.total_price)
                    }
                });
                return this.total_debit_note
            },
            grandTotalInvoice(){
                this.grand_total = 0
                if (this.adj_amount) {
                    if (this.deductionCheck) {
                        this.grand_total = (Math.round(this.totalPrice) + Math.round(this.totalTaxAmount)  + Math.round(this.delivery_fee)) - Math.round(this.adj_amount)
                    } else {
                        this.grand_total = (Math.round(this.totalPrice) + Math.round(this.totalTaxAmount) + Math.round(this.delivery_fee)) + Math.round(this.adj_amount)
                    }
                } else {
                    this.grand_total =  Math.round(this.totalPrice) + Math.round(this.totalTaxAmount) - Math.round(this.totalDebitNote) + Math.round(this.delivery_fee)
                }
                return this.grand_total
            },
        },
    }
</script>