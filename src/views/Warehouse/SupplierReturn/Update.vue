<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <SelectWarehouse
                        disabled
                        name="warehouse"
                        :warehouse="warehouse"
                        :aux_data="2"
                        :error="error.warehouse_id"
                        :dense="true"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectSupplier
                        name="supplier"
                        :dense="true"
                        @selected="supplierSelected"
                        :error="error.supplier_id"
                        :supplier="supplier"
                        disabled
                    ></SelectSupplier>
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
                                    name="recognition_date"
                                    prepend-inner-icon="mdi-calendar"
                                    outlined
                                    v-model="form.recognition_date"
                                    :error-messages="error.recognition_date"
                                    clearable
                                    disabled
                                    @click:clear="form.recognition_date = ''"
                                    dense
                                >
                                    <template v-slot:label>Recognition Date<span style="color:red">*</span></template>
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
                                    name="ata_date"
                                    prepend-inner-icon="mdi-calendar"
                                    outlined
                                    v-model="ata_date"
                                    :error-messages="error.ata_date"
                                    clearable
                                    disabled
                                    @click:clear="ata_date = ''"
                                    dense
                                >
                                    <template v-slot:label>GR Ata Date<span style="color:red">*</span></template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            v-model="ata_date"
                            @input="ata_date_model = false"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectGoodsReceipt
                        name="good_receipt"
                        :dense="true"
                        :goods_receipt="good_receipt"
                        @click.native="warningOption"
                        @selected="goodsReceiptSelected"
                        :error="error.good_receipt"
                        disabled
                    ></SelectGoodsReceipt>
                    <i style="color: red">
                        *Change GR Code, Supplier &amp; ATA Date will remove products list
                    </i>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-textarea
                        name="note"
                        v-model="form.note"
                        :counter="250"
                        outlined
                        rows="3"
                        required
                    >
                        <template v-slot:label>
                            Note
                        </template>
                    </v-textarea>
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table">Products</div>
        <div class="box-body-table">
            <v-data-table
                :headers="table.fields"
                :items="form.supplier_return_item"
                :hide-default-footer="true"
                :items-per-page="-1"
                mobile-breakpoint="0"
            >
                <template v-slot:item="props">
                    <tr>
                        <td>{{ props.index + 1 }}</td>
                        <td>
                            <SelectProductGRTable
                                :name="`product_${props.index}`"
                                @click.native="setProductIdx(props.index)"
                                @selected="productSelected"
                                :warehouse="form.warehouse_id"
                                :gr_id="form.good_receipt_id"
                                :product="props.item.product"
                                :error="errPro(props.index)"
                                :refs="`${props.index+1}-${refs},${form.supplier_return_item.length}`"
                                :update="update"
                                :class="errPro(props.index) ? 'formProductErr' : ''"
                            ></SelectProductGRTable>
                        </td>
                        <td>{{ props.item.uom }}</td>
                        <td>{{ props.item.received_qty }}</td>
                        <td>
                            <vue-numeric
                                :name="`qty_${props.index}`"
                                :class="errQty(props.index) ? 'productNumericErr' : 'productNumeric'"
                                separator="."
                                placeholder="0,00"
                                @focus="productIdx = props.index"
                                :precision="2"
                                v-model="props.item.return_good_qty"
                            ></vue-numeric>
                            <div class="mt-1 ml-3 fs12" style="color:red;">{{errQty2(props.index)}}</div>
                        </td>
                        <td>
                            <v-text-field
                                :name="`note_${props.index}`"
                                outlined
                                class="mt-2 rounded-form-sm"
                                style="margin-bottom:-20px"
                                v-model="props.item.note"
                                dense
                            />
                        </td>
                        <td>
                            <div class="d-flex justify-end">
                                <div v-if="props.index == form.supplier_return_item.length-1">
                                    <v-btn
                                        icon
                                        name="addproduct"
                                        @click="addProduct()"
                                    >
                                        <img src="/icon/plus.png" height="22px" width="22px"/>
                                    </v-btn>
                                </div>
                                <div v-if="props.index > 0">
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
                            v-privilege="'supr_rdl'"
                        >
                            <span class="text-black80">Cancel</span>
                        </v-btn>
                        <v-btn
                            depressed
                            color="#50ABA3"
                            class="main-btn white--text"
                            @click="confirmButton()"
                            v-privilege="'supr_upd'"
                        >
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </div>
        <v-dialog
            v-model="warning_modal"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">Change Goods Receipt</span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">Change Goods Receipt  will reset Product List.</span>
                </v-card-text>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="noWarning()"
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                    >
                        <span class="text-black80">No</span>
                    </v-btn>
                    <v-btn
                        @click="yesWarning()"
                        depressed
                        color="#50ABA3"
                        class="main-btn white--text"
                    >Yes
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </v-container>
</template>

