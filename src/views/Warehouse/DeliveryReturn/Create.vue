<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mt24">
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
                                    name="recognition_date"
                                    dense
                                    prepend-inner-icon="mdi-calendar"
                                    outlined
                                    clearable
                                    @click:clear="form.recognition_date = ''"
                                    v-model="form.recognition_date"
                                    maxlength="10"
                                    onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 45"
                                    :error-messages="error.recognition_date"
                                >
                                    <template v-slot:label>Delivery Return Date</template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            v-model="form.recognition_date"
                            @input="delivery_date_model = false"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectArea
                        name="area"
                        @selected="areaSelected"
                        required
                        :aux_data="2"
                        :error="error.finance_area_id"
                        :dense="true"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectWarehouse
                        name="warehouse"
                        v-model="warehouse"
                        :area_id="form.area_id"
                        :aux_data="2"
                        :disabled="disabled_warehouse"
                        @selected="warehouseSelected"
                        :error="error.warehouse_id"
                        :dense="true"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectDeliveryOrder
                        name="delivery_order"
                        :warehouse="form.warehouse_id"
                        :disabled="disabled_orderCode"
                        @selected="DOSelected"
                        :error="error.wrt_id"
                        :dense="true"
                    ></SelectDeliveryOrder>
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
                <v-col cols="12" class="-mt24">
                    <v-textarea
                        name="note"
                        v-model="form.note"
                        maxlength="250"
                        :counter="250"
                        outlined
                        :error-messages="error.note"
                        required
                        dense
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
                :mobile-breakpoint="0"
                :headers="table.fields"
                :items="form.products"
                :hide-default-footer="true"
                :items-per-page="-1"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.index + 1 }}</td>
                        <td>{{ props.item.prefixValue.code }} - {{ props.item.prefixValue.name }}</td>
                        <!-- <td>
                            <SelectProductTable
                                :name="`product_${props.index}`"
                                @click.native="setProductIdx(props.index)"
                                @selected="productSelected"
                                :disabled="true"
                                :warehouse="form.warehouse_id"
                                :prefixValue="props.item.prefixValue"
                                :product="props.item.product"
                                :error="errPro(props.index)"
                                :refs="`${props.index+1}-${refs},${form.products.length}`"
                            ></SelectProductTable>
                        </td> -->
                        <td>{{ props.item.uom }}</td>
                        <td>{{ formatPrice(props.item.deliver_qty) }}</td>
                        <td>{{ formatPrice(props.item.receive_qty) }}</td>
                        <td>
                            <vue-numeric
                                :name="`return_good_qty_${props.index}`"
                                :class="errQty(props.index) ? 'productNumeric' : 'productNumericErr'"
                                separator="."
                                placeholder="0,00"
                                @focus="productIdx = props.index"
                                :precision="2"
                                v-model="props.item.return_good_qty"
                                :disabled="ordertype.value == 'zero_waste'"
                            ></vue-numeric>
                        </td>
                        <td>
                            <vue-numeric
                                :name="`return_waste_qty_${props.index}`"
                                :class="errUnitPrice(props.index) ? 'productNumeric' : 'productNumericErr'"
                                separator="."
                                placeholder="0,00"
                                :precision="2"
                                @focus="productIdx = props.index"
                                v-model="props.item.return_waste_qty"
                            ></vue-numeric>
                        </td>
                        <td>
                            <div class="mt24">
                                <SelectGlossary
                                    @click.native="setReasonIdx(props.index)"
                                    :disabled="ordertype.value == 'zero_waste' || props.item.return_waste_qty <= 0"
                                    v-model="props.item.return_waste_reason"
                                    outlined
                                    :dense="true"
                                    :norequired="true"
                                    label="Waste Reason"
                                    @selected="wasteReasonSelected"
                                    table="all"
                                    attribute="waste_reason"
                                    class="rounded-form-sm"
                                    :error="errReason(props.index)"
                                >
                                </SelectGlossary>
                            </div>
                        </td>
                        <td>
                            <v-text-field
                                :name="`note_${props.index}`"
                                outlined
                                class="mt-6 rounded-form-sm mb-20"
                                v-model="props.item.note"
                                dense
                            />
                        </td>
                    </tr>
                </template>
            </v-data-table>
            <!-- <v-row>
                <v-col>
                    <v-btn
                        name="addproduct"
                        rounded
                        elevation="0"
                        class="no-caps px-7"
                        @click="addProduct()"
                        :disabled="disabledBtnAddApply"
                        style="background: #E6E9ED; color:#768F9C;height:45px"
                    >Add Product</v-btn>
                </v-col>
            </v-row> -->
        </div>
        <div class="box">
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    @click="$router.go(-1)"
                    depressed
                    outlined
                    color="#EBEBEB"
                    class="main-btn"
                    v-privilege="'dr_rdl'"
                >
                    <span class="text-black80">Cancel</span>
                </v-btn>
                <v-btn
                    depressed
                    color="#50ABA3"
                    class="main-btn white--text"
                    @click="confirmButton()"
                    v-privilege="'dr_crt'"
                >Save</v-btn>
            </v-card-actions>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </v-container>
</template>

