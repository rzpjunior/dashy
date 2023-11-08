<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row>
                <v-col class="mb6"/>
            </v-row>
            <v-row>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="delivery_order_code"
                        v-model="items.code"
                        disabled
                        required
                        outlined
                        dense
                    >
                        <template v-slot:label>
                            Delivery Order Code *
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="order_code"
                        v-model="items.sales_order.code"
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
                        v-model="items.sales_order.order_type.name"
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
                    <v-text-field
                        name="delivery_date"
                        prepend-inner-icon="mdi-calendar"
                        disabled
                        outlined
                        :error-messages="error.recognition_date"
                        v-model="format_recognition_date"
                        dense
                    >
                        <template v-slot:label>
                            Delivery Date
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
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
                        disabled
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
                :items="form.delivery_order_items"
                :hide-default-footer="true"
                :items-per-page="-1"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.index + 1 }}</td>
                        <td>
                            <v-tooltip top>
                                <template v-slot:activator="{ on: tooltip }">
                                    <div v-on="{ ...tooltip }">
                                        <v-text-field
                                            :name="`product_${props.index}`"
                                            outlined
                                            disabled
                                            class="mt-2 rounded-form-sm"
                                            style="margin-bottom:-20px"
                                            v-model="props.item.product"
                                            :error-messages="errPro(props.index)"
                                            dense
                                        />
                                    </div>
                                </template>
                            <span>{{props.item.product}}</span>
                            </v-tooltip>
                        </td>
                        <td>{{ props.item.uom }}</td>
                        <td>
                            <vue-numeric
                                :name="`order_qty_${props.index}`"
                                placeholder="0,00"
                                :class="errDeliverQty(props.index) ? 'productNumeric' : 'productNumericErr'"
                                separator="."
                                :precision="2"
                                disabled
                                v-model="props.item.order_qty"
                            ></vue-numeric>
                        </td>
                        <td>
                            <vue-numeric
                                :name="`delivery_qty_${props.index}`"
                                placeholder="0,00"
                                :class="errDeliverQty(props.index) ? 'productNumeric' : 'productNumericErr'"
                                separator="."
                                :precision="2"
                                v-model="props.item.deliver_qty"
                            ></vue-numeric>
                        </td>
                        <td>
                            <v-text-field
                                name="note"
                                outlined
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
                            v-privilege="'do_rdl'"
                        >
                            <span class="text-black80">Cancel</span>
                        </v-btn>
                        <v-btn
                            depressed
                            color="#50ABA3"
                            class="main-btn white--text"
                            @click="confirmButton()"
                            v-privilege="'do_cnf'"
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
    import Vue from 'vue'
    export default {
        name: 'ConfirmDeliveryOrder',
        data () {
            return {
                items : {
                    sales_order : {
                        term_invoice_sls : {
                            name : "",
                            name_id : "",
                        },
                        order_type: {
                            name: ''
                        }
                    }
                },
                form : {
                    recognition_date : "",
                    sales_order_id : "",
                    wrt_id : "",
                    warehouse_id : "",
                    shipping_address : "",
                    note : '',
                    delivery_order_items : [],
                },
                order_delivery_date : '',
                order_date : '',
                order_date_model : '',
                delivery_date_model : '',
                error : {},
                success : {},
                ConfirmData : {},
                customer : null,
                outlet : null,
                showoutlet : false,
                wrt: '',
                warehouse : '',
                subdistrict_id : '',
                table: {
                    fields: [
                        {
                            text:'No.',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Product',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'UOM',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Delivery Qty',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Receive Qty *',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Receive Note',
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
        mounted () {
            let self = this
            this.$root.$on('event_error', function(err){
                self.error = err
            });
        },
        created() {
            this.renderData()
            let self = this
            setTimeout(function(){
                self.setProduct()
                self.branchSelected(self.items.sales_order.branch)
            }, 500);
        },
        methods:{
            setProduct() {
                let arr = JSON.parse(JSON.stringify(this.form.delivery_order_items))
                this.form.delivery_order_items = arr
            },
            renderData(){
                this.$http.get("/warehouse/delivery_order/"+this.$route.params.id).then(response => {
                    this.items = response.data.data
                    this.merchantSelected(this.items.sales_order.branch.merchant)
                    this.form.recognition_date = this.$moment(this.items.recognition_date).format('YYYY-MM-DD')
                    this.order_delivery_date = this.$moment(this.items.sales_order.delivery_date).format('DD/MM/YYYY')
                    this.order_date = this.$moment(this.items.sales_order.recognition_date).format('YYYY-MM-DD')
                    this.wrtSelected(this.items.wrt)
                    this.warehouseSelected(this.items.warehouse)
                    this.form.sales_order_id = this.items.sales_order.id
                    this.form.shipping_address = this.items.shipping_address
                    this.form.note = this.items.note
                    this.form.delivery_order_items = []
                    this.items.delivery_order_items.forEach(element => {
                        this.form.delivery_order_items.push(
                            {
                                id : element.id,
                                product : element.product.code +' - '+element.product.name,
                                product_id : element.product.id,
                                uom : element.product.uom.name,
                                order_qty : element.deliver_qty,
                                deliver_qty : element.receive_qty == 0 ? element.deliver_qty : element.receive_qty,
                                note: element.receipt_item_note == '' ? element.note : element.receipt_item_note,
                            }
                        )
                    });
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
                this.ConfirmData = {
                    model : true,
                    title : "Confirm Delivery Order",
                    text : "Are you sure want to confirm this delivery order?",
                    urlApi : "/warehouse/delivery_order/confirm/"+this.$route.params.id,
                    nextPage : "/warehouse/delivery-order/detail/"+this.$route.params.id,
                    data : this.form
                }
            },
            merchantSelected(d) {
                this.showoutlet = false
                this.area = null
                this.customer = null
                this.showoutlet = false
                if (d) {
                    if (d.customer_group==1) {
                        this.showoutlet = true
                    }
                    this.customer = d
                }
            },
            branchSelected(d) {
                this.outlet = null
                this.subdistrict_id = null
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
