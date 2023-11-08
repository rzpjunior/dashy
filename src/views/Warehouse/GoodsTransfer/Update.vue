<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mb24">
                <v-col class="fs24 bold">
                    {{form.code}}
                </v-col>
                <v-col class="d-flex justify-end align-end">
                    <div v-if="!draft">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            class="no-caps mb4"
                            :color="statusMaster('active')"
                        >Active</v-btn>
                    </div>
                    <div v-if="draft">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            class="no-caps mb4"
                            :color="statusMaster('draft')"
                        >Draft</v-btn>
                    </div>
                </v-col>
            </v-row>
            <v-row>
                <v-col v-if="draft" cols="12" md="6" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="request_date_model"
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
                                    @click:clear="form.request_date = ''"
                                    :error-messages="error.request_date"
                                    v-model="form.request_date"
                                    dense
                                >
                                    <template v-slot:label>
                                        Request Date<span class="text-red">*</span>
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            v-model="form.request_date"
                            @input="request_date_model = false"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col v-if="!draft" cols="12" md="6" class="-mt24">
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
                        :error="error.warehouse_origin_id ? error.warehouse_origin_id : errWarehouseOrigin()"
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
                        :error="error.warehouse_destination_id ? error.warehouse_destination_id : errWarehouseDestination()"
                        :dense="true"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="3" :class="draft ? 'hidden' : '-mt24'">
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
                <v-col cols="12" md="3" :class="draft ? 'hidden' : '-mt24'">
                    <v-menu
                        ref="menu"
                        v-model="eta_time_model"
                        :close-on-content-click="false"
                        :return-value.sync="form.eta_time"
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
                                @click:clear="form.eta_time = ''"
                                v-model="form.eta_time"
                                :error-messages="error.eta_time"
                                dense
                                v-bind="attrs"
                                v-on="on"
                                @blur="$refs.menu.save(form.eta_time)"
                            >
                                <template v-slot:label>
                                    Estimated Arrival Time<span class="text-red">*</span>
                                </template>
                            </v-text-field>
                        </template>
                        <v-time-picker
                            format="24hr"
                            v-if="eta_time_model"
                            v-model="form.eta_time"
                            full-width
                            @click:minute="$refs.menu.save(form.eta_time)"
                        ></v-time-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <v-textarea
                        name="note"
                        v-model="form.note"
                        :counter="350"
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
                :headers="draft ? tableDraft.fields : table.fields"
                :mobile-breakpoint="0"
                :items="form.items"
                :hide-default-footer="true"
                :items-per-page="-1"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.index + 1 }}</td>
                        <td>
                            <SelectProductTable
                                :name="`product_${props.index}`"
                                @click.native="setProductIdx(props.index)"
                                @selected="productSelected"
                                :disabled="!draft ? true : disabledAddProduct"
                                :warehouse="form.warehouse_origin_id"
                                :product="props.item.product"
                                :error="errPro(props.index)"
                                :refs="`${props.index+1}-${refs},${form.items.length}`"
                                :update="update"
                            ></SelectProductTable>
                        </td>
                        <td>{{ props.item.uom }}</td>
                        <td>
                            <vue-numeric
                                :name="`request_qty_${props.index}`"
                                placeholder="0,00"
                                :class="errReqQty(props.index) ? 'productNumeric' : 'productNumericErr'"
                                separator="."
                                :precision="2"
                                v-model="props.item.request_qty"
                                :disabled="draft ? false : true"
                            ></vue-numeric>
                            <div class="mt-1 ml-3 fs12 text-red v-messages__message">{{errReqQtyMsg(props.index)}}</div>
                        </td>
                        <td v-if="!draft">
                            <vue-numeric
                                :name="`transfer_qty_${props.index}`"
                                placeholder="0,00"
                                :class="errTransferQty(props.index) ? 'productNumeric' : 'productNumericErr'"
                                separator="."
                                :precision="2"
                                v-model="props.item.transfer_qty"
                            ></vue-numeric>
                            <div class="mt-1 ml-3 fs12 text-red v-messages__message">{{errTransferQtyMsg(props.index)}}</div>
                        </td>
                        <td v-if="!draft">
                            <vue-numeric
                                :name="`unit_cost_${props.index}`"
                                placeholder="0"
                                :class="errUnitCost(props.index) ? 'productNumeric' : 'productNumericErr'"
                                separator="."
                                :precision="0"
                                v-model="props.item.unit_cost"
                            ></vue-numeric>
                        </td>
                        <td v-if="!draft">
                            {{ formatPrice(props.item.transfer_qty*props.item.unit_cost) }}
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
                        <td v-if="draft">
                            <div class="d-flex justify-end">
                                <div v-if="props.index == form.items.length-1">
                                    <v-btn
                                        icon
                                        name="addproduct"
                                        @click="addProduct()"
                                    >
                                        <img src="/icon/plus.png" height="22px" width="22px"/>
                                    </v-btn>
                                </div>
                                <div v-if="form.items.length != 1">
                                    <v-btn
                                        icon
                                        :name="`removeproduct_${props.index}`"
                                        @click="removeProduct(props.index)"
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
        <div class="box-end">
            <v-row v-if="!draft">
                <v-col>
                    <v-row>
                        <v-col cols="12" md="11" v-if="form.additional_cost != 0">
                            <v-textarea
                                    name="add_note"
                                    outlined
                                    v-model="form.additional_cost_note"
                                    :counter="100"
                                    maxlength="100"
                                    dense
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
                        <div class="col d-flex justify-end text-black">
                            {{formatPrice(totalPrice)}}
                        </div>
                    </div>
                    <div class="-mt20">
                        <div class="row">
                            <div class="col">
                                Additional Cost (Rp) :
                            </div>
                            <div class="col d-flex justify-end text-black">
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
            <v-row class="hr-title" v-if="!draft"/>
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
                            v-privilege="'gt_upd'"
                        >
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
        <v-dialog
            v-model="refreshData"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans">
                <v-card-title><span class="text-title-modal">Refresh Data</span></v-card-title>
                <v-card-text><span class="fs16 mt-1">There's an updated data on this document, are you want to refresh the page ?</span></v-card-text>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                        @click="disableRefreshDataModal"
                    ><span class="text-black80">No</span></v-btn>
                    <v-btn
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                        @click="renderData"
                    >Yes</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
    import Vue from 'vue'

    export default {
        name: 'UpdateGoodsTransfer',
        data() {
            return {
                form: {
                    code: "",
                    recognition_date: "",
                    request_date: "",
                    area_origin_id: "",
                    area_destination_id: "",
                    warehouse_origin_id: "",
                    warehouse_destination_id: "",
                    eta_date: "",
                    eta_time: "",
                    note: "",
                    additional_cost: 0,
                    additional_cost_note: "",
                    updated_at: "",
                    items: [],
                    stock_type: ''
                },
                eta_time_model: "",
                error: {},
                success: {},
                ConfirmData: {},
                areaOrigin: '',
                areaDestination: '',
                warehouseOrigin: '',
                warehouseOriginDis: true,
                warehouseDestination: '',
                warehouseDestinationDis: true,
                recognition_date_model: '',
                request_date_model: '',
                eta_date_model: '',
                refs: "",
                productIdx: '',
                disabledAddProduct: true,
                timeInterval: "",
                table: {
                    fields: [
                        {
                            text: 'No.',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text: 'Product',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'UOM',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Request Qty.',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Transfer Qty *',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Unit Cost *',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Subtotal',
                            class: 'grey--text text--darken-4',
                            sortable: false
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
                tableDraft: {
                    fields: [
                        {
                            text: 'No.',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text: 'Product',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'UOM',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Request Qty.',
                            class: 'grey--text text--darken-4',
                            sortable: false
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
                update: false,
                draft: true,
                refreshData: false,
                stockType: null

            }
        },
        async mounted() {
            let self = this
            this.$root.$on('event_error', function (err) {
                self.error = err
            });
            await  this.renderData()
            await this.$nextTick()
            await   self.setProduct()

        },
        computed: {
            totalPrice() {
                if (this.form.items.length > 0) {
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
                return this.totalPrice + this.form.additional_cost
            }
        },
        methods: {
            async setProduct() {
                let arr = await JSON.parse(JSON.stringify(this.form.items))
                this.form.items = arr
            },
            async renderData() {
                this.refreshData = false
                this.update = true;
                await this.$http.get("/warehouse/goods/transfer/" + this.$route.params.id).then(response => {
                    let data = response.data.data
                    this.draft = data.status === 5 ? true : false
                    this.form = {
                        code: data.code,
                        recognition_date: this.$moment(data.recognition_date).format('YYYY-MM-DD'),
                        request_date: this.$moment(data.request_date).format('YYYY-MM-DD'),
                        area_origin_id: "",
                        area_destination_id: "",
                        warehouse_origin_id: "",
                        warehouse_destination_id: "",
                        eta_date: this.$moment(data.eta_date).format('YYYY-MM-DD'),
                        eta_time: data.eta_time,
                        note: data.note,
                        additional_cost: data.additional_cost,
                        additional_cost_note: data.additional_cost_note,
                        updated_at: data.updated_at,
                        items: [],
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
                            goods_transfer_item_id: e.id,
                            product: e.product,
                            product_id: e.product.id,
                            uom: e.product.uom.name,
                            transfer_qty: e.delivery_qty,
                            unit_cost: e.unit_cost,
                            request_qty: e.request_qty,
                            note: e.note
                        })
                    });
                });
            },
            errPro(idx) {
                for (var key in this.error) {
                    if (key == 'product_id' + idx) {
                        return this.error[key]
                    }
                }
            },
            errReqQty(idx) {
                for (var key in this.error) {
                    if (key == 'request_qty' + idx) {
                        return false
                    }
                }
                return true
            },
            errTransferQty(idx) {
                for (var key in this.error) {
                    if (key == 'transfer_qty' + idx) {
                        return false
                    }
                }
                return true
            },
            errReqQtyMsg(idx) {
                for (var key in this.error) {
                    if (key == 'request_qty' + idx) {
                        return this.error[key]
                    }
                }
            },
            errTransferQtyMsg(idx) {
                for (var key in this.error) {
                    if (key == 'transfer_qty' + idx) {
                        return this.error[key]
                    }
                }
            },
            errUnitCost(idx) {
                for (var key in this.error) {
                    if (key == 'unit_cost' + idx) {
                        return false
                    }
                }
                return true
            },
            errWarehouseOrigin() { //give error message when user is missmatch with warehouse origin
                for (var key in this.error) {
                    if (this.error[key].includes('warehouse origin')) {
                        return this.error[key]
                    }
                }
            },
            errWarehouseDestination() { //give error message when user is missmatch with warehouse destination
                for (var key in this.error) {
                    if (this.error[key].includes('warehouse destination')) {
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
                    if (key.includes(idx) && key.includes('request_qty')) {
                        delete this.error[key];
                    }
                }
            },
            addProduct() {
                this.update = false;
                this.form.items.push(
                    {
                        product_id: "",
                        product: "",
                        uom: "",
                        transfer_qty: 0,
                        unit_cost: 0,
                        request_qty: 0,
                        note: ""
                    }
                )
                this.refs = false
                Vue.nextTick(() => {
                    this.refs = true
                    this.setProductIdx(this.form.items.length - 1)
                });
            },
            setProductIdx(idx) {
                this.productIdx = idx
            },
            productSelected(d) {
                this.form.items[this.productIdx].product = ''
                this.form.items[this.productIdx].product_id = ''
                if (d) {
                    this.form.items[this.productIdx].product = d
                    this.form.items[this.productIdx].product_id = d.id
                    this.form.items[this.productIdx].uom = d.uom.name
                }
            },
            confirmButton() {
                this.$http.get("/warehouse/goods/transfer/" + this.$route.params.id).then(response => {
                    let data = response.data.data
                    if (data.updated_at !== this.form.updated_at) {
                        this.refreshData = true
                    } else {
                        this.ConfirmData = {
                            model: true,
                            title: "Update Goods Transfer",
                            text: "Are you sure want to update this goods transfer?",
                            urlApi: "/warehouse/goods/transfer/" + this.$route.params.id,
                            nextPage: "/warehouse/goods-transfer/detail/" + this.$route.params.id,
                            data: this.form
                        }
                    }
                })
            },
            disableRefreshDataModal() { // close refresh data modal
                this.refreshData =  false
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
        },
        watch: {
            'form.eta_time': {
                handler: function (val) {
                    if (val.length == 5) {
                        let h = val.slice(0, 2)
                        let m = val.slice(-2)
                        if (parseInt(h) > 23 & parseInt(m) > 59) {
                            this.form.eta_time = '00:00'
                        } else if (parseInt(h) > 23) {
                            this.form.eta_time = '00:' + m
                        } else if (parseInt(m) > 59) {
                            this.form.eta_time = h + ':00'
                        }
                    }
                },
                deep: true
            },
        }
    }
</script>
