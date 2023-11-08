<template>
    <div class="m0">
        <v-container fill-height class="main-container hidden-sm-and-down">
            <div class="box">
                <v-row class="mt24">
                    <v-col cols="12" md="6" class="-mt24">
                        <SelectArea
                            name="area"
                            @selected="areaSelected"
                            :aux_data="2"
                            :error="error.area_id"
                            :dense="true"
                        ></SelectArea>
                    </v-col>
                    <v-col cols="12" md="6" class="-mt24">
                        <SelectWarehouse
                            name="warehouse"
                            :aux_data="2"
                            :area_id="form.area_id"
                            :warehouse="warehouse"
                            :disabled="disabledWr"
                            @selected="warehouseSelected"
                            :error="error.warehouse_id"
                            :dense="true"
                        ></SelectWarehouse>
                    </v-col>
                    <v-col cols="12" md="6" class="-mt24">
                        <SelectSupplier
                            name="supplier"
                            @selected="supplierSelected"
                            :supplier="supplier"
                            :error="error.supplier_id"
                            :dense="true"
                        ></SelectSupplier>
                    </v-col>
                    <v-col cols="12" md="6" class="-mt24">
                        <SelectPurchaseOrder
                            name="purchase_order"
                            @selected="purchaseOrderSelected"
                            :supplier="form.supplier_id"
                            :purchase_order="purchase_order"
                            :warehouse="form.warehouse_id"
                            :error="error.purchase_order_id"
                            :disabled="disabledPo"
                            :dense="true"
                        ></SelectPurchaseOrder>
                    </v-col>
                    <v-col cols="12" md="6" class="-mt24">
                        <v-text-field
                            name="recognition_date"
                            prepend-inner-icon="mdi-calendar"
                            disabled
                            outlined
                            :value="formatDate(recognition_date)"
                            dense
                        >
                            <template v-slot:label>
                                Order Date
                            </template>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" md="3" class="-mt24">
                        <v-text-field
                            name="eta_date"
                            prepend-inner-icon="mdi-calendar"
                            outlined
                            disabled
                            :value="formatDate(eta_date)"
                            dense
                        >
                            <template v-slot:label>
                                Estimated Arrival Date
                            </template>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" md="3" class="-mt24">
                        <v-text-field
                            name="eta_date"
                            prepend-inner-icon="mdi-clock-outline"
                            outlined
                            disabled
                            :value="eta_time"
                            dense
                        >
                            <template v-slot:label>
                                Estimated Arrival Time
                            </template>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" md="3" class="-mt24">
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
                                        dense
                                    >
                                        <template v-slot:label>
                                            Actual Arrival Date<span class="text-red">*</span>
                                        </template>
                                    </v-text-field>
                                </div>
                            </template>
                            <v-date-picker
                                v-model="form.ata_date"
                                @input="ata_date_model = false"
                                class="hidden-sm-and-down"
                            ></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="12" md="3" class="-mt24">
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
                                    dense
                                    v-bind="attrs"
                                    v-on="on"
                                    @blur="$refs.menu.save(form.ata_time)"
                                >
                                    <template v-slot:label>
                                        Actual Arrival Time<span class="text-red">*</span>
                                    </template>
                                </v-text-field>
                            </template>
                            <v-time-picker
                                format="24hr"
                                v-if="ata_time_model"
                                v-model="form.ata_time"
                                full-width
                                @click:minute="$refs.menu.save(form.ata_time)"
                                class="hidden-sm-and-down"
                            ></v-time-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="12" class="-mt24">
                        <v-textarea
                            name="note"
                            v-model="form.note"
                            :counter="350"
                            maxlength="350"
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
                    <v-col cols="12" md="6" class="-mt24">
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
                    :items="form.items"
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
                                                class="mt-6 rounded-form-sm mb-20"
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
                                    :name="`reject_qty_${props.index}`"
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
            </div>
        </v-container>
        <v-container class="hidden-md-and-up">
            <v-row>
                <v-col cols="12" class="mt24">
                    <SelectArea
                        name="area"
                        @selected="areaSelected"
                        :aux_data="2"
                        :error="error.area_id"
                        class="rounded-form"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <SelectWarehouse
                        name="warehouse"
                        :aux_data="2"
                        :area_id="form.area_id"
                        :warehouse="warehouse"
                        :disabled="disabledWr"
                        @selected="warehouseSelected"
                        :error="error.warehouse_id"
                        class="rounded-form"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="inbound_type"
                        v-model="inbound_type"
                        label="Type"
                        disabled
                        :dense="true"
                        outlined
                    />
                </v-col>
                <v-col cols="12" class="-mt24">
                    <SelectPurchaseOrder
                        name="purchase_order"
                        @selected="purchaseOrderSelected"
                        :supplier="form.supplier_id"
                        :purchase_order="purchase_order"
                        :warehouse="form.warehouse_id"
                        :error="error.inbound_id"
                        :disabled="disabledPo"
                        :dense="true"
                        label="Inbound Code"
                    ></SelectPurchaseOrder>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectSupplier
                        name="supplier"
                        @selected="supplierSelected"
                        :supplier="supplier"
                        :error="error.supplier_id"
                        :dense="true"
                    ></SelectSupplier>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
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
                <v-col cols="12" class="-mt24">
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
                <v-col cols="12" class="-mt24">
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
                <v-col cols="12" class="-mt24">
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
                                        Actual Arrival Date<span class="text-red">*</span>
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            v-model="form.ata_date"
                            @input="ata_date_model = false"
                            class="hidden-md-and-up"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" class="-mt24">
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
                                @blur="$refs.menu.save(form.ata_time)"
                            >
                                <template v-slot:label>
                                    Actual Arrival Time<span class="text-red">*</span>
                                </template>
                            </v-text-field>
                        </template>
                        <v-time-picker
                            format="24hr"
                            v-if="ata_time_model"
                            v-model="form.ata_time"
                            full-width
                            @click:minute="$refs.menu.save(form.ata_time)"
                            class="hidden-md-and-up"
                        ></v-time-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <v-textarea
                        name="note"
                        v-model="form.note"
                        :counter="350"
                        maxlength="350"
                        outlined
                        :error-messages="error.note"
                        required
                        class="rounded-form"
                        rows="3"
                    >
                        <template v-slot:label>
                            Note
                        </template>
                    </v-textarea>
                </v-col>
                <v-col cols="12" class="-mt24">
                </v-col>
            </v-row>
            <div class="box-header-table ml-0">
                Products
            </div>
            <div v-if="form.items.length > 0" class="m0">
                <v-expansion-panels>
                    <v-expansion-panel
                        v-for="(item,i) in form.items"
                        :key="i"
                    >
                        <v-expansion-panel-header>
                            <div class="productCardTitle"><span class="productCardIndex">{{i+1}}</span></div>{{item.product}}
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <div>
                                <v-row class="-mt34">
                                    <v-col cols="12" class="mt24">
                                        <table class="tableProductCard">
                                            <tr>
                                                <td><b>UOM</b></td>
                                                <td class="tdGRProductItemCreate">{{item.uom}}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Order Qty</b></td>
                                                <td class="tdGRProductItemCreate">{{item.order_qty ? item.order_qty : 0}},00</td>
                                            </tr>
                                            <tr>
                                                <td><b>Receive Qty</b></td>
                                                <td class="tdGRProductItemCreate">{{formatPrice(receiveQty(item.delivery_qty, item.reject_qty))}}</td>
                                            </tr>
                                        </table>
                                        <div class="mt-1 fs12 text-red v-messages__message">{{errPro(i)}}</div>
                                    </v-col>
                                    <v-col cols="6">
                                        <label><b>Delivery Qty</b><span class="text-red">*</span></label>
                                        <vue-numeric
                                            :name="`deliver_qty_${i}`"
                                            placeholder="0,00"
                                            :class="errDeliverQty(i) ? 'productReceiveNumeric' : 'productReceiveNumericErr'"
                                            separator="."
                                            :precision="2"
                                            v-model="item.delivery_qty"
                                            dense
                                        >
                                        </vue-numeric>
                                    </v-col>
                                    <v-col cols="6">
                                        <label><b>Reject Qty</b><span class="text-red">*</span></label>
                                        <vue-numeric
                                            :name="`reject_qty_${i}`"
                                            placeholder="0,00"
                                            :class="errRejectQty(i) ? 'productReceiveNumeric' : 'productReceiveNumericErr'"
                                            separator="."
                                            :precision="2"
                                            v-model="item.reject_qty"
                                            dense
                                        >
                                        </vue-numeric>
                                    </v-col>
                                    <v-col cols="12" class="-mt24">
                                        <label><b>Note</b></label>
                                        <v-text-field
                                            :name="`note_${i}`"
                                            outlined
                                            class="rounded-form-sm mb-20"
                                            v-model="item.note"
                                            dense
                                        />
                                    </v-col>
                                </v-row>
                            </div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </div>
            <div v-else class="emptyProduct">
                There is no product.
            </div>
        </v-container>
        <div class="box">
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
                            v-privilege="'gr_rdl'"
                        >
                            <span class="text-black80">Cancel</span>
                        </v-btn>
                        <v-btn
                            depressed
                            color="#50ABA3"
                            class="main-btn white--text"
                            @click="confirmButton()"
                            v-privilege="'gr_crt'"
                        >
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </div>
</template>
<script>
    export default {
        name: 'CreateGoodsReceipt',
        data () {
            return {
                form : {
                    area_id:"",
                    warehouse_id:"",
                    supplier_id: "",
                    inbound_type: "purchase_order",
                    inbound_id:"",
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
                area : {},
                warehouse : '',
                supplier : '',
                purchase_order : '',
                recognition_date : '',
                eta_date : '',
                eta_time : '',
                ata_date_model : '',
                ata_time_model : '',
                inbound_type: 'Purchase Order',
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
                            text:'Order Qty',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Delivery Qty *',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Reject Qty *',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Receive Qty',
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

        },
        methods:{
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
                    title : "Create Goods Receipt",
                    text : "Are you sure want to create this goods receipt?",
                    urlApi : "/warehouse/goods/receipt",
                    nextPage : "/warehouse/goods-receipt",
                    data : this.form,
                    post : true
                }
            },
            areaSelected(d) {
                this.form.area_id = ""
                this.disabledWr = true
                this.form.warehouse_id = ""
                this.warehouse = ""
                this.disabledPoW = true
                this.choosePo = true
                this.recognition_date = ""
                this.eta_date = ""
                this.eta_time = ""
                this.form.inbound_id = ""
                this.form.ata_date = ""
                this.form.ata_time = ""
                this.purchase_order = null
                this.form.items = []
                if (d) {
                    this.form.area_id = d.id
                    this.disabledWr = false
                }
            },
            warehouseSelected(d) {
                this.form.warehouse_id = ""
                this.warehouse = ""
                this.disabledPoW = true
                this.choosePo = true
                this.recognition_date = ""
                this.eta_date = ""
                this.eta_time = ""
                this.form.inbound_id = ""
                this.form.ata_date = ""
                this.form.ata_time = ""
                this.purchase_order = null
                this.form.items = []
                if (d) {
                    this.disabledPoW = false
                    this.warehouse = d
                    this.form.warehouse_id = d.id
                }
            },
            supplierSelected(d) {
                this.form.supplier_id = ""
                this.supplier = null
                this.disabledPoS = true
                this.choosePo = true
                this.recognition_date = ""
                this.eta_date = ""
                this.eta_time = ""
                this.form.inbound_id = ""
                this.form.ata_date = ""
                this.form.ata_time = ""
                this.purchase_order = null
                this.form.items = []
                if (d) {
                    this.supplier = d
                    this.disabledPoS = false
                    this.form.supplier_id = d.id
                }
            },
            purchaseOrderSelected(d) {
                this.choosePo = true
                this.recognition_date = ""
                this.eta_date = ""
                this.eta_time = ""
                this.form.inbound_id = ""
                this.form.ata_date = ""
                this.form.ata_time = ""
                this.form.items = []
                this.purchase_order = null
                if (d) {
                    this.purchase_order = d
                    this.choosePo = false
                    this.recognition_date = d.recognition_date
                    this.eta_date = d.eta_date
                    this.eta_time = d.eta_time
                    this.form.inbound_id = d.id
                    this.form.ata_date = this.$moment(d.eta_date).format('YYYY-MM-DD')
                    this.form.ata_time = d.eta_time
                    this.$http.get("/purchase/order/"+d.id)
                    .then(response => {
                        if(response.data.data.purchase_order_items) {
                            let array = response.data.data.purchase_order_items
                            array.forEach(e => {
                                this.form.items.push({
                                    inbound_item_id:e.id,
                                    product:e.product.code +" - "+ e.product.name,
                                    product_id:e.product.id,
                                    uom:e.product.uom.name,
                                    order_qty:e.order_qty,
                                    delivery_qty:0,
                                    reject_qty:0,
                                    note:""
                                })
                            });
                        }
                    });
                }
            },
        },
        watch: {
            'form.ata_time': {
                handler: function (val) {
                    if (val.length == 5) {
                        let h = val.slice(0,2)
                        let m = val.slice(-2)
                        if (parseInt(h) > 23 & parseInt(m) > 59) {
                            this.form.ata_time = '00:00'
                        } else if (parseInt(h) > 23) {
                            this.form.ata_time = '00:'+m
                        } else if (parseInt(m) > 59) {
                            this.form.ata_time = h+':00'
                        }
                    }
                },
                deep: true
            },
        }
    }
</script>
<style scoped>

    .productCardTitle {
        text-align: left;
    }

    .productCardIndex {
        background-color: #50ABA3;
        color: white;
        border-radius: 50%;
        padding: 6px 12px;
    }

    .productReceiveNumeric {
        border: 2px solid #B7B7B7;
        height: 40px;
        text-align:center;
        width: 100%;
        border-radius: 8px;
    }

    .productReceiveNumericErr {
        border: 2px solid red;
        height: 40px;
        text-align:center;
        width: 100%;
        border-radius: 8px;
    }

    .tableProductCard {
        width: 100%;
        margin: auto;
    }

    .emptyProduct {
        text-align: center;
        color: gray;
        margin-top: 24px;
    }

    .tdGRProductItemCreate {
        text-align: right;
    }
</style>
