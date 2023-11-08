<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row>
                <v-col cols="12" md="4" class="h70">
                    <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                            <v-text-field
                                name="search"
                                v-model="search"
                                prepend-inner-icon="search"
                                placeholder="Search..."
                                v-on="{ ...tooltip }"
                                outlined
                                dense
                                filled
                                v-privilege="'filter_rdl'"
                            >
                            </v-text-field>
                        </template>
                        <span>Search by code and name</span>
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row class="hr-title"/>
            <v-row :class="showFilter?'mb24':''">
                <v-col>
                    Filter 
                    <v-btn 
                        depressed
                        x-small
                        @click="showFilter = !showFilter"
                        v-if="showFilter"
                        class="no-caps fs12"
                    >
                        Hide
                        <v-icon right>
                            mdi-chevron-up
                        </v-icon>
                    </v-btn>
                    <v-btn 
                        depressed
                        x-small
                        @click="showFilter = !showFilter"
                        v-else
                        class="no-caps fs12"
                    >
                        Show
                        <v-icon right>
                            mdi-chevron-down
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row :class="showFilter? '':'hidden'">
                <v-col cols="12" md="3" class="-mt24">
                    <SelectPriceSet
                        @selected="priceSetFilterSelected"
                        :dense="true"
                        :norequired="true"
                    ></SelectPriceSet>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectCategory
                        :norequired="true"
                        :dense="true"
                        @selected="categoryFilterSelected"
                    ></SelectCategory>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectProductTag
                        :norequired="true"
                        :dense="true"
                        @selected="productTagFilterSelected"
                    ></SelectProductTag>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-select
                        v-model="filter.SelectSalable"
                        outlined
                        label="Salability"
                        dense
                        :items="salableValueList"
                        clearable
                        @click:clear="filter.SelectSalable = '',renderData(search,filter.SelectSalable)"
                    ></v-select>
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row>
                <v-col cols="12" md="9" class="h1"/>
                <v-col cols="12" md="3" class="d-flex justify-end h70">
                    <v-btn
                        @click="exportProduct=true, error ={}, clear3=false"
                        depressed
                        color="#50ABA3"
                        class="no-caps bold white--text mx6"
                    >Export Product Price</v-btn>
                    <v-btn
                        @click="productPrice=true, error ={}, clear1=false"
                        depressed
                        color="#50ABA3"
                        class="no-caps bold white--text mx6"
                    >Update Product Price</v-btn>
                    <v-btn
                        @click="shadowPrice=true, error ={}, clear2=false"
                        depressed
                        color="#50ABA3"
                        class="no-caps bold white--text mx6"
                    >Update Shadow Price</v-btn>
                </v-col>
            </v-row>
        </div>
        <div class="box-body-table">
            <v-data-table
                :headers="table.fields"
                :items="items"
                :loading="loading"
                :items-per-page="10"
                :mobile-breakpoint="0"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.item.product.code }}</td>
                        <td>
                            {{ props.item.product.name }}<br>
                            <label class="grey--text">
                                {{ props.item.product.uom.name }}
                            </label>
                        </td>
                        <td>{{ props.item.product.category.name }}</td>
                        <td>{{ props.item.product.tag_product_str }}</td>
                        <td>{{ props.item.product.salability == 1 ? 'Yes' : 'No' }}</td>
                        <td>
                            Rp {{ formatPrice(props.item.unit_price) }}<br>
                            <label class="grey--text">
                                {{ props.item.price_set.name }}
                            </label>
                        </td>
                        <td>
                            Rp {{ formatPrice(props.item.shadow_price ) }}<br>
                            <label class="grey--text">
                                {{ props.item.shadow_price_pct }}%
                            </label>
                        </td>
                    </tr>
                </template>
                <v-alert slot="no-results" :value="true" color="error" icon="warning">
                    Your search for "{{ search }}" found no results.
                </v-alert>
            </v-data-table>
        </div>
        <v-dialog
            v-model="exportProduct"
            persistent
            max-width="350px"
        >
            <v-card class="OpenSans">
                <LoadingBar :value="overlay"/>
                <div class="d-flex justify-end pt-4 pr-4">
                    <v-btn
                        icon
                        @click="exportProduct = false, clear3 = true"
                    >
                        <v-img src="/icon/close-new.png" max-height="20px" max-width="20px"></v-img>
                    </v-btn>
                </div>
                <v-card-title class="-mt24">
                    <span class="text-title-modal">Export Product Price</span>
                </v-card-title>
                <v-card-text>
                   <span class="fs16 mt-1">Export product price based on filters below</span>
                </v-card-text>
                <v-card-text>
                    <SelectPriceSet
                        @selected="priceSetExportSelected"
                        :dense="true"
                        :clear="clear3"
                        :error="error.price_set_export"
                    ></SelectPriceSet>
                        <SelectCategory
                        :dense="true"
                        :norequired="true"
                        :clear="clear3"
                        @selected="categoryExportSelected"
                    ></SelectCategory>
                    <v-select
                        v-model="filter_export_product_price.SelectSalable"
                        outlined
                        label="Salability"
                        dense
                        :items="salableValue"
                    ></v-select>
                </v-card-text>
                <v-card-actions class="pb-8 px-5 -mt24">
                    <v-btn
                        block
                        @click="exportProductPrice()"
                        class="no-caps bold white--text"
                        depressed
                        color="#50ABA3"
                    >Export</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="productPrice" persistent max-width="900px">
            <v-card class="OpenSans">
                <LoadingBar :value="overlay"/>
                <v-card-title>
                    <div class="flex-row-between full-width">
                        <div class="text-title-modal">
                            Update Product Price
                        </div>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="productPrice = false, clear2=true, filter_update_shadow_price.PriceSet=null" class="mt4">
                            <v-img
                                src="/icon/close-new.png"
                                max-height="24px"
                                max-width="24px"
                            ></v-img>
                        </v-btn>
                    </div>
                </v-card-title>
                <div class="hr-title-modal"/>
                <v-alert
                    color="#2A89A7"
                    dark
                    outlined
                    class="mx24 mt10"
                >
                    <v-icon color="#2A89A7" class="-mt3">mdi-alert-circle-outline</v-icon> 
                    Please follow the step to update product price
                </v-alert>
                <v-card-text class="mt24">
                    <v-row>
                        <v-col cols="12" md="12">
                            <v-row>
                                <v-col
                                    class="border-r-1 border-dashed border-r-lightgrey flex-justify-between"
                                    cols="12"
                                    md="4"
                                >
                                    <div>
                                        <div>Step 1. Download Template</div>
                                        <div class="text-black60 mb20">
                                            Download template based on filters
                                        </div>
                                        <SelectPriceSet
                                            v-model="filter_update_product_price.PriceSet"
                                            :dense="true"
                                            :clear="clear1"
                                            :error="error.price_set"
                                            @selected="priceSetUpdateProductSelected"
                                        ></SelectPriceSet>
                                        <SelectCategory
                                            v-model="filter_update_product_price.Category"
                                            :dense="true"
                                            :norequired="true"
                                            :clear="clear1"
                                            @selected="categoryUpdateProductSelected"
                                        ></SelectCategory>
                                        <v-select
                                            v-model="filter_update_product_price.SelectSalable"
                                            outlined
                                            label="Salability"
                                            dense
                                            :items="salableValue"
                                        ></v-select>
                                    </div>
                                    <v-card-actions class="mt20">
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            depressed
                                            color="#50ABA3"
                                            class="no-caps bold white--text"
                                            :disabled="filter_update_product_price.PriceSet ? false : true"
                                            @click="downloadProductPrice()"
                                        >Download</v-btn>
                                    </v-card-actions>
                                </v-col>
                                <v-col
                                    class="border-r-1 border-dashed border-r-lightgrey"
                                    cols="12"
                                    md="4"
                                >
                                    <div>Step 2. Update Template</div>
                                    <div class="text-black60">
                                        Update with spreadsheet application
                                    </div>
                                    <v-img
                                        width="250px"
                                        class="mt-4 ml-6"
                                        src="/img/worktime_new.png"
                                        alt=""
                                    />
                                </v-col>
                                <v-col
                                    cols="12"
                                    md="4"
                                >
                                    <div>
                                        Step 3. Upload File
                                        <span class="text-red">*</span>
                                    </div>
                                    <div class="text-black60">
                                        Data will be updated based on file
                                    </div>
                                    <div class="mt10">
                                        <UploadExcel
                                            @onSelect="onSelectProductPrice"
                                            @onDelete="onDeleteProductPrice"
                                            :clear="clear1"
                                            :error="error.id"
                                        ></UploadExcel>
                                    </div>
                                    <v-card-actions class="mt5">
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            @click="uploadProductPrice()"
                                            :disabled="uploadDis1"
                                            class="no-caps bold white--text"
                                            depressed
                                            color="#50ABA3"
                                        >Upload</v-btn>
                                    </v-card-actions>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog v-model="shadowPrice" persistent max-width="900px">
            <v-card class="OpenSans">
                <LoadingBar :value="overlay"/>
                <v-card-title>
                    <div class="flex-row-between full-width">
                        <div class="text-title-modal">
                            Update Shadow Price
                        </div>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="shadowPrice = false, clear2=true, filter_update_shadow_price.PriceSet=null" class="mt4">
                            <v-img
                                src="/icon/close-new.png"
                                max-height="24px"
                                max-width="24px"
                            ></v-img>
                        </v-btn>
                    </div>
                </v-card-title>
                <div class="hr-title-modal"/>
                <v-alert
                    color="#2A89A7"
                    dark
                    outlined
                    class="mx24 mt10"
                >
                    <v-icon color="#2A89A7" class="-mt3">mdi-alert-circle-outline</v-icon> 
                    Please follow the step to update shadow price
                </v-alert>
                <v-card-text class="mt24">
                    <v-row>
                        <v-col cols="12" md="12">
                            <v-row>
                                <v-col
                                    class="border-r-1 border-dashed border-r-lightgrey flex-justify-between"
                                    cols="12"
                                    md="4"
                                >
                                    <div>
                                        <div>Step 1. Download Template</div>
                                        <div class="text-black60 mb20">
                                            Download template based on filters
                                        </div>
                                        <SelectPriceSet
                                            v-model="filter_update_shadow_price.PriceSet"
                                            @selected="priceSetUpdateShadowSelected"
                                            :dense="true"
                                            :clear="clear2"
                                            :error="error.price_set"
                                        ></SelectPriceSet>
                                        <SelectProductTag
                                            :norequired="true"
                                            :dense="true"
                                            :clear="clear2"
                                            @selected="productTagUpdateShadowSelected"
                                        ></SelectProductTag>
                                        <v-select
                                            v-model="filter_update_shadow_price.SelectSalable"
                                            outlined
                                            label="Salability"
                                            dense
                                            :items="salableValue"
                                        ></v-select>
                                    </div>
                                    <v-card-actions class="mt20">
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            depressed
                                            color="#50ABA3"
                                            class="no-caps bold white--text"
                                            :disabled="filter_update_shadow_price.PriceSet ? false : true"
                                            @click="downloadShadowPrice()"
                                        >Download</v-btn>
                                    </v-card-actions>
                                </v-col>
                                <v-col
                                    class="border-r-1 border-dashed border-r-lightgrey"
                                    cols="12"
                                    md="4"
                                >
                                    <div>Step 2. Update Template</div>
                                    <div class="text-black60">
                                        Update with spreadsheet application
                                    </div>
                                    <v-img
                                        width="250px"
                                        class="mt-4 ml-6"
                                        src="/img/worktime_new.png"
                                        alt=""
                                    />
                                </v-col>
                                <v-col 
                                    cols="12"
                                    md="4"
                                >
                                    <div>
                                        Step 3. Upload File
                                        <span class="text-red">*</span>
                                    </div>
                                    <div class="text-black60">
                                        Data will be updated based on file
                                    </div>
                                    <div class="mt10">
                                        <UploadExcel
                                            @onSelect="onSelectShadowPrice"
                                            @onDelete="onDeleteShadowPrice"
                                            :clear="clear2"
                                            :error="error.id"
                                        ></UploadExcel>
                                    </div>
                                    <v-card-actions class="mt5">
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            @click="uploadShadowPrice()"
                                            :disabled="uploadDis2"
                                            class="no-caps bold white--text"
                                            depressed
                                            color="#50ABA3"
                                        >Upload</v-btn>
                                    </v-card-actions>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
        <LoadingBar :value="overlay"/>
    </v-container>
