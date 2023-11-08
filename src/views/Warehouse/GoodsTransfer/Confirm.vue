<template>
    <div class="m0">
        <v-container fill-height class="main-container hidden-sm-and-down">
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
                        <v-text-field
                            name="departure_date"
                            prepend-inner-icon="mdi-calendar"
                            outlined
                            clearable
                            disabled
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
                            :error="error.warehouse_origin_id"
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
                    <v-col cols="12" md="3" class="-mt24">
                        <v-text-field
                            name="eta_date"
                            prepend-inner-icon="mdi-calendar"
                            outlined
                            clearable
                            disabled
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
                    </v-col>
                    <v-col cols="12" md="3" class="-mt24">
                        <SelectTimeInterval
                            name="eta_time"
                            disabled
                            :time="timeInterval"
                            :label="'Estimated Arrival Time'"
                            @selected="timeIntervalSelected"
                            :error="error.eta_time"
                            :dense="true"
                        >
                        </SelectTimeInterval>
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
                            outlined
                            disabled
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
                            <td>{{ props.item.request_qty }}</td>
                            <td>{{ props.item.transfer_qty }}</td>
                            <td>{{ props.item.weight }}</td>
                            <td>
                                <vue-numeric
                                    :name="`receive_qty_${props.index}`"
                                    placeholder="0"
                                    :class="errUnitCost(props.index) ? 'productNumeric' : 'productNumericErr'"
                                    separator="."
                                    :precision="2"
                                    v-model="props.item.receive_qty"
                                ></vue-numeric>
                            </td>
                            <td>
                                <v-text-field
                                    name="receive_note"
                                    outlined
                                    class="mt-6 rounded-form-sm mb-20"
                                    v-model="props.item.receive_note"
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
                    <v-text-field
                        name="code"
                        outlined
                        disabled
                        clearable
                        v-model="form.code"
                        class="rounded-form"
                    >
                        <template v-slot:label>
                            Goods Transfer Code<span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <v-text-field
                        name="departure_date"
                        prepend-inner-icon="mdi-calendar"
                        outlined
                        clearable
                        disabled
                        maxlength="10"
                        onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 45"
                        @click:clear="form.recognition_date = ''"
                        :error-messages="error.recognition_date"
                        v-model="form.recognition_date"
                        class="rounded-form"
                    >
                        <template v-slot:label>
                            Departure Date<span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <SelectArea
                        name="area_origin"
                        @selected="areaOriginSelected"
                        :aux_data="2"
                        :area="areaOrigin"
                        disabled
                        :label="'Area Origin'"
                        :error="error.area_origin_id"
                        class="rounded-form"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <SelectWarehouse
                        name="warehouse_origin"
                        :aux_data="2"
                        :label="'Warehouse Origin'"
                        :area_id="form.area_origin_id"
                        :warehouse="warehouseOrigin"
                        :disabled="true"
                        @selected="warehouseOriginSelected"
                        :error="error.warehouse_origin_id"
                        class="rounded-form"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <SelectArea
                        name="area_destination"
                        @selected="areaDestinationSelected"
                        :aux_data="2"
                        disabled
                        :area="areaDestination"
                        :label="'Area Destination'"
                        :error="error.area_destination_id"
                        class="rounded-form"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <SelectWarehouse
                        name="warehouse_destination"
                        :aux_data="2"
                        :label="'Warehouse Destination'"
                        :area_id="form.area_destination_id"
                        :warehouse="warehouseDestination"
                        :disabled="true"
                        @selected="warehouseDestinationSelected"
                        :error="error.warehouse_destination_id"
                        class="rounded-form"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12"  class="-mt24">
                    <v-text-field
                        name="eta_date"
                        prepend-inner-icon="mdi-calendar"
                        outlined
                        clearable
                        disabled
                        maxlength="10"
                        onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 45"
                        @click:clear="form.eta_date = ''"
                        :error-messages="error.eta_date"
                        v-model="form.eta_date"
                        class="rounded-form"
                    >
                        <template v-slot:label>
                            Estimated Arrival Date<span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <SelectTimeInterval
                        name="eta_time"
                        disabled
                        :time="timeInterval"
                        :label="'Estimated Arrival Time'"
                        @selected="timeIntervalSelected"
                        :error="error.eta_time"
                        class="rounded-form"
                    >
                    </SelectTimeInterval>
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
                        outlined
                        disabled
                        :error-messages="error.note"
                        required
                        class="rounded-form"
                        :counter="350"
                        rows="3"
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
            <div v-if="form.items.length > 0" class="m0">
                <v-expansion-panels>
                    <v-expansion-panel
                        v-for="(item,i) in form.items"
                        :key="i"
                    >
                        <v-expansion-panel-header>
                            <div class="productCardTitle"><span class="productCardIndex">{{productCardNumbering(i+1)}}</span></div>{{item.product}}
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <div class="productCard">
                                <v-col cols="12" class="mt24 productCardContainer">
                                    <v-text-field
                                        name="receive_uom"
                                        outlined
                                        disabled
                                        clearable
                                        v-model="item.uom"
                                        class="rounded-form uomStyle"
                                        dense
                                    >
                                        <template v-slot:label>
                                            UOM
                                        </template>
                                    </v-text-field>
                                    <div class="rightContainer">
                                        <table class="tableProductCard">
                                            <tr>
                                                <td>Transfer Qty. :</td>
                                                <td>{{item.transfer_qty ? item.transfer_qty : 0}}</td>
                                            </tr>
                                            <tr>
                                                <td>Weight :</td>
                                                <td>{{item.weight ? item.weight : 0}}</td>
                                            </tr>
                                            <tr>
                                                <td>Request Qty. :</td>
                                                <td>{{item.request_qty ? item.request_qty : 0}}</td>
                                            </tr>
                                        </table>
                                    </div>
                                </v-col>
                                <v-col cols="12" class="-mt46">
                                    <label>Receive Qty<span class="text-red">*</span></label>
                                    <vue-numeric
                                        :name="`receive_qty_${item.index}`"
                                        placeholder="0"
                                        :class="errUnitCost(item.index) ? 'productReceiveNumeric' : 'productReceiveNumericErr'"
                                        separator="."
                                        :precision="2"
                                        v-model="item.receive_qty"
                                        dense
                                    >
                                    </vue-numeric>
                                </v-col>
                                <v-col cols="12" class="-mt24">
                                    <label>Receive Note</label>
                                    <v-text-field
                                        name="receive_note"
                                        outlined
                                        class="rounded-form-sm mb-20"
                                        v-model="item.receive_note"
                                        dense
                                    />
                                </v-col>
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
    import Vue from 'vue'
    export default {
        name: 'CreateGoodsTransfer',
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
                    ata_date:new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                    ata_time:"",
                    note:"",
                    additional_cost:0,
                    additional_cost_note:"",
                    items : [],
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
                ata_date_model : '',
                ata_time_model : '',
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
                            text:'Transfer Qty',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Deliver Weight (Kg)',
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
                        }
                    ],
                }

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
                        recognition_date:this.$moment(data.recognition_date).format('YYYY-MM-DD'),
                        area_origin_id:"",
                        area_destination_id:"",
                        warehouse_origin_id:"",
                        warehouse_destination_id:"",
                        eta_date:this.$moment(data.eta_date).format('YYYY-MM-DD'),
                        eta_time:data.eta_time,
                        ata_date:new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                        ata_time:this.$moment(new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString()).format('HH:mm'),
                        note:data.note,
                        additional_cost:data.additional_cost,
                        additional_cost_note:data.additional_cost_note,
                        items : [],
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
                            receive_qty:e.receive_qty,
                            receive_note:e.receive_note,
                            request_qty: e.request_qty,
                        })
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
            errTransferQty(idx) {
                for (var key in this.error) {
                    if (key.includes(idx) && key.includes('transfer_qty')) {
                        return false
                    }
                }
                return true
            },
            errUnitCost(idx) {
                for (var key in this.error) {
                    if (key.includes(idx) && key.includes('unit_cost')) {
                        return false
                    }
                }
                return true
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
                    title : "Create Goods Transfer",
                    text : "Are you sure want to create this goods transfer?",
                    urlApi : "/warehouse/goods/transfer/confirm/"+this.$route.params.id,
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
            productCardNumbering(d) { //product card indexing
                if (d <= 9) {
                    return '0'+d
                }
                return d
            }
        },
    }
</script>
<style scoped>
    .productCard {
        border: 1px solid rgb(180, 180, 180);
        border-radius: 12px;
        margin-bottom: 12px;
    }

    .productCardTitle {
        text-align: left;
        padding: 12px;
    }

    .productCardIndex {
        background-color: red;
        color: white;
        border-radius: 50%;
        padding: 6px;
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

    .productCardContainer {
        display: flex;
    }

    .uomStyle {
        width: 50%;
    }

    .rightContainer {
        width: 50%;
        font-size: 12px;
        text-align: justify;
    }

    .tableProductCard {
        width: 100%;
        margin: 0px 10px 0px 10px;
    }

    .emptyProduct {
        text-align: center;
        color: gray;
        margin-top: 24px;
    }
</style>
