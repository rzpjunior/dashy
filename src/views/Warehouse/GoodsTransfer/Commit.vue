<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="code"
                        outlined
                        disabled
                        clearable
                        v-model="form.code"
                        dense
                    >
                        <template v-slot:label>
                            Goods Transfer Code<span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectGlossary
                        v-model="form.stock_type"
                        outlined
                        :dense="true"
                        :error="error.stock_type"
                        label="Stock Type"
                        @selected="typeSelected"
                        table="all"
                        attribute="stock_type"
                        :glossary="stockType"
                        disabled
                    ></SelectGlossary>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectArea
                        name="area_origin"
                        @selected="areaOriginSelected"
                        :aux_data="2"
                        :area="areaOrigin"
                        disabled
                        :label="'Area Origin'"
                        :error="error.area_origin_id"
                        :dense="true"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectWarehouse
                        name="warehouse_origin"
                        :aux_data="2"
                        :label="'Warehouse Origin'"
                        :area_id="form.area_origin_id"
                        :warehouse="warehouseOrigin"
                        :disabled="true"
                        @selected="warehouseOriginSelected"
                        :error="errWarehouseOriginMsg()"
                        :dense="true"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectArea
                        name="area_destination"
                        @selected="areaDestinationSelected"
                        :aux_data="2"
                        disabled
                        :area="areaDestination"
                        :label="'Area Destination'"
                        :error="error.area_destination_id"
                        :dense="true"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectWarehouse
                        name="warehouse_destination"
                        :aux_data="2"
                        :label="'Warehouse Destination'"
                        :area_id="form.area_destination_id"
                        :warehouse="warehouseDestination"
                        :disabled="true"
                        @selected="warehouseDestinationSelected"
                        :error="error.warehouse_destination_id"
                        :dense="true"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="recognition_date_model"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-text-field
                                    name="departure_date"
                                    prepend-inner-icon="mdi-calendar"
                                    outlined
                                    clearable
                                    maxlength="10"
                                    onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 45"
                                    @click:clear="form.recognition_date = ''"
                                    :error-messages="error.recognition_date"
                                    v-model="form.recognition_date"
                                    dense
                                >
                                    <template v-slot:label>
                                        Departure Date<span class="text-red">*</span>
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                                v-model="form.recognition_date"
                                @input="recognition_date_model = false"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
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
                                    clearable
                                    maxlength="10"
                                    onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 45"
                                    @click:clear="form.eta_date = ''"
                                    :error-messages="error.eta_date"
                                    v-model="form.eta_date"
                                    dense
                                >
                                    <template v-slot:label>
                                        Estimated Arrival Date<span class="text-red">*</span>
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            v-model="form.eta_date"
                            @input="eta_date_model = false"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectTimeInterval
                        name="eta_time"
                        :time="timeInterval"
                        :label="'Estimated Arrival Time'"
                        @selected="timeIntervalSelected"
                        :error="error.eta_time"
                        :dense="true"
                    >
                    </SelectTimeInterval>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <v-textarea
                        name="note"
                        v-model="form.note"
                        outlined
                        :error-messages="error.note"
                        required
                        dense
                        :counter="350"
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
                :items="form.items"
                :hide-default-footer="true"
                :items-per-page="-1"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.index + 1 }}</td>
                        <td>{{ props.item.product }}</td>
                        <td>{{ props.item.uom }}</td>
                        <td>{{ formatPrice(props.item.request_qty) }}</td>
                        <td>
                            <vue-numeric
                                :name="`transfer_qty_${props.index}`"
                                placeholder="0"
                                :class="errTransferQty(props.index) ? 'productNumeric' : 'productNumericErr'"
                                separator="."
                                :precision="2"
                                v-model="props.item.transfer_qty"
                            ></vue-numeric>
                            <div class="mt-1 ml-3 fs12 text-red v-messages__message">{{errTransferMsg(props.index)}}</div>
                        </td>
                        <td>
                            <vue-numeric
                                :name="`unit_cost_${props.index}`"
                                placeholder="0"
                                :class="errUnitCost(props.index) ? 'productNumeric' : 'productNumericErr'"
                                separator="."
                                :precision="2"
                                v-model="props.item.unit_cost"
                            ></vue-numeric>
                            <div class="mt-1 ml-3 fs12 text-red v-messages__message">{{errUnitCostMsg(props.index)}}</div>
                        </td>
                        <td>
                            {{ formatPrice(props.item.transfer_qty*props.item.unit_cost) }}
                        </td>
                        <td>
                            <v-text-field
                                name="receive_note"
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
        <div class="box">
            <v-row>
                <v-col>
                    <v-row>
                        <v-col cols="12" md="11" v-if="form.additional_cost != 0">
                            <v-textarea
                                name="add_note"
                                outlined
                                v-model="form.additional_cost_note"
                                :counter="100"
                                maxlength="100"
                                rows="3"
                                :error-messages="error.additional_cost_note"
                            >
                                <template v-slot:label>
                                    Additional Note
                                </template>
                            </v-textarea>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col class="text-black60">
                    <div class="row">
                        <div class="col">
                            Total (Rp) :
                        </div>
                        <div class="col d-flex justify-end">
                            {{formatPrice(totalPrice)}}
                        </div>
                    </div>
                    <div class="-mt20">
                        <div class="row">
                            <div class="col">
                                Additional Cost (Rp) :
                            </div>
                            <div class="col d-flex justify-end">
                                <vue-numeric
                                    name="additional_cost"
                                    placeholder="0.00"
                                    class="vueNumeric"
                                    separator="."
                                    :precision="2"
                                    v-model="form.additional_cost"
                                ></vue-numeric>
                            </div>
                        </div>
                    </div>
                    <v-divider class="my-4"/>
                    <div class="row fs20 text-black bold -mt10 mb2">
                        <div class="col">
                            Grand Total (Rp) :
                        </div>
                        <div class="col d-flex justify-end">
                            {{formatPrice(grandTotal)}}
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
                            @click="$router.go(-1)"
                            depressed
                            outlined
                            color="#EBEBEB"
                            class="main-btn"
                            v-privilege="'gt_rdl'"
                        >
                            <span class="text-black80">Cancel</span>
                        </v-btn>
                        <v-btn
                            depressed
                            color="#50ABA3"
                            class="main-btn white--text"
                            @click="confirmButton()"
                            v-privilege="'gt_cnf'"
                        >
                            Commit
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
        name: 'GoodsTransferCommit',
        data () {
            return {
                form : {
                    code:"",
                    recognition_date:"",
                    area_origin_id:"",
                    area_destination_id:"",
                    warehouse_origin_id:"",
                    warehouse_destination_id:"",
                    eta_date:"",
                    eta_time:"",
                    note:"",
                    additional_cost:0,
                    additional_cost_note:"",
                    items : [],
                    stock_type: ''
                },
                error : {},
                success : {},
                ConfirmData : {},
                areaOrigin : '',
                areaDestination : '',
                warehouseOrigin : '',
                warehouseOriginDis : true,
                warehouseDestination : '',
                warehouseDestinationDis : true,
                recognition_date_model : '',
                eta_date_model : '',
                refs : "",
                productIdx : '',
                disabledAddProduct : true,
                timeInterval : "",
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
                            text:'Request Qty',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Transfer Qty *',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Unit Cost *',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Subtotal',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Note',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        }
                    ],
                },
                stockType: null
            }
        },
        mounted () {
            let self = this
            this.$root.$on('event_error', function(err){
                self.error = err
            });
        },
        computed : {
            totalPrice() {
                if (this.form.items.length >0) {
                    let total = 0
                    this.form.items.forEach(e => {
                        total += e.transfer_qty * e.unit_cost
                    });
                    return total
                } else {
                    return 0
                }
            },
            grandTotal() {
                return this.totalPrice+this.form.additional_cost
            }
        },
        created() {
            this.renderData()
            let self = this
            setTimeout(function(){
                self.setProduct()
            }, 500);
        },
        methods:{
            setProduct() {
                let arr = JSON.parse(JSON.stringify(this.form.items))
                this.form.items = arr
            },
            renderData(){
                this.$http.get("/warehouse/goods/transfer/"+this.$route.params.id).then(response => {
                    let data = response.data.data
                    this.form = {
                        code : data.code,
                        recognition_date:new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10),
                        area_origin_id:"",
                        area_destination_id:"",
                        warehouse_origin_id:"",
                        warehouse_destination_id:"",
                        eta_date:"",
                        eta_time:data.eta_time,
                        note:data.note,
                        additional_cost:data.additional_cost,
                        additional_cost_note:data.additional_cost_note,
                        items : [],
                        stock_type: data.stock_type
                    }
                    if (data.stock_type) {
                        this.$http.get("/config/glossary?conditions=table:all|attribute:stock_type|value_int:" + data.stock_type)
                        .then(res => {
                            this.form.stock_type = res.data.data[0].value_int
                            this.stockType = res.data.data[0].id
                        })
                    }
                    this.timeIntervalSelected(data.eta_time)
                    this.areaOriginSelected(data.origin.area)
                    this.warehouseOriginSelected(data.origin)
                    this.areaDestinationSelected(data.destination.area)
                    this.warehouseDestinationSelected(data.destination)
                    data.goods_transfer_item.forEach(e => {
                        this.form.items.push({
                            goods_transfer_item_id:e.id,
                            product:e.product.code+" - "+e.product.name,
                            product_id:e.product.id,
                            uom:e.product.uom.name,
                            transfer_qty:e.delivery_qty,
                            weight:e.weight,
                            unit_cost: e.unit_cost,
                            receive_qty:e.receive_qty,
                            note:e.note,
                            request_qty: e.request_qty,
                        })
                    });
                });
            },
            errWarehouseOrigin() { // give error status for missmatch user and warehouse origin 
                for (var key in this.error) {
                    if (key == 'warehouse') {
                        return false
                    }
                }
                return true
            },
            errWarehouseOriginMsg() {// give error message for missmatch user and warehouse origin 
                for (var key in this.error) {
                    if (key == 'warehouse') {
                        return this.error[key]
                    }
                }
            },
            errTransferQty(idx) {// give error status for transfer qty
                for (var key in this.error) {
                    if (key == 'transfer_qty' + idx || key == 'request_qty' + idx) {
                        return false
                    }
                }
                return true
            },
            errTransferMsg(idx) {// give error message for transfer qty
                for (var key in this.error) {
                    if (key == 'transfer_qty' + idx || key == 'request_qty' + idx) {
                        return this.error[key]
                    }
                }
            },
            errUnitCost(idx) {// give error status for unit cost
                for (var key in this.error) {
                    if (key == 'unit_cost' + idx) {
                        return false
                    }
                }
                return true
            },
            errUnitCostMsg(idx) {// give error message for unit cost
                for (var key in this.error) {
                    if (key == 'unit_cost' + idx) {
                        return this.error[key]
                    }
                }
            },
            removeProduct(idx) {
                this.form.items.splice(idx, 1)
                for (var key in this.error) {
                    if (key.includes(idx) && key.includes('unit_cost')) {
                        delete this.error[key];
                    }
                    if (key.includes(idx) && key.includes('transfer_qty')) {
                        delete this.error[key];
                    }
                    if (key.includes(idx) && key.includes('product_id')) {
                        delete this.error[key];
                    }
                }
            },
            addProduct() {
                this.form.items.push(
                    {
                        product_id:"",
                        product:"",
                        uom:"",
                        transfer_qty:0,
                        unit_cost:0,
                        note:""
                    }
                )
                this.refs = false
                Vue.nextTick(() => {
                    this.refs = true
                    this.setProductIdx(this.form.items.length-1)
                });
            },
            setProductIdx(idx) {
                this.productIdx = idx
            },
            productSelected(d) {
                this.form.items[this.productIdx].product = ''
                this.form.items[this.productIdx].product_id = ''
                if(d) {
                    this.form.items[this.productIdx].product = d
                    this.form.items[this.productIdx].product_id = d.id
                    this.form.items[this.productIdx].uom = d.uom.name
                }
            },
            confirmButton() {
                this.ConfirmData = {
                    model : true,
                    title : "Commit Goods Transfer",
                    text : "Are you sure want to commit this goods transfer?",
                    urlApi : "/warehouse/goods/transfer/commit/"+this.$route.params.id,
                    nextPage : "/warehouse/goods-transfer/detail/"+this.$route.params.id,
                    data : this.form,
                }
            },
            areaOriginSelected(d) {
                this.form.area_origin_id = ""
                this.warehouseOrigin = ""
                this.areaOrigin = ""
                this.form.warehouse_origin_id = ""
                this.disabledAddProduct = true
                this.warehouseOriginDis = true
                if (d) {
                    this.areaOrigin = d
                    this.form.area_origin_id = d.id
                    this.warehouseOriginDis = false
                }
            },
            warehouseOriginSelected(d) {
                this.form.warehouse_origin_id = ""
                this.warehouseOrigin = ""
                this.disabledAddProduct = true
                if (d) {
                    this.disabledAddProduct = false
                    this.warehouseOrigin = d
                    this.form.warehouse_origin_id = d.id
                }
            },
            areaDestinationSelected(d) {
                this.form.area_destination_id = ""
                this.warehouseDestination = ""
                this.areaDestination = ""
                this.form.warehouse_destination_id = ""
                this.warehouseDestinationDis = true
                if (d) {
                    this.areaDestination = d
                    this.form.area_destination_id = d.id
                    this.warehouseDestinationDis = false
                }
            },
            warehouseDestinationSelected(d) {
                this.form.warehouse_destination_id = ""
                this.warehouseDestination = ""
                if (d) {
                    this.warehouseDestination = d
                    this.form.warehouse_destination_id = d.id
                }
            },
            timeIntervalSelected(d) {
                this.form.eta_time = ""
                this.timeInterval = ""
                if (d) {
                    this.timeInterval = d
                    this.form.eta_time = d
                }
            },
            typeSelected(d) { // for select stock type
                this.form.stock_type = ""
                this.stockType = ""
                if (d) {
                    this.stockType = d
                    this.form.stock_type = d.value_int
                }
            },
        }
    }
</script>
