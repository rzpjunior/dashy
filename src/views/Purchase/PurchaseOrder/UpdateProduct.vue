<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row>
                <v-col class="fs24 bold mb24">
                    {{code}}
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectSupplier
                        name="supplier"
                        :dense="true"
                        :supplier="supplier"
                        @selected="supplierSelected"
                        :error="error.supplier_id"
                        :disabled="true"
                    ></SelectSupplier>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectPurchaseTerm
                        name="payment_term"
                        :dense="true"
                        @selected="paymentTermSelected"
                        required
                        :purchase_term="term_payment_pur"
                        :error="error.term_payment_pur_id"
                        :disabled="true"
                    ></SelectPurchaseTerm>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectArea
                        :area="area"
                        :dense="true"
                        name="area"
                        :aux_data="2"
                        @selected="areaSelected"
                        :error="error.area"
                        :disabled="true"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectWarehouse
                        :warehouse="warehouse"
                        :dense="true"
                        name="warehouse"
                        @selected="warehouseSelected"
                        :aux_data="2"
                        :error="error.warehouse_id"
                        :disabled="true"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <v-textarea
                        name="warehouse_address"
                        v-model="form.warehouse_address"
                        :counter="350"
                        maxlength="350"
                        outlined
                        :disabled="true"
                        rows="3"
                        required
                        placeholder="Warehouse Address"
                        :error-messages="error.warehouse_address"
                    >
                    </v-textarea>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="order_date"
                        prepend-inner-icon="mdi-calendar"
                        outlined
                        v-model="form.order_date"
                        :error-messages="error.order_date"
                        clearable
                        disabled
                        @click:clear="form.order_date = ''"
                        dense
                    >
                        <template v-slot:label>Order Date*</template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="eta_date"
                        prepend-inner-icon="mdi-calendar"
                        outlined
                        :error-messages="error.eta_date"
                        clearable
                        disabled
                        v-model="form.eta_date"
                        @click:clear="form.eta_date = ''"
                        dense
                    >
                        <template v-slot:label>Estimated Arrival Date*</template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="eta_time"
                        prepend-inner-icon="mdi-clock-outline"
                        outlined
                        disabled
                        clearable
                        maxlength="5"
                        onkeypress="return event.charCode >= 48 && event.charCode <= 58"
                        @click:clear="form.eta_time = ''"
                        v-model="form.eta_time"
                        :error-messages="error.eta_time"
                        dense
                        @blur="$refs.menuTime.save(form.eta_time)"
                    >
                        <template v-slot:label>
                            Estimated Arrival Time*
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <v-textarea
                        name="note"
                        v-model="form.note"
                        :counter="350"
                        outlined
                        :error-messages="error.note"
                        required
                        rows="3"
                        :disabled="true"
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
                :items="form.purchase_order_items"
                :hide-default-footer="true"
                :items-per-page="-1"
                mobile-breakpoint="0"
            >
                <template v-slot:item="props">
                    <tr>
                        <td>{{ props.index + 1 }}</td>
                        <td>
                            <span class="text-ellipsis">{{ props.item.product.name }}</span>
                        </td>
                        <td>{{ props.item.uom }}</td>
                        <td>
                            <vue-numeric
                                :name="`qty_${props.index}`"
                                :class="errQty(props.index) ? 'productNumeric' : 'productNumericErr'"
                                separator="."
                                placeholder="0,00"
                                :style="isMobile ? 'width:126px': ''"
                                @focus="productIdx = props.index"
                                @blur="sumPriceNonPPN(), sumSubtotal(), sumTaxAmount()"
                                :precision="2"
                                v-model="props.item.qty"
                            ></vue-numeric>
                            <div class="ml-3 fs12" style="color:red;">{{qtyError(props.index)}}</div>
                        </td>
                        <td>
                            <vue-numeric
                                :name="`unit_price_${props.index}`"
                                :class="errUnitPrice(props.index) ? cogsUnitPrice(props.index) : 'productNumericErr'"
                                separator="."
                                :style="isMobile ? 'width:126px': ''"
                                placeholder="0"
                                @focus="productIdx = props.index"
                                @blur="sumPriceNonPPN(), sumSubtotal(), sumTaxAmount(), checkCOGS(props)"
                                v-model="props.item.unit_price"
                            ></vue-numeric>
                            <div class="ml-3 fs12" style="color:#E2621A;">{{cogsUnitPrice2(props.index)}}</div>
                        </td>
                        <td>{{ props.item.tax_percentage }}</td>
                        <td>
                            <span v-if="props.item.include_tax === 1">Yes</span>
                            <span v-else>No</span>
                        </td>
                        <td class="right">
                            <span>{{ formatPrice(props.item.unit_price_non_tax) }}</span>
                            /
                            <span v-if="props.item.tax_percentage">{{ formatPrice(props.item.unit_price_tax) }}</span>
                            <span v-else>0</span>
                        </td>
                        <td class="right">{{ formatPrice(props.item.tax_amount) }}</td>
                        <td class="right">{{ formatPrice(props.item.subtotal) }}</td>
                        <td>
                            <span v-if="props.item.note">{{ props.item.note }}</span>
                            <span v-else>-</span>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <div class="box-end">
            <v-alert border="left" color="#fa4141" v-if="notEmpty">
                <div class="flex-row-align-center">    
                    <v-icon large color="#820000">mdi-alert</v-icon>
                    <div class="ml8">
                        <ul>
                            <li v-for="(value, key) in error">
                                {{ key === 'purchase_order_image' ? 'Please enter image via Purchaser Apps' : value }}
                            </li>
                        </ul>
                    </div>
                </div>
            </v-alert>
            <v-row>
                <v-col v-if="!isMobile">
                </v-col>
                <v-col class="text-black60">
                    <div class="row">
                        <div class="col">
                            Total:
                        </div>
                        <div class="col d-flex justify-end text-black">
                            {{ totalPrice }}
                        </div>
                    </div>
                    <div class="-mt10">
                        <div class="row">
                            <div class="col flex-justify-center">
                                Total Tax Amount:
                            </div>
                            <div class="col d-flex justify-end text-black">
                                {{ totalTaxAmount }}
                            </div>
                        </div>
                    </div>
                    <div class="-mt10">
                        <div class="row">
                            <div class="col flex-justify-center">
                                Delivery Fee:
                            </div>
                            <div class="col d-flex justify-end text-black">
                                {{ formatPrice(form.delivery_fee) }}
                            </div>
                        </div>
                    </div>
                    <v-divider class="my-4"/>
                    <div class="row fs20 text-black bold -mt10 mb2">
                        <div class="col">
                            Grand Total (Rp):
                        </div>
                        <div class="col d-flex justify-end">
                            {{ grandTotal }}
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
                            v-privilege="'po_upd_prd'"
                        >
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </div>
        <v-dialog
            v-model="refreshData"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans">
                <v-card-title><span class="text-title-modal">Refresh Data</span></v-card-title>
                <v-card-text><span class="fs16 mt-1">There's an updated data on this document, are you want to Refresh the Page ?</span></v-card-text>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                        @click="closeModalRefreshData"
                    ><span class="text-black80">No</span></v-btn>
                    <v-btn
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                        @click="renderData()"
                    >Yes</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </v-container>
