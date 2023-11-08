<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="order_code"
                        v-model="items.code"
                        disabled
                        required
                        outlined
                        dense
                    >
                        <template v-slot:label>
                            Order Code *
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectMerchant
                        name="customer"
                        :label="'Customer'"
                        disabled
                        :dense="true"
                        @selected="merchantSelected"
                        :error="error.merchant_id"
                        :merchant="customer"
                    />
                </v-col>
                <v-col cols="12" md="6" v-if="showoutlet" class="-mt24">
                    <SelectBranch
                        name="outlet"
                        :merchant="form.merchant_id"
                        @selected="branchSelected"
                        disabled
                        :dense="true"
                        :error="error.branch_id"
                        :label="'Outlet'"
                        :branch="outlet"
                    ></SelectBranch>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                            <div v-on="{ ...tooltip }">
                                <v-text-field
                                    name="area"
                                    disabled
                                    label="Area *"
                                    dense
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
                                    clearable
                                    :error-messages="error.delivery_date"
                                    @click:clear="form.delivery_date = ''"
                                    v-model="form.delivery_date"
                                    maxlength="10"
                                    onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 45"
                                    dense
                                >
                                    <template v-slot:label>
                                        Delivery Date
                                    </template>
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
                        name="outlet"
                        @selected="wrtSelected"
                        :wrt="wrt"
                        :area="form.area_id"
                        :error="error.wrt_id"
                        :dense="true"
                    ></SelectWrt>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectWarehouseSelfPickUp
                        v-if="form.order_type_id == '393216'"
                        :warehouse="warehouse"
                        name="warehouse"
                        :dense="true"
                        :error="error.warehouse_id"
                        @selected="warehouseSelected"
                    ></SelectWarehouseSelfPickUp>
                    <SelectWarehouseCoverage
                        v-else
                        :warehouse="warehouse"
                        name="warehouse"
                        :dense="true"
                        :error="error.warehouse_id"
                        :subdistrict_id="subdistrict_id"
                        @selected="warehouseSelected"
                        :clear="clearWarehouse"
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
                                    @click:clear="form.order_date = ''"
                                    maxlength="10"
                                    v-model="form.order_date"
                                    onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 45"
                                    dense
                                >
                                    <template v-slot:label>
                                        Order Date
                                    </template>
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
                        :error="error.order_type_id"
                        @selected="ordertypeSelected"
                        :dense="true"
                    ></SelectOrderType>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectSalesPerson
                        name="salesperson"
                        @selected="salespersonSelected"
                        required
                        :sales_person="salesperson"
                        :error="error.salesperson_id"
                        :dense="true"
                    ></SelectSalesPerson>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectSalesTerm
                        name="purchase_payment_term"
                        @selected="salestermSelected"
                        required
                        :exceptPBD="true"
                        :label="'Default Payment Term'"
                        :error="error.term_payment_sls_id"
                        :sales_term="sales_term"
                        :dense="true"
                    ></SelectSalesTerm>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectPaymentGroupComb
                        name="sales_invoice_term"
                        @selected="invoicetermSelected"
                        required
                        :disabled="invoice_term_dis"
                        :payment_group="invoice_term"
                        :label="'Default Invoice Term'"
                        :error="error.term_invoice_sls_id"
                        :pt="form.term_payment_sls_id"
                        :dense="true"
                    ></SelectPaymentGroupComb>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
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
                        rows="3"
                        required
                        :error-messages="error.shipping_address"
                    >
                        <template v-slot:label>
                            Shipping Address*
                        </template>
                    </v-textarea>
                </v-col>
                <v-col cols="12" md="6" v-if="showoutlet" class="-mt24">
                    <v-textarea
                        name="billing_address"
                        v-model="form.billing_address"
                        :counter="350"
                        outlined
                        disabled
                        :error-messages="error.billing_address"
                        required
                        rows="3"
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
            <v-row class="-mt32 -mb32">
                <v-col class="flex-justify-center">
                    Products
                </v-col>
                <v-col>
                    <div class="flex-align-end">
                        <v-switch
                            v-model="switchProduct"
                            label="Update Products"
                            color="#50ABA3"
                            inset
                            :false-value="0"
                            :true-value="1"
                        >
                            <template v-slot:label>
                                <span class="text-white">Update Products</span>
                            </template>
                        </v-switch>
                    </div>
                </v-col>
            </v-row>
        </div>
        <div class="box-body-table">
            <v-data-table
                :headers="table.fields"
                :mobile-breakpoint="0"
                :items="form.products"
                :hide-default-footer="true"
                :items-per-page="-1"
            >
                <template v-slot:item="props">
                    <tr class="removeHover" style="height:25px; vertical-align: bottom;" v-if="props.item.max_disc_qty > 0 || infoDiscQty(props.index)">
                        <td style="border-bottom: thin solid white;"></td>
                        <td style="border-bottom: thin solid white;">
                            <v-tooltip top>
                                <template v-slot:activator="{ on: tooltip }">
                                    <span 
                                        v-if="props.item.max_disc_qty > 0"
                                        class="fs13 text-info" 
                                        v-on="{ ...tooltip }"
                                    >
                                        <v-icon small color="#2A89A7">info</v-icon>
                                        Special price max. {{ formatUnitPrice(props.item.max_disc_qty) }} {{ props.item.uom }}
                                    </span>
                                </template>
                                <div v-for="tier in props.item.dataDiscount.sku_discount_item_tier" :key="tier.tier_level">
                                    <div>Order min.Qty {{ tier.minimum_qty }} get discount Rp{{ formatUnitPrice(tier.disc_amount)}}</div>
                                </div>
                            </v-tooltip>
                        </td>
                        <td style="border-bottom: thin solid white;"></td>
                        <td style="border-bottom: thin solid white;"></td>
                        <td style="border-bottom: thin solid white; padding-left:0px">
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
                                :warehouse="form.warehouse_id"
                                :sb="salable"
                                :product="props.item.product"
                                :error="errPro(props.index)"
                                :refs="`${props.index+1}-${refs},${form.products.length}`"
                                :update="update"
                                :class="errPro(props.index) ? 'formProductErr' : ''"
                                :disabled="disableAll"
                                :orderType="ordertype"
                                :wasteStock="true"
                                :wh_stock="form.warehouse_id"
                            ></SelectProductTable>
                        </td>
                        <td>{{ props.item.uom }}</td>
                        <td class="right" style="padding-right:0px">
                            <v-tooltip top v-if="props.item.create_disc_qty > 0">
                                <template v-slot:activator="{ on: tooltip }">
                                    <div v-on="{ ...tooltip }">
                                        <v-icon>info</v-icon>
                                    </div>
                                </template>
                                <span>Discount Qty {{ props.item.create_disc_qty }} {{ props.item.uom }}</span>
                            </v-tooltip>
                        </td>
                        <td style="padding-left:0px">
                            <vue-numeric
                                :name="`qty_${props.index}`"
                                :class="errQty(props.index) ? 'productNumeric' : 'productNumericErr'"
                                separator="."
                                @focus="productIdx = props.index"
                                @blur="sumSubtotal(props.index)"
                                :precision="2"
                                v-model="props.item.qty"
                                :disabled="disableAll"
                                onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode <= 44"
                            ></vue-numeric>
                            <div class="mt-1 ml-3 fs12 text-red v-messages__message">{{errQty2(props.index)}}</div>
                        </td>
                        <td>
                            <vue-numeric
                                :name="`unit_price_${props.index}`"
                                placeholder="0"
                                :class="errUnitPrice(props.index) ? 'productNumeric' : 'productNumericErr'"
                                separator="."
                                @focus="productIdx = props.index"
                                @blur="sumSubtotal(props.index)"
                                v-model="props.item.unit_price"
                                :disabled="disableAll"
                                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                            ></vue-numeric>
                            <div class="mt-1 ml-3 fs12 text-red v-messages__message">{{errUnitPrice2(props.index)}}</div>
                        </td>
                        <td class="right">{{ props.item.unit_price_discount == 0? '-':formatPrice(props.item.unit_price_discount) }}</td>
                        <td class="right">{{ formatPrice(props.item.subtotal) }}</td>
                        <td>
                            <v-text-field
                                :name="`note_${props.index}`"
                                outlined
                                class="mt-2 rounded-form-sm"
                                style="margin-bottom:-20px"
                                v-model="props.item.note"
                                dense
                                :disabled="disableAll"
                            />
                        </td>
                        <td>
                            <div class="d-flex justify-end">
                                <div v-if="props.index == form.products.length-1">
                                    <v-btn
                                        icon
                                        name="addproduct"
                                        @click="addProduct()"
                                        v-show="!disableAll"
                                    >
                                        <img src="/icon/plus.png" height="22px" width="22px"/>
                                    </v-btn>
                                </div>
                                <div v-if="form.products.length != 1">
                                    <v-btn
                                        icon
                                        :name="`removeproduct_${props.index}`"
                                        @click="removeProduct(props.index)"
                                        v-show="!disableAll"
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
                        <v-col cols="12" md="10">
                            <v-text-field
                                name="voucher_code"
                                outlined
                                v-model="redeem_code"
                                dense
                                :error-messages="error.redeem_code"
                                :success-messages="success.voucher"
                            >
                                <template v-slot:label>
                                    Voucher
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="2">
                            <v-btn
                                @click="applyVoucher()"
                                :disabled="disabledBtnAddApply || redeem_code == redeem_code_old"
                                depressed
                                outlined
                                color="#EBEBEB"
                                class="only-btn mt2"
                            >
                                <span :class="disabledBtnAddApply?'text-black40':'text-secondary' " >Apply</span>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <div v-if="this.show_detail" class="-mt24">
                        <a><span @click="voucherDetail = true">See voucher detail here</span></a>
                    </div>
                    <div class="pt10">
                        <v-alert
                            v-if="total.extraEdenPoint"
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
                            <span class="text-black pl8">Cashback EdenPoint {{formatUnitPrice(total.extraEdenPoint)}}</span>
                        </v-alert>
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
                        <div class="row">
                            <div class="col">
                                Delivery Fee :
                            </div>
                            <div class="col d-flex justify-end text-black">
                                {{formatPrice(total.deliveryFee)}}
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
                        <div class="row" v-if="total.edenPoint != 0">
                            <div class="col">
                                EdenPoint :
                            </div>
                            <div class="col d-flex justify-end text-black">
                                - {{formatPrice(total.edenPoint)}}
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
                            @click="cancelBack()"
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
                            v-privilege="'so_upd'"
                        >
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
        <LoadingBar :value="overlay"/>
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
                        @click="changeField = false,form.products=[]"
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
<script>
    import Vue from 'vue'
    export default {
        name: 'UpdateSalesOrder',
        data() {
            return {
                items: {},
                overlay: false,
                form: {
                    merchant_id: "",
                    branch_id: "",
                    area_id: "",
                    delivery_date: "",
                    order_date: "",
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
                    update_all:0,
                },
                order_date_model: '',
                delivery_date_model: '',
                error: {},
                success: {},
                ConfirmData: {},
                customer: null,
                outlet: null,
                showoutlet: false,
                disabledShipping: true,
                disabledBtnAddApply: true,
                changeField: false,
                voucherDetail : false,
                titleField: '',
                area: '',
                wrt: '',
                warehouse: '',
                warehouse2: '',
                clearWarehouse: false,
                salesperson: '',
                sales_term: '',
                invoice_term: '',
                payment_group: '',
                invoice_term_dis: true,
                subdistrict_id: '',
                ordertype: '',
                orderChannel: 0,
                switchProduct: 0,
                disableProduct: false,
                table: {
                    fields: [
                        {
                            text: 'No.',
                            sortable: false,
                            class: 'grey--text text--darken-4',
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
                            width: "5%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Order Qty',
                            width: "12%",
                            sortable: false,
                            class: 'grey--text text--darken-4',
                            align: "right"
                        },
                        {
                            width: "12%",
                            text: 'Unit Price',
                            sortable: false,
                            class: 'grey--text text--darken-4',
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
                business_type_id : '',
                productIdx: '',
                priceSetIdx: '',
                redeem_code: '',
                show_detail:false,
                voucher_name : '',
                voucher_start : '',
                voucher_end : '',
                voucher_items: [{
                    product: {
                        name: '',
                        uom :{
                            name: ''
                        }
                    },
                }],
                redeem_code_old: '',
                refs: '',
                total: {
                    totalProduct: 0,
                    totalDiscount: 0,
                    deliveryFee: 0,
                    deliveryDiscount: 0,
                    edenPoint:0,
                    grandTotalDiscount: 0,
                    grandTotal: 0,
                    extraEdenPoint: 0
                },
                update: false,
                disableAll: true,
                salable: 1
            }
        },
        computed: {
            totalPrice() {
                let total = 0
                this.total.totalProduct = 0
                let array = this.form.products
                for (let i = 0; i < array.length; i++) {
                    total += parseFloat(array[i].subtotal);
                }
                this.total.totalProduct = total
                if (this.business_type_id && this.form.area_id) {
                    this.getDeliveryFee()
                }
                let val = (total / 1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
            grandTotal() {
                let total = 0
                let data = this.total
                this.total.grandTotal = 0
                total = (parseFloat(data.totalProduct) - parseFloat(data.totalDiscount)) + (parseFloat(data.deliveryFee) - parseFloat(data.deliveryDiscount)) 
                        - parseFloat(data.grandTotalDiscount) - parseFloat(data.edenPoint)
                this.total.grandTotal = total
                let val = (total / 1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
        },
        async mounted() {
            let self = this
            this.$root.$on('event_error', function (err) {
                if(err){
                    self.error = err
                    if (self.error.redeem_code) {
                        self.total.deliveryDiscount = 0
                        self.total.grandTotalDiscount = 0
                        self.total.totalDiscount = 0
                    }
                }
            });

            await this.renderData()
            await this.$nextTick()
            await this.setProduct()
            await self.branchSelected(self.items.branch)
            await this.getVoucherDetail()

        },
        methods: {
            async setProduct() {
                let arr = await JSON.parse(JSON.stringify(this.form.products))
                this.form.products = []
                this.form.products = arr
            },
            async renderData() {
                this.update = true;
                await this.$http.get("/sales/order/" + this.$route.params.id).then(response => {
                    this.items = response.data.data
                    this.merchantSelected(this.items.branch.merchant)
                    this.branchSelected(this.items.branch)
                    this.form.delivery_date = this.$moment(this.items.delivery_date).format('YYYY-MM-DD')
                    this.form.order_date = this.$moment(this.items.recognition_date).format('YYYY-MM-DD')
                    this.wrtSelected(this.items.wrt)
                    this.ordertypeSelected(this.items.order_type)
                    let self = this
                    setTimeout(() => {
                        if (self.form.order_type_id == "393216") {
                            self.setWarehouseSelfPickup()
                        } else {
                            self.warehouseSelected(self.items.warehouse)
                        }
                    }, 500);
                    this.salespersonSelected(this.items.salesperson)
                    this.salestermSelected(this.items.term_payment_sls)
                    this.orderChannel = this.items.order_channel
                    this.$http.get("/payment/payment_group_comb", {
                        params: {
                            embeds: 'payment_group_sls_id,term_payment_sls_id,term_invoice_sls_id',
                            conditions: 'paymentterm__id.e:' + this.items.term_payment_sls.id + '|invoiceterm__id.e:' + this.items.term_invoice_sls.id,
                        }
                    }).then(response => {
                        this.invoicetermSelected(response.data.data[0])
                    });
                    this.form.shipping_address = this.items.shipping_address
                    this.form.billing_address = this.items.billing_address
                    this.form.note = this.items.note
                    this.priceSetIdx = this.items.branch.price_set.id
                    this.form.products = []
                    if(this.items.sales_order_items){
                        for (let i = 0; i < this.items.sales_order_items.length; i++) {
                            this.form.products.push(
                                {
                                    product: this.items.sales_order_items[i].product,
                                    product_id: this.items.sales_order_items[i].product.id,
                                    uom: this.items.sales_order_items[i].product.uom.name,
                                    qty: this.items.sales_order_items[i].order_qty,
                                    unit_price: this.items.sales_order_items[i].unit_price,
                                    subtotal: this.items.sales_order_items[i].subtotal,
                                    note: this.items.sales_order_items[i].note,
                                    disc_qty: this.items.sales_order_items[i].discount_qty,
                                    unit_price_discount: this.items.sales_order_items[i].unit_price_discount*this.items.sales_order_items[i].discount_qty,
                                    create_disc_qty: this.items.sales_order_items[i].discount_qty,
                                    dataDiscount: this.items.sales_order_items[i].sku_discount_item,
                                    so_item_id: this.items.sales_order_items[i].id,
                                }
                            )
                            if(this.form.products[i].dataDiscount){
                                let minDiscQty = Math.min(this.form.products[i].dataDiscount?.rem_quota_per_user,this.form.products[i].dataDiscount?.rem_overall_quota,this.form.products[i].dataDiscount?.rem_daily_quota_per_user)
                                this.form.products[i].max_disc_qty = minDiscQty >= this.form.products[i].dataDiscount.sku_discount_item_tier[0].minimum_qty? minDiscQty : 0
                                this.form.products[i].sku_discount_item_id = this.form.products[i].dataDiscount.id
                            }else{
                                this.form.products[i].max_disc_qty = 0
                            }
                        }
                    }
                    this.form.redeem_code = this.items.vou_redeem_code
                    this.redeem_code = this.items.vou_redeem_code
                    this.redeem_code_old = this.items.vou_redeem_code
                    if (this.items.voucher) {
                        if (this.items.voucher.type == 1) {
                            this.total.totalDiscount = this.items.vou_disc_amount
                        } else if (this.items.voucher.type == 2) {
                            this.total.grandTotalDiscount = this.items.vou_disc_amount
                        } else if (this.items.voucher.type == 3) {
                            this.total.deliveryDiscount = this.items.vou_disc_amount
                        } else if (this.items.voucher.type == 4) {
                            this.total.extraEdenPoint = this.items.voucher.disc_amount
                        }
                    }
                    this.total.edenPoint = this.items.point_redeem_amount
                })
                let self = this
                setTimeout(() => {
                    self.getDeliveryFee()
                }, 1500);
            },
            async renderDataProduct() { // to render data product only
                this.overlay = true
                await this.$http.get("/sales/order/" + this.$route.params.id).then(response => {
                    this.items = response.data.data
                    this.form.products = []
                    if(this.items.sales_order_items){
                        for (let i = 0; i < this.items.sales_order_items.length; i++) {
                            this.form.products.push(
                                {
                                    product: this.items.sales_order_items[i].product,
                                    product_id: this.items.sales_order_items[i].product.id,
                                    uom: this.items.sales_order_items[i].product.uom.name,
                                    qty: this.items.sales_order_items[i].order_qty,
                                    unit_price: this.items.sales_order_items[i].unit_price,
                                    subtotal: this.items.sales_order_items[i].subtotal,
                                    note: this.items.sales_order_items[i].note,
                                    disc_qty: this.items.sales_order_items[i].discount_qty,
                                    unit_price_discount: this.items.sales_order_items[i].unit_price_discount*this.items.sales_order_items[i].discount_qty,
                                    create_disc_qty: this.items.sales_order_items[i].discount_qty,
                                    dataDiscount: this.items.sales_order_items[i].sku_discount_item,
                                    so_item_id: this.items.sales_order_items[i].id,
                                }
                            )
                            if(this.form.products[i].dataDiscount){
                                let minDiscQty = Math.min(this.form.products[i].dataDiscount?.rem_quota_per_user,this.form.products[i].dataDiscount?.rem_overall_quota,this.form.products[i].dataDiscount?.rem_daily_quota_per_user)
                                this.form.products[i].max_disc_qty = minDiscQty >= this.form.products[i].dataDiscount.sku_discount_item_tier[0].minimum_qty? minDiscQty : 0
                                this.form.products[i].sku_discount_item_id = this.form.products[i].dataDiscount.id
                            }else{
                                this.form.products[i].max_disc_qty = 0
                            }
                        }
                    }
                    this.overlay = false
                })
            },
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
            errQty(idx) {
                for (var key in this.error) {
                    if (key == 'qty' + idx) {
                        return false
                    }
                }
                return true
            },
            errQty2(idx) {
                for (var key in this.error) {
                    if (key == 'qty' + idx) {
                        return this.error[key]
                    }
                }
            },
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
            // For get delivery fee
            getDeliveryFee() {
                this.total.deliveryFee = 0
                if (this.form.order_type_id != "393216") {
                    this.$http.get("config/area/business_policy/delivery", {
                        params: {
                            area_id : this.form.area_id,
                            business_type_id : this.business_type_id
                        }
                    }).then(response => {
                        if (response.data.data != null) {
                            let data = response.data.data
                            if (parseFloat(this.total.totalProduct) < parseFloat(data.min_order)) {
                                this.total.deliveryFee = data.delivery_fee
                            }
                        }
                    });
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
                this.show_detail=false
                this.form.redeem_code = ''
                this.voucher_items = []
                this.success.voucher = ''
                this.total.deliveryDiscount = 0
                this.total.grandTotalDiscount = 0
                this.total.totalDiscount = 0
                this.total.extraEdenPoint = 0
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
                        } else if (res.type == 4) {
                            this.total.extraEdenPoint = res.disc_amount
                        }
                        this.redeem_code_old = this.redeem_code
                        this.error.redeem_code = ''
                        this.success.voucher = 'Voucher applied'
                        this.form.redeem_code = this.redeem_code
                    }).catch(e => {
                        this.error = e.errors
                    });
                    this.getVoucherDetail()
                } else if (this.redeem_code == "") {
                    this.redeem_code_old = ""
                }
            },
            getVoucherDetail(){
                this.voucher_items = []
                if(this.redeem_code) {
                    this.$http.get("/promotion/voucher",{params:{
                        conditions:'redeem_code:'+this.redeem_code+'|status:1',
                        orderby:'-id',
                    }}).then(responsedetail => {
                        let dataVoucher = responsedetail.data.data[0]
                        if(dataVoucher === null){
                            dataVoucher = []
                            this.show_detail = false
                        }else{
                            this.show_detail = true
                            this.voucher_name = dataVoucher.name
                            this.voucher_start = this.$moment(dataVoucher.start_timestamp).format('DD-MM-YYYY HH:mm:ss')
                            this.voucher_end = this.$moment(dataVoucher.end_timestamp).format('DD-MM-YYYY HH:mm:ss')
                            if(dataVoucher.voucher_item == 1){
                                this.$http.get("/promotion/voucher/" + dataVoucher.id).then(responseVoucher => {
                                    let v_item = responseVoucher.data.data.voucher_items
                                    this.voucher_items = v_item;
                                });
                            }
                        }
                    }).catch(error => {
                        this.show_detail = false
                    });
                }
            },
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
            setProductIdx(idx) {
                this.productIdx = idx
            },
            productSelected(d) {
                this.form.products[this.productIdx].product = ''
                this.form.products[this.productIdx].product_id = ''
                this.form.products[this.productIdx].uom = ''
                this.form.products[this.productIdx].disc_qty = 0
                this.form.products[this.productIdx].max_disc_qty = 0
                this.form.products[this.productIdx].create_disc_qty = 0
                this.form.products[this.productIdx].unit_price_discount = 0
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
                        this.form.products[this.productIdx].unit_price = response.data.data[0].unit_price
                        
                    });
                    this.getDiscInfo(this.productIdx)
                }
            },
            //get special price qty
            getDiscInfo(idx){
                if (this.ordertype.value != 'zero_waste') { // handle for order type zero waste
                    this.$http.get("/promotion/sku_discount/sku_disc_data?", {
                        params: {
                            'price_set_id': this.priceSetIdx,
                            'product_id': this.form.products[idx].product_id,
                            'merchant_id': this.form.merchant_id,
                            'order_channel': this.orderChannel,
                            'so_item_id': this.form.products[idx].so_item_id
                        }
                    }).then(response => {
                        if(response.data.data){
                            this.form.products[idx].dataDiscount = response.data.data
                            let minDiscQty = Math.min(this.form.products[idx].dataDiscount?.rem_quota_per_user,this.form.products[idx].dataDiscount?.rem_overall_quota,this.form.products[idx].dataDiscount?.rem_daily_quota_per_user)
                            this.form.products[idx].max_disc_qty = minDiscQty >= this.form.products[idx].dataDiscount.sku_discount_item_tier[0]?.minimum_qty? minDiscQty : 0
                            this.form.products[idx].sku_discount_item_id = this.form.products[idx].dataDiscount.id
                        }else{
                            this.form.products[idx].max_disc_qty = 0
                        }
                        this.sumSubtotal(idx)
                    });
                }
            },
            //get special price qty
            getDiscInfoBefore(idx){
                if (this.ordertype.value != 'zero_waste') { // handle for order type zero waste
                    this.$http.get("/promotion/sku_discount/sku_disc_data?", {
                        params: {
                            'price_set_id': this.priceSetIdx,
                            'product_id': this.form.products[idx].product_id,
                            'order_channel': this.orderChannel,
                            'merchant_id': this.form.merchant_id,
                        }
                    }).then(response => {
                        if(response.data.data){
                            this.form.products[idx].dataDiscount = response.data.data
                            let minDiscQty = Math.min(this.form.products[idx].dataDiscount?.rem_quota_per_user,this.form.products[idx].dataDiscount?.rem_overall_quota,this.form.products[idx].dataDiscount?.rem_daily_quota_per_user)
                            this.form.products[idx].max_disc_qty = minDiscQty >= this.form.products[idx].dataDiscount.sku_discount_item_tier[0]?.minimum_qty? minDiscQty : 0
                            this.form.products[idx].sku_discount_item_id = this.form.products[idx].dataDiscount.id
                        }else{
                            this.form.products[idx].max_disc_qty = 0
                        }
                        this.sumSubtotal(idx)
                    });
                }
            },
            // to recheck max disc qty, disc amount, and sum sub total
            async checkDiscQty(){
                if (this.ordertype.value != 'zero_waste') { // handle for order type zero waste
                    for (let i = 0; i < this.form.products.length; i++) {
                        await this.$http.get("/promotion/sku_discount/sku_disc_data?", {
                            params: {
                                'price_set_id': this.priceSetIdx,
                                'product_id': this.form.products[i].product_id,
                                'order_channel': this.orderChannel,
                                'merchant_id': this.form.merchant_id,
                                'so_item_id': this.form.products[i].so_item_id
                            }
                        }).then(response => {
                            this.form.products[i].max_disc_qty = 0
                            this.form.products[i].unit_price_discount = 0
                            this.form.products[i].sku_discount_item_id = ""
                            
                            let unit = parseFloat(this.form.products[i].unit_price)
                            let qty = parseFloat(this.form.products[i].qty)
                            if(response.data.data){
                                this.form.products[i].dataDiscount = response.data.data
                                this.form.products[i].sku_discount_item_id = this.form.products[i].dataDiscount.id
                                let minDiscQty = Math.min(this.form.products[i].dataDiscount?.rem_quota_per_user,this.form.products[i].dataDiscount?.rem_overall_quota,this.form.products[i].dataDiscount?.rem_daily_quota_per_user)
                                this.form.products[i].max_disc_qty = minDiscQty >= this.form.products[i].dataDiscount.sku_discount_item_tier[0]?.minimum_qty? minDiscQty : 0
                                let discQty = this.form.products[i].qty < this.form.products[i].max_disc_qty? parseFloat(this.form.products[i].qty) : parseFloat(this.form.products[i].max_disc_qty)
                                
                                if(discQty < this.form.products[i].dataDiscount.sku_discount_item_tier[0].minimum_qty){
                                    this.form.products[i].unit_price_discount = 0
                                }
                                else{
                                    this.form.products[i].disc_qty = discQty
                                    this.form.products[i].dataDiscount.sku_discount_item_tier.forEach(tier => {
                                        if (discQty >= tier.minimum_qty) {
                                            this.form.products[i].unit_price_discount = discQty * tier.disc_amount;
                                        }
                                    }); 
                                }
                                
                                if(minDiscQty == 0){
                                    this.form.products[i].create_disc_qty = 0
                                    this.form.products[i].dataDiscount = {}
                                    this.form.products[i].disc_qty = 0
                                    this.form.products[i].max_disc_qty = 0
                                    this.form.products[i].unit_price_discount = 0
                                    this.form.products[i].sku_discount_item_id = ''
                                }
                            }else{
                                this.form.products[i].create_disc_qty = 0
                                this.form.products[i].dataDiscount = {}
                                this.form.products[i].disc_qty = 0
                                this.form.products[i].max_disc_qty = 0
                                this.form.products[i].unit_price_discount = 0
                                this.form.products[i].sku_discount_item_id = ''
                            }
                            // get sumSubTotal
                            this.form.products[i].subtotal = (unit * qty) - this.form.products[i].unit_price_discount
                        });
                    }
                }
            },
            // For calculated subtotal product
            sumSubtotal(idx) {
                let item = this.form.products[idx]
                let unit = parseFloat(item.unit_price)
                let qty = parseFloat(item.qty)
                let discQty = item.qty < item.max_disc_qty? parseFloat(item.qty) : parseFloat(item.max_disc_qty)
                //get discount Amount
                if(item.dataDiscount){
                    if(discQty < item.dataDiscount.sku_discount_item_tier[0].minimum_qty){
                        item.unit_price_discount = 0
                        item.disc_qty = 0
                    }
                    else{
                        item.disc_qty = discQty
                        item.dataDiscount.sku_discount_item_tier.forEach(tier => {
                            if (discQty >= tier.minimum_qty) {
                                item.unit_price_discount = discQty * tier.disc_amount;
                            }
                        }); 
                    }
                }
                // get sumSubTotal
                item.subtotal = (unit * qty) - item.unit_price_discount
                
            },
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
                        max_disc_qty: 0,
                        disc_qty: 0,
                        unit_price_discount: 0,
                        create_disc_qty: 0,
                        sku_discount_item_id: "",
                        dataDiscount:{
                            rem_daily_quota_per_user: 0,
                            rem_overall_quota: 0,
                            rem_quota_per_user: 0,
                            sku_discount_item_tier:[
                                {
                                    minimum_qty: 0,
                                    disc_amount: 0,
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
            confirmButton() {
                this.ConfirmData = {
                    model: true,
                    title: "Update Sales Order",
                    text: "Are you sure want to update this sales order?",
                    urlApi: "/sales/order/" + this.$route.params.id,
                    nextPage: "/sales-order/detail/" + this.$route.params.id,
                    data: this.form
                }
            },
            merchantSelected(d) {
                this.showoutlet = false
                this.area = null
                this.customer = null
                this.form.merchant_id = ""
                this.form.area_id = ''
                this.disabledShipping = true
                this.disabledBtnAddApply = true
                if (d) {
                    this.business_type_id = d.business_type.id
                    if (d.customer_group == 1) {
                        this.showoutlet = true
                    } else {
                        this.disabledShipping = false
                        this.disabledBtnAddApply = false
                    }
                    this.customer = d
                    this.form.merchant_id = d.id
                }
            },
            branchSelected(d) {
                this.outlet = null
                this.form.branch_id = ""
                this.area = null
                this.form.area_id = ''
                this.disabledBtnAddApply = true
                this.total.deliveryFee = 0
                if (d) {
                    this.outlet = d
                    this.area = d.area.code + ' - ' + d.area.name
                    this.form.area_id = d.area.id
                    this.getDeliveryFee()
                    this.form.branch_id = d.id
                    this.subdistrict_id = d.sub_district.id
                    this.disabledBtnAddApply = false
                    this.priceSetIdx = d.price_set.id
                }
            },
            wrtSelected(d) {
                this.form.wrt_id = ""
                this.wrt = ""
                if (d) {
                    this.wrt = d
                    this.form.wrt_id = d.id
                }
            },
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
                                max_disc_qty: 0,
                                disc_qty: 0,
                                unit_price_discount: 0,
                                create_disc_qty: 0,
                                sku_discount_item_id: "",
                                dataDiscount:{
                                    rem_daily_quota_per_user: 0,
                                    rem_overall_quota: 0,
                                    rem_quota_per_user: 0,
                                    sku_discount_item_tier:[
                                        {
                                            minimum_qty: 0,
                                            disc_amount: 0,
                                        }
                                    ]
                                },
                            }
                        )
                    }
                }
            },
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
                    this.setWarehouseSelfPickup()
                }
            },
            setWarehouseSelfPickup() { // select warehouse base order type
                if (this.form.order_type_id == "393216") {
                    this.warehouse2 = JSON.parse(JSON.stringify(this.warehouse))
                    this.$http.get("/config/warehouse/self-pickup",{params:{
                        area : this.form.area_id,
                    }}).then(response => {
                        let data = response.data.data
                        let self = this
                        setTimeout(() => {
                            self.warehouseSelected(data)
                        }, 500);
                    });
                } else {
                    let self = this
                    if (this.warehouse2) {
                        setTimeout(() => {
                            self.clearWarehouse = true
                            self.warehouseSelected(this.warehouse2)
                            setTimeout(() => {
                                self.clearWarehouse = false
                                self.warehouse2 = ""
                            }, 500);
                        }, 500);
                    } else {
                        setTimeout(() => {
                            self.warehouseSelected("")
                            self.clearWarehouse = true
                            setTimeout(() => {
                                self.clearWarehouse = false
                                self.warehouse2 = ""
                            }, 500);
                        }, 500);
                    }
                }
            },
            salespersonSelected(d) {
                this.salesperson = null;
                this.form.salesperson_id = '';
                if (d) {
                    this.salesperson = d;
                    this.form.salesperson_id = d.id
                }
            },
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
                }
            },
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
            paymentgroupSelected(d) {
                this.payment_group = null;
                this.form.payment_group_id = '';
                if (d) {
                    this.payment_group = d;
                    this.form.payment_group_id = d.id
                }
            },
            cancelBack() {
                this.$http.put('/sales/order/lock/'+this.$route.params.id,{})
                .then(responseLock => {
                    this.$router.go(-1)
                })
            },
            async resetProduct(){ // to calling await mathod on watch
                await this.renderDataProduct()
                await this.$nextTick()
                await this.setProduct()
            }
        },
        watch: {
            'redeem_code': {
                handler: function (val) {
                    if(val == this.redeem_code_old){
                        this.error.redeem_code = ''
                    }
                },
                deep: true
            },
            error: {
                handler: function (val) { // if any error, check info and subtotal again
                    if(val){
                        setTimeout(() => {
                            const element = document.querySelector(".v-messages__message:first-of-type");
                            element.scrollIntoView({block: "center", inline: "center"});
                        }, 500);
                        for (var key in val) {
                            if (key.includes('rem_qty')) {
                                this.checkDiscQty()
                            }
                        }
                    }
                },
                deep: true
            },
            switchProduct: {
                handler: function (val){ // to set disable or enable field on products
                    this.form.update_all = val
                    if(val == 1){
                        this.disableAll = false
                        for(let i = 0; i < this.form.products.length; i++){
                            if(this.form.products[i].sku_discount_item_id == null){
                                this.getDiscInfoBefore(i)
                            }
                        }
                    }
                    else{
                        this.disableAll = true
                        this.error = {}
                        this.resetProduct()
                    }
                }
            },
            ordertype: {
                handler: function (val) { // handle if change order type and update product Active
                     if (val) {
                         this.switchProduct = 0
                     }
                }
            }
        }
    }
</script>