<script>
    import Vue from 'vue'
    export default {
        name: 'SupplierReturnCreate',
        data () {
            return {
                form : {
                    warehouse_id: '',
                    supplier_id: '',
                    recognition_date: '',
                    good_receipt_id: '',
                    note: '',
                    supplier_return_item : [],
                },
                ata_date: '',
                ata_date_input : '',
                filteredProductGR: [],
                warning : {},
                error : {},
                success : {},
                ConfirmData : {},
                supplier: '',
                good_receipt: '',
                disabledBtnAddApply : true,
                recognition_date_model: '',
                grDs: true,
                ata_date_model: '',
                isMobile : false,
                itemlength : 0,
                warehouse: '',
                warning_modal: false,
                warning_option: localStorage.getItem('warning_option'),
                warn: 'no',
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
                            text:'Received Qty',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Return Qty',
                            class: 'grey--text text--darken-4',
                            width: "12%",
                            sortable: false
                        },
                        {
                            text:'Note',
                            class: 'grey--text text--darken-4',
                            width: "12%",
                            sortable: false
                        },
                        {
                            width: "5%",
                            sortable: false
                        },
                    ],
                },
                productIdx : '',
                refs : '',
                search:'',
                update:false,
            }
        },
        mounted () {
            this.renderData()
            let self = this
            self.getWarehouse()
            self.getWarning()
            self.noWarning()
            self.$root.$on('event_error', function(err){
                self.error = err
            });
            window.onresize = () => {
                if (window.screen.width < 769) {
                    self.isMobile = true
                } else {
                    self.isMobile = false
                }
            }
        },
        computed: {
            //to get staff id
            staff() {
                return this.$store.getters.getStaff
            },
        },
        methods:{
            renderData(){
                this.update = true;
                this.$http.get("/warehouse/supplier_return/"+this.$route.params.id).then(response => {
                    let data = response.data.data
                    this.supplierSelected(data.supplier)
                    this.goodsReceiptSelected(data.good_receipt)
                    this.ata_date = this.$moment(data.good_receipt.ata_date).format('YYYY-MM-DD')
                    this.form.recognition_date = this.$moment(data.recognition_date).format('YYYY-MM-DD')
                    this.form.note = data.note
                    Vue.nextTick(() => {
                        this.form.good_receipt_id = data.good_receipt.id
                    });
                    this.form.supplier_return_item = []
                    for (let i = 0; i < data.supplier_return_items.length; i++) {
                        this.form.supplier_return_item.push({
                            product:data.supplier_return_items[i].product,
                            product_id:data.supplier_return_items[i].product.id,
                            uom:data.supplier_return_items[i].product.uom.name,
                            received_qty:data.supplier_return_items[i].received_qty,
                            return_good_qty:data.supplier_return_items[i].return_good_qty,
                            note:data.supplier_return_items[i].note
                        })
                    }
                });
            },
            getWarning(){
                localStorage.getItem('warning_option')
            },
            warningOption(){
                if(localStorage.getItem('warning_option').includes("yes")){
                    this.warning_modal = false
                }else{
                    this.warning_modal = true
                }
            },
            yesWarning(){
                this.warning_modal = false
                this.form.supplier_return_item = []
                localStorage.setItem('warning_option','yes')
            },
            noWarning(){
                this.warning_modal = false
                localStorage.setItem('warning_option','no')
            },
            errPro(idx) {
                for (var key in this.error) {
                    if (key == 'product_id' + idx) {
                        return this.error[key]
                    }
                }
            },
            errQty(idx) {
                for (var key in this.error) {
                    if (key == 'return_good_qty' + idx) {
                        return this.error[key]
                    }
                }
            },
            errQty2(idx) {
                for (var key in this.error) {
                    if (key == 'return_good_qty' + idx) {
                        return this.error[key]
                    }
                }
            },
            //get warehouse id based on user log
            getWarehouse(){
                this.loaded = false
                this.$http.get("/user/staff/"+this.staff.id)
                .then(response => {
                    let dataWr = response.data.data
                    this.warehouse = dataWr.warehouse
                    this.form.warehouse_id = dataWr.warehouse.id
                });
            },
            //remove product from table row
            removeProduct(idx) {
                this.form.supplier_return_item.splice(idx, 1)
                if (key.includes(idx) && key.includes('product_id')) {
                    delete this.error[key];
                }
                if (key.includes(idx) && key.includes('return_good_qty')) {
                    delete this.error[key];
                }
            },
            //set index from product selection
            setProductIdx(idx) {
                this.productIdx = idx
            },
            //select product table to get row data
            productSelected(d) {
                this.form.supplier_return_item[this.productIdx].product = ''
                this.form.supplier_return_item[this.productIdx].product_id = ''
                if(d) {
                    this.form.supplier_return_item[this.productIdx].product = d
                    this.form.supplier_return_item[this.productIdx].product_id = d.id
                    this.form.supplier_return_item[this.productIdx].uom = d.uom.name
                    this.$http
                        .get("/warehouse/goods/receipt/item", {
                            params: {
                                conditions: 'product.id.e:' + d.id + '|goodsreceipt.id.e:' +this.form.good_receipt_id,
                                embeds: 'goodsreceipt,purchaseorderitem,product'
                            }
                        })
                        .then((response) => {
                            this.form.supplier_return_item[this.productIdx].received_qty = response.data.data[0].receive_qty
                        });
                }
            },
            //add product to table
            addProduct() {
                this.update = false;
                this.form.supplier_return_item.push(
                    {
                        product : "",
                        product_id : "",
                        uom : "",
                        received_qty:'',
                        return_good_qty : 0,
                        note:'',
                    }
                )
                this.refs = false
                Vue.nextTick(() => {
                    this.refs = true
                    this.setProductIdx(this.form.supplier_return_item.length-1)
                });
            },
            //select supplier id to form
            supplierSelected(d){
                this.grDs = true
                this.form.supplier_id = '1'
                this.supplier = ''
                this.form.supplier_return_item = []
                if(d){
                    this.supplier = d
                    this.form.supplier_id = d.id
                    this.grDs = false
                }
            },
            //select goods receipt based on code and get detail products
            goodsReceiptSelected(d){
                this.form.good_receipt_id = ''
                this.good_receipt = ''
                this.form.supplier_return_item = []
                if(d){
                    this.good_receipt = d
                    this.form.good_receipt_id = d.id
                }
            },
            //post form to api
            confirmButton() {
                this.ConfirmData = {
                    model : true,
                    title : "Update Supplier Return",
                    text : "Are you sure want to Update this Supplier Return?",
                    urlApi : "/warehouse/supplier_return/"+this.$route.params.id,
                    nextPage : "/warehouse/supplier-return/detail/"+this.$route.params.id,
                    data : this.form,
                }
            },
        },
         watch: {
            // untuk search list product good receipt
            search: {
                handler: function (val) {
                    if (val) {
                        const newFiltered = this.form.supplier_return_item
                            .map((i) => {
                                return {
                                    ...i,
                                    label: i.product.code + " " + i.product.name,
                                };
                            })
                            .filter((item) =>
                                item.label.toLowerCase().includes(val.toLowerCase())
                            );

                        this.filteredProductGR = newFiltered;
                    }
                },
                deep: true,
            },
        },
    }
</script>