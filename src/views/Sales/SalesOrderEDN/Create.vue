<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <SelectMerchant
                        name="customer"
                        :business_type="983040"
                        :dense="true"
                        :label="'Customer'"
                        @click.native="setTitleConfirm('Customer')"
                        @selected="merchantSelected"
                        :error="error.customer || error.merchant_id"
                        :merchant="customer"
                    />
                    <p v-if="errorSuspend" class="-mt24 mb8 ml8 text-red fs12">Customer is suspended.</p>
                </v-col>
                <v-col cols="12" md="6" v-if="showoutlet" class="-mt24">
                    <SelectBranch
                        name="outlet"
                        :dense="true"
                        :merchant="form.merchant_id"
                        @selected="branchSelected"
                        :error="error.branch_id"
                        :label="'Outlet'"
                        @click.native="setTitleConfirm('Outlet')"
                        :branch="outlet"
                        :disabled="isSuspended"
                    ></SelectBranch>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                            <div v-on="{ ...tooltip }">
                                <v-text-field
                                    name="area"
                                    disabled
                                    :dense="true"
                                    label="Area *"
                                    outlined
                                    v-model="area"
                                    :error-messages="error.area_id"
                                ></v-text-field>
                            </div>
                        </template>
                        <span>Outlet Area</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="delivery_date_model"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-text-field
                                    name="delivery_date"
                                    prepend-inner-icon="mdi-calendar"
                                    outlined
                                    :dense="true"
                                    clearable
                                    :error-messages="error.delivery_date"
                                    @click:clear="form.delivery_date = ''"
                                    v-model="form.delivery_date"
                                    maxlength="10"
                                    onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 45"
                                    :disabled="isSuspended"
                                >
                                    <template v-slot:label>Delivery date</template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            v-model="form.delivery_date"
                            @input="delivery_date_model = false"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectWrt
                        name="wrt"
                        @selected="wrtSelected"
                        :wrt="wrt"
                        :dense="true"
                        :area="form.area_id"
                        :error="error.wrt_id"
                        :clear="clearwrt"
                        :disabled="isSuspended"
                    ></SelectWrt>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectWarehouseCoverage
                        :warehouse="warehouse"
                        name="warehouse"
                        :dense="true"
                        :error="error.warehouse_id"
                        :subdistrict_id="subdistrict_id"
                        @selected="warehouseSelected"
                        :disabled="isSuspended"
                    ></SelectWarehouseCoverage>
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
                                    :error-messages="error.order_date"
                                    clearable
                                    :dense="true"
                                    @click:clear="form.order_date = ''"
                                    v-model="form.order_date"
                                    maxlength="10"
                                    onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 45"
                                    :disabled="isSuspended"
                                >
                                    <template v-slot:label>Order Date</template>
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
                    <SelectOrderType
                        :ordertype="ordertype"
                        name="ordertype"
                        :dense="true"
                        :error="error.order_type_id"
                        @selected="ordertypeSelected"
                        :disabled="true"
                        @click.native="setTitleConfirm('Order Type')"
                    ></SelectOrderType>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectSalesPerson
                        name="salesperson"
                        @selected="salespersonSelected"
                        required
                        :dense="true"
                        :sales_person="salesperson"
                        :error="error.salesperson_id"
                        :disabled="isSuspended"
                    ></SelectSalesPerson>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectSalesTerm
                        name="purchase_payment_term"
                        @selected="salestermSelected"
                        required
                        :exceptPBD="true"
                        :dense="true"
                        :label="'Default Payment Term'"
                        :error="error.term_payment_sls_id"
                        :sales_term="sales_term"
                        :disabled="true"
                    ></SelectSalesTerm>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectPaymentGroupComb
                        name="sales_invoice_term"
                        @selected="invoicetermSelected"
                        required
                        :dense="true"
                        :disabled="true"
                        :payment_group="invoice_term"
                        :label="'Default Invoice Term'"
                        :error="error.term_invoice_sls_id"
                        :pt="form.term_payment_sls_id"
                    ></SelectPaymentGroupComb>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectPaymentGroup
                        name="payment_group"
                        @selected="paymentgroupSelected"
                        required
                        :dense="true"
                        :disabled="true"
                        :payment_group="payment_group"
                        :error="error.payment_group_id"
                    ></SelectPaymentGroup>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6" class="-mt24">
                    <v-textarea
                        name="shipping_address"
                        v-model="form.shipping_address"
                        :counter="350"
                        maxlength="350"
                        outlined
                        disabled
                        dense
                        rows="3"
                        required
                        :error-messages="error.shipping_address"
                    >
                        <template v-slot:label>
                            Shipping Address*
                        </template>
                    </v-textarea>
                    <v-row v-if="!showoutlet" class="">
                        <v-col>
                            <v-btn
                                :disabled="disabledShipping"
                                @click="changeShipping('Shipping Address')"
                                depressed
                                outlined
                                color="#EBEBEB"
                                class="only-btn"
                            >
                                <span :class="disabledBtnAddApply?'text-black40':'text-secondary'">Change shipping address</span>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12" md="6" v-if="showoutlet" class="-mt24">
                    <v-textarea
                        name="billing_address"
                        v-model="form.billing_address"
                        :counter="350"
                        outlined
                        dense
                        rows="3"
                        disabled
                        :error-messages="error.billing_address"
                        required
                    >
                        <template v-slot:label>
                            Billing Address*
                        </template>
                    </v-textarea>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-textarea
                        name="note"
                        v-model="form.note"
                        :counter="250"
                        outlined
                        rows="3"
                        :error-messages="error.note"
                        required
                        :disabled="isSuspended"
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
                :mobile-breakpoint="0"
                :headers="table.fields"
                :items="form.products"
                :hide-default-footer="true"
                :items-per-page="-1"
            >
                <template v-slot:item="props">
                    <tr class="removeHover" style="height:25px; vertical-align: bottom;" v-if="props.item.max_disc_qty > 0">
                        <td style="border-bottom: thin solid white;"></td>
                        <td style="border-bottom: thin solid white;">
                            <v-tooltip top>
                                <template v-slot:activator="{ on: tooltip }">
                                    <span 
                                        class="fs13 text-info" 
                                        v-on="{ ...tooltip }"
                                    >
                                        <v-icon small color="#2A89A7">info</v-icon>
                                        Special price max. {{ formatUnitPrice(props.item.max_disc_qty) }} {{ props.item.uom }}
                                    </span>
                                </template>
                                <div v-for="tier in props.item.dataDiscount.sku_discount_item_tier" :key="tier.tier_level">
                                    <div>Order min.Qty {{ tier.minimum_qty }} get discount Rp{{ formatUnitPrice(tier.disc_amount) }}</div>
                                </div>
                            </v-tooltip>
                        </td>
                        <td style="border-bottom: thin solid white;"></td>
                        <td style="border-bottom: thin solid white;">
                            <div class="ml10 fs13 text-info">{{ infoDiscQty(props.index) }}</div>
                        </td>
                    </tr>
                    <tr style="height:48px; vertical-align: baseline;" class="removeHover">
                        <td>{{ props.index + 1 }}</td>
                        <td style="padding-bottom:5px">
                            <SelectProductTable
                                :name="`product_${props.index}`"
                                @click.native="setProductIdx(props.index)"
                                @selected="productSelected"
                                :restriction="restrict_value"
                                :warehouse="form.warehouse_id"
                                :product="props.item.product"
                                :sb="salable"
                                :error="errPro(props.index)"
                                :refs="`${props.index+1}-${refs},${form.products.length}`"
                                :update="update"
                                :class="errPro(props.index) ? 'formProductErr' : ''"
                                :disabled="isSuspended"
                                :orderType="ordertype"
                                :wasteStock="true"
                                :wh_stock="form.warehouse_id"
                            ></SelectProductTable>
                        </td>
                        <td>{{ props.item.uom }}</td>
                        <td>
                            <vue-numeric
                                :name="`qty_${props.index}`"
                                :class="errQty(props.index) ? 'productNumeric' : 'productNumericErr'"
                                separator="."
                                placeholder="0,00"
                                @focus="productIdx = props.index"
                                @blur="sumSubtotal()"
                                :precision="2"
                                v-model="props.item.qty"
                                onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode <= 44"
                                :disabled="isSuspended"
                            ></vue-numeric>
                            <div class="mt-1 ml-3 fs12 text-red v-messages__message">{{errQty2(props.index)}}</div>
                        </td>
                        <td>
                            <vue-numeric
                                :name="`unit_price_${props.index}`"
                                :class="errUnitPrice(props.index) ? 'productNumeric' : 'productNumericErr'"
                                separator="."
                                placeholder="0"
                                @focus="productIdx = props.index"
                                @blur="sumSubtotal()"
                                v-model="props.item.unit_price"
                                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                                :disabled="isSuspended"
                            ></vue-numeric>
                            <div class="mt-1 ml-3 fs12 text-red v-messages__message">{{errUnitPrice2(props.index)}}</div>
                        </td>
                        <td class="right">{{ props.item.disc_unit_price == 0? '-':formatPrice(props.item.disc_unit_price) }}</td>
                        <td class="right">{{ formatPrice(props.item.subtotal) }}</td>
                        <td>
                            <v-text-field
                                :name="`note_${props.index}`"
                                outlined
                                class="mt-2 rounded-form-sm"
                                style="margin-bottom:-20px"
                                v-model="props.item.note"
                                dense
                                :disabled="isSuspended"
                            />
                        </td>
                        <td>
                            <div class="d-flex justify-end">
                                <div v-if="props.index == form.products.length-1">
                                    <v-btn
                                        icon
                                        name="addproduct"
                                        @click="addProduct()"
                                    >
                                        <img src="/icon/plus.png" height="22px" width="22px"/>
                                    </v-btn>
                                </div>
                                <div v-if="form.products.length != 1">
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
        <div class="box">
            <v-row>
                <v-col>
                    <v-row>
                        <v-col cols="12" md="8">
                            <v-text-field
                                name="voucher_code"
                                outlined
                                dense
                                v-model="redeem_code"
                                :error-messages="error.redeem_code"
                                :success-messages="success.voucher"
                                :disabled="isSuspended"
                            >
                                <template v-slot:label>
                                    Voucher
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="2">
                            <v-btn
                                @click="applyVoucher()"
                                :disabled="disabledBtnAddApply"
                                depressed
                                outlined
                                color="#EBEBEB"
                                class="only-btn mt2"
                            >
                                <span :class="disabledBtnAddApply?'text-black40':'text-secondary'">Apply</span>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <div v-if="this.show_detail" class="-mt24">
                        <a><span @click="voucherDetail = true">See voucher detail here</span></a>
                    </div>
                </v-col>
                <v-col class="text-black60">
                    <div class="row">
                        <div class="col">
                            Total :
                        </div>
                        <div class="col d-flex justify-end text-black">
                            {{totalPrice}}
                        </div>
                    </div>
                    <div class="-mt20">
                        <div class="row" v-if="total.totalDiscount">
                            <div class="col">
                                Total Discount :
                            </div>
                            <div class="col d-flex justify-end text-black">
                                - {{formatPrice(total.totalDiscount)}}
                            </div>
                        </div>
                    </div>
                    <div class="-mt20">
                        <div class="row" v-if="total.deliveryDiscount">
                            <div class="col">
                                Delivery Discount :
                            </div>
                            <div class="col d-flex justify-end text-black">
                                - {{formatPrice(total.deliveryDiscount)}}
                            </div>
                        </div>
                    </div>
                    <div class="-mt20">
                        <div class="row" v-if="total.grandTotalDiscount">
                            <div class="col">
                                Grand Total Discount :
                            </div>
                            <div class="col d-flex justify-end text-black">
                                - {{formatPrice(total.grandTotalDiscount)}}
                            </div>
                        </div>
                    </div>
                    <v-divider class="my-4"/>
                    <div class="row fs20 text-black bold -mt10 mb2">
                        <div class="col">
                            Grand Total (Rp) :
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
                            to="/sales/sales-order-edn"
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
                            v-privilege="'so_edn_crt'"
                            :disabled="isSuspended"
                        >
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
        <ShippingAddressNew :dataprops="ShippingData"/>
        <v-dialog
            v-model="changeField"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">Change {{titleField}}</span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">Change {{titleField}}  will reset Product List.</span>
                </v-card-text>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="changeField = false"
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                    >
                        <span class="text-black80">No</span>
                    </v-btn>
                    <v-btn
                        @click="changeField = false,form.products=[], error={} "
                        depressed
                        color="#50ABA3"
                        class="main-btn white--text"
                    >Yes
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="voucherDetail"
            persistent
            max-width="500px"
        >
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">{{voucher_name}}</span>
                </v-card-title>
                <v-card-text>
                    <v-row class="fs16 mt-1">
                        <v-col cols="12">
                            Start Timestamp: {{voucher_start}}<br>
                            End Timestamp: {{voucher_end}}<br>
                        </v-col>
                        <v-col cols="12" v-if="this.voucher_items[0]">
                            Products:<br>
                            <div v-for="(item, idx) in voucher_items" :key="idx">
                                {{idx+1+'. '+item.product.name+' '+item.min_qty_disc+' '+item.product.uom.name}}
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="voucherDetail = false"
                        depressed
                        color="#50ABA3"
                        class="main-btn white--text"
                    >Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<style scoped>
