<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row>
                <v-col cols="12" md="4" class="h70">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }">
                            <v-text-field
                                dense
                                v-model="search"
                                outlined
                                filled
                                placeholder="Search..."
                                prepend-inner-icon="search"
                                v-on="{ ...tooltip }"
                            >
                            </v-text-field>
                        </template>
                       <span>Search by code and name</span>
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row class="hr-title"/>
            <v-row :class="filter?'mb24':''">
                <v-col>
                    Filter 
                    <v-btn 
                        depressed
                        x-small
                        @click="filter = !filter"
                        v-if="filter"
                        class="no-caps fs12"
                    >
                        Hide
                        <v-icon
                            right
                        >
                            mdi-chevron-up
                        </v-icon>
                    </v-btn>
                    <v-btn 
                        depressed
                        x-small
                        @click="filter = !filter"
                        v-else
                        class="no-caps fs12"
                    >
                        Show
                        <v-icon
                            right
                        >
                            mdi-chevron-down
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row :class="filter? '':'hidden'">
                <v-col cols="12" md="3" class="-mt24">
                    <v-select
                        v-model="statuses"
                        :items="status"
                        item-text="text"
                        item-value="value"
                        outlined
                        dense
                    ></v-select>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectUom
                        :norequired="true"
                        v-model="uoms"
                        @selected="uomSelected"
                        :uom="uoms"
                        :dense="true"
                    ></SelectUom>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectCategory
                        :norequired="true"
                        v-model="categories"
                        @selected="categorySelected"
                        :category="categories"
                        :dense="true"
                    ></SelectCategory>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectProductTag
                        v-model="productTags"
                        @selected="productTagSelected"
                        :product_tag="productTags"
                        :dense="true"
                    ></SelectProductTag>
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row >
                <v-col class="flex-align-end">
                    <v-btn
                        depressed
                        color="#50ABA3"
                        :to="{ name: 'ProductCreate' }"
                        class="no-caps bold"
                        v-privilege="'prd_crt'"
                    >
                    <span class="text-white">
                        Create Product
                    </span>
                    </v-btn>
                </v-col>
            </v-row>
        </div>
        <div class="box-body-table">
            <v-data-table
                :headers="table.fields"
                :items="items"
                :loading="loading"
                :items-per-page="10"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.item.code }}</td>
                        <td>{{ props.item.name }}<br>
                        <span class="second-color">{{ props.item.product_uom }}</span>
                        </td>
                        <td>{{ props.item.category.name }}</td>
                        <td>{{ props.item.tag_product_str }}</td>
                        <td>
                            <span v-if="props.item.taxable === 2">No</span>
                            <span v-else>Yes</span>
                        </td>
                        <td>
                            <v-btn
                                v-if="props.item.status == 1"
                                class="only-btn"
                                depressed
                                outlined
                                color="#EBEBEB"
                                small
                                @click="modalPrintLabel(props.item.id)"
                                v-privilege="'prd_prt_lbl'"
                            >
                        <span class="text-secondary">
                            <v-icon left>
                                mdi-printer
                            </v-icon>
                            Create Label</span>
                            </v-btn>
                        </td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                ><span class="pa-md-2">Active</span></v-chip>
                            </div>
                            <div v-else-if="props.item.status == 2">
                                <v-chip
                                    :color="statusMaster('archived')"
                                >Archived</v-chip>
                            </div>
                        </td>
                        <td>
                            <v-menu offset-y>
                                <template v-slot:activator="{ on: menu }">
                                    <v-btn
                                        icon
                                        v-on="{ ...menu }"
                                    ><v-icon dark>mdi-dots-vertical</v-icon></v-btn>
                                </template>
                                <v-list class="bg-white">
                                    <v-list-item v-privilege="'prd_rdd'" :to="`/inventory/product/detail/${props.item.id}`" >
                                        <v-list-item-content>
                                            <v-list-item-title>Detail</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <div v-privilege="'prd_upd'">
                                        <hr>
                                    </div>
                                    <v-list-item v-privilege="'prd_upd'" :to="{ name: 'ProductUpdate', params: { id: props.item.id } }">
                                        <v-list-item-content>
                                            <v-list-item-title>Update</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
         <v-dialog
            v-model="modalLabelProduct"
            persistent
            max-width="850px"
        >
            <v-card class="OpenSans">
                <LoadingBar :value="overlayLabelProduct"/>
                <v-card-title>
                    <v-row>
                        <v-col class="text-title-modal" cols="12" md="6">
                            Create Label
                        </v-col>
                        <v-col class="flex-align-end" cols="12" md="6">
                            <v-btn
                                icon
                                @click="closeModalPrintLabel()"
                            >
                                <v-img src="/icon/close-new.png" max-height="24px" max-width="24px"></v-img>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-card-text>
                    <div>
                        <v-row>
                            <v-col cols="12" md="6" class="mt24">
                                <DetailRowNew :name="'Product Name'" :value="detailProduct.product_name"/>
                            </v-col>
                            <v-col cols="12" md="6" class="mt24">
                                <DetailRowNew :name="'UOM'" :value="detailProduct.product_uom"/>
                            </v-col>
                            <v-col cols="12" md="6" class="mt12">
                                <v-select
                                    v-if="detailProduct.product_uom == 'KG'"
                                    v-model="detailProduct.pack_size"
                                    :items="pack_size"
                                    item-text="text"
                                    item-value="value"
                                    outlined
                                    dense
                                >
                                    <template v-slot:label>
                                        Pack Size <span class="text-red">*</span>
                                    </template>
                                </v-select>
                                <v-text-field
                                    v-else
                                    name="name"
                                    v-model.number="detailProduct.total_order"
                                    required
                                    outlined
                                    dense
                                    onkeypress='return event.charCode >= 48 && event.charCode <= 57'
                                    maxlength="5"
                                >
                                    <template v-slot:label>
                                        Total Order <span class="text-red">*</span>
                                    </template>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="6" class="mt12">
                                <v-text-field
                                    name="name"
                                    v-model.number="detailProduct.total_print"
                                    required
                                    outlined
                                    dense
                                    onkeypress='return event.charCode >= 48 && event.charCode <= 57'
                                    maxlength="5"
                                >
                                    <template v-slot:label>
                                        Number of Label <span class="text-red">*</span>
                                    </template>
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </div>
                </v-card-text>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="printLabel()"
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                        :disabled="validation"
                    >
                        <span><v-icon left>mdi-printer</v-icon>Print</span>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    export default {
        name: "ProductList",
        data() {
            return {
                search: '',
                filter : false,
                loading: false,
                uom : null,
                overlay: false,
                modalLabelProduct: false,
                overlayLabelProduct: false,
                statuses:1,
                pack_size:[
                    {
                        text: '250 Gram',
                        value: '250 Gram'
                    },
                    {
                        text: '500 Gram',
                        value: '500 Gram'
                    },
                    {
                        text: '1000 Gram',
                        value: '1000 Gram'
                    }
                ],
                table: {
                    fields: [
                        {
                            text:'Code',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Name',
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
                            alias: "product-tag",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Taxable',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            width: "10%",
                            sortable: false
                        },
                        {
                            text:'Status',
                            width: "10%",
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
                items:[],
                detailProduct: {
                    product_code: "",
                    product_name: "",
                    product_uom: "",
                    total_order: null,
                    pack_size: '',
                    total_print: null,
                },
                uoms : null,
                categories : null,
                productTags : null,
                websocket_status: '',
                websocket: null,
                connected: false,
            }
        },
        computed: {
            validation() {
                if (this.detailProduct.total_print && (this.detailProduct.total_order || this.detailProduct.pack_size)) {
                    return false
                } else {
                    return true
                }
            },
        },
        mounted() {
            this.renderData(this.search)
        },
        created() {
            //initiate connection to websocket
            this.connection()
        },
        methods: {
            //connection method to websocket
            connection(){
                this.websocket = new WebSocket("ws://127.0.0.1:12212/printer")
                this.websocket.onopen = this.onConnect
                this.websocket.onclose = this.onDisconnect
            },
            //reconnect websocket if disconnected or idle
            reconnect(){
                this.connection()
            },
            //show status connected if onconnect
            onConnect(){
                this.connected = true
                this.websocket_status = 'Connected'
            },
            //show status disconnected if ondisconnect and try to reconnect to the websocket
            onDisconnect(){
                this.connected = false
                this.websocket_status = 'Disconnected'
                this.reconnect()
            },
            isConnected(){
                return this.connected
            },
            submitDataToWebSocket(data){
                if (Array.isArray(data)) {
                    data.forEach(function (element) {
                        this.websocket.send(JSON.stringify(element));
                    });
                } else {
                    this.websocket.send(JSON.stringify(data));
                }
            },
            productTagSelected(d) {
                this.productTags = null;
                if (d !== ''  && d !== undefined) {
                    this.productTags = d;
                }
                this.renderData(this.search)
            },
            uomSelected(d) {
                this.uoms = null;
                if (d !== ''  && d !== undefined) {
                    this.uoms = d;
                }
                this.renderData(this.search)
            },
            categorySelected(d) {
                this.categories = null;
                if (d !== ''  && d !== undefined) {
                    this.categories = d;
                }
                this.renderData(this.search)
            },
            renderData(search){
                this.loading = true;
                this.items = []
                let statuses = ''
                if(this.statuses === 999){
                    statuses = ''
                }else{
                    statuses= "|status:"+this.statuses
                }
                let uom = ''
                if (this.uoms !== null) {
                    uom = "|uom.id.e:"+this.uoms.id
                }
                let category = ''
                if (this.categories !== null) {
                    category = "|category.id.e:"+this.categories.id
                }
                let productTag = ''
                if (this.productTags !== null) {
                    productTag = this.productTags.value
                }
                this.$http.get("/inventory/product",{params:{
                        perpage:100,
                        conditions:'Or.name.icontains:'+search+'%2COr.code.icontains:'
                        +search+statuses+uom+category,
                        embeds: 'uom_id,category_id',
                        orderby:'-id',
                        tagproduct : productTag
                    }}).then(response => {
                    this.loading = false;
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }
                });
            },
            modalPrintLabel(id){
                this.modalLabelProduct = true
                this.overlayLabelProduct = true
                this.$http.get("/inventory/product/"+ id).then(response => {
                    let data = response.data.data
                    this.detailProduct.product_code = data.code
                    this.detailProduct.product_name = data.name
                    this.detailProduct.product_uom = data.uom.name
                    this.overlayLabelProduct = false
                });
            },
            closeModalPrintLabel(){
                this.modalLabelProduct = false
                this.detailProduct.pack_size = ""
                this.detailProduct.total_order = null
                this.detailProduct.total_print = ""
            },
            printLabel(){
                this.overlayLabelProduct = true
                this.$http.post('/inventory/product/print',this.detailProduct)
                .then(response => {
                    this.overlayLabelProduct = false
                    if(this.isConnected()){
                        this.submitDataToWebSocket({
                            'type': 'LABEL',
                            'qty': response.data.data.total_print,
                            'url': response.data.data.link_print
                        })
                    }else{
                        alert('Automatic print is disconnected. Please try to reconnect the whb.exe or contact admin, press OK to manually print the Label Product');
                        window.open(response.data.data.link_print, '_blank');
                    }
                    this.detailProduct.pack_size = ""
                    this.detailProduct.total_order = null
                    this.detailProduct.total_print = ""
                    this.modalLabelProduct = false
                })
                .catch(e => {
                    this.overlayLabelProduct = false
                    this.detailProduct.pack_size = ""
                    this.detailProduct.total_order = null
                    this.detailProduct.total_print = ""
                });
            }
        },
        watch: {
            'search': {
                handler: function (val) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function(){
                        that.renderData(val)
                    }, 1000);
                },
                deep: true
            },
            'statuses': {
                handler: function (val) {
                    let that = this
                    that.renderData(this.search)
                },
                deep: true
            },
        },
    }
</script>