</template>

<script>
    export default {
        name: "ProductPrice",
        data() {
            return {
                showFilter : false,
                salableValue: [
                    {
                        text: 'All',
                        value: 1.2
                    },
                    {
                        text: 'Salable',
                        value: 1
                    },
                    {
                        text: 'Non Salable',
                        value: 2
                    }
                ],
                salableValueList: [
                    {
                        text: 'Salable',
                        value: 1
                    },
                    {
                        text: 'Non Salable',
                        value: 2
                    }
                ],
                filter: {
                    SelectPriceSet: '',
                    SelectCategory: '',
                    SelectProductTag: null,
                    SelectSalable: ''
                },
                filter_export_product_price: {
                    SelectPriceSet: '',
                    SelectCategory: '',
                    SelectSalable: 1,
                },
                filter_update_product_price: {
                    SelectPriceSet: '',
                    SelectCategory: '',
                    SelectSalable: 1,
                    PriceSet : null,
                },
                filter_update_shadow_price: {
                    SelectPriceSet: '',
                    SelectCategory: '',
                    SelectProductTag: null,
                    SelectSalable: 1,
                    PriceSet : null,
                },
                productPrice: false,
                exportProduct: false,
                shadowPrice: false,
                disable: false,
                overlay: false,
                absolute: true,
                uploadDis1 : true,
                uploadDis2 : true,
                clear1 : false,
                clear2 : false,
                clear3 : false,
                overlay: false,
                error: {},
                table: {
                    fields: [
                        {
                            text:'Product Code',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Product Name',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Category',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Product Tag',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Salability',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Unit Price',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Shadow Price',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                    ],
                },
                search : '',
                loading : false,
                items:[],
                prices: [],
                shadowPrices: []
            }
        },
        mounted(){
            this.renderData('',this.filter.SelectSalable)
        },

        methods: {
             renderData(search,salability){
                let priceSet = ''
                if(this.filter.SelectPriceSet){
                    priceSet = "|price_set_id.e:"+this.filter.SelectPriceSet
                }
                let category = ''
                if (this.filter.SelectCategory) {
                    category = "|product.category.id.e:"+this.filter.SelectCategory
                }
                if(this.filter.SelectSalable === ''){
                    salability = ''
                }else{
                    salability = "|product.salability:"+this.filter.SelectSalable
                }
                 let productTag = ''
                if (this.filter.SelectProductTag !== null) {
                    productTag = this.filter.SelectProductTag.value
                }

                this.$http.get("/price/product_price",{params:{
                        perpage:100,
                        embeds:'product,price_set_id,product.uom,product.category',
                        conditions: 'Or.product.name.icontains:'+search+'%2COr.product.code.icontains:'
                        +search+priceSet+category+salability+'|product.status:1',
                        orderby:'-id',
                        tagproduct : productTag
                    }})
                    .then(response => {
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }
                    }).catch(err => {
                        console.log(err)
                    });
            },

            // FILTER TABLE PRODUCT PRICE
            priceSetFilterSelected(d){
               this.filter.SelectPriceSet = ""
               if(d) {
                   this.filter.SelectPriceSet= d.id
               }
               this.renderData(this.search,this.filter.SelectSalable)
            },

            categoryFilterSelected(d) {
                this.filter.SelectCategory = "";
                if (d) {
                    this.filter.SelectCategory = d.id;
                }
                this.renderData(this.search,this.filter.SelectSalable)
            },

            productTagFilterSelected(d) {
                this.filter.SelectProductTag = null;
                if (d !== ''  && d !== undefined) {
                    this.filter.SelectProductTag = d;
                }
                this.renderData(this.search,this.filter.SelectSalable)
            },

            // SELECT EXPORT PRODUCT PRICE
            priceSetExportSelected(d){
                this.filter_export_product_price.SelectPriceSet = ""
                if(d) {
                    this.filter_export_product_price.SelectPriceSet = d.id
                }
            },

            categoryExportSelected(d){
                this.filter_export_product_price.SelectCategory = ""
                if(d) {
                    this.filter_export_product_price.SelectCategory = d.id
                }
            },

            //SELECT DOWNLOAD PRODUCT PRICE
            priceSetUpdateProductSelected(d){
                this.filter_update_product_price.PriceSet = null
                this.filter_update_product_price.SelectPriceSet = ""
                if(d !== ''  && d !== undefined) {
                    this.filter_update_product_price.PriceSet = d.id
                    this.filter_update_product_price.SelectPriceSet= d.id
                }
            },

            categoryUpdateProductSelected(d){
                this.filter_update_product_price.Category = null
                this.filter_update_product_price.SelectCategory = ""
                if(d !== ''  && d !== undefined) {
                    this.filter_update_product_price.PriceSet = d.id
                    this.filter_update_product_price.SelectCategory = d.id
                }
            },

            //SELECT DOWNLOAD SHADOW PRICE
            priceSetUpdateShadowSelected(d){
                this.filter_update_shadow_price.PriceSet = null
                this.filter_update_shadow_price.SelectPriceSet = ""
                if(d !== ''  && d !== undefined) {
                    this.filter_update_shadow_price.PriceSet = d.id
                    this.filter_update_shadow_price.SelectPriceSet= d.id
                }
            },

            categoryUpdateShadowSelected(d){
                this.filter_update_shadow_price.Category = null
                this.filter_update_shadow_price.SelectCategory = ""
                if(d !== ''  && d !== undefined) {
                    this.filter_update_shadow_price.PriceSet = d.id
                    this.filter_update_shadow_price.SelectCategory = d.id
                }
            },
            productTagUpdateShadowSelected(d) {
                this.filter_update_shadow_price.SelectProductTag = null;
                if (d !== ''  && d !== undefined) {
                    this.filter_update_shadow_price.SelectProductTag = d;
                }
            },
            uploadProductPrice() {
                this.overlay = true
                this.productPrice = false
                this.$http.put("/price/product_price/template/update", {
                    salability_status:this.filter_update_product_price.SelectSalable,
                    prices:this.prices
                })
                .then(response => {
                    this.$toast.open({
                        position: 'top-right',
                        message: 'Data has been updated successfully',
                        type: 'success',
                    });
                    this.overlay = false
                    this.clear1 = false
                    this.error = {}
                    this.renderData(this.search, this.filter.SelectSalable)
                }).then(() => {
                    this.clear1 = true
                }).catch(e => {
                    this.overlay = false
                    this.productPrice = true
                    this.error = e.errors
                })
            },

            onDeleteProductPrice(ev) {
                this.prices = []
                this.uploadDis1 = true
            },
            onSelectProductPrice(file){
                this.prices = []
                file.forEach((item) => {
                    let value = {};
                    value.product_id = String(item.Product_ID);
                    value.unit_price = parseFloat(item.Unit_Price);
                    value.price_set_id = this.filter_update_product_price.SelectPriceSet
                    value.category_name = String(item.Category)
                    value.salability = parseInt(item.Salable)
                    this.prices.push(value)
                });
                this.uploadDis1 = false
            },
            uploadShadowPrice() {
                this.overlay = true
                this.shadowPrice = false
                this.$http.put("/price/product_price/template/shadow/update", {
                    salability_status:this.filter_update_shadow_price.SelectSalable,
                    prices:this.shadowPrices
                }).then(response => {
                    this.$toast.open({
                        position: 'top-right',
                        message: 'Data has been updated successfully',
                        type: 'success',
                    });
                    this.clear2 = false
                    this.overlay = false
                    this.error = {}
                    this.renderData(this.search, this.filter.SelectSalable)
                }).then(() => {
                    this.clear2 = true
                }).catch(e => {
                    this.overlay = false
                    this.error = e.errors
                    this.shadowPrice = true
                })
            },

            onDeleteShadowPrice(ev) {
                this.shadowPrices = []
                this.uploadDis2 = true
            },
            onSelectShadowPrice(file){
                this.shadowPrices = []
                file.forEach((item) => {
                    let value = {};
                    value.product_id = String(item.Product_ID);
                    value.shadow_price = parseFloat(item.Shadow_Price);
                    value.price_set_id = this.filter_update_shadow_price.SelectPriceSet
                    this.shadowPrices.push(value)
                });
                this.uploadDis2 = false
            },

            exportProductPrice(priceSetID, productSalability, productCategoryID) {
                let that = this
                if(!that.filter_export_product_price.SelectPriceSet){
                    priceSetID = ''
                    this.error = {
                        price_set_export : "Price set is required"
                    }
                }else{
                    priceSetID = "|price_set_id.e:"+that.filter_export_product_price.SelectPriceSet
                }
                if(that.filter_export_product_price.SelectSalable === ''){
                    productSalability = ''
                }else{
                    productSalability = "product.salability__in:"+that.filter_export_product_price.SelectSalable
                }
                if(that.filter_export_product_price.SelectCategory === ''){
                    productCategoryID = ''
                }else{
                    productCategoryID = "|product.category.id.e:"+that.filter_export_product_price.SelectCategory
                }
                if(that.filter_export_product_price.SelectPriceSet){
                    this.overlay = true
                    this.$http.get("/price/product_price/export?export=1", {params:{
                    conditions: productSalability +priceSetID + productCategoryID + "|product.status:1"
                    }}).then(response => {
                        this.overlay = false
                        this.error = {}
                        window.location.href = response.data.file
                        this.clear3 = false
                        // this.exportProduct = false
                        this.filter_export_product_price.SelectPriceSet = ""
                    }).then(() => {
                        this.clear3 = true
                    }).catch((err) => {
                        return Promise.reject({ Error: 'something went wrong', err});
                    });
                }
            },

            downloadProductPrice(priceSetID, productSalability, productCategoryID) {
                this.overlay = true
                let that = this
                if(that.filter_update_product_price.SelectPriceSet === ''){
                    priceSetID = ''
                }else{
                    priceSetID = "price_set_id.e:"+that.filter_update_product_price.SelectPriceSet
                }
                if(that.filter_update_product_price.SelectSalable === ''){
                    productSalability = ''
                }else{
                    productSalability = "|product.salability__in:"+that.filter_update_product_price.SelectSalable
                }
                if(that.filter_update_product_price.SelectCategory === ''){
                    productCategoryID = ''
                }else{
                    productCategoryID = "|product.category.id.e:"+that.filter_update_product_price.SelectCategory
                }

                this.$http.get("/price/product_price/template?export=1", {params:{
                    conditions: priceSetID + productSalability + productCategoryID + '|product.status:1'
                    }}).then(response => {
                        this.overlay = false
                        window.location.href = response.data.file
                    }).catch((err) => {
                        return Promise.reject({ Error: 'something went wrong', err});
                    });
            },

            downloadShadowPrice(priceSetID, productSalability){
                this.overlay = true
                let that = this
                if(that.filter_update_shadow_price.SelectPriceSet === ''){
                    priceSetID = ''
                }else{
                    priceSetID = "price_set_id.e:"+that.filter_update_shadow_price.SelectPriceSet
                }
                if(that.filter_update_shadow_price.SelectSalable === ''){
                    productSalability = ''
                }else{
                    productSalability = "|product.salability__in:"+that.filter_update_shadow_price.SelectSalable
                }
               let productTag = ''
                if (this.filter_update_shadow_price.SelectProductTag !== null) {
                    productTag = this.filter_update_shadow_price.SelectProductTag.value
                }

                this.$http.get("/price/product_price/template/shadow?export=1", {params:{
                    conditions: priceSetID + productSalability + '|product.status:1',
                    tagproduct : productTag
                    }}).then(response => {
                        this.overlay = false
                        window.location.href = response.data.file
                    }).catch((err) => {
                        return Promise.reject({ Error: 'something went wrong', err});
                    });
            },

        },
        watch:{
            'search': {
                handler: function (val) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function(){
                        that.renderData(val,that.filter.SelectSalable)
                    }, 1000);
                },
                deep: true
            },
            'filter.SelectSalable': {
                handler: function (val) {
                    let that = this
                    that.renderData(this.search,val)
                },
                deep: true
            },
        }
    }
</script>