.h-row {
    height: 48px;
}
</style>
<script>
    import Vue from 'vue'
    export default {
        name: 'CreateSalesOrderEDN',
        data() {
            return {
                form: {
                    merchant_id: "",
                    branch_id: "",
                    area_id: "",
                    delivery_date: new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10),
                    order_date: new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10),
                    wrt_id: "",
                    warehouse_id: "",
                    order_type_id: "",
                    salesperson_id: "",
                    term_payment_sls_id: "",
                    term_invoice_sls_id: "",
                    payment_group_id: "",
                    shipping_address: "",
                    billing_address: "",
                    note: '',
                    redeem_code: "",
                    products: [],
                },
                editedProduct: false,
                order_date_model: '',
                delivery_date_model: '',
                error: {
                    redeem_code: '',
                },
                success: {},
                ShippingData: {},
                ConfirmData: {},
                customer: null,
                outlet: null,
                showoutlet: false,
                disabledShipping: true,
                disabledBtnAddApply: true,
                changeField: false,
                voucherDetail: false,
                titleField: '',
                area: '',
                wrt: '',
                clearwrt: false,
                warehouse: '',
                salesperson: '',
                sales_term: '',
                invoice_term: '',
                payment_group: '',
                invoice_term_dis: true,
                subdistrict_id: '',
                ordertype: '',
                maxQty: [],
                table: {
                    fields: [
                        {
                            text: 'No.',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text: 'Product',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'UOM',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text: 'Order Qty',
                            width: "12%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                            align: "right"
                        },
                        {
                            width: "12%",
                            text: 'Unit Price',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                            align: "right"
                        },
                        {
                            text: 'Discount Amount',
                            width: "10%",
                            sortable: false,
                            class: 'grey--text text--darken-4',
                            align: "right"
                        },
                        {
                            text: 'Subtotal',
                            width: "10%",
                            sortable: false,
                            class: 'grey--text text--darken-4',
                            align: "right"
                        },
                        {
                            text: 'Note',
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
                productIdx: '',
                priceSetIdx: '',
                redeem_code: '',
                show_detail: false,
                voucher_name: '',
                voucher_start: '',
                voucher_end: '',
                voucher_items: [{
                    product: {
                        name: '',
                        uom :{
                            name: ''
                        }
                    },
                }],
                refs: '',
                total: {
                    totalProduct: 0,
                    totalDiscount: 0,
                    deliveryFee: 0,
                    deliveryDiscount: 0,
                    grandTotalDiscount: 0,
                    grandTotal: 0,
                },
                update: false,
                restrict_value: '1',
                isSuspended: false,
                errorSuspend: false,
                salable: 1
            }
        },
        computed: {
            format_order_date() {
                if (this.form.order_date)
                    return this.$moment(this.form.order_date).format('DD/MM/YYYY')
            },
            format_delivery_date() {
                if (this.form.delivery_date)
                    return this.$moment(this.form.delivery_date).format('DD/MM/YYYY')
            },
            totalPrice() {
                let total = 0
                this.total.totalProduct = 0
                let array = this.form.products
                for (let i = 0; i < array.length; i++) {
                    total += parseFloat(array[i].subtotal);
                }
                this.total.totalProduct = total
                let val = (total / 1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
            grandTotal() {
                let total = 0
                let data = this.total
                this.total.grandTotal = 0
                total = (parseFloat(data.totalProduct) - parseFloat(data.totalDiscount)) + (parseFloat(data.deliveryFee) - parseFloat(data.deliveryDiscount)) - parseFloat(data.grandTotalDiscount)
                this.total.grandTotal = total
                let val = (total / 1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
        },
        mounted() {
            let self = this
            this.$root.$on('event_error', function (err) {
                self.error = err
                self.error.redeem_code = err.redeem_code
                if (self.error.redeem_code) {
                    self.total.deliveryDiscount = 0
                    self.total.grandTotalDiscount = 0
                    self.total.totalDiscount = 0
                }
            });
            this.$root.$on('event_shipping', function (val) {
                self.ShippingData = val
                if (val.area.id) {
                    self.form.area_id = val.area.id
                }
                self.area = val.area.code + ' - ' + val.area.name
                self.form.branch_id = val.shipping_id
                self.form.shipping_address = val.shipping_address
                self.subdistrict_id = val.subdistrict_id
                self.warehouseSelected(val.warehouse)
                self.priceSetIdx = val.priceset_id
                self.clearwrt = true
            });
        },
        created() {
            let self = this
            setTimeout(function () {
                self.ordertypeSelected({
                    "id": "851968"
                })
            }, 100);
        },
        watch:{
            error: {
                handler: function (val) { // if any error, check info and subtotal again
                    if(val){
                        setTimeout(() => {
                            const element = document.querySelector(".v-messages__message:first-of-type");
                            if(element){
                                element.scrollIntoView({block: "center", inline: "center"});
                            }
                        }, 500);
                    }
                },
                deep: true
            },
            ordertype: {
                handler: function (val) { // handle ketika ordertype berubah
                     if (this.form.products.length == 0 && this.customer != null) {
                        this.addProduct()
                    }
                }
            }
        },
        methods: {
            // For Show Popup Dialog and Clear all item
            setTitleConfirm(val) {
                this.editedProduct = false
                if (this.form.products.length > 0) {
                    let array = this.form.products
                    let edited = ''
                    array.forEach(e => {
                        if (e.product_id == "" && e.qty == 0 && e.unit_price == 0 && e.note == "") {
                            edited = false
                        } else {
                            edited = true
                            if (edited == true) {
                                this.editedProduct = true
                            }
                        }
                    });
                }
                if (this.form.products.length > 0 && this.editedProduct == true) {
                    this.changeField = true
                    this.titleField = val
                }
            },
            // Show which product has error unit price by index
            errUnitPrice(idx) {
                for (var key in this.error) {
                    if (key == 'unit_price' + idx) {
                        return false
                    }
                }
                return true
            },
            errUnitPrice2(idx) {
                for (var key in this.error) {
                    if (key == 'unit_price' + idx) {
                        return this.error[key]
                    }
                }
            },

            // Find which product has error quantity by index
            errQty(idx) {
                for (var key in this.error) {
                    if (key == 'qty' + idx) {
                        return false
                    }
                }
                return true
            },
            // Show erorr message which product has error quantity by index
            errQty2(idx) {
                for (var key in this.error) {
                    if (key == 'qty' + idx) {
                        return this.error[key]
                    }
                }
            },
            // Show erorr message if product not valid
            errPro(idx) {
                for (var key in this.error) {
                    if (key == 'product_id' + idx) {
                        return this.error[key]
                    }
                }
            },
            // Show info message if max Qty Discount has been change
            infoDiscQty(idx) {
                for (var key in this.error) {
                    if (key == 'rem_qty' + idx) {
                        return this.error[key]
                    }
                }
            },
            // For validate reedem code voucher
            applyVoucher() {
                let data = {
                    "redeem_code": this.redeem_code,
                    "area_id": this.form.area_id,
                    "branch_id": this.form.branch_id,
                    "items": this.form.products
                }
                this.show_detail = false
                this.form.redeem_code = ''
                this.voucher_items = []
                this.success.voucher = ''
                this.total.deliveryDiscount = 0
                this.total.grandTotalDiscount = 0
                this.total.totalDiscount = 0
                this.error.redeem_code = ''
                if (this.redeem_code) {
                    this.$http.post("/promotion/voucher/apply", data)
                        .then(response => {
                            let res = response.data.data
                            if (res.type == 1) {
                                this.total.totalDiscount = res.disc_amount
                            } else if (res.type == 2) {
                                this.total.grandTotalDiscount = res.disc_amount
                            } else if (res.type == 3) {
                                this.total.deliveryDiscount = res.disc_amount
                            }
                            this.redeem_code_old = this.redeem_code
                            this.error.redeem_code = ''
                            this.success.voucher = 'Voucher applied'
                            this.form.redeem_code = this.redeem_code
                        }).catch(e => {
                        this.error = e.errors
                    });
                    // For get Voucher detail informations
                    this.$http.get("/promotion/voucher", {
                        params: {
                            conditions: 'redeem_code:' + this.redeem_code + '|status:1',
                            orderby: '-id',
                        }
                    }).then(responsedetail => {
                        let dataVoucher = responsedetail.data.data[0]
                        if (dataVoucher === null) {
                            dataVoucher = []
                            this.show_detail = false
                        } else {
                            this.show_detail = true
                            this.voucher_name = dataVoucher.name
                            this.voucher_start = this.$moment(dataVoucher.start_timestamp).format('DD-MM-YYYY HH:mm:ss')
                            this.voucher_end = this.$moment(dataVoucher.end_timestamp).format('DD-MM-YYYY HH:mm:ss')
                            if (dataVoucher.voucher_item == 1) {
                                this.$http.get("/promotion/voucher/" + dataVoucher.id).then(responseVoucher => {
                                    let v_item = responseVoucher.data.data.voucher_items
                                    this.voucher_items = v_item;
                                });
                            }
                        }
                    });
                } else if (this.redeem_code == "") {
                    this.redeem_code_old = ""
                }
            },
            // For remove product if mandatory data has changes
            removeProduct(idx) {
                this.form.products.splice(idx, 1)
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
            // For set id
            setProductIdx(idx) {
                this.productIdx = idx
            },
            // For Select Product Sales Orde
            productSelected(d) {
                this.form.products[this.productIdx].product = ''
                this.form.products[this.productIdx].product_id = ''
                this.form.products[this.productIdx].uom = ''
                this.form.products[this.productIdx].disc_qty = 0
                this.form.products[this.productIdx].max_disc_qty = 0
                this.form.products[this.productIdx].disc_unit_price = 0
                this.form.products[this.productIdx].unit_price = 0
                this.form.products[this.productIdx].qty = 0
                if (d) {
                    this.form.products[this.productIdx].product = d
                    this.form.products[this.productIdx].product_id = d.id
                    this.form.products[this.productIdx].uom = d.uom.name
                    this.$http.get("/price/product_price", {
                        params: {
                            conditions: 'product.id.e:' + d.id + '|priceset.id.e:' + this.priceSetIdx
                        }
                    }).then(response => {
                        if(response.data.data){
                            this.form.products[this.productIdx].unit_price = response.data.data[0].unit_price
                            this.sumSubtotal()
                        }
                    });
                }
            },
            // For calculated subtotal product
            sumSubtotal() {
                let item = this.form.products[this.productIdx]
                let unit = parseFloat(item.unit_price)
                let qty = parseFloat(item.qty)
                let discQty = item.qty < item.max_disc_qty? parseFloat(item.qty) : parseFloat(item.max_disc_qty)

                //get discount Amount
                if (this.ordertype.value != 'zero_waste') { // if ordertype is not zero waste calculate the discount amount
                    if(discQty < item.dataDiscount.sku_discount_item_tier[0].minimum_qty){
                        item.disc_unit_price = 0
                    }
                    else{
                        item.disc_qty = discQty
                        item.dataDiscount.sku_discount_item_tier.forEach(tier => {
                            if (discQty >= tier.minimum_qty) {
                                item.disc_unit_price = discQty * tier.disc_amount;
                            }
                        }); 
                    }
                }
                // get sumSubTotal
                item.subtotal = (unit * qty) - item.disc_unit_price
            },
            // For add product
            addProduct() {
                this.update = false;
                this.form.products.push(
                    {
                        product: "",
                        product_id: "",
                        uom: "",
                        qty: 0,
                        unit_price: 0,
                        subtotal: 0,
                        note: "",
                        max_disc_qty:0,
                        disc_qty:0,
                        disc_unit_price:0,
                        dataDiscount:{
                            rem_daily_quota_per_user: 0,
                            rem_overall_quota: 0,
                            rem_quota_per_user: 0,
                            sku_discount_item_tier:[
                                {
                                    minimum_qty:0,
                                    disc_amount:0,
                                }
                            ]
                        },
                    }
                )
                this.refs = false
                Vue.nextTick(() => {
                    this.refs = true
                    this.setProductIdx(this.form.products.length - 1)
                });
            },
            // For changes shipping address
            changeShipping(val) {
                this.editedProduct = false

                if (this.form.products.length > 0) {
                    let array = this.form.products
                    let edited = ''
                    array.forEach(e => {
                        if (e.product_id == "" && e.qty == 0 && e.unit_price == 0 && e.note == "") {
                            edited = false
                        } else {
                            edited = true
                            if (edited == true) {
                                this.editedProduct = true
                            }
                        }
                    });
                }
                if (this.form.products.length > 0 && this.editedProduct == true) {
                    this.changeField = true
                    this.titleField = val
                } else {
                    this.clearwrt = false
                    this.ShippingData = {
                        model: true,
                        agent_id: this.form.merchant_id,
                        shipping_id: this.form.branch_id,
                        shipping_address: ''
                    }
                }
            },
            // Popup confirmation save data
            confirmButton() {
                if (this.customer.customer_group === 2) {
                    this.errorSuspend = false
                }
                this.ConfirmData = {
                    model: true,
                    title: "Create Sales Order",
                    text: "Are you sure want to create this sales order?",
                    urlApi: "/sales/order-edn",
                    nextPage: "/sales/sales-order-edn",
                    data: this.form,
                    post: true
                }
            },
            // For select merchant
            merchantSelected(d) {
                this.clearwrt = false
                this.showoutlet = false
                this.area = null
                this.outlet = null
                this.customer = null
                this.form.merchant_id = ""
                this.form.branch_id = ""
                this.form.area_id = ''
                this.form.wrt_id = ""
                this.wrt = ""
                this.form.warehouse_id = ""
                this.warehouse = ""
                this.disabledShipping = true
                this.disabledBtnAddApply = true
                this.form.shipping_address = ''
                this.total.deliveryFee = 0
                this.salespersonSelected(null)
                this.salestermSelected(null)
                if (d) {
                    if (d.customer_group == 1) {
                        this.clearwrt = true
                        this.showoutlet = true
                    } else {
                        this.clearwrt = true
                        this.$http.get("/customer/agent", {
                            params: {
                                embeds: 'merchant_id,area_id,archetype_id,price_set_id,warehouse_id,salesperson_id,sub_district_id,merchant.business_type_id,merchant.payment_group_sls_id',
                                conditions: 'merchant.id.e:' + d.id + '|main_branch:1'
                            }
                        }).then(response => {
                            this.form.area_id = response.data.data[0].area.id
                            this.area = response.data.data[0].area.code + ' - ' + response.data.data[0].area.name
                            this.warehouseSelected(response.data.data[0].warehouse)
                            this.subdistrict_id = response.data.data[0].sub_district.id
                            this.form.branch_id = response.data.data[0].id
                            this.priceSetIdx = response.data.data[0].price_set.id
                            this.form.shipping_address = response.data.data[0].shipping_address + ', ' + response.data.data[0].sub_district.concat_address + ', ' + response.data.data[0].sub_district.postal_code
                            this.salespersonSelected(response.data.data[0].salesperson)
                            this.salestermSelected(response.data.data[0].merchant.payment_term)
                        });
                        this.disabledShipping = false
                        this.disabledBtnAddApply = false
                        this.form.billing_address = d.billing_address
                        if (this.form.products.length == 0) {
                            this.form.products.push(
                                {
                                    product: "",
                                    product_id: "",
                                    uom: "",
                                    qty: 0,
                                    unit_price: 0,
                                    subtotal: 0,
                                    note: "",
                                    max_disc_qty:0,
                                    disc_qty:0,
                                    disc_unit_price:0,
                                    dataDiscount:{
                                        rem_daily_quota_per_user: 0,
                                        rem_overall_quota: 0,
                                        rem_quota_per_user: 0,
                                        sku_discount_item_tier:[
                                            {
                                                minimum_qty:0,
                                                disc_amount:0,
                                            }
                                        ]
                                    },
                                }
                            )
                        }
                    }
                    this.customer = d
                    if (d.suspended === 1) {
                        this.isSuspended = true
                        this.errorSuspend = true
                    } else {
                        this.isSuspended = false
                        this.errorSuspend = false
                    }
                    if (this.error.customer) {
                        this.errorSuspend = false
                    }
                    this.form.merchant_id = d.id
                    if (this.form.term_payment_sls_id) {
                        this.$http.get("/payment/payment_group_comb", {
                            params: {
                                embeds: 'payment_group_sls_id,term_payment_sls_id,term_invoice_sls_id',
                                conditions: 'paymentterm__id.e:' + this.form.term_payment_sls_id + '|invoiceterm__id.e:' + d.invoice_term.id,
                            }
                        }).then(response => {
                            if (response.data.data != null) {
                                this.invoicetermSelected(response.data.data[0])
                            }
                        });
                    }
                }
            },
            // For select branch/outlet
            branchSelected(d) {
                this.outlet = null
                this.form.branch_id = ""
                this.area = null
                this.form.area_id = ''
                this.form.wrt_id = ""
                this.wrt = ""
                this.form.warehouse_id = ""
                this.warehouse = ""
                this.form.shipping_address = ''
                this.disabledBtnAddApply = true
                this.total.deliveryFee = 0
                this.salespersonSelected(null)
                this.salestermSelected(null)
                this.clearwrt = false
                if (d) {
                    this.clearwrt = true
                    this.outlet = d
                    this.area = d.area.code + ' - ' + d.area.name
                    this.form.area_id = d.area.id
                    this.form.branch_id = d.id
                    this.form.shipping_address = d.shipping_address + ', ' + d.sub_district.concat_address + ', ' + d.sub_district.postal_code
                    this.warehouseSelected(d.warehouse)
                    this.subdistrict_id = d.sub_district.id
                    this.form.billing_address = d.merchant.billing_address
                    this.salespersonSelected(d.salesperson)
                    this.salestermSelected(d.merchant.payment_term)
                    if (this.form.products.length == 0) {
                        this.form.products.push(
                            {
                                product: "",
                                product_id: "",
                                uom: "",
                                qty: 0,
                                unit_price: 0,
                                subtotal: 0,
                                note: "",
                                max_disc_qty:0,
                                disc_qty:0,
                                disc_unit_price:0,
                                dataDiscount:{
                                    rem_daily_quota_per_user: 0,
                                    rem_overall_quota: 0,
                                    rem_quota_per_user: 0,
                                    sku_discount_item_tier:[
                                        {
                                            minimum_qty:0,
                                            disc_amount:0,
                                        }
                                    ]
                                },
                            }
                        )
                    }
                    this.disabledBtnAddApply = false
                    this.priceSetIdx = d.price_set.id
                }
            },
            // For select wrt
            wrtSelected(d) {
                this.form.wrt_id = ""
                this.wrt = ""
                if (d) {
                    this.wrt = d
                    this.form.wrt_id = d.id
                }
            },
            // For select warehouse
            warehouseSelected(d) {
                this.form.warehouse_id = ""
                this.warehouse = ""
                if (d) {
                    this.warehouse = d
                    this.form.warehouse_id = d.id
                    if (this.form.products.length == 0) {
                        this.form.products.push(
                            {
                                product: "",
                                product_id: "",
                                uom: "",
                                qty: 0,
                                unit_price: 0,
                                subtotal: 0,
                                note: "",
                                max_disc_qty:0,
                                disc_qty:0,
                                disc_unit_price:0,
                                dataDiscount:{
                                    rem_daily_quota_per_user: 0,
                                    rem_overall_quota: 0,
                                    rem_quota_per_user: 0,
                                    sku_discount_item_tier:[
                                        {
                                            minimum_qty:0,
                                            disc_amount:0,
                                        }
                                    ]
                                },
                            }
                        )
                    }
                }
            },
            // For select order type
            ordertypeSelected(d) {
                this.form.order_type_id = ""
                this.ordertype = ""
                if (d) {
                    this.ordertype = d
                    this.form.order_type_id = d.id
                    if (d.value == 'zero_waste') { // handle if zero waste is salable
                        this.salable = ''
                    } else {
                        this.salable = 1
                    }
                }
            },
            // For select salesperson
            salespersonSelected(d) {
                this.salesperson = null;
                this.form.salesperson_id = '';
                if (d) {
                    this.salesperson = d;
                    this.form.salesperson_id = d.id
                }
            },
            // For select salesterm
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
                    if (this.customer) {
                        this.$http.get("/payment/payment_group_comb", {
                            params: {
                                embeds: 'payment_group_sls_id,term_payment_sls_id,term_invoice_sls_id',
                                conditions: 'paymentterm__id.e:' + d.id + '|invoiceterm__id.e:' + this.customer.invoice_term.id,
                            }
                        }).then(response => {
                            if (response.data.data != null) {
                                this.invoicetermSelected(response.data.data[0])
                            }
                        });
                    }
                }
            },
            // For select invoice term
            invoicetermSelected(d) {
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
            // For select payment group
            paymentgroupSelected(d) {
                this.payment_group = null;
                this.form.payment_group_id = '';
                if (d) {
                    this.payment_group = d;
                    this.form.payment_group_id = d.id
                }
            },
        }
    }
</script>