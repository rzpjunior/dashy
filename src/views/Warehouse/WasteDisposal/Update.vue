<template>
    <v-container class="px-12">
        <v-row style="margin-top:24px">
            <v-col cols="12" md="6" class="mtn24">
                <SelectArea
                    name="area"
                    @selected="areaSelected"
                    :aux_data="2"
                    :area="area"
                    :error="error.area_id"
                    disabled
                ></SelectArea>
            </v-col>
            <v-col cols="12" md="6" class="mtn24">
                <SelectWarehouse
                    name="warehouse"
                    :aux_data="2"
                    :area_id="form.area_id"
                    :warehouse="warehouse"
                    :disabled="true"
                    @selected="warehouseSelected"
                    :error="error.warehouse_id"
                ></SelectWarehouse>
            </v-col>
            <v-col cols="12" md="6" class="mtn24">
                <SelectSupplier
                    name="supplier"
                    @selected="supplierSelected"
                    :supplier="supplier"
                    disabled
                    :error="error.supplier_id"
                ></SelectSupplier>
            </v-col>
            <v-col cols="12" md="6" class="mtn24">
                <SelectPurchaseOrder
                    name="purchase_order"
                    @selected="purchaseOrderSelected"
                    :supplier="form.supplier_id"
                    :purchase_order="purchase_order"
                    :warehouse="form.warehouse_id"
                    :error="error.purchase_order_id"
                    :disabled="true"
                ></SelectPurchaseOrder>
            </v-col>
            <v-col cols="12" md="6" class="mtn24">
                <v-text-field
                    name="recognition_date"
                    prepend-inner-icon="mdi-calendar"
                    disabled
                    outlined
                    :value="formatDate(recognition_date)"
                    class="rounded-form"
                >
                    <template v-slot:label>
                        Order Date
                    </template>
                </v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="mtn24">
                <v-text-field
                    name="eta_date"
                    prepend-inner-icon="mdi-calendar"
                    outlined
                    disabled
                    :value="formatDate(eta_date)"
                    class="rounded-form"
                >
                    <template v-slot:label>
                        Estimated Arrival Date
                    </template>
                </v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="mtn24">
                <v-text-field
                    name="eta_date"
                    prepend-inner-icon="mdi-clock-outline"
                    outlined
                    disabled
                    :value="eta_time"
                    class="rounded-form"
                >
                    <template v-slot:label>
                        Estimated Arrival Time
                    </template>
                </v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="mtn24">
                <v-menu
                    ref="menu"
                    v-model="ata_date_model"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                >
                    <template v-slot:activator="{ on }">
                        <div v-on="on">
                            <v-text-field
                                :disabled="choosePo"
                                name="actual_date"
                                prepend-inner-icon="mdi-calendar"
                                outlined
                                clearable
                                maxlength="10"
                                onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 45"
                                @click:clear="form.ata_date = ''"
                                :error-messages="error.ata_date"
                                v-model="form.ata_date"
                                class="rounded-form"
                            >
                                <template v-slot:label>
                                    Actual Arrival Date<span style="color:red">*</span>
                                </template>
                            </v-text-field>
                        </div>
                    </template>
                    <v-date-picker
                        v-model="form.ata_date"
                        @input="ata_date_model = false"
                    ></v-date-picker>
                </v-menu>
            </v-col>
            <v-col cols="12" md="6" class="mtn24">
                <v-menu
                    ref="menu"
                    v-model="ata_time_model"
                    :close-on-content-click="false"
                    :return-value.sync="form.ata_time"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            :disabled="choosePo"
                            prepend-inner-icon="mdi-clock-outline"
                            outlined
                            clearable
                            maxlength="5"
                            onkeypress="return event.charCode >= 48 && event.charCode <= 58"
                            @click:clear="form.ata_time = ''"
                            v-model="form.ata_time"
                            :error-messages="error.ata_time"
                            class="rounded-form"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <template v-slot:label>
                                Actual Arrival Time<span style="color:red">*</span>
                            </template>
                        </v-text-field>
                    </template>
                    <v-time-picker
                        v-if="ata_time_model"
                        v-model="form.ata_time"
                        full-width
                        @click:minute="$refs.menu.save(form.ata_time)"
                    ></v-time-picker>
                </v-menu>
            </v-col>
            <v-col cols="12" md="6" class="mtn24">
                <v-textarea
                    name="note"
                    v-model="form.note"
                    :counter="350"
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
        <div class="title-table">
            <label class="label-title">
                Products
            </label>
        </div>
        <v-data-table
            :headers="table.fields"
            :items="form.items"
            :hide-default-footer="true"
            :items-per-page="-1"
        >
            <template v-slot:item="props">
                <tr>
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
                        {{ formatPrice(props.item.order_qty) }}
                    </td>
                    <td>
                        <vue-numeric
                            :name="`deliver_qty_${props.index}`"
                            placeholder="0,00"
                            :class="errDeliverQty(props.index) ? 'productNumeric' : 'productNumericErr'"
                            separator="."
                            :precision="2"
                            v-model="props.item.delivery_qty"
                        ></vue-numeric>
                    </td>
                    <td>
                        <vue-numeric
                            :name="`deliver_qty_${props.index}`"
                            placeholder="0,00"
                            :class="errRejectQty(props.index) ? 'productNumeric' : 'productNumericErr'"
                            separator="."
                            :precision="2"
                            v-model="props.item.reject_qty"
                        ></vue-numeric>
                    </td>
                    <td>
                        {{ formatPrice(receiveQty(props.item.delivery_qty, props.item.reject_qty)) }}
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
        <v-row style="border-top: 1px solid #C8DDC8;" class="mt-10">
            <v-col>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        rounded
                        elevation="0"
                        class="no-caps px-7"
                        @click="$router.go(-1)"
                        style="background: #E6E9ED; color:#768F9C;height:45px"
                        v-privilege="'wd_rdl'"
                    >Cancel</v-btn>
                    <v-btn
                        class="px-7 ml-2 no-caps white--text"
                        @click="confirmButton()"
                        elevation="0"
                        rounded
                        style="background: #768f9c; height:45px"
                        v-privilege="'wd_upd'"
                    >Save</v-btn>
                </v-card-actions>
            </v-col>
        </v-row>
        <ConfirmationDialog :sendData="ConfirmData"/>
    </v-container>
