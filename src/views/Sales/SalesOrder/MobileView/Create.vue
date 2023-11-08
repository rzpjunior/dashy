<template>
    <v-container>
        <v-row style="margin-top:24px">
            <v-col cols="12" class="mtn24">
                <SelectMerchant
                    name="customer"
                    :label="'Customer'"
                    :minSearch="true"
                    @click.native="setTitleConfirm('Customer')"
                    @selected="merchantSelected"
                    :error="error.merchant_id"
                    :merchant="customer"
                />
            </v-col>
            <v-col cols="12" v-if="showoutlet" class="mtn24">
                <SelectBranch
                    name="outlet"
                    :merchant="form.merchant_id"
                    @selected="branchSelected"
                    :error="error.branch_id"
                    :label="'Outlet'"
                    @click.native="setTitleConfirm('Outlet')"
                    :branch="outlet"
                ></SelectBranch>
            </v-col>
            <v-col cols="12" class="mtn24">
                <SelectSalesPerson
                    name="salesperson"
                    @selected="salespersonSelected"
                    required
                    disabled
                    :sales_person="salesperson"
                    :error="error.salesperson_id"
                ></SelectSalesPerson>
            </v-col>
            <v-col cols="12" class="mtn24">
                <v-textarea
                    name="shipping_address"
                    v-model="form.shipping_address"
                    :counter="350"
                    maxlength="350"
                    outlined
                    disabled
                    class="rounded-form"
                    required
                    :error-messages="error.shipping_address"
                >
                    <template v-slot:label>
                        Shipping Address<span style="color:red">*</span>
                    </template>
                </v-textarea>
                <v-row v-if="!showoutlet" class="mb-10">
                    <v-col>
                        <v-btn
                            rounded
                            :disabled="disabledShipping"
                            elevation="0"
                            class="no-caps"
                            @click="changeShipping('Shipping Address')"
                            style="background: #E6E9ED; color:#768F9C;height:45px"
                        >Change shipping address
                        </v-btn>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="12" class="mtn24">
                <v-menu
                    ref="menu"
                    v-model="delivery_date_model"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                    disabled
                >
                    <template v-slot:activator="{ on }">
                        <div v-on="on">
                            <v-text-field
                                name="delivery_date"
                                prepend-inner-icon="mdi-calendar"
                                outlined
                                disabled
                                :error-messages="error.delivery_date"
                                @click:clear="form.delivery_date = ''"
                                v-model="form.delivery_date"
                                maxlength="10"
                                onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 45"
                                class="rounded-form"
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
            <v-col cols="12" class="mtn24">
                <SelectWrt
                    name="wrt"
                    @selected="wrtSelected"
                    :wrt="wrt"
                    :area="form.area_id"
                    :error="error.wrt_id"
                    :clear="clearwrt"
                ></SelectWrt>
            </v-col>
            <v-col cols="12" class="mtn24">
                <v-textarea
                    name="note"
                    v-model="form.note"
                    :counter="250"
                    maxlength="250"
                    outlined
                    :error-messages="error.note"
                    required
                    class="rounded-form"
                >
                    <template v-slot:label>
                        Note
                    </template>
                </v-textarea>
            </v-col>
        </v-row>
        <div>
            <label class="label-title" style="color:black">
                Products
            </label>
        </div>
        <v-data-table
            :hide-default-headers="true"
            :items="form.products"
            :hide-default-footer="true"
            :items-per-page="-1"
            style="margin-top:-20px"
        >
            <template v-slot:item="props">
                <tr style="height:280px;">
                    <td style="margin:0px;padding:0px;width:100vw;">
                        <v-row>
                            <v-col style="padding-top:20px;">
                                <b>{{ props.index + 1 }}.</b>
                            </v-col>
                            <v-col style="display: flex;justify-content:flex-end;">
                                <v-btn
                                    icon
                                    :name="`removeproduct_${props.index}`"
                                    @click="removeProduct(props.index)"
                                >
                                    <v-img src="/icon/close-2.png" max-height="20px" max-width="20px"></v-img>
                                </v-btn>    
                            </v-col>
                        </v-row>
                        <SelectProductTable
                            :name="`product_${props.index}`"
                            class="mb-3 mt-2"
                            @click.native="setProductIdx(props.index)"
                            @selected="productSelected"
                            :minSearch="true"
                            :warehouse="form.warehouse_id"
                            :product="props.item.product"
                            :sb="1"
                            :error="errPro(props.index)"
                            :refs="`${props.index+1}-${refs},${form.products.length}`"
                            :update="update"
                        ></SelectProductTable>
                        <v-row>
                            <v-col cols="4">
                                <vue-numeric
                                    :name="`qty_${props.index}`"
                                    :class="errQty(props.index) ? 'mProductNumeric' : 'mProductNumericErr'"
                                    separator="."
                                    placeholder="0,00"
                                    @focus="productIdx = props.index"
                                    @blur="sumSubtotal()"
                                    :precision="2"
                                    v-model="props.item.qty"
                                ></vue-numeric>
                            </v-col>
                            <v-col cols="2" class="pt-5 pl-0">
                                {{ props.item.uom }}
                            </v-col>
                            <v-col cols="6" class="pl-0">
                                <v-row>
                                    <v-col cols="2">
                                        Price:<br><span style="color:#4ABFB2;">Subtotal:</span>
                                    </v-col>
                                    <v-col cols="10" style="display: lex;justify-content:flex-end;text-align:end">
                                        {{formatPrice(props.item.unit_price)}}<br><span style="color:#4ABFB2;">{{formatPrice(props.item.subtotal)}}</span>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                        <div v-if="errQty2(props.index)" class="ml-3 fs12" style="color:red;margin-bottom:-10px">{{errQty2(props.index)}}</div>
                        <v-text-field
                            :name="`note_${props.index}`"
                            placeholder="Product Note"
                            outlined
                            class="mt-5 mb-1 rounded-form-sm"
                            v-model="props.item.note"
                            dense
                        />
                    </td>
                </tr>
            </template>
        </v-data-table>
        <v-row>
            <v-col>
                <v-btn
                        name="addproduct"
                        rounded
                        elevation="0"
                        class="no-caps px-7"
                        @click="addProduct()"
                        :disabled="disabledBtnAddApply"
                        style="background: #E6E9ED; color:#768F9C;height:45px"
                >Add Product
                </v-btn>
            </v-col>
        </v-row>
        <hr class="mt-10">
        <v-row class="mt-8">
            <v-col>
                <v-row>
                    <v-col cols="9">
                        <v-text-field
                            name="voucher_code"
                            outlined
                            v-model="redeem_code"
                            class="rounded-form"
                            :error-messages="error.redeem_code"
                            :success-messages="success.voucher"
                        >
                            <template v-slot:label>
                                Voucher
                            </template>
                        </v-text-field>
                    </v-col>
                    <v-col cols="3">
                        <v-btn
                            rounded
                            elevation="0"
                            class="no-caps"
                            :disabled="disabledBtnAddApply"
                            @click="applyVoucher()"
                            style="background: #E6E9ED; color:#768F9C;height:45px; margin-top:5px"
                        >Apply
                        </v-btn>
                    </v-col>
                </v-row>
                <div v-if="this.show_detail" style="margin-left:13px;margin-top:-20px">
                    <a><span @click="voucherDetail = true">See voucher detail here</span></a>
                </div>
            </v-col>
            <v-col cols="12" class="second-color">
                <div class="row">
                    <div class="col">
                        Total :
                    </div>
                    <div class="col d-flex justify-end">
                        {{totalPrice}}
                    </div>
                </div>
                <div class="row" v-if="total.totalDiscount">
                    <div class="col">
                        Total Discount :
                    </div>
                    <div class="col d-flex justify-end">
                        - {{formatPrice(total.totalDiscount)}}
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        Delivery Fee :
                    </div>
                    <div class="col d-flex justify-end">
                        {{formatPrice(total.deliveryFee)}}
                    </div>
                </div>
                <div class="row" v-if="total.deliveryDiscount">
                    <div class="col">
                        Delivery Discount :
                    </div>
                    <div class="col d-flex justify-end">
                        - {{formatPrice(total.deliveryDiscount)}}
                    </div>
                </div>
                <div class="row" v-if="total.grandTotalDiscount">
                    <div class="col">
                        Grand Total Discount :
                    </div>
                    <div class="col d-flex justify-end">
                        - {{formatPrice(total.grandTotalDiscount)}}
                    </div>
                </div>
                <v-divider class="my-4"/>
                <div class="row">
                    <div class="col" style="color:#4ABFB2;">
                        Grand Total (Rp) :
                    </div>
                    <div class="col d-flex justify-end" style="color:black;">
                        {{grandTotal}}
                    </div>
                </div>
            </v-col>
        </v-row>
        <v-row class="mt-10">
            <v-col>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                            rounded
                            elevation="0"
                            class="no-caps px-7"
                            @click="$router.go(-1)"
                            style="background: #E6E9ED; color:#768F9C;height:45px"
                            v-privilege="'so_rdl'"
                    >Cancel
                    </v-btn>
                    <v-btn
                            class="px-7 ml-2 no-caps white--text"
                            @click="confirmButton()"
                            elevation="0"
                            rounded
                            style="background: #768f9c; height:45px"
                            v-privilege="'so_crt'"
                    >Save
                    </v-btn>
                </v-card-actions>
            </v-col>
        </v-row>
        <ConfirmationDialog :sendData="ConfirmData"/>
        <ShippingAddressMobile :dataprops="ShippingData"/>
        <v-dialog
                v-model="changeField"
                persistent
                max-width="470px"
        >
            <v-card class="Heiti" style="border-radius: 15px;">
                <v-card-title>
                    <span class="fs25 second-color mt-1">Change {{titleField}}</span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">Change {{titleField}}  will reset Product List.</span>
                </v-card-text>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                            rounded
                            elevation="0"
                            class="no-caps px-7"
                            @click="changeField = false"
                            style="background: #E6E9ED;color:#768F9C;height:45px"
                    >No
                    </v-btn>
                    <v-btn
                            class="px-7 ml-2 no-caps white--text"
                            @click="changeField = false,form.products=[]"
                            elevation="0"
                            rounded
                            style="background: #768f9c; height:45px"
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
            <v-card class="Heiti" style="border-radius: 15px;">
                <v-card-title>
                    <span class="fs25 second-color mt-1">{{voucher_name}}</span>
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
                            class="px-7 ml-2 no-caps white--text"
                            @click="voucherDetail = false"
                            elevation="0"
                            rounded
                            style="background: #768f9c; height:45px"
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
        name: 'CreateSalesOrder',
        data() {
            return {
                form: {
                    merchant_id: "",
                    branch_id: "",
                    area_id: "",
                    delivery_date: new Date(Date.now() + (3600 * 1000 * 24) + (3600 * 1000 * 7)).toISOString().substr(0, 10),
                    order_date: new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10),
                    wrt_id: "",
                    warehouse_id: "",
                    salesperson_id: "",
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
                table: {
                    fields: [
                        {
                            text: 'Product',
                            width: "100%",
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
                update: false
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
                this.getDeliveryFee()
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
                        if(responsedetail.data){
                            let dataVoucher = responsedetail.data.data[0]
                            if (dataVoucher) {
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
                            } else {
                                dataVoucher = []
                                this.show_detail = false
                            }
                        }
                    }).catch(e => {
                        this.show_detail = false
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
            setProductIdx(idx) {
                this.productIdx = idx
            },
            // For Select Product Sales Orde
            productSelected(d) {
                this.form.products[this.productIdx].product = ''
                this.form.products[this.productIdx].product_id = ''
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
                        this.sumSubtotal()
                    });
                }
            },
            // For calculated subtotal product
            sumSubtotal() {
                let unit = this.form.products[this.productIdx].unit_price
                let qty = this.form.products[this.productIdx].qty
                this.form.products[this.productIdx].subtotal = parseFloat(unit) * parseFloat(qty)
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
                this.ConfirmData = {
                    model: true,
                    title: "Create Sales Order",
                    text: "Are you sure want to create this sales order?",
                    urlApi: "/sales/order",
                    nextPage: "/sales-order",
                    data: this.form,
                    post: true
                }
            },
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
                            this.getDeliveryFee()
                            this.warehouseSelected(response.data.data[0].warehouse)
                            this.subdistrict_id = response.data.data[0].sub_district.id
                            this.form.branch_id = response.data.data[0].id
                            this.priceSetIdx = response.data.data[0].price_set.id
                            this.form.shipping_address = response.data.data[0].shipping_address + ', ' + response.data.data[0].sub_district.concat_address + ', ' + response.data.data[0].sub_district.postal_code
                            this.salespersonSelected(response.data.data[0].salesperson)
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
                                }
                            )
                        }
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
                this.form.wrt_id = ""
                this.wrt = ""
                this.form.warehouse_id = ""
                this.warehouse = ""
                this.form.shipping_address = ''
                this.disabledBtnAddApply = true
                this.total.deliveryFee = 0
                this.salespersonSelected(null)
                this.clearwrt = false
                if (d) {
                    this.clearwrt = true
                    this.outlet = d
                    this.area = d.area.code + ' - ' + d.area.name
                    this.form.area_id = d.area.id
                    this.getDeliveryFee()
                    this.form.branch_id = d.id
                    this.form.shipping_address = d.shipping_address + ', ' + d.sub_district.concat_address + ', ' + d.sub_district.postal_code
                    this.warehouseSelected(d.warehouse)
                    this.subdistrict_id = d.sub_district.id
                    this.form.billing_address = d.merchant.billing_address
                    this.salespersonSelected(d.salesperson)
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
                            }
                        )
                    }
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
                            }
                        )
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
        }
    }
</script>