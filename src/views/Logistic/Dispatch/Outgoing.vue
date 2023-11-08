<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="mtn24">
                <SelectCourier
                    name="courier"
                    @selected="courierSelected"
                    :dense="true"
                ></SelectCourier>
            </v-col>
            <v-col cols="12" md="6" class="mtn24">
                <v-text-field
                    name="vehicle_type"
                    v-model="vehicle_type"
                    required
                    disabled
                    dense
                    outlined
                >
                    <template v-slot:label>
                        Vehicle Type
                    </template>
                </v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="mtn24">
                <v-text-field
                    name="vehicle_number"
                    v-model="vehicle_number"
                    required
                    outlined
                    disabled
                    dense
                >
                <template v-slot:label>
                    Vehicle Number
                </template>
            </v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="mtn24">
                <v-text-field
                    name="vendor"
                    v-model="vendor"
                    required
                    outlined
                    disabled
                    dense
            >
                <template v-slot:label>
                    Vendor
                </template>
            </v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="mtn24">
                <v-text-field
                    name="koliweight"
                    v-model="koliWeightTotal"
                    required
                    outlined
                    disabled
                    dense
                >
                    <template v-slot:label>
                        Koli &amp; Weight Total
                    </template>
                </v-text-field>
            </v-col>
            </v-row>
        </div>
        <div class="box-start">
            <v-row>
                <v-col class="mt-2" cols="4">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }" v-privilege="'filter_rdl'">
                            <v-text-field
                                v-model="search_planning"
                                append-icon="search"
                                name="search_planning"
                                label="Search planning.."
                                single-line
                                hide-details
                                style="margin-top:-10px;"
                                v-on="{ ...tooltip }"
                                outlined
                                dense
                            >
                            </v-text-field>
                        </template>
                        <span>Search Planning</span>
                    </v-tooltip>
                </v-col>
                <v-col class="mt-2" cols="4" offset="4">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }" v-privilege="'filter_rdl'">
                            <v-text-field
                                ref="searchSO"
                                v-model="search"
                                append-icon="mdi-qrcode-scan"
                                name="search"
                                label="Sales Order Code"
                                single-line
                                hide-details
                                style="margin-top:-10px;"
                                v-on="{ ...tooltip }"
                                outlined
                                dense
                                :disabled="disScan"
                            >
                            </v-text-field>
                        </template>
                        <span>Scan QR Code</span>
                    </v-tooltip>
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table">
            Outgoing
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
                        <td>{{ props.item.sales_order.code }}</td>
                        <td>{{ props.item.sales_order.branch.merchant.name }}</td>
                        <td>{{ props.item.sales_order.shipping_address }}</td>
                        <td v-if=" props.item.planning_vendor !== ''">
                            {{ props.item.planning_vendor }}
                        </td>
                        <td v-else> - </td>
                        <td>{{ props.item.total_scan_dispatch }} / {{ props.item.total_koli }}</td>
                        <td>
                            <div v-if="props.item.dispatch_status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                    :text-color="statusMasterText('active')"
                                ><span class="pa-md-2">New</span></v-chip>
                            </div>
                            <div v-else-if="props.item.dispatch_status == 2">
                                <v-chip
                                    :color="statusMaster('finished')"
                                    :text-color="statusMasterText('finished')"
                                ><span class="pa-md-2">Finished</span></v-chip>
                            </div>
                            <div v-else-if="props.item.dispatch_status == 3">
                                <v-chip
                                    :color="statusMaster('on_process')"
                                    :text-color="statusMasterText('on_process')"
                                ><span class="pa-md-2"> On Progress </span></v-chip>
                            </div>
                        </td>
                        <td>
                        <v-tooltip top>
                            <template v-slot:activator="{ on: tooltip }">
                            <v-btn
                                tile
                                elevation="0"
                                class="no-caps mr-3"
                                color="white"
                                v-on="{ ...tooltip }"
                                @click="resetScanned(props.item.sales_order.code)"
                            >
                                <v-icon>mdi-refresh</v-icon>
                            </v-btn>
                            </template>
                            <span>Reset scan koli</span>
                        </v-tooltip>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
    </v-container>
</template>
<script>
    import Vue from 'vue'
    export default {
        name: 'Outgoing',
        data () {
            return {
                table: {
                    fields: [
                        {
                            text:'Sales Order Code',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Customer',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Shipping Address',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Planning',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Scanned',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Status',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            width:'2%',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                    ],
                },
                items:[],
                loading: false,
                SelectCourier: '',
                courier_name: '',
                vehicle_type: '',
                vehicle_number: '',
                vendor: '',
                koliWeightTotal: '',
                koli: '',
                search: '',
                search_planning: '',
                disScan: true
            }
        },
        computed: {
            //count koli and weight
            countKoliWeight() {
                if(this.items !== null){
                    var countKoli = this.items.reduce((acc, item) => acc + item.total_koli, 0);
                    var countWeight = this.items.reduce((acc, item) => acc + item.sales_order.total_weight, 0);
                    this.koliWeightTotal = countKoli + ' / ' + countWeight + ' KG'
                }else{
                    this.koliWeightTotal = 'No Data'
                }
                return this.koliWeightTotal
            },
        },
        mounted(){
            this.$nextTick(() => this.$refs.searchSO.focus())
        },
        methods:{
            //reset scanned so code on field
            resetScanned(code){
                this.$http.put("/logistic/dispatch/scan", {
                    sales_order_code : code,
                    type_request : 'reset'
                }).then(res => {
                    this.renderData(this.search_planning)
                })
            },
            //scan and add to scanned field on table
            scanBarcode(){
                this.$http.put("/logistic/dispatch/scan", {
                    sales_order_code : this.search,
                    type_request : 'scan'
                }).then(res => {
                    this.renderData(this.search_planning)
                })
            },
            //render data table
            renderData(search_planning){
                this.loaded = false
                this.loading = true
                let courier = ''
                if(this.SelectCourier){
                    courier = '|courier.id.e:'+this.SelectCourier
                }
                this.$http.get("/logistic/dispatch",{params:{
                        conditions:'status:2'+courier+'|planning_vendor.icontains:'+search_planning,
                        orderby:'-id',
                    }}).then(response => {
                    this.loading = false
                    this.items = response.data.data
                    this.countKoliWeight
                    this.search = ""
                    if(this.items == null){
                        this.items = []
                    }
                });

            },
            //select courier based on id
            courierSelected(d) {
                this.SelectCourier = ""
                if (d) {
                    this.disScan = false
                    this.SelectCourier = d.id
                    this.vehicle_type = d.vehicle_type
                    this.vehicle_number = d.license_plate
                    this.vendor = d.courier_vendor.name
                    this.renderData(this.search_planning)
                }else{
                    this.disScan = true
                    this.items = []
                    this.koliWeightTotal = 'No Data'
                }
            },   
        },
        watch: {
            //watch search when changes
            'search': {
                handler: function (val) {
                    let that = this
                    if(val !== ""){
                        clearTimeout(this._timerId)
                        this._timerId = setTimeout(function(){
                            that.scanBarcode()
                        }, 100);
                    }else{
                        this.renderData(this.search_planning)
                    }
                },
                deep: true
            },
            //watch search planning when changes
            'search_planning': {
                handler: function (val) {
                    let that = this
                    if(val !== ""){
                        clearTimeout(this._timerId)
                        this._timerId = setTimeout(function(){
                            that.renderData(val)
                        }, 1000);
                    }else{
                        that.items = []
                    }
                    
                },
                deep: true
            },
        },
    }
</script>
