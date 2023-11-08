<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
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
                <v-col cols="12" md="6" class="-mt24">
                    <SelectGlossary
                        v-model="stock_type"
                        outlined
                        :dense="true"
                        :error="error.stock_type_id"
                        label="Stock Type"
                        @selected="typeSelected"
                        table="all"
                        attribute="stock_type"
                    ></SelectGlossary>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectAreaRestriction
                        name="area_origin"
                        @selected="areaOriginSelected"
                        :aux_data="2"
                        :restriction="area_access_list"
                        :area="areaOrigin"
                        :label="'Area Origin'"
                        :error="error.area_origin_id"
                        :dense="true"
                    ></SelectAreaRestriction>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectWarehouseRestriction
                        name="warehouse_origin"
                        :aux_data="2"
                        :label="'Warehouse Origin'"
                        :area_id="form.area_origin_id"
                        :restriction_area="area_access_list"
                        :restriction_warehouse="warehouse_access_list"
                        :disabled="warehouseOriginDis"
                        @selected="warehouseOriginSelected"
                        :error="error.warehouse_origin_id"
                        :dense="true"
                    ></SelectWarehouseRestriction>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectAreaRestriction
                        name="area_destination"
                        @selected="areaDestinationSelected"
                        :aux_data="2"
                        :restriction="area_access_list"
                        :label="'Area Destination'"
                        :error="error.area_destination_id"
                        :dense="true"
                    ></SelectAreaRestriction>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectWarehouseRestriction
                        name="warehouse_destination"
                        :aux_data="2"
                        :label="'Warehouse Destination'"
                        :area_id="form.area_destination_id"
                        :disabled="warehouseDestinationDis"
                        :restriction_area="area_access_list"
                        :restriction_warehouse="warehouse_access_list"
                        @selected="warehouseDestinationSelected"
                        :error="error.warehouse_destination_id"
                        :dense="true"
                    ></SelectWarehouseRestriction>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <v-textarea
                        name="note"
                        v-model="form.note"
                        :counter="350"
                        maxlength="350"
                        outlined
                        required
                        dense
                        rows="3"
                    >
                        <template v-slot:label>
                            Note
                        </template>
                    </v-textarea>
                    <span class="text-red">{{ error.warehouse }}</span>
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
                            <SelectProductTable
                                :name="`product_${props.index}`"
                                @click.native="setProductIdx(props.index)"
                                @selected="productSelected"
                                :disabled="disabledAddProduct"
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
                                :class="errRequestQty(props.index) ? 'productNumeric' : 'productNumericErr'"
                                separator="."
                                :precision="2"
                                v-model="props.item.request_qty"
                            ></vue-numeric>
                            <div class="mt-1 ml-3 fs12 text-red v-messages__message">{{errReqQty(props.index)}}</div>
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
                        <td>
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
            <v-row>
                <v-col>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            depressed
                            outlined
                            color="#EBEBEB"
                            class="main-btn"
                            @click="$router.go(-1)"
                            v-privilege="'gt_rdl'"
                        >
                            <span class="text-black80">Cancel</span>
                        </v-btn>
                        <v-btn
                            depressed
                            color="#50ABA3"
                            class="main-btn white--text"
                            @click="confirmButton()"
                            v-privilege="'gt_req'"
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
<style scoped>
.text-red{
    margin-top:-30px;
    color:red;
    font-size: 14px;
}
</style>
<script>
    import Vue from 'vue'
    export default {
        name: 'CreateGoodsTransfer',
        data() {
            return {
                form: {
                    request_date: new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10),
                    area_origin_id: "",
                    area_destination_id: "",
                    warehouse_origin_id: "",
                    warehouse_destination_id: "",
                    note: "",                    
                    additional_cost: 0,
                    additional_cost_note: "",
                    items: [],
                    stock_type: 0
                },
                error: {},
                success: {},
                ConfirmData: {},
                areaOrigin: '',
                areaDestination: '',
                areaDestinationText: '',
                warehouseOrigin: '',
                warehouseOriginDis: true,
                warehouseDestination: '',
                warehouseDestinationText: '',
                warehouseDestinationDis: true,
                request_date_model: '',
                warehouse_access_list: '',
                area_access_list: '',
                refs: "",
                productIdx: '',
                disabledAddProduct: true,
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
                            text: 'Request Qty *',
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
                stock_type: [],
                area_id: '',
                wh_id:'',
            }
        },
        mounted() {
            let self = this
            this.$root.$on('event_error', function (err) {
                self.error = err
            });
            self.fetchUserDestination()
        },
        methods: {
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
                        return this.error[key]
                    }
                }
            },
            errRequestQty(idx) {
                for (var key in this.error) {
                    if (key == 'request_qty' + idx) {
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
            resetProductItemAndErr() { // reset all error and product item for new list
                this.form.warehouse_origin_id = ""
                this.disabledAddProduct = true
                this.warehouseOrigin = ""
                this.form.items = []
                this.error = {}
            },
            removeProduct(idx) {
                this.form.items.splice(idx, 1)
                for (var key in this.error) {
                    if (key.includes(idx) && key.includes('request_qty')) {
                        delete this.error[key];
                    }
                    if (key.includes(idx) && key.includes('product_id')) {
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
                        request_qty: 0,
                        unit_cost: 0,
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
                this.ConfirmData = {
                    model: true,
                    title: "Request Goods Transfer",
                    text: "Are you sure want to request this goods transfer?",
                    urlApi: "/warehouse/goods/transfer",
                    nextPage: "/warehouse/goods-transfer",
                    data: this.form,
                    post: true
                }
            },
            areaOriginSelected(d) {
                this.form.area_origin_id = ""
                this.warehouseOrigin = ""
                this.areaOrigin = ""
                this.resetProductItemAndErr()
                if (d) {
                    this.areaOrigin = d
                    this.form.area_origin_id = d.id
                    this.warehouseOriginDis = false
                }
            },
            areaDestinationSelected(d) {
                this.form.area_destination_id = ""
                this.warehouseDestination = ""
                this.areaDestination = ""
                if (d) {
                    this.areaDestination = d
                    this.form.area_destination_id = d.id
                    this.warehouseDestinationDis = false
                }
            },
            warehouseDestinationSelected(d) {
                this.warehouseDestination = ""
                this.form.warehouse_destination_id = ""
                if (d) {
                    this.warehouseDestination = d
                    this.form.warehouse_destination_id = d.id
                }
            },
            warehouseOriginSelected(d) {
                this.resetProductItemAndErr()
                if (d) {
                    this.disabledAddProduct = false
                    this.warehouseOrigin = d
                    this.form.warehouse_origin_id = d.id
                    if (this.form.items.length == 0) {
                        this.form.items.push({
                            product_id: "",
                            product: "",
                            uom: "",
                            request_qty: 0,
                            unit_cost: 0,
                            note: ""
                        })
                    }
                }
            },
            async fetchUserDestination(){
                let ls = await JSON.parse(localStorage.getItem('vuex'))
                this.$http.get("/user/staff/"+ls.staff.id)
                .then(response => {
                    let dataWr = response.data.data
                    this.area_id = dataWr.area.id
                    this.wh_id = dataWr.warehouse.id
                    let dataAccess = dataWr.warehouse_access
                    if(dataWr.warehouse_access){
                        let idWr =  dataAccess.map(function(item){
                            return item.id
                        })
                        let idArea =  dataAccess.map(function(item){
                            return item.area.id
                        })
                        this.warehouse_access_list = idWr.toString()
                        this.area_access_list = idArea.toString()
                    }
                    this.areaDestinationSelected(dataWr.area)
                    this.warehouseDestinationSelected(dataWr.warehouse)
                });
            },
            typeSelected(d) { // for select stock type
                this.form.stock_type = ''
                if (d) {
                    this.form.stock_type = d.value
                }
            }
        },
        watch: {
            // 
        }
    }
</script>
