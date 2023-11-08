<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row>
                <v-col class="fs24 bold">
                    {{form.code}}
                </v-col>
            </v-row>
            <v-spacer></v-spacer>
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
                                    prepend-inner-icon="mdi-calendar"
                                    outlined
                                    clearable
                                    :error-messages="error.recognition_date"
                                    @click:clear="form.recognition_date = ''"
                                    v-model="form.recognition_date"
                                    maxlength="10"
                                    onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 45"
                                    dense
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
                        disabled
                        :aux_data="2"
                        :area="area"
                        :error="error.finance_area_id"
                        :dense="true"
                    ></SelectArea>  
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectWarehouse
                        name= "warehouse"
                        disabled
                        v-model="warehouse"
                        :area_id="form.area_id"
                        :aux_data="2"
                        :warehouse="warehouse"
                        @selected="warehouseSelected"
                        :error="error.warehouse_id"
                        :dense="true"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="delivery_order"
                        v-model="delivery_order_code"
                        required
                        disabled
                        outlined
                        dense
                    >
                    <template v-slot:label>
                        Delivery Order Code<span class="text-red">*</span>
                    </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectOrderType
                        :ordertype="ordertype"
                        name="ordertype"
                        disabled
                        :dense="true"
                        @selected="ordertypeSelected"
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
                :headers="table.fields"
                :mobile-breakpoint="0"
                :items="form.products"
                :hide-default-footer="true"
                :items-per-page="-1"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.index + 1 }}</td>
                        <td>{{ props.item.prefixValue.code }} - {{ props.item.prefixValue.name }}</td>
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
                                    :glossary="props.item.reason_value"
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
                        /></td>
                    </tr>
                </template>
            </v-data-table>
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
                    v-privilege="'dr_upd'"
                >
                    Save
                </v-btn>
            </v-card-actions>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </v-container>
</template>

