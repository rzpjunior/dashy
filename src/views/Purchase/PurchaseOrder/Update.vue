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
                                    v-model="form.order_date"
                                    :error-messages="error.order_date"
                                    clearable
                                    @click:clear="form.order_date = ''"
                                    dense
                                >
                                    <template v-slot:label>Order Date<span style="color:red">*</span></template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            v-model="form.order_date"
                            @input="order_date_model = false"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="eta_date_model"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-text-field
                                    name="eta_date"
                                    prepend-inner-icon="mdi-calendar"
                                    outlined
                                    :error-messages="error.eta_date"
                                    clearable
                                    v-model="form.eta_date"
                                    @click:clear="form.eta_date = ''"
                                    dense
                                >
                                    <template v-slot:label>Estimated Arrival Date<span style="color:red">*</span></template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            v-model="form.eta_date"
                            @input="eta_date_model = false"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-menu
                        ref="menuTime"
                        v-model="eta_time_model"
                        :close-on-content-click="false"
                        :return-value.sync="form.eta_time"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                name="eta_time"
                                prepend-inner-icon="mdi-clock-outline"
                                outlined
                                clearable
                                maxlength="5"
                                onkeypress="return event.charCode >= 48 && event.charCode <= 58"
                                @click:clear="form.eta_time = ''"
                                v-model="form.eta_time"
                                :error-messages="error.eta_time"
                                dense
                                v-bind="attrs"
                                v-on="on"
                                @blur="$refs.menuTime.save(form.eta_time)"
                            >
                                <template v-slot:label>
                                    Estimated Arrival Time<span style="color:red">*</span>
                                </template>
                            </v-text-field>
                        </template>
                        <v-time-picker
                            format="24hr"
                            v-if="eta_time_model"
                            v-model="form.eta_time"
                            full-width
                            @click:minute="$refs.menuTime.save(form.eta_time)"
                        ></v-time-picker>
                    </v-menu>
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
                            <div v-if="isMobile">
                                <SelectProductTable
                                    :name="`product_${props.index}`"
                                    @click.native="setProductIdx(props.index)"
                                    @selected="productSelected"
                                    :warehouse="form.warehouse_id"
                                    :product="props.item.product"
                                    :error="errPro(props.index)"
                                    :pb="1"
                                    style="width:215px"
                                    :refs="`${props.index+1}-${refs},${itemlength}`"
                                    :update="update"
                                ></SelectProductTable>
                            </div>
                            <div v-else>
                                <SelectProductTable
                                    :name="`product_${props.index}`"
                                    @click.native="setProductIdx(props.index)"
                                    @selected="productSelected"
                                    :warehouse="form.warehouse_id"
                                    :product="props.item.product"
                                    :error="errPro(props.index)"
                                    :pb="1"
                                    :refs="`${props.index+1}-${refs},${itemlength}`"
                                    :update="update"
                                ></SelectProductTable>
                            </div>
                        </td>
                        <td>{{ props.item.uom }}</td>
                        <td>
                            <div v-if="isMobile">
                                <vue-numeric
                                    :name="`qty_${props.index}`"
                                    :class="errQty(props.index) ? 'productNumeric' : 'productNumericErr'"
                                    separator="."
                                    placeholder="0,00"
                                    style="width:126px"
                                    @focus="productIdx = props.index"
                                    @blur="sumPriceNonPPN(), sumSubtotal(), sumAmount()"
                                    :precision="allowDecimal(props.item.product)"
                                    v-model="props.item.qty"
                                ></vue-numeric>
                            </div>
                            <div v-else>
                                <vue-numeric
                                    :name="`qty_${props.index}`"
                                    :class="errQty(props.index) ? 'productNumeric' : 'productNumericErr'"
                                    separator="."
                                    placeholder="0,00"
                                    @focus="productIdx = props.index"
                                    @blur="sumPriceNonPPN(), sumSubtotal(), sumAmount()"
                                    :precision="allowDecimal(props.item.product)"
                                    v-model="props.item.qty"
                                ></vue-numeric>
                            </div>
                        </td>
                        <td>
                            <div v-if="isMobile">
                                <vue-numeric
                                    :name="`unit_price_${props.index}`"
                                    :class="errUnitPrice(props.index) ? cogsUnitPrice(props.index) : 'productNumericErr'"
                                    separator="."
                                    style="width:126px"
                                    placeholder="0"
                                    @focus="productIdx = props.index"
                                    @blur="sumPriceNonPPN(), sumSubtotal(), sumAmount(), checkCOGS(props)"
                                    v-model="props.item.unit_price"
                                ></vue-numeric>
                                <div class="ml-3 fs12" style="color:#E2621A;">{{cogsUnitPrice2(props.index)}}</div>
                            </div>
                            <div v-else>
                                <vue-numeric
                                    :name="`unit_price_${props.index}`"
                                    :class="errUnitPrice(props.index) ? cogsUnitPrice(props.index) : 'productNumericErr'"
                                    separator="."
                                    placeholder="0"
                                    @focus="productIdx = props.index"
                                    @blur="sumPriceNonPPN(), sumSubtotal(), sumAmount(), checkCOGS(props)"
                                    v-model="props.item.unit_price"
                                ></vue-numeric>
                                <div class="ml-3 fs12" style="color:#E2621A;">{{cogsUnitPrice2(props.index)}}</div>
                            </div>
                        </td>
                        <td>
                            <div v-if="isMobile">
                                <vue-numeric
                                    :name="`tax_${props.index}`"
                                    class="productNumeric"
                                    style="width:126px"
                                    separator="."
                                    placeholder="0"
                                    @focus="productIdx = props.index"
                                    @blur="sumPriceNonPPN(), sumSubtotal(), sumAmount(), checkCOGS(props)"
                                    dense
                                    v-model="props.item.tax_percentage"
                                    :disabled="props.item.taxable_item === 2"
                                ></vue-numeric>
                            </div>
                            <div v-else>
                                <vue-numeric
                                    :name="`tax_${props.index}`"
                                    class="productNumeric"
                                    separator="."
                                    placeholder="0"
                                    @focus="productIdx = props.index"
                                    @blur="sumPriceNonPPN(), sumSubtotal(), sumAmount(), checkCOGS(props)"
                                    dense
                                    v-model="props.item.tax_percentage"
                                    :disabled="props.item.taxable_item === 2"
                                ></vue-numeric>
                            </div>
                        </td>
                        <td>
                            <v-switch
                                color="#50ABA3"
                                inset
                                :false-value="2"
                                :true-value="1"
                                :disabled="props.item.taxable_item === 2"
                                v-model="props.item.include_tax"
                                @change="setProductIdx(props.index), sumPriceNonPPN(), sumSubtotal(), sumAmount()"
                            ></v-switch>
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
                            <v-menu offset-y>
                                <template v-slot:activator="{ on: menu }">
                                    <v-btn
                                        icon
                                        v-on="{ ...menu }"
                                    ><v-icon dark>mdi-dots-vertical</v-icon></v-btn>
                                </template>
                                <v-list class="bg-white">
                                    <v-list-item @click="setProductNote(props.index), setProductIdx(props.index), dialogNote = true">
                                        <v-list-item-content>
                                            <v-list-item-title>Note</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                        <td>
                            <div class="d-flex justify-end">
                                <div v-if="props.index == form.purchase_order_items.length-1">
                                    <v-btn
                                        icon
                                        name="addproduct"
                                        @click="addProduct()"
                                    >
                                        <img src="/icon/plus.png" height="22px" width="22px"/>
                                    </v-btn>
                                </div>
                                <div v-if="form.purchase_order_items.length != 1">
                                    <v-btn
                                        icon
                                        :name="`removeproduct_${props.index}`"
                                        @click="removeProduct(props.index)"
                                    >
                                        <img src="/icon/close-new.png" height="20px" width="20px"/>
                                    </v-btn>
                                </div>
                            </div>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <div class="box-end">
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
                            <div class="col">
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
                                <vue-numeric
                                    name="delivery_fee"
                                    class="vueNumeric"
                                    placeholder="0,00"
                                    separator="."
                                    :precision="2"
                                    v-model="form.delivery_fee"
                                ></vue-numeric>
                            </div>
                        </div>
                    </div>
                    <v-divider class="my-4"/>
                    <div class="row fs20 text-black bold -mt10 mb2">
                        <div class="col">
                            Grand Total (Rp):
                        </div>
                        <div class="col d-flex justify-end">
                            {{grandTotal}}
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
                            to="/purchase/order"
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
                            v-privilege="'po_upd'"
                        >
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </div>
        <v-dialog v-model="dialogNote" persistent max-width="470px">
            <v-card class="OpenSans">
                <v-card-title>
                    Note
                </v-card-title>
                <v-card-text>
                    <v-textarea
                        name="adj_note"
                        counter="100"
                        rows="3"
                        outlined
                        label="Note"
                        v-model="noteProduct"
                    ></v-textarea>
                </v-card-text>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="deleteNote(), dialogNote = false"
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
                        @click="submitNote(), dialogNote = false"
                        :disabled="!noteProduct"
                    >
                        Yes
                    </v-btn>
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
                    purchase_order_items: [],
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
                            text: "No.",
                            class: "grey--text text--darken-4",
                            width: "5%",
                            sortable: false
                        },
                        {
                            text: "Product",
                            class: "grey--text text--darken-4",
                            width: "22%",
                            sortable: false
                        },
                        {
                            text: "UOM",
                            class: "grey--text text--darken-4",
                            width: "5%",
                            sortable: false
                        },
                        {
                            text: "Order Qty",
                            class: "grey--text text--darken-4",
                            width: "8%",
                            sortable: false
                        },
                        {
                            width: "12%",
                            class: "grey--text text--darken-4",
                            text: "Unit Price",
                            sortable: false
                        },
                        {
                            width: "7%",
                            class: "grey--text text--darken-4",
                            text: "Tax (%)",
                            sortable: false,
                        },
                        {
                            width: "5%",
                            class: "grey--text text--darken-4",
                            text: "Include Tax",
                            sortable: false,
                        },
                        {
                            width: "15%",
                            class: "grey--text text--darken-4",
                            text: "Unit Price non Tax / Unit Price Tax",
                            sortable: false,
                        },
                        {
                            width: "10%",
                            class: "grey--text text--darken-4",
                            text: "Tax Amount",
                            sortable: false,
                        },
                        {
                            text: "Subtotal",
                            class: "grey--text text--darken-4",
                            width: "10%",
                            sortable: false
                        },
                        {
                            width: "1%",
                            sortable: false,
                        },
                        {
                            width: "2%",
                            sortable: false,
                        },
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
                dialogNote: false,
                noteProduct: ""
            }
        },
        computed: {
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
                    total += Math.round(array[i].subtotal);
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
            // For show warning unusual price 
            cogsUnitPrice2(idx) {
                for (var key in this.warning) {
                    if (key == idx) {
                        return 'Unusual Price'
                    }
                }
                return ''
            },
            // For assign class when input unit price
            cogsUnitPrice(idx) {
                for (var key in this.warning) {
                    if (key == idx) {
                        return 'productNumericWarningWithMargin'
                    }
                }
                return 'productNumeric'
            },
            async setPOI() {
                let arr = await JSON.parse(JSON.stringify(this.form.purchase_order_items))
                this.form.purchase_order_items = []
                this.form.purchase_order_items = arr
            },
            async renderData() {
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
                    for (let i = 0; i < this.items.purchase_order_items.length; i++) {
                        const isIncludeTax = this.items.purchase_order_items[i].include_tax === 1
                        if(isIncludeTax){
                            const taxPercentage = this.items.purchase_order_items[i].tax_percentage
                            const unitPrice = this.items.purchase_order_items[i].unit_price_tax
                            const unitPriceNonTax = Math.round(unitPrice * (100/(100+ taxPercentage)))
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
            // For show unit price error
            errUnitPrice(idx) {
                for (var key in this.error) {
                    if (key.includes(idx) && key.includes('unit_price')) {
                        return false
                    }
                }
                return true
            },
            // For show error qty
            errQty(idx) {
                for (var key in this.error) {
                    if (key.includes(idx) && key.includes('qty')) {
                        return false
                    }
                }
                return true
            },
            // For show error
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
            // For select product
            productSelected(d) {
                this.form.purchase_order_items[this.productIdx].product = ''
                this.form.purchase_order_items[this.productIdx].product_id = ''
                if (d) {
                    this.form.purchase_order_items[this.productIdx].product = d
                    this.form.purchase_order_items[this.productIdx].product_id = d.id
                    this.form.purchase_order_items[this.productIdx].uom = d.uom.name
                    this.form.purchase_order_items[this.productIdx].tax_percentage = d.tax_percentage;
                    this.form.purchase_order_items[this.productIdx].taxable_item = d.taxable;
                }
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
            sumAmount(){
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
                this.form.purchase_order_items.push({   
                    id: "",
                    product: "",
                    product_id: "",
                    uom: "",
                    qty: 0,
                    unit_price: 0,
                    unit_price_non_tax: 0,
                    unit_price_tax: 0,
                    include_tax: 2,
                    tax_amount: 0,
                    subtotal: 0,
                    taxable_item: 2,
                    note: "",
                })
                this.itemlength = this.form.purchase_order_items.length
                this.refs = false
                Vue.nextTick(() => {
                    this.refs = true
                    this.setProductIdx(this.form.purchase_order_items.length - 1)
                });
            },
            // For confirm button
            confirmButton() {
                let data = {
                    area_id: this.form.area_id,
                    supplier_id: this.form.supplier_id,
                    warehouse_id: this.form.warehouse_id,
                    term_payment_pur_id: this.form.term_payment_pur_id,
                    warehouse_address: this.form.warehouse_address,
                    order_date: this.form.order_date,
                    eta_date: this.form.eta_date,
                    eta_time: this.form.eta_time,
                    delivery_fee: this.form.delivery_fee,
                    note: this.form.note,
                    tax_pct: this.form.tax_pct,
                    purchase_order_items: []
                }
                for (let i = 0; i < this.form.purchase_order_items.length; i++) {
                    data.purchase_order_items.push({
                        id: this.form.purchase_order_items[i].id,
                        product_id:
                            this.form.purchase_order_items[i].product_id,
                        uom: this.form.purchase_order_items[i].uom,
                        qty: this.form.purchase_order_items[i].qty,
                        unit_price: this.form.purchase_order_items[i].unit_price,
                        include_tax: this.form.purchase_order_items[i].include_tax,
                        tax_percentage: this.form.purchase_order_items[i].tax_percentage,
                        note: this.form.purchase_order_items[i].note
                    });
                }
                this.ConfirmData = {
                    model: true,
                    title: "Update Purchase Order",
                    text: "Are you sure want to update this Purchase order?",
                    urlApi: "/purchase/order/" + this.$route.params.id,
                    nextPage: "/purchase/order/",
                    data: data,
                }
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
                                id: "",
                                product: "",
                                product_id: "",
                                uom: "",
                                qty: 0,
                                unit_price: 0,
                                unit_price_non_ppn: 0,
                                unit_price_ppn: 0,
                                include_tax: 2,
                                tax_amount: 0,
                                taxable_item: 2,
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
            },
            // For delete note
            deleteNote(){
                this.noteProduct = ""
            },
            // For select product note
            setProductNote(idx){
                this.noteProduct = this.form.purchase_order_items[idx].note
            },
            // For submit note
            submitNote(){
                this.form.purchase_order_items[this.productIdx].note = this.noteProduct
            },
            // allow decimal
            allowDecimal(product) {
                if (product){
                    if (product.uom.decimal_enabled == 1){
                        return 2
                    }
                    return 0
                }
            }
        },
        watch: {
            'form.eta_time': {
                handler: function (val) {
                    if (val.length == 5) {
                        let h = val.slice(0, 2)
                        let m = val.slice(-2)
                        if (parseInt(h) > 23 & parseInt(m) > 59) {
                            this.form.eta_time = '00:00'
                        } else if (parseInt(h) > 23) {
                            this.form.eta_time = '00:' + m
                        } else if (parseInt(m) > 59) {
                            this.form.eta_time = h + ':00'
                        }
                    }
                },
                deep: true
            },
        }
    }
</script>