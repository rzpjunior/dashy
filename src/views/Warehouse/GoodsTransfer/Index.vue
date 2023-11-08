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
                    <span>Search by Goods Transfer Code</span>
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
                    <SelectWarehouse
                        :norequired="true"
                        :aux_data="2"
                        name="filter_origin"
                        :label="'Warehouse Origin'"
                        @selected="warehouseOriginSelected"
                        :dense="true"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectWarehouse
                        :norequired="true"
                        :aux_data="2"
                        name="filter_destination"
                        :label="'Warehouse Destination'"
                        @selected="warehouseDestinationSelected"
                        :dense="true"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="departuredate_model"
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
                                    name="filter_departuredate"
                                    @click:clear="departuredate = '',renderData(search,statuses)"
                                    v-model="departuredate"
                                    dense
                                >
                                    <template v-slot:label>
                                        Departure Date
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            persistent-hint
                            v-model="departuredate"
                        >
                        <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="departuredate_model = false,renderData(search,statuses)"
                            >
                                OK
                            </v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="etadate_model"
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
                                    name="filter_etadate"
                                    @click:clear="etadate = '',renderData(search,statuses)"
                                    v-model="etadate"
                                    dense
                                >
                                    <template v-slot:label>
                                        ETA Date
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            persistent-hint
                            v-model="etadate"
                        >
                        <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="etadate_model = false,renderData(search,statuses)"
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
                        item-text="text"
                        item-value="value"
                        outlined
                        name="filter_status"
                        dense
                    ></v-select>
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row >
                <v-col class="flex-align-end">
                    <v-btn
                        depressed
                        color="#50ABA3"
                        :to="{ name: 'GoodsTransferCreate' }"
                        class="no-caps bold"
                        v-privilege="'gt_req'"
                    >
                    <span class="text-white">
                        Request Goods Transfer
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
                        <td>{{ props.item.stock_type == 2 ? 'Waste Stock' : 'Good Stock' }}</td>
                        <td>{{ props.item.origin.code }} - {{ props.item.origin.name }}</td>
                        <td>{{ props.item.destination.code }} - {{props.item.destination.name }}</td>
                        <td>{{ props.item.status == 5 ? '-' : formatDate(props.item.recognition_date) }}</td>
                        <td>{{ props.item.status == 5 ? '-' : formatDate(props.item.eta_date) }}</td>
                        <td>{{ formatPrice(props.item.total_weight) }}</td>
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
                                ><span class="pa-md-2"> Draft </span></v-chip>
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
                                <v-list class="text-red">
                                    <v-list-item  :to="`/warehouse/goods-transfer/detail/${props.item.id}`" v-privilege="'gt_rdd'">
                                        <v-list-item-content>
                                            <v-list-item-title>Detail</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <div v-if="props.item.status == 1 || props.item.status == 5">
                                        <hr>
                                    </div>
                                    <v-list-item 
                                        v-if="props.item.status == 1 || props.item.status == 5" 
                                        @click="update(props.item.id)"
                                        v-privilege="'gt_upd'"
                                    >
                                        <v-list-item-content>
                                            <v-list-item-title>Update</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <div v-if="props.item.status == 1 || props.item.status == 2">
                                        <hr>
                                    </div>
                                    <v-list-item 
                                        @click="downloadPdf(props.item.id)" 
                                        v-if="props.item.status == 1 || props.item.status == 2"
                                    >
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
        <LockDialog :model="updateCheck" :locked_by="locked_by_name" :locked_text="locked_text"/>
        <LoadingBar :value="overlay"/>
    </v-container>
</template>