<script>
    import Vue from 'vue'

    export default {
        name: 'CreateSalesOrder',
        data() {
            return {
                form: {
                    area_id: "",
                    recognition_date: new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10),
                    warehouse_id: "",
                    note: '',
                    products: [],
                },
                sendForm: {},
                delivery_date_model: '',
                error: {},
                success: {},
                ConfirmData: {},
                disabledBtnAddApply: true,
                area: '',
                warehouse: '',
                delivery_order: '',
                ordertype: '',
                table: {
                    fields: [
                        {
                            text: 'No.',
                            width: "3%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text: 'Product',
                            width: "20%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'UOM',
                            width: "6%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Deliver Qty',
                            width: "6%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Receive Qty',
                            width: "6%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Return Goods Stock Qty *',
                            width: "12%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            width: "12%",
                            text: 'Return Waste Stock Qty *',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            width: "12%",
                            text: 'Return Waste Reason',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Note',
                            width: "15%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        // {
                        //     width: "3%",
                        //     sortable: false
                        // },
                    ],
                },
                refs: '',
                do_items: '',
                disabled_warehouse: true,
                disabled_orderCode: true,
                reasonIdx: ''
            }
        },
        computed: {
            format_delivery_date() {
                if (this.form.recognition_date)
                    return this.$moment(this.form.recognition_date).format('DD/MM/YYYY')
            },
        },
        mounted() {
            let self = this
            this.$root.$on('event_error', function (err) {
                self.error = err
            });
        },
        methods: {
            errUnitPrice(idx) {
                for (var key in this.error) {
                    if (key.includes(idx) && key.includes('unit_price')) {
                        return false
                    }
                }
                return true
            },
            errQty(idx) {
                for (var key in this.error) {
                    if (key.includes(idx) && key.includes('qty')) {
                        return false
                    }
                }
                return true
            },
            errPro(idx) {
                for (var key in this.error) {
                    if (key.includes(idx) && key.includes('product_id')) {
                        return this.error[key]
                    }
                }
            },
            errReason(idx) {
                for (var key in this.error) {
                    if (key == 'waste_reason_id' + idx) {
                        return this.error[key]
                    }
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
                if (d) {

                    this.form.products[this.productIdx].product = d
                    this.form.products[this.productIdx].product_id = d.id
                    this.form.products[this.productIdx].uom = d.uom.name
                }
            },
            addProduct() {
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
            confirmButton() {
                this.sendForm = {
                    warehouse_id: this.form.warehouse_id,
                    area_id: this.form.area_id,
                    delivery_order_id: this.form.delivery_order_id,
                    recognition_date: this.form.recognition_date,
                    note: this.form.note,
                    delivery_return_items: []
                }
                for (let i = 0; i < this.form.products.length; i++) {
                    this.sendForm.delivery_return_items[i] = {
                        product_id: this.form.products[i].product.id,
                        delivery_order_item_id: this.form.products[i].delivery_order_item_id,
                        deliver_qty: this.form.products[i].deliver_qty,
                        receive_qty: this.form.products[i].receive_qty,
                        return_good_stock_qty: this.form.products[i].return_good_qty,
                        return_waste_stock_qty: this.form.products[i].return_waste_qty,
                        return_waste_reason: this.form.products[i].return_waste_reason,
                        note: this.form.products[i].note,
                    }
                }
                this.ConfirmData = {
                    model: true,
                    title: "Create Delivery Return",
                    text: "Are you sure want to create this delivery return?",
                    urlApi: "/warehouse/delivery_return",
                    nextPage: "/warehouse/delivery-return",
                    data: this.sendForm,
                    post: true
                }
            },
            areaSelected(d) {
                this.area = null;
                this.form.area_id = '';
                this.form.warehouse_id = ""
                this.warehouse = ""
                this.disabled_warehouse = true
                this.disabled_orderCode = true
                this.form.products = []
                if (d !== '' && d !== undefined) {
                    this.area = d;
                    this.form.area_id = d.id
                    this.disabled_warehouse = false
                    this.disabled_orderCode = false
                }
            },
            warehouseSelected(d) {
                this.form.warehouse_id = ""
                this.warehouse = ""
                this.disabled_orderCode = true
                this.form.products = []
                if (d) {
                    this.warehouse = d
                    this.form.warehouse_id = d.id
                    this.disabled_orderCode = false
                }
            },
            DOSelected(d) {
                this.form.delivery_order_id = ""
                this.delivery_order = ""
                this.form.products = []
                this.disabledBtnAddApply = true
                if (d) {
                    this.disabledBtnAddApply = false
                    this.delivery_order = d
                    this.form.delivery_order_id = d.id
                    this.$http.get("/warehouse/delivery_order/" + d.id)
                        .then(response => {
                            this.ordertypeSelected(response.data.data.sales_order)
                            this.do_items = []

                            this.do_items = response.data.data.delivery_order_items
                            for (let i = 0; i < this.do_items.length; i++) {
                                this.form.products.push(
                                    {
                                        product: this.do_items[i].product,
                                        product_id: this.do_items[i].product.id,
                                        delivery_order_item_id: this.do_items[i].id,
                                        prefixValue: {
                                            code: this.do_items[i].product.code,
                                            name: this.do_items[i].product.name,
                                        },
                                        uom: this.do_items[i].product.uom.name,
                                        deliver_qty: this.do_items[i].deliver_qty,
                                        receive_qty: this.do_items[i].receive_qty,
                                    }
                                )
                            }
                        });
                } else {
                    this.form.products = []
                }
            },
            ordertypeSelected(d) {
                this.ordertype = null;
                this.form.order_type_id = ""
                if (d) {
                    this.ordertype = d.order_type
                    this.form.order_type_id = d.order_type.id
                }
            },
            setReasonIdx(idx) {
                this.reasonIdx = idx
            },
            wasteReasonSelected(d) {
                this.form.products[this.reasonIdx].return_waste_reason = 0
                if (d) {
                    this.form.products[this.reasonIdx].return_waste_reason = d.value
                }
            },
        }
    }
</script>