</template>
<script>
    export default {
        name: 'CreateSalesOrder',
        data () {
            return {
                form : {
                    ata_date:"",
                    ata_time:"",
                    note:"",
                    items : [],
                },
                error : {},
                success : {},
                ConfirmData : {},
                disabledWr : true,
                disabledPoS : true,
                disabledPoW : true,
                choosePo : true,
                area : "",
                warehouse : '',
                supplier : '',
                purchase_order : '',
                recognition_date : '',
                eta_date : '',
                eta_time : '',
                ata_date_model : '',
                ata_time_model : '',
                table: {
                    fields: [
                        {
                            text:'No.',
                            sortable: false,
                        },
                        {
                            text:'Product',
                            sortable: false
                        },
                        {
                            text:'UOM',
                            sortable: false
                        },
                        {
                            text:'Order Qty',
                            sortable: false
                        },
                        {
                            text:'Delivery Qty *',
                            sortable: false
                        },
                        {
                            text:'Reject Qty *',
                            sortable: false
                        },
                        {
                            text:'Receive Qty',
                            sortable: false
                        },
                        {
                            text:'Note',
                            sortable: false
                        },
                    ],
                }

            }
        },
        computed: {
            format_recognition_date() {
                if (this.recognition_date)
                return this.$moment(this.recognition_date).format('DD/MM/YYYY')
            },
            format_eta_date() {
                if (this.eta_date)
                return this.$moment(this.eta_date).format('DD/MM/YYYY')
            },
            format_eta_time() {
                if (this.eta_time)
                return this.$moment(this.eta_time).format('HH:mm')
            },
            format_ata_date() {
                if (this.form.ata_date)
                return this.$moment(this.form.ata_date).format('DD/MM/YYYY')
            },
            disabledPo() {
                if (this.disabledPoS == false && this.disabledPoW == false) {
                    return false
                } else {
                    return true
                }
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
                this.$http.get("/warehouse/goods/receipt/"+this.$route.params.id).then(response => {
                    let data = response.data.data
                    this.areaSelected(data.warehouse.area)
                    this.warehouseSelected(data.warehouse)
                    this.supplierSelected(data.purchase_order.supplier)
                    this.purchaseOrderSelected(data.purchase_order)
                    this.form.ata_date = this.$moment(data.ata_date).format('YYYY-MM-DD')
                    this.form.ata_time = data.ata_time
                    this.form.note = data.note
                    data.goods_receipt_items.forEach(e => {
                        this.form.items.push({
                            goods_receipt_item_id:e.id,
                            product:e.product.code +" - "+ e.product.name,
                            product_id:e.product.id,
                            uom:e.product.uom.name,
                            order_qty:e.purchase_order_item.order_qty,
                            delivery_qty:e.delivery_qty,
                            reject_qty:e.reject_qty,
                            note:e.note
                        })
                    });
                });
            },
            receiveQty(val1, val2) {
                return val1-val2
            },
            errPro(idx) {
                for (var key in this.error) {
                    if (key.includes(idx) && key.includes('receive_qty')) {
                        return this.error[key]
                    }
                }
            },
            errDeliverQty(idx) {
                for (var key in this.error) {
                    if (key.includes(idx) && key.includes('delivery_qty') || key.includes(idx) && key.includes('receive_qty')) {
                        return false
                    }
                }
                return true
            },
            errRejectQty(idx) {
                for (var key in this.error) {
                    if (key.includes(idx) && key.includes('reject_qty') || key.includes(idx) && key.includes('receive_qty')) {
                        return false
                    }
                }
                return true
            },
            confirmButton() {
                this.ConfirmData = {
                    model : true,
                    title : "Update Goods Receipt",
                    text : "Are you sure want to update this goods receipt?",
                    urlApi : "/warehouse/goods/receipt/"+this.$route.params.id,
                    nextPage : "/warehouse/goods-receipt/detail/"+this.$route.params.id,
                    data : this.form
                }
            },
            areaSelected(d) {
                this.disabledWr = true
                this.warehouse = ""
                this.disabledPoW = true
                this.choosePo = true
                this.recognition_date = ""
                this.eta_date = ""
                this.eta_time = ""
                this.purchase_order = null
                if (d) {
                    this.area = d
                }
            },
            warehouseSelected(d) {
                this.warehouse = ""
                this.disabledPoW = true
                this.choosePo = true
                this.recognition_date = ""
                this.eta_date = ""
                this.eta_time = ""
                this.purchase_order = null
                if (d) {
                    this.disabledPoW = false
                    this.warehouse = d
                }
            },
            supplierSelected(d) {
                this.supplier = null
                this.disabledPoS = true
                this.choosePo = true
                this.recognition_date = ""
                this.eta_date = ""
                this.eta_time = ""
                this.purchase_order = null
                if (d) {
                    this.supplier = d
                    this.disabledPoS = false
                }
            },
            purchaseOrderSelected(d) {
                this.choosePo = true
                this.recognition_date = ""
                this.eta_date = ""
                this.eta_time = ""
                this.purchase_order = null
                if (d) {
                    this.purchase_order = d
                    this.choosePo = false
                    this.recognition_date = d.recognition_date
                    this.eta_date = d.eta_date
                    this.eta_time = d.eta_time
                }
            },
        }
    }
</script>
