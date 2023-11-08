<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="stock_opname_date_model"
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
                                    v-model="form.recognition_date"
                                    :error-messages="error.recognition_date"
                                    clearable
                                    @click:clear="form.recognition_date = ''"
                                    dense
                                >
                                    <template v-slot:label>Stock Opname Date</template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            v-model="form.recognition_date"
                            @input="stock_opname_date_model = false"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectGlossary
                        v-model="stock_type"
                        outlined
                        :dense="true"
                        :error="error.stock_type"
                        label="Stock Type"
                        @selected="typeSelected"
                        table="all"
                        attribute="stock_type"
                    ></SelectGlossary>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectArea
                        name="area"
                        :aux_data="2"
                        @selected="areaSelected"
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
                    <v-select
                        v-model="parentgp"
                        :items="item_parentgp"
                        persistent-hint
                        outlined
                        :disabled="disabledCt"
                        :dense="true"
                        label="Type"
                    >
                        <template v-slot:label>
                            <span>Type<span class='text-red'>*</span></span>
                        </template>
                    </v-select> 
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectCategoryParentGP
                        v-if="parentgp == '0'"
                        :category="category"
                        name="gparent"
                        @selected="categorySelected"
                        :error="error.category_id"
                        :disabled="disabledCt"
                        :dense="true"
                        :embed="1"
                    ></SelectCategoryParentGP>
                    <SelectCategoryParentGP
                        v-if="parentgp == '1'"
                        :category="category"
                        name="parent"
                        @selected="categorySelected"
                        :error="error.category_id"
                        :disabled="disabledCt"
                        :dense="true"
                        :embed="2"
                    ></SelectCategoryParentGP>
                    <SelectCategoryParentGP
                        v-if="parentgp == '2'"
                        :category="category"
                        name="child"
                        @selected="categorySelected"
                        :error="error.category_id"
                        :disabled="disabledCt"
                        :dense="true"
                        :embed="3"
                    ></SelectCategoryParentGP>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <v-textarea
                        name="note"
                        v-model="form.note"
                        :counter="250"
                        outlined
                        :error-messages="error.note"
                        required
                        dense
                        maxlength="250"
                        rows="3"
                    >
                        <template v-slot:label>
                            Note
                        </template>
                    </v-textarea>
                </v-col>
            </v-row>
        </div>
        <div v-if="uploadProduct" class="box">
            <v-row>
                <v-col cols="12" md="12">
                    <v-row class="px-4">
                        <v-col style="border-right: 1px dashed lightgrey;" class="pa-8">
                            <div>
                                Step 1. Download Template
                            </div>
                            <div class="text-black60">
                                Download template based on filters
                            </div>
                            <div class="mt-9 bg-black10" style="border: 2px dashed #AAAAAA; min-height:220px; text-align: center;">
                                <img width="60" class="mt50 mb8" src="/icon/download_new.png" alt=""> <br>
                                <v-btn
                                    @click="downloadTemplate()"
                                    depressed
                                    color="#50ABA3"
                                    class="only-btn white--text rounded-form mt10"
                                >Download Template</v-btn>
                            </div>
                        </v-col>
                        <v-col style="border-right: 1px dashed lightgrey;" class="pa-8">
                            <div>
                                Step 2. Update Template
                            </div>
                            <div class="text-black60">
                                Update with spreadsheet application
                            </div>
                            <v-img width="250px" class="mt-4 ml-6" src="/img/worktime_new.png" alt="" />
                        </v-col>
                        <v-col class="pa-8">
                            <div>
                                Step 3. Upload File<span class="text-red">*</span>
                            </div>
                            <div class="text-black60">
                                Product stock will be updated based on selected warehouse and category
                            </div>
                            <div class="mt10">
                                <UploadExcel
                                    @onSelect="onSelect"
                                    @onDelete="onDelete"
                                    :error="error.stock_opname_items"
                                    :emptyForm="emptyForm"
                                ></UploadExcel>
                            </div>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
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
                            v-privilege="'st_rdl'"
                        >
                            <span class="text-black80">Cancel</span>
                        </v-btn>
                        <v-btn
                            depressed
                            color="#50ABA3"
                            class="main-btn white--text"
                            @click="confirmButton()"
                            v-privilege="'st_crt'"
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
import axios from 'axios'
    export default {
        name: 'StockOpnameCreate',
        data () {
            return {
                form : {
                    classification: '',
                    category_id : '',
                    area_id: '',
                    warehouse_id : '',
                    recognition_date : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                    note : '',
                    stock_opname_items : [],
                    stock_type: 0
                },
                emptyForm: '',
                stock_type: [],
                classification : '',
                disabledWr : true,
                disabledCt: true,
                area: null,
                category : null,
                warehouse : null,
                stock_opname_date : '',
                note : '',
                stock_opname_date_model : '',
                eta_time : '',
                error : {},
                success : {},
                ConfirmData : {},
                disabledBtn : false,
                uploadProduct: false,
                refs : '',
                fileUpload: null,
                parentgp: '',
                item_parentgp: [
                    {
                        text: 'C0',
                        value: '0'
                    },
                    {
                        text: 'C1',
                        value: '1'
                    },
                    {
                        text: 'C2',
                        value: '2'
                    }
                ],

            }
        },
        mounted () {
            let self = this
            this.$root.$on('event_error', function(err){
                self.error = err
            });
        },
        methods:{
            downloadTemplate() {
                if(this.parentgp == "0"){
                    this.classification = 1
                }
                if(this.parentgp == "1"){
                    this.classification = 2
                }
                if(this.parentgp == "2"){
                    this.classification = 3
                }
                if (this.form.warehouse_id && this.form.category_id && this.form.stock_type) {
                    this.$http.get("/warehouse/stock_opname/export/form?export=1&warehouse_id="+this.form.warehouse_id+"&category_id="+this.form.category_id+"&classification="+this.classification+"&stock_type="+this.form.stock_type)
                    .then(response => {
                        window.location.href = response.data.file
                    })
                } else {
                    this.error = {warehouse_id:'Please select warehouse', category_id:'Please select category'}
                }
            },
            onDelete(ev) {
                this.form.stock_opname_items = []
            },
            onSelect: function(file){
                this.form.stock_opname_items = []
                file.forEach((item) => {
                    if (this.form.stock_type == '1') {
                        this.form.stock_opname_items.push({
                            product_id:item.Product_ID,
                            final_stock:parseFloat(item.GoodStock),
                            opname_reason:item.Opname_Reason,
                            note:item.Note
                        })
                    } else if (this.form.stock_type == '2') {
                        this.form.stock_opname_items.push({
                            product_id:item.Product_ID,
                            final_stock:parseFloat(item.Actual_Waste_Stock),
                            opname_reason:item.Opname_Reason,
                            note:item.Note
                        })
                    }
                });
            },
            confirmButton() {
                if(this.parentgp == "0"){
                    this.form.classification = 1
                }
                if(this.parentgp == "1"){
                    this.form.classification = 2
                }
                if(this.parentgp == "2"){
                    this.form.classification = 3
                }
                this.ConfirmData = {
                    model : true,
                    title : "Create Stock Opname",
                    text : "Are you sure want to create this Stock Opname?",
                    urlApi : "/warehouse/stock_opname",
                    nextPage : "/warehouse/stock-opname",
                    data : this.form,
                    post :true
                }
            },
            areaSelected(d) {
                this.warehouse = null
                this.warehouse_id = ''
                this.form.area_id = ""
                this.area = null
                this.form.category_id = ""
                this.category = null
                this.disabledWr = true
                if (d) {
                    this.form.area_id = d.id
                    this.area = d
                    this.disabledWr = false
                }

            },
            warehouseSelected(d) {
                this.form.warehouse_id = ""
                this.warehouse = null
                this.form.category_id = ""
                this.category = null
                this.disabledCt = true
                if (d) {
                        this.warehouse = d
                        this.form.warehouse_id = d.id
                        this.disabledCt = false
                }
            },
            categorySelected(d){
                this.form.category_id = ""
                this.category = null
                if(d) {
                    this.category = d
                    this.form.category_id = d.id
                    this.uploadProduct = true
                }else{
                    this.uploadProduct = false
                }
            },
            typeSelected(d) {
                this.form.stock_opname_items = []
                this.form.stock_type = 0
                if (d) {
                    this.emptyForm = d
                    this.form.stock_type = d.value
                }
            }
        }
    }
</script>
