<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row>
                <v-col class="fs24 bold">
                    {{form.code}}
                </v-col>
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
                        :error-messages="error.po_code"
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
                                    dense
                                    :error-messages="error.order_date"
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
                        rows="3"
                    >
                        <template v-slot:label>
                            Note
                        </template>
                    </v-textarea>
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
                :mobile-breakpoint="0"
            >
                <template v-slot:item="props">
                    <tr>
                        <td>{{props.index + 1}}</td>
                        <td>{{props.item.product.code}} - {{props.item.product.name}}</td>
                        <td>{{props.item.product.uom.name}}</td>
                        <td>{{formatPrice(props.item.purchase_order_item.order_qty)}}</td>
                        <td>
                            <div v-if="props.item.good_receipt_item">
                                {{formatPrice(props.item.good_receipt_item.receive_qty)}}
                            </div>
                            <div v-else>
                                0,00
                            </div>
                        </td>
                        <td>
                            <vue-numeric
                                :name="`invoice_qty_${props.index}`"
                                v-model.number="props.item.invoice_qty"
                                required
                                dense
                                placeholder="0,00"
                                separator="."
                                :precision="2"
                                style="max-width:90px"
                                class="rounded-sm-form productNumeric"
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
                            <span v-if="props.item.include_tax === 1">{{ formatPrice(Math.round(props.item.tax_amount = Math.round((props.item.unit_price_tax - props.item.unit_price_non_tax) * props.item.invoice_qty))) }}</span>
                            <span v-else>{{ formatPrice(Math.round(props.item.tax_amount = Math.round(props.item.unit_price *  props.item.tax_percentage / 100 * props.item.invoice_qty))) }}</span>
                        </td>
                        <td>
                            <span>{{ formatPrice(props.item.subtotal = Math.round(props.item.invoice_qty * props.item.unit_price_non_tax)) }}</span>
                        </td>
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
                            <span>{{ error.debit_note_id }}</span>
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
                        <div class="col d-flex justify-end text-black">{{formatPrice(totalPrice)}}</div>
                    </div>
                    <div class="-mt10">
                        <div class="row">
                            <div class="col">Total Tax Amount:</div>
                            <div class="col d-flex justify-end text-black">{{formatPrice(totalTaxAmount)}}</div>
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
                            <div class="col">Delivery Fee:</div>
                            <div class="col d-flex justify-end text-black">{{formatPrice(delivery_fee)}}</div>
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
                                v-model="form.adj_amount"
                            ></vue-numeric>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col flex-justify-center"></div>
                        <div class="col flex-align-end">
                            <v-checkbox
                                v-model="deductionCheck"
                                label="Deduction"
                                :value="deductionCheck"
                                :disabled="disableCheck"
                                class="ma-0"
                            ></v-checkbox>
                        </div>
                    </div>
                    <v-divider class="my-4" />
                    <div class="row fs20 text-black bold -mt10 mb2">
                        <div class="col"><h3>Grand Total Invoice (Rp):</h3></div>
                        <div class="col d-flex justify-end">{{formatPrice(grandTotalInvoice)}}</div>
                    </div>
                </v-col>
            </v-row>
            <v-row class="hr-title" />
            <v-row class="mt-1">
                <v-col>
                    <v-card-actions class="pb-4">
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
                form:[],
                sendForm:{
                    adj_note:'',
                },
                items:[],
                error:{},
                debit_notes: [],
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
                            class: "grey--text text--darken-4"
                        },
                        {
                            text:'Product *',
                            width: "13%",
                            sortable: false,
                            class: "grey--text text--darken-4"
                        },
                        {
                            text:'UOM',
                            width: "5%",
                            sortable: false,
                            class: "grey--text text--darken-4"
                        },
                        {
                            text:'Order Qty',
                            width: "5%",
                            sortable: false,
                            class: "grey--text text--darken-4"
                        },
                        {
                            text:'Receive Qty',
                            width: "5%",
                            sortable: false,
                            class: "grey--text text--darken-4"
                        },
                        {
                            text:'Invoice Qty *',
                            width: "7%",
                            sortable: false,
                            class: "grey--text text--darken-4"
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
                            class: "grey--text text--darken-4"
                        },
                        {
                            text:'Note',
                            width: "12%",
                            sortable: false,
                            class: "grey--text text--darken-4"
                        },
                    ],
                },
                total_price: '',
                total_tax_amount: '',
                tax_percentage: '',
                delivery_fee: '',
                SelectDN: '',
                supp_id: '',
                total_debit_note: 0,
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
            removeDebitNote(idx){
                this.debit_notes.splice(idx, 1)
            },
            renderData(){
                this.$http.get("/finance/purchase/invoice/"+this.$route.params.id,{params:{
                        perpage:100,
                        orderby:'-id',
                    }}).then(response => {
                    let d = response.data.data
                    this.form = response.data.data
                    this.items = response.data.data.purchase_invoice_items
                    if(response.data.data.debit_note !== null){
                        d.debit_note.forEach(e => {
                            this.debit_notes.push({
                                debit_note_id: e.id,
                                code: e.code,
                                total_price: e.total_price
                            })
                        })
                    }
                    this.form.po_code = d.purchase_order.code
                    this.form.order_date = d.purchase_order.recognition_date
                    this.form.invoice_date = this.$moment(d.recognition_date).format('YYYY-MM-DD')
                    this.form.invoice_due_date = this.$moment(d.due_date).format('YYYY-MM-DD')
                    this.supp_id = d.purchase_order.supplier.id
                    this.form.supplier = d.purchase_order.supplier.name
                    this.tax_percentage = d.tax_pct
                    this.delivery_fee = d.delivery_fee
                    if (d.adjustment == 2) {
                        this.deductionCheck = true
                    } else {
                        this.deductionCheck = ''
                    }
                    this.adjustmentType = d.adjustment
                    this.form.adj_amount = d.adj_amount
                    this.sendForm.adj_note = d.adj_note
                });
            },
            confirmButton() {
                if (this.deductionCheck) {
                    this.adjustmentType = 1
                } else {
                    this.adjustmentType = 0
                }
                this.sendForm = {
                    purchase_order_id: this.form.purchase_order.id,
                    recognition_date: this.form.invoice_date,
                    due_date: this.form.invoice_due_date,
                    note: this.form.note,
                    tax_pct: this.tax_percentage,
                    delivery_fee: this.delivery_fee,
                    adj_amount: parseFloat(this.form.adj_amount),
                    deduction: this.adjustmentType,
                    adj_note: this.sendForm.adj_note,
                    debit_notes: this.debit_notes,
                    invoice_items:[]
                }
                for (let i = 0; i < this.items.length; i++) {
                    if (this.items[i].invoice_qty) {
                        if (this.items[i].taxable_item === 1) {
                            if (this.items[i].include_tax === 1) {
                                this.sendForm.invoice_items[i] = {
                                    id: this.items[i].id,
                                    product_id: this.items[i].product.id,
                                    purchase_order_item_id: this.items[i].purchase_order_item.id,
                                    uom: this.items[i].product.uom.name,
                                    invoice_qty: this.items[i].invoice_qty,
                                    unit_price: this.items[i].unit_price_tax,
                                    include_tax: this.items[i].include_tax,
                                    tax_percentage: this.items[i].tax_percentage,
                                    note: this.items[i].note,
                                }
                            } else {
                                this.sendForm.invoice_items[i] = {
                                    id: this.items[i].id,
                                    product_id: this.items[i].product.id,
                                    purchase_order_item_id: this.items[i].purchase_order_item.id,
                                    uom: this.items[i].product.uom.name,
                                    invoice_qty: this.items[i].invoice_qty,
                                    unit_price: this.items[i].unit_price,
                                    include_tax: this.items[i].include_tax,
                                    tax_percentage: this.items[i].tax_percentage,
                                    note: this.items[i].note,
                                }
                            }    
                        } else {
                            this.sendForm.invoice_items[i] = {
                                id: this.items[i].id,
                                product_id: this.items[i].product.id,
                                purchase_order_item_id: this.items[i].purchase_order_item.id,
                                uom: this.items[i].product.uom.name,
                                invoice_qty: this.items[i].invoice_qty,
                                unit_price: this.items[i].unit_price,
                                include_tax: this.items[i].include_tax,
                                tax_percentage: this.items[i].tax_percentage,
                                note: this.items[i].note,
                            }
                        }
                    } else {
                        if (this.items[i].taxable_item === 1) {
                            if (this.items[i].include_tax === 1) {
                                this.sendForm.invoice_items[i] = {
                                    id: this.items[i].id,
                                    product_id: this.items[i].product.id,
                                    purchase_order_item_id: this.items[i].purchase_order_item.id,
                                    invoice_qty: 0,
                                    uom: this.items[i].product.uom.name,
                                    unit_price: this.items[i].unit_price_tax,
                                    include_tax: this.items[i].include_tax,
                                    tax_percentage: this.items[i].tax_percentage,
                                    note: this.items[i].note,
                                }
                            } else {
                                this.sendForm.invoice_items[i] = {
                                    id: this.items[i].id,
                                    product_id: this.items[i].product.id,
                                    purchase_order_item_id: this.items[i].purchase_order_item.id,
                                    invoice_qty: 0,
                                    uom: this.items[i].product.uom.name,
                                    unit_price: this.items[i].unit_price,
                                    include_tax: this.items[i].include_tax,
                                    tax_percentage: this.items[i].tax_percentage,
                                    note: this.items[i].note,
                                }
                            }   
                        } else {
                            this.sendForm.invoice_items[i] = {
                                id: this.items[i].id,
                                product_id: this.items[i].product.id,
                                purchase_order_item_id: this.items[i].purchase_order_item.id,
                                invoice_qty: 0,
                                uom: this.items[i].product.uom.name,
                                unit_price: this.items[i].unit_price,
                                include_tax: this.items[i].include_tax,
                                tax_percentage: this.items[i].tax_percentage,
                                note: this.items[i].note,
                            }
                        }
                    }
                }
                if (this.form.adj_amount) {
                    this.ConfirmData = {
                        model : true,
                        title : "Adjustment Note",
                        text : "Please fill with the adjustment reason",
                        urlApi : "/finance/purchase/invoice/"+this.$route.params.id,
                        nextPage : "/finance/purc-invoice",
                        data : this.sendForm,
                        adjustmentNote : "Adjustment note"
                    }
                } else {
                    this.ConfirmData = {
                        model : true,
                        title : "Update Purchase Invoice",
                        text : "Are you sure want to update this purchase invoice?",
                        urlApi : "/finance/purchase/invoice/"+this.$route.params.id,
                        nextPage : "/finance/purc-invoice",
                        data : this.sendForm,
                    }
                }
            },
        },
        watch: {
            'form.adj_amount': {
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
                if (this.form.adj_amount) {
                    if (this.deductionCheck) {
                        this.grand_total = (Math.round(this.totalPrice) + Math.round(this.totalTaxAmount) + Math.round(this.delivery_fee)) - Math.round(this.form.adj_amount)
                    } else {
                        this.grand_total = (Math.round(this.totalPrice) + Math.round(this.totalTaxAmount) + Math.round(this.delivery_fee)) + Math.round(this.form.adj_amount)
                    }
                } else {
                    this.grand_total =  Math.round(this.totalPrice) + Math.round(this.totalTaxAmount) - Math.round(this.totalDebitNote) + Math.round(this.delivery_fee)
                }
                return this.grand_total
            },
        },
    }
</script>