<script>
    import Vue from 'vue'
    export default {
        name: 'CreateSalesOrder',
        data () {
            return {
                form : {
                    code : "",
                    area_id : "",
                    recognition_date : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                    warehouse_id : "",
                    note : '',
                    products : [],
                },
                sendForm:{},
                delivery_date_model : '',
                error : {},
                success : {},
                ConfirmData : {},
                disabledBtnAddApply : true,
                area : '',
                warehouse : '',
                delivery_order : '',
                delivery_order_code :'',
                ordertype: '',
                table: {
                    fields: [
                        {
                            text:'No.',
                            width: "3%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Product',
                            width: "20%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'UOM',
                            width: "6%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Deliver Qty',
                            width: "6%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Receive Qty',
                            class: 'grey--text text--darken-4',
                            width: "6%",
                            sortable: false
                        },
                        {
                            text:'Return Goods Stock Qty *',
                            class: 'grey--text text--darken-4',
                            width: "12%",
                            sortable: false
                        },
                        {
                            width: "12%",
                            text:'Return Waste Stock Qty *',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Return Waste Reason',
                            class: 'grey--text text--darken-4',
                            width: "12%",
                            sortable: false
                        },
                        {
                            text:'Note',
                            width: "15%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                    ],
                },
                refs : '',
                do_items : '',
                reasonIdx: '',
            }
        },
        mounted () {
            let self = this
            this.$root.$on('event_error', function(err){
                self.error = err
            });
        },
        created() {
            this.renderData()
        },
        methods:{
            renderData(){
                this.$http.get("/warehouse/delivery_return/"+this.$route.params.id).then(response => {
                    let datas = response.data.data
                    this.form.code = datas.code
                    this.form.note = datas.note
                    this.form.recognition_date = this.$moment(datas.recognition_date).format('YYYY-MM-DD')
                    this.ordertypeSelected(datas.delivery_order.sales_order)
                    this.areaSelected(datas.warehouse.area)
                    this.warehouseSelected(datas.warehouse)
                    this.deliveryOrderSelected(datas.delivery_order)

                    this.do_items = datas.delivery_return_item
                    for (let i = 0; i < this.do_items.length; i++) {
                        this.form.products.push(
                            {
                                id : this.do_items[i].id,
                                product : this.do_items[i].product,
                                product_id : this.do_items[i].product.id,
                                delivery_order_item_id : this.do_items[i].delivery_order_item.id,
                                prefixValue : {
                                    code : this.do_items[i].product.code,
                                    name : this.do_items[i].product.name,
                                },
                                uom : this.do_items[i].product.uom.name,
                                deliver_qty : this.do_items[i].delivery_order_item.deliver_qty,
                                receive_qty : this.do_items[i].delivery_order_item.receive_qty,
                                return_good_qty : this.do_items[i].return_good_qty,
                                return_waste_qty : this.do_items[i].return_waste_qty,
                                return_waste_reason: this.do_items[i].return_waste_reason,
                                reason_value: this.do_items[i].return_waste_reason,
                                note : this.do_items[i].note,
                            }
                        )
                        this.$http.get("/config/glossary?conditions=table:all|attribute:waste_reason|value_int:" + this.do_items[i].return_waste_reason)
                        .then(res => {
                            if (res.data.data == null) { // handle if waste_reason null
                                this.form.products[i].return_waste_reason = null
                                this.form.products[i].reason_value = null
                            } else {
                                this.form.products[i].return_waste_reason = res.data.data[0].value_int
                                this.form.products[i].reason_value = res.data.data[0].id
                            }
                        })
                    }
                });
            },
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
                if(d) {
                    this.form.products[this.productIdx].product = d
                    this.form.products[this.productIdx].product_id = d.id
                    this.form.products[this.productIdx].uom = d.uom.name
                }
            },
            addProduct() {
                this.form.products.push(
                    {
                        product : "",
                        product_id : "",
                        uom : "",
                        deliver_qty : 0,
                        receive_qty : 0,
                        note : "",
                    }
                )
                this.refs = false
                Vue.nextTick(() => {
                    this.refs = true
                    this.setProductIdx(this.form.products.length-1)
                });
            },
            confirmButton() {
                this.sendForm = {
                    warehouse_id: this.form.warehouse_id,
                    area_id: this.form.area_id,
                    // delivery_order_id: this.form.delivery_order_id,
                    recognition_date: this.form.recognition_date,
                    note: this.form.note,
                    delivery_return_items:[]
                }
                for (let i = 0; i < this.form.products.length; i++) {
                    this.sendForm.delivery_return_items[i] = {
                        id : this.form.products[i].id,
                        product_id: this.form.products[i].product.id,
                        delivery_order_item_id: this.form.products[i].delivery_order_item_id,
                        deliver_qty: parseFloat(this.form.products[i].deliver_qty),
                        receive_qty: parseFloat(this.form.products[i].receive_qty),
                        return_good_stock_qty: parseFloat(this.form.products[i].return_good_qty),
                        return_waste_stock_qty: parseFloat(this.form.products[i].return_waste_qty),
                        return_waste_reason: this.form.products[i].return_waste_reason,
                        note: this.form.products[i].note,
                    }
                }
                this.ConfirmData = {
                    model : true,
                    title : "Update Delivery Return",
                    text : "Are you sure want to update this delivery return?",
                    urlApi : "/warehouse/delivery_return/"+this.$route.params.id,
                    nextPage : "/warehouse/delivery-return/detail/"+this.$route.params.id,
                    data : this.sendForm,
                }
            },
            areaSelected(d) {
                this.area = null;
                this.form.area_id = '';
                this.form.warehouse_id = ""
                this.warehouse = ""
                this.clearWarehouse = true
                this.disabled_warehouse = true
                if (d !== ''  && d !== undefined) {
                    this.area = d;
                    this.form.area_id = d.id
                    this.disabled_warehouse = false
                    this.clearWarehouse = false
                }
            },
            warehouseSelected(d) {
                this.form.warehouse_id = ""
                this.warehouse = ""
                if (d) {
                    this.warehouse = d
                    this.form.warehouse_id = d.id
                }
            },
            deliveryOrderSelected(d) {
                this.form.delivery_order_id = ""
                this.delivery_order = ""
                this.delivery_order_code = ""
                if (d) {
                    this.delivery_order = d
                    this.form.delivery_order_id = d.id
                    this.delivery_order_code = d.code
                } else {
                    this.form.products = []
                }
            },
            ordertypeSelected(d) {
                this.ordertype = ""
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
                this.form.products[this.reasonIdx].reason_value = 0
                this.form.products[this.reasonIdx].return_waste_reason = 0
                if (d) {
                    this.form.products[this.reasonIdx].return_waste_reason = d.value
                }
            },
        }
    }
</script>
