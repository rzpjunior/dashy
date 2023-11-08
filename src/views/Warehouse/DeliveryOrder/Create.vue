<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mb24">
                <v-col class="bold fs16">
                    {{toUpperCase(items.term_invoice_sls.name)}} : *{{items.term_invoice_sls.name_id}}
                </v-col>
            </v-row>
            <v-row>
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
                    <v-text-field
                        name="order_type"
                        v-model="items.order_type.name"
                        disabled
                        required
                        outlined
                        dense
                    >
                        <template v-slot:label>
                            Order Type *
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="order_date"
                        prepend-inner-icon="mdi-calendar"
                        disabled
                        outlined
                        :error-messages="error.order_date"
                        :value="format_order_date"
                        dense
                    >
                        <template v-slot:label>
                            Order Date *
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="order_delivery_date"
                        prepend-inner-icon="mdi-calendar"
                        disabled
                        outlined
                        :error-messages="error.delivery_date"
                        v-model="order_delivery_date"
                        dense
                    >
                        <template v-slot:label>
                        Order Delivery Date *
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectWrt
                        name= "outlet"
                        @selected="wrtSelected"
                        :wrt="wrt"
                        :disabled="true"
                        :dense="true"
                        :area="form.area_id"
                        :error="error.wrt_id"
                    ></SelectWrt>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectMerchant
                        name= "customer"
                        :label="'Customer'"
                        :disabled="true"
                        :dense="true"
                        @selected="merchantSelected"
                        :error="error.merchant_id"
                        :merchant="customer"
                    />
                </v-col>
                <v-col cols="12" md="6" v-if="showoutlet" class="-mt24">
                    <SelectBranch
                        name= "outlet"
                        :merchant="form.merchant_id"
                        @selected="branchSelected"
                        :disabled="true"
                        :dense="true"
                        :error="error.branch_id"
                        :label="'Outlet'"
                        :branch="outlet"
                    ></SelectBranch>
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
                                    v-model="form.recognition_date"
                                    :error-messages="error.recognition_date"
                                    @click:clear="form.recognition_date = ''"
                                    :value="format_recognition_date"
                                    dense
                                >
                                    <template v-slot:label>
                                        Delivery Date
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            v-model="form.recognition_date"
                            @input="delivery_date_model = false"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="6" class="-mt24 mb20">
                    <DetailRowNew :name="'Warehouse'" :value="warehouse.name"/>
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
                            Shipping Address<span style="color:red">*</span>
                        </template>
                    </v-textarea>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
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
                :mobile-breakpoint="0"
                :items="form.delivery_order_items"
                :hide-default-footer="true"
                :items-per-page="-1"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.index + 1 }}</td>
                        <td>{{ props.item.product }}</td>
                        <td>{{ props.item.uom }}</td>
                        <td class="right">
                            {{ formatPrice(props.item.order_qty) }}
                        </td>
                        <td class="right">
                            {{ formatPrice(props.item.picking_qty) }}
                        </td>
                        <td>
                            <vue-numeric
                                :name="`deliver_qty_${props.index}`"
                                placeholder="0,00"
                                :class="errDeliverQty(props.index) ? 'productNumeric' : 'productNumericErr'"
                                separator="."
                                :precision="2"
                                v-model="props.item.deliver_qty"
                            ></vue-numeric>
                        </td>
                        <td>
                            <v-text-field
                                :name="`note_${props.index}`"
                                outlined
                                disabled
                                class="mt-2 rounded-form-sm"
                                style="margin-bottom:-20px"
                                v-model="props.item.note"
                                dense
                            />
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <div class="box-end">
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
                            v-privilege="'do_crt'"
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
        name: 'CreateDeliveryOrder',
        data () {
            return {
                items: {
                    term_invoice_sls: {
                        name: "",
                        name_id: "",
                        code: ""
                    },
                    order_type: {
                        name: ''
                    }
                },
                form: {
                    recognition_date: "",
                    sales_order_id: "",
                    wrt_id: "",
                    warehouse_id: "",
                    shipping_address: "",
                    note: '',
                    delivery_order_items: [],
                },
                order_delivery_date: '',
                order_date: '',
                order_date_model: '',
                delivery_date_model: '',
                error: {},
                success: {},
                ConfirmData: {},
                customer: null,
                outlet: null,
                showoutlet: false,
                wrt: '',
                warehouse: '',
                subdistrict_id: '',
                table: {
                    fields: [
                        {
                            text:'No.',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                            width: '1%'
                        },
                        {
                            text:'Product',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                            width: '25%'
                        },
                        {
                            text:'UOM',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Order Qty',
                            class: 'grey--text text--darken-4',
                            align: "right",
                            sortable: false
                        },
                        {
                            text:'Picking Qty',
                            class: 'grey--text text--darken-4',
                            align: "right",
                            sortable: false
                        },
                        {
                            text:'Delivery Qty *',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Note',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                    ],
                }

            }
        },
        computed: {
            format_recognition_date() {
                if (this.form.recognition_date)
                    return this.$moment(this.form.recognition_date).format('DD/MM/YYYY')
            },
            format_order_date() {
                if (this.order_date)
                    return this.$moment(this.order_date).format('DD/MM/YYYY')
            },
            format_delivery_date() {
                if (this.order_delivery_date)
                    return this.$moment(this.order_delivery_date).format('DD/MM/YYYY')
            },
        },
        mounted() {
            let self = this
            this.$root.$on('event_error', function (err) {
                self.error = err
            });
        },
        created() {
            this.renderData()
            this.renderPicking()
            let self = this
            setTimeout(function () {
                self.setProduct()
                self.branchSelected(self.items.branch)
            }, 500);
        },
        methods: {
            setProduct() {
                let arr = JSON.parse(JSON.stringify(this.form.delivery_order_items))
                this.form.delivery_order_items = arr
            },
            renderPicking() {
                this.$http.get("/warehouse/picking_order/items", {
                    params: {
                        conditions: 'pickingorderassign.salesorder.id.e:' + this.$route.params.id
                    }
                }).then(response => {
                    let data = response.data.data
                    this.form.delivery_order_items = []
                    if (data === null) {
                        this.$http.get("/sales/order/" + this.$route.params.id).then(res => {
                            let dataSO = res.data.data.sales_order_items
                            dataSO.forEach(el => {
                                this.form.delivery_order_items.push({
                                    product: el.product.code + ' - ' + el.product.name,
                                    product_id: el.product.id,
                                    uom: el.product.uom.name,
                                    order_qty: el.order_qty,
                                    deliver_qty: el.order_qty,
                                    picking_qty: 0,
                                    note: el.note
                                })
                            })
                        })
                    } else {
                        for (let i = 0; i < data.length; i++) {
                            if (data.length > 0) {
                                this.form.delivery_order_items.push({
                                    product: data[i].product.code + ' - ' + data[i].product.name,
                                    product_id: data[i].product.id,
                                    uom: data[i].product.uom.name,
                                    order_qty: data[i].order_qty,
                                    deliver_qty: data[i].pick_qty,
                                    picking_qty: data[i].pick_qty,
                                    note: data[i].note
                                })
                            }
                        }
                    }
                });
            },
            renderData() {
                this.$http.get("/sales/order/" + this.$route.params.id).then(response => {
                    this.items = response.data.data
                    this.items.term_invoice_sls.code = response.data.data.term_invoice_sls.code
                    this.merchantSelected(this.items.branch.merchant)
                    this.form.recognition_date = this.$moment(this.items.delivery_date).format('YYYY-MM-DD')
                    this.order_delivery_date = this.$moment(this.items.delivery_date).format('DD/MM/YYYY')
                    this.order_date = this.$moment(this.items.recognition_date).format('YYYY-MM-DD')
                    this.wrtSelected(this.items.wrt)
                    this.warehouseSelected(this.items.warehouse)
                    this.form.sales_order_id = this.items.id
                    this.form.shipping_address = this.items.shipping_address
                    this.form.note = this.items.note
                });
            },
            errPro(idx) {
                for (var key in this.error) {
                    if (key.includes(idx) && key.includes('product_id')) {
                        return this.error[key]
                    }
                }
            },
            errDeliverQty(idx) {
                for (var key in this.error) {
                    if (key.includes(idx) && key.includes('product_id')) {
                        return false
                    }
                }
                return true
            },
            confirmButton() {
                if (this.items.term_invoice_sls.code == 'SIT0002') {
                    this.ConfirmData = {
                        model: true,
                        title: "Create Delivery Order",
                        text: "Are you sure want to create this delivery order?",
                        urlApi: "/warehouse/delivery_order/produce_create",
                        // urlApi : "/warehouse/delivery_order",
                        nextPage: "/sales-order/detail/" + this.items.id,
                        data: this.form,
                        withJobs: false,
                        post: true
                    }
                } else {
                    this.ConfirmData = {
                        model: true,
                        title: "Create Delivery Order",
                        text: "Are you sure want to create this delivery order?",
                        // urlApi : "/warehouse/delivery_order",
                        urlApi: "/warehouse/delivery_order/produce_create",
                        nextPage: "/warehouse/delivery-order",
                        data: this.form,
                        withJobs: false,
                        post: true
                    }
                }
            },
            merchantSelected(d) {
                this.showoutlet = false
                this.area = null
                this.customer = null
                this.showoutlet = false
                if (d) {
                    if (d.customer_group == 1) {
                        this.showoutlet = true
                    }
                    this.customer = d
                }
            },
            branchSelected(d) {
                this.outlet = null
                this.subdistrict_id = ""
                if (d) {
                    this.outlet = d
                    this.subdistrict_id = d.sub_district.id
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
                }
            }
        }
    }
</script>
