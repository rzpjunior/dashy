<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="-mb38">
                <v-col cols="12" md="4">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }">
                            <v-text-field
                                dense
                                v-model="search"
                                outlined
                                filled
                                placeholder="Search..."
                                v-on="{ ...tooltip }"
                                prepend-inner-icon="search"
                            ></v-text-field>
                        </template>
                        <span>Search by Code</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12" md="5" class="h1"/>
                <v-col cols="12" md="3">
                    <v-autocomplete
                        v-model="sortby"
                        :items="sorts"
                        item-text="text"
                        name="sort"
                        placeholder="Select Field"
                        @change="funcSort"
                        return-object
                        label="Sort by"
                        outlined
                        dense
                    >
                        <template slot="selection" slot-scope="data">
                            <div class="select-item">
                                {{ data.item.text }}
                            </div>
                        </template>
                        <template slot="item" slot-scope="data">
                            {{ data.item.text }}
                        </template>
                    </v-autocomplete>
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
                    <SelectSupplier
                        name="filter_supplier"
                        :norequired="true"
                        :dense="true"
                        @selected="supplierSelected"
                        v-privilege="'filter_rdl'"
                    ></SelectSupplier>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectArea
                        name="filter_area"
                        :norequired="true"
                        @selected="areaSelected"
                        :aux_data="2"
                        :dense="true"
                        v-privilege="'filter_rdl'"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectWarehouse
                        name="filter_warehouse"
                        :norequired="true"
                        :aux_data="2"
                        :dense="true"
                        @selected="warehouseSelected"
                        v-privilege="'filter_rdl'"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="order_date_model"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-text-field
                                    prepend-inner-icon="mdi-calendar"
                                    outlined
                                    clearable
                                    @click:clear="order_date = [],order_date_input = '',renderData(search,statuses)"
                                    v-model="order_date_input"
                                    maxlength="24"
                                    dense
                                >
                                    <template v-slot:label>
                                        Order Date
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            persistent-hint
                            v-model="order_date"
                        >
                        <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="order_date_model = false,renderData(search,statuses)"
                            >
                                OK
                            </v-btn>
                        </v-date-picker>
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
                                    prepend-inner-icon="mdi-calendar"
                                    outlined
                                    clearable
                                    @click:clear="eta_date = [],eta_date_input = '',renderData(search,statuses)"
                                    v-model="eta_date_input"
                                    maxlength="24"
                                    dense
                                >
                                    <template v-slot:label>
                                        Estimated Arrival Date
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            persistent-hint
                            v-model="eta_date"
                        >
                        <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="eta_date_model = false,renderData(search,statuses)"
                            >
                                OK
                            </v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-select
                        v-model="statuses"
                        :items="status2"
                        item-text="text"
                        item-value="value"
                        outlined
                        dense
                    ></v-select>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectGoodReceiptStatus
                        name="filter_good_receipt"
                        :norequired="true"
                        :dense="true"
                        @selected="goodReceiptSelected"
                        v-privilege="'filter_rdl'"
                    ></SelectGoodReceiptStatus>
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row >
                <v-col cols="12" md="6">
                    <v-btn
                        :disabled="disabledCommitPO"
                        @click="modelCommitPO = true"
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="only-btn"
                        v-privilege="'po_cmt'"
                    >
                        <span :class="disabledCommitPO?'text-black40':'text-secondary'" >Commit PO</span>
                    </v-btn>
                    <v-tooltip right>
                        <template v-slot:activator="{ on: tooltip }">
                            <v-icon
                                v-on="{ ...tooltip }"
                                dark
                                right
                            >
                                mdi-information-outline
                            </v-icon>
                        </template>
                        <span>Select the checkbox to activate the commit PO</span>
                    </v-tooltip>
                </v-col>
                <v-col class="flex-align-end" cols="12" md="6">
                    <v-btn
                        depressed
                        color="#50ABA3"
                        to="/purchase/order/create"
                        class="no-caps bold"
                        v-privilege="'po_crt'"
                    >
                        <span class="text-white">
                            Create Purchase Order
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
                mobile-breakpoint="0"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>
                            <div v-if="props.item.status == 5">
                                <v-checkbox
                                    v-model="po_bulk"
                                    multiple
                                    :value="props.item.id"
                                    color="#50AE55"
                                ></v-checkbox>
                            </div>
                        </td>
                        <td>{{ props.item.code }}<br>
                        <span class="text-black60">{{ formatDate(props.item.recognition_date) }}</span></td>
                        <td>{{ props.item.supplier.name }}</td>
                        <td>{{ props.item.warehouse.name }}</td>
                        <td>{{ formatPrice(props.item.total_charge) }}</td>
                        <td>{{ formatPrice(props.item.total_invoice) }}</td>
                        <td>{{ formatDate(props.item.eta_date) }}</td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                    :text-color="statusMasterText('active')"
                                ><span class="pa-md-2">Active</span></v-chip>
                            </div>
                            <div v-else-if="props.item.status == 2">
                                <v-chip
                                    :color="statusMaster('finished')"
                                    :text-color="statusMasterText('finished')"
                                ><span class="pa-md-2">Finished</span></v-chip>
                            </div>
                            <div v-else-if="props.item.status == 3">
                                <v-chip
                                    :color="statusMaster('cancelled')"
                                    :text-color="statusMasterText('cancelled')"
                                ><span class="pa-md-2"> Cancelled </span></v-chip>
                            </div>
                            <div v-else-if="props.item.status == 5">
                                <v-chip
                                    :color="statusMaster('draft')"
                                    :text-color="statusMasterText('draft')"
                                ><span class="pa-md-2">Draft</span></v-chip>
                            </div>
                        </td>
                        <td>
                            <div v-if="props.item.status == 5 && props.item.supplier_badge">
                                <v-btn
                                    v-privilege="'po_mrk'"
                                    v-if="props.item.supplier_badge.name == 'Central Market'"
                                    icon
                                    :to="`/purchase/order/market-purchase/${props.item.id}`"
                                ><v-icon dark>mdi-shopping</v-icon></v-btn>
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
                                    <v-list-item  :to="`/purchase/order/${props.item.id}`" v-privilege="'po_rdd'">
                                        <v-list-item-content>
                                            <v-list-item-title>Detail</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <v-list-item v-if="props.item.status == 5" :to="`/purchase/order/update/${props.item.id}`" v-privilege="'po_upd'">
                                        <v-list-item-content>
                                            <v-list-item-title>Update</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <v-list-item v-if="props.item.status == 1 && props.item.total_invoice == 0" :to="`/finance/purc-invoice/create/${props.item.id}`" v-privilege="'pi_crt'">
                                        <v-list-item-content>
                                            <v-list-item-title>Create Invoice</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <div>
                                        <hr>
                                    </div>
                                    <v-list-item @click="downloadPdf(props.item.id)" v-privilege="'po_prt'">
                                        <v-list-item-content>
                                            <v-list-item-title>Print</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <div v-if="props.item.status == 1">
                                        <hr>
                                    </div>
                                    <v-list-item @click="downloadExcel(props.item.id)" v-privilege="'pd_dl'" v-if="props.item.status == 1">
                                        <v-list-item-content>
                                            <v-list-item-title>Download PD</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <LoadingBar :value="overlay"/>
        <v-dialog
            v-model="modelCommitPO"
            persistent
            max-width="470px"
        >
            <LoadingBar :value="overlay"/>
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">Commit Purchase Order</span>
                </v-card-title>
                <v-card-text>
                <span class="fs16 mt-1">Are you sure to Commit {{po_bulk.length}} Purchase Order ?</span>
                </v-card-text>
                <v-card-actions class="pb-4">
                <v-spacer></v-spacer>
                    <v-btn
                        @click="modelCommitPO = false"
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                    >
                        <span class="text-black80">No</span>
                    </v-btn>
                    <v-btn
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                        @click="commitPO()"
                    >Yes</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import Vue from 'vue'
    export default {
        name: "PurchaseOrder",
        data() {
            return {
                sortby: '-id',
                filter : false,
                orderby: '-id',
                sorts:[
                    {
                        text:'Default',
                        value:'-id'
                    },
                    {
                        text:'Warehouse (A-Z)',
                        value:'warehouse.name'
                    },
                    {
                        text:'Warehouse (Z-A)',
                        value:'-warehouse.name'
                    },
                    {
                        text:'Total Invoice (A-Z)',
                        value:'total_invoice'
                    },
                    {
                        text:'Total Invoice (Z-A)',
                        value:'-total_invoice'
                    },
                    {
                        text:'Estimated Arrival Date (A-Z)',
                        value:'eta_date'
                    },
                    {
                        text:'Estimated Arrival Date (Z-A)',
                        value:'-eta_date'
                    },
                    {
                        text:'Status (A-Z)',
                        value:'status'
                    },
                    {
                        text:'Status (Z-A)',
                        value:'-status'
                    },
                ],
                search: '',
                order_date_model : '',
                order_date_input : "",
                order_date : [],
                po_bulk :[],
                eta_date_model : '',
                eta_date_input : '',
                eta_date : [],
                loading: false,
                isMobile : false,
                modelCommitPO : false,
                statuses:999,
                status2:[
                    {
                        text:'All Status',
                        value:999
                    },
                    {
                        text:'Active',
                        value:1
                    },
                    {
                        text:'Finished',
                        value:2
                    },
                    {
                        text:'Cancelled',
                        value:3
                    },
                    {
                        text:'Draft',
                        value:5
                    },
                ],
                table: {
                    fields: [
                        {
                            width: "5%",
                            sortable: false
                        },
                        {
                            text:'Code',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Supplier',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Warehouse',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Total Order',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Total Invoice',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                         {
                            text:'Estimated Arrival Date',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Status',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            width: "1%",
                            sortable: false
                        },
                        {
                            width: "1%",
                            sortable: false
                        },
                    ],
                },
                items:[{
                    supplier : {
                        name : ''
                    },
                    warehouse : {
                        name : ''
                    },
                }],
                SelectArea : '',
                SelectSupplier : '',
                SelectWarehouse : '',
                SelectGoodReceiptStatus : '',
                overlay: false,
            }
        },
        mounted() {
            this.renderData('',this.statuses)
            window.onresize = () => {
                if (window.screen.width < 769) {
                    this.isMobile = true
                } else {
                    this.isMobile = false
                }
            }
        },
        created() {
            if (window.screen.width < 769) {
                this.isMobile = true
            } else {
                this.isMobile = false
            }
        },
        computed: {
            disabledCommitPO() {
                if (this.po_bulk.length == 0) {
                    return true
                } else {
                    return false
                }
            },
            format_order_date() {
                if (this.order_date.length > 0) {
                    let ret = ''
                    if (this.order_date.length == 1) {
                        let date = this.order_date[0]
                        ret = this.$moment(date).format('DD/MM/YYYY')
                    } else {
                        let date = this.order_date[0]
                        let date2 = this.order_date[1]
                        if (date > date2) {
                            ret = this.$moment(date2).format('DD/MM/YYYY')+' - '+this.$moment(date).format('DD/MM/YYYY')
                        } else {
                            ret = this.$moment(date).format('DD/MM/YYYY')+' - '+this.$moment(date2).format('DD/MM/YYYY')
                        }
                    }
                    return ret
                }
            },
            format_eta_date() {
                if (this.eta_date.length > 0) {
                    let ret = ''
                    if (this.eta_date.length == 1) {
                        let date = this.eta_date[0]
                        ret = this.$moment(date).format('DD/MM/YYYY')
                    } else {
                        let date = this.eta_date[0]
                        let date2 = this.eta_date[1]
                        if (date > date2) {
                            ret = this.$moment(date2).format('DD/MM/YYYY')+' - '+this.$moment(date).format('DD/MM/YYYY')
                        } else {
                            ret = this.$moment(date).format('DD/MM/YYYY')+' - '+this.$moment(date2).format('DD/MM/YYYY')
                        }
                    }
                    return ret
                }
            },
        },
        methods: {
            downloadPdf(id){
                this.overlay = true
                this.$http.get("/purchase/order/print/"+id)
                .then(response => {
                    this.filePdf = response.data.file
                    window.open(this.filePdf,'_blank');
                    this.overlay = false
                })
            },
            downloadExcel(id){
                this.overlay = true
                this.$http.get("/purchase/order/download-delivery/"+id+"?export=1")
                .then(response => {
                    window.location.href = response.data.file
                    this.overlay = false
                })
            },
            commitPO() {
                let data = {
                    data : this.po_bulk
                }
                this.overlay = true
                this.$http.put("/purchase/order/commit", data)
                .then(response => {
                    this.po_bulk = []
                    this.modelCommitPO = false
                    this.overlay = false
                    this.renderData(this.search,this.statuses)
                    if(response.data.data){
                        Vue.$toast.open({
                            position: 'top-right',
                            message: response.data.data,
                            type: 'success',
                        });
                    }
                })
                .catch(e => {
                    this.po_bulk = []
                    this.renderData(this.search,this.statuses)
                    this.overlay = false
                    this.modelCommitPO = false
                })
            },
            funcSort(event) {
                this.orderby = event.value
                this.renderData(this.search,this.statuses)
            },
            renderData(search,statuses){
                if(statuses === 999){
                    statuses = ''
                }else{
                    statuses= "|status:"+statuses
                }
                let supplier = ''
                if (this.SelectSupplier) {
                    supplier = '|supplier.id.e:'+this.SelectSupplier
                }
                let area = ''
                if (this.SelectArea) {
                    area = '|warehouse.area.id.e:'+this.SelectArea
                }
                let goodreceipt = ''
                if (this.SelectGoodReceiptStatus != 0) {
                    goodreceipt = '|hasfinishedgr:'+this.SelectGoodReceiptStatus
                }
                let warehouse = ''
                if (this.SelectWarehouse) {
                    warehouse = '|warehouse.id.e:'+this.SelectWarehouse
                }
                let order_date = ''
                if (this.order_date.length > 0) {
                    if (this.order_date.length == 1) {
                        order_date = '|recognition_date:'+this.order_date[0]
                    } else {
                        let date = this.order_date[0]
                        let date2 = this.order_date[1]
                        if (date > date2) {
                            order_date = '|recognition_date.gte:'+date2+'|recognition_date.lte:'+date
                        } else {
                            order_date = '|recognition_date.gte:'+date+'|recognition_date.lte:'+date2
                        }
                    }
                }
                let eta_date = ''
                if (this.eta_date.length > 0) {
                    if (this.eta_date.length == 1) {
                        eta_date = '|eta_date:'+this.eta_date[0]
                    } else {
                        let date = this.eta_date[0]
                        let date2 = this.eta_date[1]
                        if (date > date2) {
                            eta_date = '|eta_date.gte:'+date2+'|eta_date.lte:'+date
                        } else {
                            eta_date = '|eta_date.gte:'+date+'|eta_date.lte:'+date2
                        }
                    }
                }
                this.loading = true;
                this.items = []
                this.$http.get("/purchase/order",{params:{
                        perpage:1000,
                        embeds:'supplier_id,warehouse_id,supplier_badge_id',
                        conditions:'code.icontains:'+search+area+supplier+warehouse+goodreceipt+order_date+eta_date+statuses,
                        orderby:this.orderby,
                    }}).then(response => {
                    this.loading = false
                    if(response.data.data){
                        this.items = response.data.data
                    }
                    if(this.items === null){
                        this.items = []
                    }
                });
            },
            // For select good receipt filter
            goodReceiptSelected(d) {
                this.SelectGoodReceiptStatus = ""
                if (d) {
                    this.SelectGoodReceiptStatus = d.value
                }
                this.renderData(this.search,this.statuses)
            },
            areaSelected(d) {
                this.SelectArea = ""
                if (d) {
                    this.SelectArea = d.id
                }
                this.renderData(this.search,this.statuses)
            },
            supplierSelected(d) {
                this.SelectSupplier = ""
                if (d) {
                    this.SelectSupplier = d.id
                }
                this.renderData(this.search,this.statuses)
            },
            warehouseSelected(d) {
                this.SelectWarehouse = ""
                if (d) {
                    this.SelectWarehouse = d.id
                }
                this.renderData(this.search,this.statuses)
            },
        },
        watch: {
            'search': {
                handler: function (val) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function(){
                        that.renderData(val,that.statuses)
                    }, 1000);

                },
                deep: true
            },
            'statuses': {
                handler: function (val) {
                    let that = this

                    that.renderData(this.search,val)
                },
                deep: true
            },
            'order_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.order_date[0] = this.$moment(val).format('YYYY-MM-DD')
                                this.renderData(this.search,this.statuses)
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0,10)
                            let date2 = val.substr(14,23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                this.order_date[0] = this.$moment(date1).format('YYYY-MM-DD')
                                this.order_date[1] = this.$moment(date2).format('YYYY-MM-DD')
                                if (this.order_date.length == 2) {
                                    this.renderData(this.search,this.statuses)
                                }
                            }
                        }
                    }
                },
                deep: true
            },
            'order_date': {
                handler: function (val) {
                    if (val) {
                        this.order_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
            'eta_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.eta_date[0] = this.$moment(val).format('YYYY-MM-DD')
                                this.renderData(this.search,this.statuses)
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0,10)
                            let date2 = val.substr(14,23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                this.eta_date[0] = this.$moment(date1).format('YYYY-MM-DD')
                                this.eta_date[1] = this.$moment(date2).format('YYYY-MM-DD')
                                if (this.eta_date.length == 2) {
                                    this.renderData(this.search,this.statuses)
                                }
                            }
                        }
                    }
                },
                deep: true
            },
            'eta_date': {
                handler: function (val) {
                    if (val) {
                        this.eta_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
        },
    }
</script>