<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row>
                <v-col cols="12" md="4" class="h70">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }" v-privilege="'filter_rdl'">
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
                       <span>Search by Goods Receipt Code, Purchase Order Code</span>
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
                    <SelectSupplier
                        :norequired="true"
                        @selected="supplierSelected"
                        name ="filter_supplier"
                        :dense="true"
                    ></SelectSupplier>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectArea
                        :norequired="true"
                        @selected="areaSelected"
                        :aux_data="2"
                        name="filter_area"
                        :dense="true"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectWarehouse
                        :norequired="true"
                        :aux_data="2"
                        :warehouse="warehouse"
                        name="filter_warehouse"
                        :area_id="SelectArea"
                        :disabled="disabledWr"
                        @selected="warehouseSelected"
                        :dense="true"
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
                                    name="filter_date"
                                    clearable
                                    @click:clear="order_date = [],renderData(search,statuses)"
                                    v-model="order_date_input"
                                    maxlength="24"
                                    dense
                                >
                                    <template v-slot:label>
                                        Actual Arrival Date
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
                    <SelectGlossary
                        v-model="stockType"
                        outlined
                        :dense="true"
                        label="Stock Type"
                        :norequired="true"
                        @selected="typeSelected"
                        table="all"
                        attribute="stock_type"
                        clearable
                    ></SelectGlossary>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-select
                        v-model="statuses"
                        :items="status2"
                        name="filter_status"
                        item-text="text"
                        item-value="value"
                        outlined
                        dense
                    ></v-select>
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
                        <td v-if="props.item.inbound_type == 1">{{ props.item.purchase_order.code }}<br>
                        <span class="text-black60">{{ formatDate(props.item.purchase_order.recognition_date) }}</span></td>
                        <td v-if="props.item.inbound_type == 2">{{ props.item.goods_transfer.code }}</td>
                        <td v-if="props.item.inbound_type !== 1 && props.item.inbound_type !== 2">-</td>
                        <td>{{ formatDate(props.item.ata_date) }}</td>
                        <td v-if="props.item.inbound_type == 1">{{ props.item.purchase_order.supplier.name }}</td>
                        <td v-else>-</td>
                        <td>{{ props.item.warehouse.name }}</td>
                        <td>{{ props.item.stock_type == 2 ? 'Waste Stock' : 'Good Stock'}}</td>
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
                                    <v-list-item  :to="`/warehouse/goods-receipt/detail/${props.item.id}`" v-privilege="'gr_rdd'">
                                        <v-list-item-content>
                                            <v-list-item-title>Detail</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <div v-if="props.item.status == 1 && props.item.inbound_type != 2">
                                        <hr>
                                    </div>
                                    <v-list-item v-if="props.item.status == 1 && props.item.inbound_type != 2" :to="`/warehouse/goods-receipt/update/${props.item.id}`" v-privilege="'gr_upd'">
                                        <v-list-item-content>
                                            <v-list-item-title>Update</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <div v-if="props.item.status !== 3">
                                        <hr>
                                    </div>
                                    <v-list-item v-if="props.item.status !== 3" @click="print(props.item.id)" v-privilege="'gr_prt'">
                                        <v-list-item-content>
                                            <v-list-item-title>Print</v-list-item-title>
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
    </v-container>
</template>

<script>
    export default {
        name: "ListGoodsReceipt",
        data() {
            return {
                filter: false,
                id_so: '',
                code_so: '',
                modalOpen: false,
                search: '',
                order_date_input : '',
                order_date_model : '',
                order_date : [],
                loading: false,
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
                ],
                table: {
                    fields: [
                        {
                            text:'Code',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Inbound Code',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Actual Arrival Date',
                            class: 'grey--text text--darken-4',
                            sortable: true
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
                            text:'Stock Type',
                            width: "10%",
                            class: 'grey--text text--darken-4',
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
                items:[{
                    purchase_order : {
                        code : '',
                        recognition_date : '',
                        supplier : {
                            name : ''
                        }
                    },
                    warehouse : {
                        name : ''
                    }
                }],
                SelectArea : '',
                SelectSupplier : '',
                SelectWarehouse : '',
                disabledWr : true,
                warehouse : "",
                outlet : false,
                overlay: false,
                id_gr: '',
                stockType: null,
                SelectStockType: ''
            }
        },
        mounted() {
            this.renderData('',this.statuses)
        },
        methods: {
            print(id) {
                this.overlay = true
                this.id_gr = id
                this.$http.get("/warehouse/goods/receipt/print/" + this.id_gr)
                    .then(response => {
                        this.filePdf = response.data.file
                        window.open(this.filePdf, '_blank');
                        this.overlay = false
                    })
            },
            renderData(search,statuses){
                if(statuses === 999){
                    statuses = ''
                }else{
                    statuses= "|status:"+statuses
                }

                let supplier = ''
                if (this.SelectSupplier) {
                    supplier = '|purchaseorder.supplier.id.e:'+this.SelectSupplier
                }

                let warehouse = ''
                if (this.SelectWarehouse) {
                    warehouse = '|warehouse.id.e:'+this.SelectWarehouse
                }
                let order_date = ''
                if (this.order_date.length > 0) {
                    if (this.order_date.length == 1) {
                        order_date = '|ata_date:'+this.order_date[0]
                    } else {
                        let date = this.order_date[0]
                        let date2 = this.order_date[1]
                        if (date > date2) {
                            order_date = '|ata_date.gte:'+date2+'|ata_date.lte:'+date
                        } else {
                            order_date = '|ata_date.gte:'+date+'|ata_date.lte:'+date2
                        }
                    }
                }
                let stocktype = ''
                if (this.SelectStockType) {
                    stocktype = '|stock_type:' + this.SelectStockType
                }
                this.loading = true;
                this.items = []
                this.$http.get("/warehouse/goods/receipt",{params:{
                        perpage:1000,
                        embeds:'warehouse,purchaseorder,purchaseorder.supplier,warehouse.area,goodstransfer',
                        conditions:'Or.code.icontains:'+search+'%2COr.purchaseorder.code.icontains:'+search+order_date+supplier+warehouse+statuses+stocktype,
                        orderby:'-id',
                    }}).then(response => {
                    this.loading = false
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }
                });
            },
            areaSelected(d) {
                this.SelectArea = ""
                this.SelectWarehouse = ""
                this.warehouse = null
                this.disabledWr = true
                if (d) {
                    this.SelectArea = d.id
                    this.disabledWr = false
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
                this.warehouse = null
                this.SelectWarehouse = ""
                if (d) {
                    this.warehouse = d
                    this.SelectWarehouse = d.id
                }
                this.renderData(this.search,this.statuses)
            },
            typeSelected(d) {
                this.SelectStockType = ""
                if (d) {
                    this.SelectStockType = d.value
                }
                this.renderData(this.search,this.statuses)
            }
        },
        watch: {
            'search': {
                handler: function (val) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function(){
                        that.renderData(val, that.statuses)
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
        },
    }
</script>
