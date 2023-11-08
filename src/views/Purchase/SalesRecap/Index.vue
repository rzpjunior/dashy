<template>
    <v-container class="Heiti px-12">
        <v-row class="mt-4">
            <v-col cols="12" md="3">
                <v-btn
                    class="px-7 ml-2 no-caps white--text"
                    elevation="0"
                    rounded
                    :disabled="disabledCreate"
                    style="background: #768f9c; height:45px"
                    @click="createPO()"
                    v-privilege="'po_crt'"
                >Create PO</v-btn>
            </v-col>
            <v-col cols="12" md="3">
                <v-text-field
                    prepend-inner-icon="mdi-calendar"
                    outlined
                    disabled
                    v-model="delivery_date_input"
                    class="rounded-form"
                >
                    <template v-slot:label>
                        Order Delivery Date
                    </template>
                </v-text-field>
            </v-col>
            <v-col cols="12" md="3">
                <SelectWarehouse
                    :norequired="true"
                    :aux_data="2"
                    :warehouse="warehouse"
                    @selected="warehouseSelected"
                ></SelectWarehouse>
            </v-col>
            <v-col cols="12" md="3">
                <SelectCategory
                    :norequired="true"
                    v-model="categories"
                    @selected="categorySelected"
                    :category="categories"
                ></SelectCategory>
            </v-col>
        </v-row>
        <div class="d-flex justify-end mb-2" style="margin-top:-35px" v-privilege="'stc_upd_cmt'">
            <v-btn
                tile
                elevation="0"
                class="no-caps mr-3"
                color="white"
                @click="refreshData()"
            >
                <v-icon left>mdi-refresh</v-icon>
                Refresh Data
            </v-btn>
        </div>
        <div class="title-table mb-2">
            <v-row>
                <v-col>
                    <label class="label-title">
                        Sales Recap
                    </label>
                </v-col>
                <v-col class="d-flex justify-end align-center">
                    <span class="fs12" style="color:white">Last updated at {{this.$moment(last_updated).format('DD/MM/YYYY HH:mm:ss')}} &nbsp; </span>
                    <v-tooltip color="black" bottom>
                        <template v-slot:activator="{ on: tooltip }">
                            <v-icon v-on="{ ...tooltip }" color="white">mdi-alert-circle-outline</v-icon>
                        </template>
                        <span> 
                            Sum SO Qty : Sum of Active & Invoiced not Delivered & Paid not Delivered SO Order Qty for a product, <br>
                            in selected Warehouse, with Order Delivery Date = Date Value (exclude SO Active PBD<br><br>

                            Sum PO Qty : Sum of Active PO (with no Finished GR yet) <br>
                            Order Qty for a product, in selected Warehouse, with ETA Date = Today's Date<br><br>

                            Expected Remaining Stock : (Sum PO Qty + Available Stock) - Sum SO Qty<br><br>

                            Spare Qty : Product Spare Percentage * Sum SO Qty<br><br>

                            1 Week Demand : Sum SO Qty on the same day in last week<br><br>

                            2 Week Demand : Sum SO Qty on the same day in last 2 weeks<br><br>

                            Average 2 Week Demand : (1 Week Demand + 2 Week Demand) / 2
                        </span>
                    </v-tooltip>
                </v-col>
            </v-row>
        </div>
        <v-data-table
            id="nopadding"
            :headers="table.fields"
            :items="items"
            height="450px"
            fixed-header
            :loading="loading"
            :hide-default-footer="true"
            :items-per-page="-1"
            mobile-breakpoint="0"
        >
            <template v-slot:item="props">
                <tr>
                    <td>
                        <v-checkbox
                            v-model="po_create"
                            multiple
                            :value="props.item"
                            color="#50AE55"
                        ></v-checkbox>
                    </td>
                    <td>
                        {{ props.item.product.name }} <br>
                        <span class="fs12 second-color">{{ props.item.product.uom.name }}</span> 
                    </td>
                    <td class="ctr">{{ props.item.sum_so_qty }}</td>
                    <td class="ctr">{{ props.item.sum_po_qty }}</td>
                    <td class="ctr">{{ props.item.available_stock }}</td>
                    <td class="ctr">{{ props.item.expected_remaining_stock }}</td>
                    <td class="ctr">{{ props.item.spare_qty }}</td>
                    <td class="ctr">{{ props.item.week_1_demand }}</td>
                    <td class="ctr">{{ props.item.week_2_demand }}</td>
                    <td class="ctr">{{ props.item.week_avg_demand }}</td>
                </tr>
            </template>
        </v-data-table>
        <CreatePO :data="data_send"/>
        <v-overlay style="z-index: 6 !important;" :value="overlay">
            <v-progress-circular
                indeterminate
                size="84"
                color="green"
                width=15
            ></v-progress-circular>
        </v-overlay>
    </v-container>
</template>
<script>
    export default {
        name: "SalesRecap",
        data() {
            return {
                loading: false,
                table: {
                    fields: [
                        {
                            width: "1%",
                            sortable: false
                        },
                        {
                            text:'Product',
                            sortable: false
                        },
                        {
                            text:'Sum SO Qty',
                            align: 'center',
                            sortable: false
                        },
                        {
                            text:'Sum PO Qty',
                            align: 'center',
                            sortable: false
                        },
                        {
                            text:'Available Stock',
                            align: 'center',
                            sortable: false
                        },
                        {
                            text:'Expected Remaining Stock',
                            align: 'center',
                            sortable: false
                        },
                        {
                            text:'Spare Qty',
                            align: 'center',
                            sortable: false
                        },
                        {
                            text:'1 Week Demand',
                            align: 'center',
                            sortable: false
                        },
                        {
                            text:'2 Week Demand',
                            align: 'center',
                            sortable: false
                        },
                        {
                            text:'Average 2 Week Demand',
                            align: 'center',
                            sortable: false
                        },
                    ],
                },
                po_create : [],
                data_send : {
                    modal : false,
                    data : [],
                    warehouse : {}
                },
                items:[],
                delivery_date_input : '',
                warehouse : '',
                categories : '',
                overlay: false,
                filter :{},
                error : {},
                last_updated : '',
                dayoff : '',
                date : new Date(Date.now() + ( 3600 * 1000 * 31)).toISOString().substr(0, 10)
            }
        },
        computed : {
            disabledCreate() {
                if (this.po_create.length == 0 || !this.warehouse) {
                    return true
                } else {
                    return false
                }
            }
        },
        created() {
            this.getLastUpdated()
            this.checkDate(this.date)
            let self = this
            setTimeout(function(){
                self.warehouseSelected({
                    "id": "720896",
                    "area" : {
                        "id" : "131072"
                    },
                    "first":"1"
                })
             }, 100);
        },
        methods: {
            // Create PO
            createPO() {
                this.data_send = {
                    modal : true,
                    data : this.po_create,
                    warehouse : this.warehouse
                }
            },
            // For trigger refresh data
            refreshData() {
                this.overlay = true
                this.$http.put("/warehouse/stock/update_commited").then(response => {
                    this.getLastUpdated()
                    this.renderData()
                    this.overlay = false
                });
            },
            // For trigger get last update timestamp
            getLastUpdated() {
                this.$http.get("/config/app?conditions=attribute.icontains:lst_stc_upd_cmt").then(response => {
                    this.last_updated = response.data.data[0].value
                });
            },
            // check dayoff
            checkDate(date) {
                this.dayoff = 'checkdate'
                this.$http.get("/config/day_off",{params:{
                        conditions:'off_date:'+date
                    }}).then(response => {
                    if(response.data.data == null){
                        this.dayoff = false
                    } else {
                        this.dayoff = true
                    }
                })
            },
            // For select warehouse filter
            warehouseSelected(d) {
                this.warehouse = null
                if (d) {
                    this.warehouse = d
                }
                this.renderData()
            },
            // For select categories filter
            categorySelected(d) {
                this.categories = null;
                if (d) {
                    this.categories = d;
                }
                this.renderData()
            },
            // For get data index
            renderData(){
                if (this.warehouse) {
                    let warehouse = ''
                    if (this.warehouse) {
                        warehouse = this.warehouse.id
                    }
                    let category = ''
                    if (this.categories) {
                        category = this.categories.id
                    }
                    let delivery_date = ''
                    if (this.delivery_date_input) {
                        delivery_date=this.delivery_date_input
                    }
                    this.items =[]
                    this.po_create =[]
                    this.loading = true;
                    this.$http.get("/purchase/sales_recap",{params:{
                            embeds : 'product,product.uom',
                            orderby:'expected_remaining_stock',
                            category:category,
                            warehouse:warehouse,
                            delivery_date:delivery_date,
                        }}).then(response => {
                        this.loading = false;
                        this.items = response.data.data
                        if(this.items === null){
                            this.items = []
                        }
                    });
                } else {
                    this.items = []
                }
            },
        },
        watch : {
            dayoff : {
                handler: function (val) {
                    if (val == true) {
                        let newdate = this.$moment(this.date, "YYYY-MM-DD").add(1, 'days')
                        this.date = this.$moment(newdate).format("YYYY-MM-DD")
                        this.checkDate(this.date)
                    } else if (val == false) {
                        this.delivery_date_input = this.date
                        this.renderData()
                    }
                },
                deep: true
            },
        }
    }
</script>