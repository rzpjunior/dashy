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
                       <span>Search by code, name</span>
                    </v-tooltip>

                </v-col>
            </v-row>
            <v-row class="hr-title"/>
            <v-row :class="filterDropdown?'mb24':''">
                <v-col>
                    Filter 
                    <v-btn 
                        depressed
                        x-small
                        @click="filterDropdown = !filterDropdown"
                        v-if="filterDropdown"
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
                        @click="filterDropdown = !filterDropdown"
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
            <v-row :class="filterDropdown? '':'hidden'">
                <v-col cols="12" md="3" class="-mt24">
                   <SelectArea
                        v-model="area"
                        @selected="areaSelected"
                        :norequired="true"
                        :dense="true"
                   ></SelectArea>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectWarehouse
                        v-model="warehouse"
                        @selected="warehouseSelected"
                        :area_id="filter.area_id"
                        :norequired="true"
                        :disabled="disabled_warehouse"
                        :clear="clearWarehouse"
                        :dense="true"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectCategory
                        v-model="categories"
                        @selected="categorySelected"
                        :norequired="true"
                        :dense="true"
                    ></SelectCategory>
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row >
                <v-col class="flex-align-end">
                    <v-btn
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="no-caps mr4"
                        @click="refreshData()"
                        v-privilege="'stc_upd_cmt'"
                    >
                        <span class="text-black80">
                            <v-icon left>mdi-refresh</v-icon>
                            Refresh Data
                        </span>
                    </v-btn>
                    <div 
                        class="d-flex justify-end fs12 align-center mr-4" 
                        v-privilege="'stc_upd_cmt'"
                    >
                        Last updated at {{this.$moment(last_updated).format('DD/MM/YYYY HH:mm:ss')}}
                    </div>
                </v-col>
            </v-row>
        </div>
        <div class="box-body-table">
            <v-data-table
                :mobile-breakpoint="0"
                :headers="table.fields"
                :items="items"
                :items-per-page="10"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.item.product.code }} - {{ props.item.product.name }}<br>
                            <span class="text-black60">{{ props.item.product.uom.name }}</span>
                        </td>
                        <td>{{ props.item.product.category.name }}</td>
                        <td>{{ parseFloat(props.item.available_stock).toFixed(2) }}</td>
                        <td>{{ parseFloat(props.item.expected_qty).toFixed(2) }}</td>
                        <td>{{ parseFloat(props.item.intransit_qty).toFixed(2) }}</td>
                        <td>{{ parseFloat(props.item.intransit_waste_qty).toFixed(2) }}</td>
                        <td>{{ parseFloat(props.item.received_qty).toFixed(2) }}</td>
                        <td>{{ parseFloat(props.item.committed_out_stock).toFixed(2) }}</td>
                        <td>{{ props.item.warehouse.area.name }}<br>
                            <span class="text-black60">{{ props.item.warehouse.name }}</span>
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
        name: "WarehouseStock",
        data() {
            return {
                disabled_warehouse:true,
                clearWarehouse:false,
                search: '',
                area:null,
                warehouse:null,
                categories:null,
                filterDropdown: false,
                filter:{
                    area_id:'',
                    warehouse_id:'',
                    category_id:'',
                },
                table: {
                    fields: [
                        {
                            text:'Product',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Product Category',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Goods Stock',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Expected Stock',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Intransit Qty',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Intransit Waste Qty',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Received Qty',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Sum SO Qty',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Area',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        }
                    ],
                },
                items:[],
                last_updated : '',
                overlay : false
            }
        },
        created() {
            this.renderData('')
            this.getLastUpdated()
        },
        methods: {
            // For trigger refresh data
            refreshData() {
                this.overlay = true
                this.$http.put("/warehouse/stock/update_commited").then(response => {
                    this.getLastUpdated()
                    this.renderData(this.search)
                    this.overlay = false
                });
            },
            // For trigger get last update timestamp
            getLastUpdated() {
                this.$http.get("/config/app?conditions=attribute.icontains:lst_stc_upd_cmt").then(response => {
                    this.last_updated = response.data.data[0].value
                });
            },
            // For get data
            renderData(search){
                let areaID = ''
                if (this.filter.area_id == '65536') {
                    areaID = ''
                } else if (this.filter.area_id) {
                    areaID = "|warehouse.area.id.e:"+ this.filter.area_id
                }

                let warehouseID = ''
                if(this.filter.warehouse_id){
                    warehouseID = "|warehouse_id.e:"+ this.filter.warehouse_id
                }

                let categoryID = ''
                if(this.filter.category_id){
                    categoryID = "|product__category.id.e:"+ this.filter.category_id
                }

                this.loading = true;
                this.items = []

                this.$http.get("/warehouse/stock",{params:{
                        perpage:100,
                        embeds:'product,product.uom,product.category,warehouse,warehouse.area',
                        conditions:'Or.product.name.icontains:'+search+'%2COr.product.code.icontains:'
                        +search+areaID+warehouseID+categoryID,
                        orderby:'-id',
                    }}).then(response => {
                    this.loading = false;
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }
                });
            },
            //For select area
            areaSelected(d){
                this.area = null;
                this.filter.area_id = '';
                this.warehouse = null;
                this.filter.warehouse_id = '';
                this.clearWarehouse = true
                this.disabled_warehouse = true
                if(d !== '' && d !== undefined){
                    this.area = d;
                    this.filter.area_id = d.id;
                    this.warehouse = null;
                    this.filter.warehouse_id = '';
                    this.disabled_warehouse = false;
                    this.clearWarehouse = false;
                }
                this.renderData(this.search)
            },
            //For select warehouse
            warehouseSelected(d) {
                this.warehouse = null;
                this.filter.warehouse_id = '';
                if (d !== ''  && d !== undefined) {
                    this.warehouse = d;
                    this.filter.warehouse_id = d.id
                }
                this.renderData(this.search)
            },
            //For select category
            categorySelected(d) {
                this.categories = null;
                this.filter.category_id = '';
                if (d){
                    this.categories = d;
                    this.filter.category_id = d.id
                }
                this.renderData(this.search)
            },
        },
        watch: {
            'search': {
                handler: function (search) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function(){ 
                        that.renderData(search,that.filter.area_id,that.filter.warehouse_id,that.salables,that.purchasables)
                    }, 1000);
                },
                deep: true
            }
        },
    }
</script>