</template>

<script>
    import Vue from 'vue'

    export default {
        name: 'PurchaseOrderUpdate',
        data() {
            return {
                form: {
                    supplier_id: "",
                    warehouse_id: "",
                    term_payment_pur_id: "",
                    warehouse_address: "",
                    order_date: '',
                    eta_date: '',
                    eta_time: '',
                    delivery_fee: 0,
                    note: '',
                    tax_pct: 0,
                    updated_at: '',
                    purchase_order_items: [],
                    images: []
                },
                area: "",
                area_id: "",
                supplier: "",
                warehouse: "",
                term_payment_pur: "",
                warehouse_address: "",
                order_date: '',
                eta_date: '',
                eta_time: '',
                delivery_fee: '',
                note: '',
                tax_pct: '',
                eta_date_model: '',
                order_date_model: '',
                eta_time: '',
                eta_time_model: '',
                code: '',
                std_dev: '',
                warning: {},
                error: {},
                success: {},
                ConfirmData: {},
                disabledBtnAddApply: true,
                isMobile : false,
                itemlength : 0,
                table: {
                    fields: [
                        {
                            text: 'No.',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                            width: '5%'
                        },
                        {
                            text: 'Product',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                            width: '15%'
                        },
                        {
                            text: 'UOM',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                            width: '5%'
                        },
                        {
                            text: 'Order Qty',
                            class: 'grey--text text--darken-4',
                            width: '10%',
                            sortable: false
                        },
                        {
                            width: '10%',
                            class: 'grey--text text--darken-4',
                            text: 'Unit Price',
                            sortable: false
                        },
                        {
                            text: 'Tax (%)',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                            width: '7%'
                        },
                        {
                            text: 'Include Tax',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                            width: '5%'
                        },
                        {
                            class:'grey--text text--darken-4',
                            text:'Unit Price non Tax / Unit Price Tax',
                            sortable: false,
                            width:'15%'
                        },
                        {
                            text: 'Tax Amount',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                            width: '10%'
                        },
                        {
                            text: 'Subtotal',
                            class: 'grey--text text--darken-4',
                            width: '10%',
                            sortable: false
                        },
                        {
                            text: 'Note',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        }
                    ],
                },
                productIdx: '',
                refs: '',
                total: {
                    totalProduct: 0,
                    grandTotal: 0,
                    taxAmount: 0
                },
                update: false,
                refreshData: false,
            }
        },
        computed: {
            notEmpty() {
                return Object.keys(this.error).length !== 0;
            },
            format_order_date() {
                if (this.form.order_date)
                    return this.$moment(this.form.order_date).format('DD/MM/YYYY')
            },
            format_eta_date() {
                if (this.form.eta_date)
                    return this.$moment(this.form.eta_date).format('DD/MM/YYYY')
            },
            totalPrice() {
                let total = 0
                this.total.totalProduct = 0
                let array = this.form.purchase_order_items
                for (let i = 0; i < array.length; i++) {
                    total += parseFloat(array[i].subtotal);
                }
                this.total.totalProduct = total
                this.getDeliveryFee()
                let val = (total / 1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
            totalTaxAmount() {
                let total = 0
                this.total.taxAmount = 0
                let array = this.form.purchase_order_items
                for (let i = 0; i < array.length; i++) {
                    total += Math.round(array[i].tax_amount);
                }
                this.total.taxAmount = total
                this.getDeliveryFee()
                let val = (total / 1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
            grandTotal() {
                let total = 0
                let data = this.total
                this.total.grandTotal = 0
                total = Math.round(data.totalProduct) + Math.round(data.taxAmount) + Math.round(this.form.delivery_fee)
                this.total.grandTotal = total
                let val = (total / 1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
        },
        async mounted() {
            let self = this
            this.$root.$on('event_error', function (err) {
                self.error = err
            });
            window.onresize = () => {
                if (window.screen.width < 769) {
                    this.isMobile = true
                } else {
                    this.isMobile = false
                }
            }

            await this.renderData()
            await this.$nextTick()
            await self.setPOI()
        },
        created() {
            this.$http.get("/config/app?conditions=attribute.icontains:std_dev_cogs").then(response => {
                this.std_dev = parseFloat(response.data.data[0].value)
            });
            if (window.screen.width < 769) {
                this.isMobile = true
            } else {
                this.isMobile = false
            }
        },
        methods: {
            // For check COGS
            checkCOGS(props) {
                let idx = props.index
                let unit_price = props.item.unit_price
                let product_id = props.item.product_id
                let std_dev = this.std_dev
                let cogs = 0
                let warehouse = ''
                if (this.form.warehouse_id) {
                    warehouse = "|warehouse.id.e:" + this.form.warehouse_id
                }
                let eta_date = ''
                if (this.form.eta_date) {
                    eta_date = "|eta_date.lt:" + this.form.eta_date
                }
                let product = ''
                if (product_id) {
                    product = "|product.id.e:" + product_id
                }
                this.overlay = true;
                this.$http.get("/purchase/cogs", {
                    params: {
                        page: 1,
                        perpage: 1,
                        orderby: "-eta_date",
                        conditions: 'id.icontains:' + warehouse + eta_date + product,
                    }
                }).then(response => {
                        if (response.data.data.length > 0) {
                            cogs = response.data.data[0].total_avg
                        }
                        let deviation = Math.abs(((cogs - unit_price) / cogs) * 100)
                        if (deviation > std_dev) {
                            let json = JSON.parse(JSON.stringify(this.warning))
                            json[idx] = true;
                            this.warning = JSON.parse(JSON.stringify(json))
                        } else {
                            let json = JSON.parse(JSON.stringify(this.warning))
                            for (var key in json) {
                                if (key == idx) {
                                    delete json[idx];
                                }
                            }
                            this.warning = JSON.parse(JSON.stringify(json))
                        }
                    }
                );
            },
            // For show error quantity
            qtyError(idx) {
                for (var key in this.error) {
                    if (key == 'qty' + idx) {
                        return "Order can't be less than Received Qty"
                    }
                }
            },
            // For cogs unit price 2
            cogsUnitPrice2(idx) {
                for (var key in this.warning) {
                    if (key == idx) {
                        return 'Unusual Price'
                    }
                }
                return ''
            },
            // For cogs unit price 2
            cogsUnitPrice(idx) {
                for (var key in this.warning) {
                    if (key == idx) {
                        return 'productNumericWarning'
                    }
                }
                return 'productNumeric'
            },
            // For set POI
            async setPOI() {
                let arr = await JSON.parse(JSON.stringify(this.form.purchase_order_items))
                this.form.purchase_order_items = []
                this.form.purchase_order_items = arr
            },
            // For get data
            async renderData() {
                this.refreshData = false
                this.update = true;
                await this.$http.get("/purchase/order/" + this.$route.params.id).then(response => {
                    this.items = response.data.data
                    this.code = response.data.data.code
                    this.form.eta_date = this.$moment(this.items.eta_date).format('YYYY-MM-DD')
                    this.form.order_date = this.$moment(this.items.recognition_date).format('YYYY-MM-DD')
                    this.areaSelected(this.items.warehouse.area)
                    this.warehouseSelected(this.items.warehouse)
                    this.supplierSelected(this.items.supplier)
                    this.paymentTermSelected(this.items.supplier.purchase_term)
                    this.form.warehouse_address = this.items.warehouse_address
                    this.form.note = this.items.note
                    this.form.eta_time = this.items.eta_time
                    this.form.tax_pct = this.items.tax_pct
                    this.form.delivery_fee = this.items.delivery_fee
                    this.form.purchase_order_items = []
                    this.form.updated_at = this.items.updated_at
                    this.form.images = this.items.images ? this.items.images.map((image) => {
                        return {
                            id: image.id,
                            url: image.image_url
                        }
                    }) : [] 
                    for (let i = 0; i < this.items.purchase_order_items.length; i++) {
                        const isIncludeTax = this.items.purchase_order_items[i].include_tax === 1
                        if(isIncludeTax) {
                            const taxPercentage = this.items.purchase_order_items[i].tax_percentage
                            const unitPrice = this.items.purchase_order_items[i].unit_price_tax
                            const unitPriceNonTax = Math.round(unitPrice * (100/(100 + taxPercentage)))
                            const unitPriceTax = unitPrice
                            this.form.purchase_order_items.push(
                                {
                                    id: this.items.purchase_order_items[i].id,
                                    product: this.items.purchase_order_items[i].product,
                                    product_id: this.items.purchase_order_items[i].product.id,
                                    uom: this.items.purchase_order_items[i].product.uom.name,
                                    qty: this.items.purchase_order_items[i].order_qty,
                                    unit_price: unitPrice,
                                    unit_price_tax: unitPriceTax,
                                    unit_price_non_tax: unitPriceNonTax,
                                    include_tax: this.items.purchase_order_items[i].include_tax,
                                    tax_amount: (unitPriceTax - unitPriceNonTax) * this.items.purchase_order_items[i].order_qty,
                                    tax_percentage: taxPercentage,
                                    taxable_item: this.items.purchase_order_items[i].taxable_item,
                                    subtotal: this.items.purchase_order_items[i].subtotal,
                                    note: this.items.purchase_order_items[i].note,
                                },
                            )
                        } else {
                            const taxPercentage = this.items.purchase_order_items[i].tax_percentage
                            const unitPrice = this.items.purchase_order_items[i].unit_price
                            const unitPriceNonTax = unitPrice
                            const unitPriceTax = Math.round(unitPrice * (100 + taxPercentage) / 100)
                            this.form.purchase_order_items.push(
                                {
                                    id: this.items.purchase_order_items[i].id,
                                    product: this.items.purchase_order_items[i].product,
                                    product_id: this.items.purchase_order_items[i].product.id,
                                    uom: this.items.purchase_order_items[i].product.uom.name,
                                    qty: this.items.purchase_order_items[i].order_qty,
                                    unit_price: unitPrice,
                                    unit_price_tax: unitPriceTax,
                                    unit_price_non_tax: unitPriceNonTax,
                                    include_tax: this.items.purchase_order_items[i].include_tax,
                                    tax_amount: (unitPriceTax - unitPriceNonTax) * this.items.purchase_order_items[i].order_qty,
                                    tax_percentage: taxPercentage,
                                    taxable_item: this.items.purchase_order_items[i].taxable_item,
                                    subtotal: this.items.purchase_order_items[i].subtotal,
                                    note: this.items.purchase_order_items[i].note,
                                },
                            )
                        }
                    }
                });
            },
            // For show error unit price
            errUnitPrice(idx) {
                for (var key in this.error) {
                    if (key.includes(idx) && key.includes('unit_price')) {
                        return false
                    }
                }
                return true
            },
            // For show error quantity
            errQty(idx) {
                for (var key in this.error) {
                    if (key.includes(idx) && key.includes('qty')) {
                        return false
                    }
                }
                return true
            },
            // For show error product
            errPro(idx) {
                for (var key in this.error) {
                    if (key.includes(idx) && key.includes('product_id')) {
                        return this.error[key]
                    }
                }
            },
            // For get delivery fee
            getDeliveryFee() {
                this.total.deliveryFee = 0
                let area = ''
                if (this.form.area_id) {
                    area = 'area.id.e:' + this.form.area_id
                }
                this.$http.get("/config/area/policy", {
                    params: {
                        conditions: area
                    }
                }).then(response => {
                    if (response.data.data != null) {
                        let data = response.data.data
                        for (let i = 0; i < data.length; i++) {
                            if (this.form.area_id == data[i].area.id) {
                                if (parseFloat(this.total.totalProduct) < parseFloat(data[i].min_order)) {
                                    this.total.deliveryFee = data[i].delivery_fee
                                }
                            }
                        }
                    }
                });
            },
            // For remove product
            removeProduct(idx) {
                this.form.purchase_order_items.splice(idx, 1)
                for (var key in this.error) {
                    if (key.includes(idx) && key.includes('unit_price')) {
                        delete this.error[key];
                    }
                    if (key.includes(idx) && key.includes('qty')) {
                        delete this.error[key];
                    }
                    if (key.includes(idx) && key.includes('product_id')) {
                        delete this.error[key];
                    }
                }
            },
            // For set product index
            setProductIdx(idx) {
                this.productIdx = idx
            },
            // For sum subtotal
            sumSubtotal() {
                let unit_price_non_tax =
                    this.form.purchase_order_items[this.productIdx].unit_price_non_tax;
                let qty = this.form.purchase_order_items[this.productIdx].qty;
                this.form.purchase_order_items[this.productIdx].subtotal =
                    Math.round(unit_price_non_tax * qty);
            },
            // For sum price non tax
            sumPriceNonPPN(){
                let unit =
                    this.form.purchase_order_items[this.productIdx].unit_price;
                let tax_percentage =
                    this.form.purchase_order_items[this.productIdx].tax_percentage;
                if(this.form.purchase_order_items[this.productIdx].include_tax === 1) {
                    this.form.purchase_order_items[this.productIdx].unit_price_non_tax =
                        Math.round(unit *  (100 / (100 + tax_percentage)))
                    this.form.purchase_order_items[this.productIdx].unit_price_tax = Math.round(unit)
                } else {
                    this.form.purchase_order_items[this.productIdx].unit_price_tax = 
                        Math.round(unit * (100 + tax_percentage) / 100)
                    this.form.purchase_order_items[this.productIdx].unit_price_non_tax = Math.round(unit)
                }
            },
            // For sum amount
            sumTaxAmount(){
                const unitPrice  = this.form.purchase_order_items[this.productIdx].unit_price
                const taxPercentage =  this.form.purchase_order_items[this.productIdx].tax_percentage
                const unitPriceTax = this.form.purchase_order_items[this.productIdx].unit_price_tax
                const unitPriceNonTax = this.form.purchase_order_items[this.productIdx].unit_price_non_tax
                const qty = this.form.purchase_order_items[this.productIdx].qty;
                if(this.form.purchase_order_items[this.productIdx].include_tax === 1) {
                    this.form.purchase_order_items[this.productIdx].tax_amount = Math.round((unitPriceTax - unitPriceNonTax) * qty)
                } else {
                    this.form.purchase_order_items[this.productIdx].tax_amount = Math.round(unitPrice * taxPercentage / 100 * qty)
                }
            },
            // For add product
            addProduct() {
                this.update = false;
                this.form.purchase_order_items.push(
                    {
                        product: "",
                        product_id: "",
                        uom: "",
                        qty: 0,
                        unit_price: 0,
                        subtotal: 0,
                        note: "",
                    }
                )
                this.itemlength = this.form.purchase_order_items.length
                this.refs = false
                Vue.nextTick(() => {
                    this.refs = true
                    this.setProductIdx(this.form.purchase_order_items.length - 1)
                });
            },
            // For confirm update product
            confirmButton() {
                this.$http.get("/purchase/order/" + this.$route.params.id).then(response => {
                    let res = response.data.data
                    if (res.updated_at !== this.form.updated_at) {
                        this.refreshData = true
                    } else {
                        this.ConfirmData = {
                            model: true,
                            title: "Update Product Purchase Order",
                            text: "Are you sure want to update product this Purchase order?",
                            urlApi: "/purchase/order/update-product/" + this.$route.params.id,
                            nextPage: "/purchase/order/" + this.$route.params.id,
                            data: this.form,
                        }
                    }
                })
            },
            closeModalRefreshData() { // close modal refresh data
                this.refreshData = false
            },
            // For select area
            areaSelected(d) {
                this.area = null
                this.area_id = ''
                this.warehouse = null
                this.form.warehouse_id = ''
                this.form.warehouse_address = ''
                if (d) {
                    this.area = d
                    this.area_id = d.id
                }
            },
            // For select warehouse
            warehouseSelected(d) {
                this.form.warehouse_id = ""
                this.warehouse = null
                this.form.warehouse_address = ''
                if (d) {
                    this.warehouse = d
                    this.form.warehouse_id = d.id
                    this.$http.get("/config/warehouse/" + d.id).then(response => {
                        this.form.warehouse_address = response.data.data.street_address + ', ' + response.data.data.sub_district.concat_address + ', ' + response.data.data.sub_district.postal_code
                    });
                    if (this.form.purchase_order_items.length == 0) {
                        this.form.purchase_order_items.push(
                            {
                                product: "",
                                product_id: "",
                                uom: "",
                                qty: 0,
                                unit_price: 0,
                                subtotal: 0,
                                note: "",
                            }
                        )
                    }
                    this.disabledBtnAddApply = false
                }
            },
            // For select payment term
            paymentTermSelected(d) {
                this.form.term_payment_pur_id = ""
                this.term_payment_pur = ""
                if (d) {
                    this.term_payment_pur = d
                    this.form.term_payment_pur_id = d.id
                }
            },
            // For select supplier
            supplierSelected(d) {
                this.form.supplier_id = ""
                this.supplier = null
                this.form.term_payment_pur_id = ""
                this.term_payment_pur = null
                if (d) {
                    this.supplier = d
                    this.form.supplier_id = d.id
                    this.term_payment_pur = d.purchase_term
                    this.form.term_payment_pur_id = d.purchase_term.id
                }
            }
        }
    }
</script>