<script>
    import Vue from 'vue'
    export default {
        name: 'ListGoodsTransfer',
        name: "GoodsTransfer",
        data() {
            return {
                code_gt: '',
                id_gt : "",
                overlay: false,
                modalOpen: false,
                filePdf: '',
                search: '',
                departuredate_model : '',
                departuredate : "",
                etadate_model : '',
                etadate : "",
                loading: false,
                statuses:999,
                filter : false,
                status2:[
                    {
                        text:'All Status',
                        value:999
                    },
                    {
                        text:'Draft',
                        value:5
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
                            text:'Stock Type',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Warehouse Origin',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Warehouse Destination',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Departure Date',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'ETA Date',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Total Weight',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Status',
                            class: 'grey--text text--darken-4',
                            width: "10%",
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
                    origin : {
                        name : '',
                        code : ""
                    },
                    destination : {
                        name : '',
                        code : ""
                    }
                }],
                SelectArea : '',
                SelectSupplier : '',
                SelectOriginWarehouse : '',
                SelectDestinationWarehouse : '',
                user_role_id: '',
                user_id: '',
                user_warehouse: '',
                updateCheck: false,
                locked_by_name: '',
                locked_text: '',
                overlay: false,
                stockType: null,
                SelectStockType: ''
            }
        },
        mounted() {
            this.user_role_id = this.$store.state.staff.role.id
            this.user_id = this.$store.state.staff.id
            this.user_warehouse = this.$store.state.staff.warehouse.id
            this.renderData('',this.statuses)
        },
        methods: {
            downloadPdf(id){
                this.overlay = true
                this.id_gt = id
                this.$http.get("/warehouse/goods/transfer/print/"+this.id_gt)
                .then(response => {
                    this.filePdf = response.data.file
                    window.open(this.filePdf,'_blank');
                    this.overlay = false
                })
            },
            // async beforeDownload ({ html2pdf, options, pdfContent }) {
            // await html2pdf().set(options).from(pdfContent).toPdf().get('pdf').then((pdf) => {
            //     const totalPages = pdf.internal.getNumberOfPages()
            //     for (let i = 1; i <= totalPages; i++) {
            //         pdf.setPage(i)
            //         pdf.setFontSize(10)
            //         pdf.setTextColor(15)
            //         pdf.text('#'+this.code_gt, (pdf.internal.pageSize.getWidth() * 0.03), (pdf.internal.pageSize.getHeight() - 0.3))
            //         pdf.text('Page ' + i + ' of ' + totalPages, (pdf.internal.pageSize.getWidth() * 0.88), (pdf.internal.pageSize.getHeight() - 0.3))
            //     }
            //     window.open(pdf.output('bloburl'), '_blank');
            //     }).save()
            //     this.overlay = false
            // },
            async renderData(search,statuses){
                if(statuses === 999){
                    statuses = ''
                }else{
                    statuses= "|status:"+statuses
                }

                let wo = ''
                if (this.SelectOriginWarehouse) {
                    wo = '|origin.id.e:'+this.SelectOriginWarehouse
                }
                let wd = ''
                if (this.SelectDestinationWarehouse) {
                    wd = '|destination.id.e:'+this.SelectDestinationWarehouse
                }
                let departuredate = ''
                if (this.departuredate) {
                    departuredate = '|recognition_date:'+this.departuredate
                }
                let etadate = ''
                if (this.etadate) {
                    etadate = '|eta_date:'+this.etadate
                }
                let stocktype = ''
                if (this.SelectStockType) {
                    stocktype = '|stock_type:' + this.SelectStockType
                }
                this.loading = true;
                this.items = []
                let res = await this.$http.get("/warehouse/goods/transfer",{params:{
                        perpage:100,
                        embeds:'origin,destination',
                        conditions:'code.icontains:'+search+etadate+departuredate+wo+wd+statuses+stocktype,
                        orderby:'-id',
                    }})
                this.items = res.data.data
                if(this.items === null){
                    this.items = []
                }
                this.loading = false
            },
            warehouseOriginSelected(d) {
                this.SelectOriginWarehouse = ""
                if (d) {
                    this.SelectOriginWarehouse = d.id
                }
                this.renderData(this.search,this.statuses)
            },
            warehouseDestinationSelected(d) {
                this.SelectDestinationWarehouse = ""
                if (d) {
                    this.SelectDestinationWarehouse = d.id
                }
                this.renderData(this.search,this.statuses)
            },
            async fetchGoodsTransferDetail(id) {
                let data = []
                await this.$http.get("/warehouse/goods/transfer/" + id)
                    .then(response => {
                        data = response.data.data
                    })
                return data
            },
            async update(id) {
                this.overlay = true
                let data = await this.fetchGoodsTransferDetail(id)
                let locked = data.locked
                if (locked == 1) {
                    let locked_by = data.locked_by.id
                    if (locked_by == this.user_id) {
                        this.$router.push('/warehouse/goods-transfer/update/'+id);
                    } else {
                        this.overlay = false
                        this.updateCheck = true
                        this.locked_by_name = data.locked_by.name
                        this.locked_text = 'Goods Transfer'
                    }
                } else {
                    if (data.goods_receipt.length > 0) {
                        let gr = data.goods_receipt
                        let grActiveFound = false
                        gr.map((e) => {
                            if (e.status === 1) {
                                grActiveFound = true
                            }
                        })
                        if (grActiveFound) {
                            this.overlay = false
                            Vue.$toast.open({
                                position: 'top-right',
                                message: "You can't Update, there is a Goods Receipt Active on this Document",
                                type: 'error',
                            });
                        } else {
                            this.$router.push('/warehouse/goods-transfer/update/'+id);
                        }
                    } else {
                        this.$router.push('/warehouse/goods-transfer/update/'+id);
                    }
                }
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
        },
    }
</script>
