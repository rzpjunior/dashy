<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="-mb38">
                <v-col cols="12" md="6" class="-mt24">
                    <v-radio-group
                        v-model="radio"
                        row
                    >
                        <v-radio
                            label="Filter by Date"
                            value="date"
                            @click="order_delivery_date_input = new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10), order_delivery_date = [new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10)]"
                        ></v-radio>
                        <v-radio
                            label="Filter by Week Number"
                            value="week"
                            @click="week_date_input = ''"
                        ></v-radio>
                    </v-radio-group>
                </v-col>
            </v-row>
            <v-row :class="radio =='date'?'-mb38':'-mb20'">
                <v-col cols="12" md="4">
                    <SelectWarehouse
                        :aux_data="2"
                        :dense="true"
                        :warehouse="warehouse"
                        @selected="warehouseSelected"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="4" v-if="radio =='date'">
                    <v-menu
                        ref="menu"
                        v-model="order_delivery_date_model"
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
                                    maxlength="24"
                                    @click:clear="order_delivery_date = [],order_delivery_date_input =''"
                                    v-model="order_delivery_date_input"
                                    dense
                                >
                                    <template v-slot:label>
                                        Order Delivery Date <span style="color:red">*</span>
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            min="2021-11-15"
                            v-model="order_delivery_date"
                            range
                            scrollable
                        >
                        </v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="4" v-if="radio =='week'" >
                    <SelectWeekNumber
                        @selected="weekSelected"
                        :norequired="true"
                        :dense="true"
                    /> 
                    <div class="mtn24 fs14">
                        {{week_date_input}}
                    </div>
                </v-col>
                <v-col cols="12" md="4" class="right" v-privilege="'rpt_ful'">
                    <span class="text-black60 fs14">Download Yearly Report</span>
                    <v-btn
                        class="only-btn white--text ml-2"
                        depressed
                        color="#50ABA3"
                        @click="downloadReportMethod()"
                    >Download</v-btn>
                </v-col>
            </v-row>
        </div>
        <div class="box-start">
            <div class="fs14 right">
                <span v-if="data.last_updated_at != '0001-01-01T00:00:00Z'">
                    Data last updated at {{this.$moment(data.last_updated_at).format('DD/MM/YYYY HH:mm:ss')}} 
                </span>
                <span v-else>
                    No data available
                </span>
                <v-tooltip color="black" top>
                    <template v-slot:activator="{ on: tooltip }">
                        <v-icon v-on="{ ...tooltip }">mdi-alert-circle-outline</v-icon>
                    </template>
                    <span> 
                        If you believe there is an error in the data, <br> 
                        please contact the system administrator <br>
                        to force update the data.
                    </span>
                </v-tooltip>
            </div>
        </div>
        <div class="wp100 ma12">
            <v-row class="text-black60">
                <v-col cols="12" md="5">
                    <div v-if="loadingSummary">
                        <v-progress-linear
                            indeterminate
                            height="10"
                            color="#4ABFB2"
                        ></v-progress-linear>
                    </div>
                    <div class="box-col-header" v-if="!loadingSummary">
                        Fulfillment Summary
                    </div>
                    <div class="box-col-body" v-if="!loadingSummary">
                        <div>
                            <v-row class="bold">
                                <v-col cols="7">
                                    <div class="mt6 text-black">
                                        SO Fulfillment Rate
                                        <v-tooltip color="black" top>
                                            <template v-slot:activator="{ on: tooltip }">
                                                <v-icon v-on="{ ...tooltip }" color="#858585">mdi-alert-circle-outline</v-icon>
                                            </template>
                                            <span>
                                                ((Total SO - SO Unfulfilled)/Total SO) * 100 %
                                            </span>
                                        </v-tooltip>
                                    </div>
                                </v-col>
                                <v-col class="d-flex justify-end" cols="5">
                                    <div class="fs24" :class="data.fulfillment_rate >= 98 ? 'text-success':'text-red-presentase'">
                                        {{data.fulfillment_rate}} %
                                    </div>
                                </v-col>
                            </v-row>
                            <v-divider class="mt-3"></v-divider>
                        </div>
                        <div class="mt-4">
                            <v-row>
                                <v-col cols="7">
                                    <div>
                                        Total SO 
                                        <v-tooltip color="black" top>
                                            <template v-slot:activator="{ on: tooltip }">
                                                <v-icon v-on="{ ...tooltip }" color="#858585">mdi-alert-circle-outline</v-icon>
                                            </template>
                                            <span> 
                                                Distinct Count SO for selected Order Delivery Date <br>
                                                (Exclude SO Cancelled Regular & Deleted) 
                                            </span>
                                        </v-tooltip>
                                    </div>
                                </v-col>
                                <v-col class="d-flex justify-end" cols="5">
                                    <div class="text-black">
                                        {{data.total_so}}
                                    </div>
                                </v-col>
                            </v-row>
                            <v-divider class="mt-3"></v-divider>
                        </div>
                        <div class="mt-4">
                            <v-row>
                                <v-col cols="7">
                                    <div>
                                        SO Unfulfilled 
                                        <v-tooltip color="black" top>
                                            <template v-slot:activator="{ on: tooltip }">
                                                <v-icon v-on="{ ...tooltip }" color="#858585">mdi-alert-circle-outline</v-icon>
                                            </template>
                                            <span> 
                                                Distinct count unfulfilled SO <br> 
                                                (Exclude SO Cancelled Regular & Deleted)
                                            </span>
                                        </v-tooltip>
                                    </div>
                                </v-col>
                                <v-col class="d-flex justify-end" cols="5">
                                    <div class="text-black">
                                        {{data.total_so_unfulfilled}}
                                    </div>
                                </v-col>
                            </v-row>
                            <v-divider class="mt-3"></v-divider>
                        </div>
                        <div class="mt-4">
                            <v-row>
                                <v-col cols="7">
                                    <div>
                                        % SO Unfulfilled 
                                        <v-tooltip color="black" top>
                                            <template v-slot:activator="{ on: tooltip }">
                                                <v-icon v-on="{ ...tooltip }" color="#858585">mdi-alert-circle-outline</v-icon>
                                            </template>
                                            <span> 
                                                (SO Unfulfilled / Total SO ) * 100%
                                            </span>
                                        </v-tooltip>
                                    </div>
                                </v-col>
                                <v-col class="d-flex justify-end" cols="5">
                                    <div class="text-black">
                                        {{data.unfulfillment_rate}} %
                                    </div>
                                </v-col>
                            </v-row>
                            <v-divider class="mt-3"></v-divider>
                        </div>
                        <div class="mt-4">
                            <v-row>
                                <v-col cols="7">
                                    <div>
                                        Total Customer 
                                        <v-tooltip color="black" top>
                                            <template v-slot:activator="{ on: tooltip }">
                                                <v-icon v-on="{ ...tooltip }" color="#858585">mdi-alert-circle-outline</v-icon>
                                            </template>
                                            <span> 
                                                Distinct Count Customer with SO for <br>
                                                selected Order Delivery Date <br>
                                                (Exclude SO Cancelled Regular & Deleted). <br>
                                                If Order Delivery Date is selected in range, <br>
                                                then the same customer ordering on different dates <br>
                                                will be considered different customer.
                                            </span>
                                        </v-tooltip>
                                    </div>
                                </v-col>
                                <v-col class="d-flex justify-end" cols="5">
                                    <div class="text-black">
                                        {{data.total_cust}}
                                    </div>
                                </v-col>
                            </v-row>
                            <v-divider class="mt-3"></v-divider>
                        </div>
                        <div class="mt-4">
                            <v-row>
                                <v-col cols="7">
                                    <div>
                                        Customer Unfulfilled 
                                        <v-tooltip color="black" top>
                                            <template v-slot:activator="{ on: tooltip }">
                                                <v-icon v-on="{ ...tooltip }" color="#858585">mdi-alert-circle-outline</v-icon>
                                            </template>
                                            <span> 
                                                Distinct count unfulfilled Customer <br>
                                                (Exclude SO Cancelled Regular & Deleted). <br> 
                                                If Order Delivery Date is selected in range, <br>
                                                then the same customer ordering on different dates <br>
                                                will be considered different customer.
                                            </span>
                                        </v-tooltip>
                                    </div>
                                </v-col>
                                <v-col class="d-flex justify-end" cols="5">
                                    <div class="text-black">
                                        {{data.total_cust_unfulfilled}}
                                    </div>
                                </v-col>
                            </v-row>
                            <v-divider class="mt-3"></v-divider>
                        </div>
                        <div class="mt-4">
                            <v-row>
                                <v-col cols="7">
                                    <div>
                                        % Customer Fulfilled 
                                        <v-tooltip color="black" top>
                                            <template v-slot:activator="{ on: tooltip }">
                                                <v-icon v-on="{ ...tooltip }" color="#858585">mdi-alert-circle-outline</v-icon>
                                            </template>
                                            <span> 
                                                (100% - (Customer Fulfilled / Total Customer) * 100%)
                                            </span>
                                        </v-tooltip>
                                    </div>
                                </v-col>
                                <v-col class="d-flex justify-end" cols="5">
                                    <div class="text-black">
                                        {{data.cust_fulfillment_rate}} %
                                    </div>
                                </v-col>
                            </v-row>
                            <v-divider class="mt-3"></v-divider>
                        </div>
                        <div class="mt-4">
                            <v-row>
                                <v-col cols="7">
                                    <div>
                                        Product Unfulfilled 
                                        <v-tooltip color="black" top>
                                            <template v-slot:activator="{ on: tooltip }">
                                                <v-icon v-on="{ ...tooltip }" color="#858585">mdi-alert-circle-outline</v-icon>
                                            </template>
                                            <span> 
                                                Distinct count product Unfulfilled. <br> 
                                                If order delivery date is selected in range, <br> 
                                                then the same product unfulfilled on different dates <br> 
                                                will be considered different product.
                                            </span>
                                        </v-tooltip>
                                    </div>
                                </v-col>
                                <v-col class="d-flex justify-end" cols="5">
                                    <div class="text-black">
                                        {{data.total_prod_unfulfilled}}
                                    </div>
                                </v-col>
                            </v-row>
                            <v-divider class="mt-3"></v-divider>
                        </div>
                    </div>
                </v-col>
                <v-col cols="12" md="7">
                    <div v-if="loadingProduct">
                        <v-progress-linear
                            indeterminate
                            height="10"
                            color="#4ABFB2"
                        ></v-progress-linear>
                    </div>
                    <div class="box-col-header" v-if="!loadingProduct">
                        Unfulfilled Product
                    </div>
                    <div class="box-col-body-table" v-if="!loadingProduct">
                        <v-data-table
                            :headers="table.fields"
                            :items="items"
                            :loading="loadingProduct"
                            :items-per-page="5"
                            :hide-default-footer="true"
                            :page="page"
                        >
                            <template v-slot:item="props">
                                <tr style="height:48px">
                                    <td>{{ props.item.product }}</td>
                                    <td>{{ props.item.unfulfilled_so }}</td>
                                    <td>{{ props.item.unfulfilled_cust }}</td>
                                    <td>{{ props.item.unfulfilled_qty }}</td>
                                    <td>{{ props.item.uom }}</td>
                                </tr>
                            </template>
                        </v-data-table>
                        <hr class="hr-solid mx-3 -mt10">
                        <v-row class="mt-1">
                            <v-col>
                            <v-card-actions class="pb-1 pr-4">
                                <v-spacer></v-spacer>
                                    <v-btn
                                        class="main-btn white--text"
                                        depressed
                                        color="#50ABA3"
                                        @click="page -= 1"
                                        :disabled="disablePrevious"
                                    >Previous</v-btn>
                                    <v-btn
                                        class="main-btn white--text"
                                        depressed
                                        color="#50ABA3"
                                        @click="page += 1"
                                        :disabled="disableNext"
                                    >Next</v-btn>
                            </v-card-actions>
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
            </v-row>
        </div>
        <v-dialog
            v-model="downloadModel"
            persistent
            max-width="470px"
        >
            <LoadingBar :value="overlay"/>
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">Download Fulfillment Report</span>
                </v-card-title>
                <v-card-text>
                    <v-autocomplete
                        v-model="year"
                        :items="years"
                        name="Year"
                        placeholder="Select Year"
                        clearable
                        outlined
                        dense
                        class="mt-4"
                    >
                        <template v-slot:label>
                            <span>Year<span style="color:red">*</span></span>
                        </template>
                    </v-autocomplete>
                    <SelectWarehouse
                        :aux_data="2"
                        :dense="true"
                        :warehouse="warehouse2"
                        @selected="warehouseSelectedReport"
                    ></SelectWarehouse>
                </v-card-text>
                <v-card-actions class="pb-6 pr-6" style="margin-top:-20px">
                <v-spacer></v-spacer>
                    <v-btn
                        @click="downloadModel = false"
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                    >
                        <span class="text-black80">Cancel</span>
                    </v-btn>
                    <v-btn
                        class="only-btn white--text"
                        depressed
                        color="#50ABA3"
                        @click="downloadReport()"
                        :disabled="disableDownload"
                    >Download</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    export default {
        name: "Fulfillment",
        data() {
            return {
                radio : 'date',
                week_date_input :'',
                order_delivery_date_input : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                order_delivery_date_model : '',
                order_delivery_date : [new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10)],
                warehouse : '',
                warehouse2 : '',
                SelectWarehouse : '',
                SelectWarehouse2 : '',
                year : String(this.$moment(new Date(Date.now() + ( 3600 * 1000 * 7))).year()),
                years : [],
                overlay: false,
                downloadModel : false,
                loadingProduct: false,
                loadingSummary: false,
                table: {
                    fields: [
                        {
                            text:'Product',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'SO Unfulfilled',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Customer Unfulfilled',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Unfulfilled Qty',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'UOM',
                            class: 'grey--text text--darken-4',
                            width: "10%",
                            sortable: false
                        },
                    ],
                },
                items:[],
                data : {},
                page : 1,
                perpage : 5,
                totalData : 0,
            }
        },
        computed : {
            //For watch disable button Download
            disableDownload() {
                if (this.year && this.SelectWarehouse2) {
                    return false
                } else {
                    return true
                }
            },
            //For watch disable button Previous
            disablePrevious() {
                if (this.page == 1) {
                    return true
                } else {
                    return false
                }
            },
            //For watch disable button Next
            disableNext() {
                if (this.totalData <= (this.page*this.perpage)) {
                    return true
                } else {
                    return false
                }
            },
            //For get max Date
            maxDate() {
                if (this.order_delivery_date.length > 0) {
                    if (this.order_delivery_date.length == 1) {
                        return this.$moment(this.order_delivery_date[0], "YYYY-MM-DD").add(31, 'days').format("YYYY-MM-DD");
                    } 
                }
            },
            //For get min Date
            minDate() {
                if (this.order_delivery_date.length > 0) {
                    if (this.order_delivery_date.length == 1) {
                        return this.$moment(this.order_delivery_date[0], "YYYY-MM-DD").subtract(31, 'days').format("YYYY-MM-DD");
                    }
                }
            }
        },
        created() {
            let yr = this.$moment(new Date(Date.now() + ( 3600 * 1000 * 7))).year()
            for (let i = 2021; i <= yr; i++) {
                this.years.push(String(i))
            }
            let self = this
            setTimeout(function(){
                self.warehouseSelected({
                    "id": "720896"
                })
             }, 100);
        },
        methods: {
            // For trigger modal report 
            downloadReportMethod() {
                this.downloadModel = true
                let self = this
                setTimeout(function(){
                    self.warehouseSelectedReport(self.warehouse)
                }, 100);
            },
            // For download report 
            downloadReport() {
                if (this.SelectWarehouse2) {
                    this.overlay = true
                    this.$http.get("/dashboard/fulfillment/report?export=1",{params:{
                            year:this.year,
                            warehouse:this.SelectWarehouse2,
                        }}).then(response => {
                            this.overlay = false
                            this.downloadModel = false
                            window.location.href = response.data.file
                        }
                    );
                }
            },
            //For get data Fullfillment Summary
            getDataSummary(){
                if (this.SelectWarehouse && this.order_delivery_date_input) {
                    let order_delivery_date = ''
                    if (this.order_delivery_date.length > 0) {
                        if (this.order_delivery_date.length == 1) {
                            order_delivery_date = this.order_delivery_date[0]+"|"+this.order_delivery_date[0]
                        } else {
                            let date = this.order_delivery_date[0]
                            let date2 = this.order_delivery_date[1]
                            if (date > date2) {
                                order_delivery_date = date2+'|'+date
                            } else {
                                order_delivery_date = date+'|'+date2
                            }
                        }
                    }
                    let warehouse = ''
                    if (this.SelectWarehouse) {
                        warehouse = this.SelectWarehouse
                    }
                    this.loadingSummary = true
                    this.$http.get("/dashboard/fulfillment/summary",{params:{
                            date:order_delivery_date,
                            warehouse:warehouse,
                        }}).then(response => {
                            this.loadingSummary = false
                            this.data = response.data.data
                        }
                    );
                }
            },
            //For get data Unfulfilled Product
            getDataProduct(){
                if (this.SelectWarehouse && this.order_delivery_date_input) {
                    let order_delivery_date = ''
                    if (this.order_delivery_date.length > 0) {
                        if (this.order_delivery_date.length == 1) {
                            order_delivery_date = this.order_delivery_date[0]+"|"+this.order_delivery_date[0]
                        } else {
                            let date = this.order_delivery_date[0]
                            let date2 = this.order_delivery_date[1]
                            if (date > date2) {
                                order_delivery_date = date2+'|'+date
                            } else {
                                order_delivery_date = date+'|'+date2
                            }
                        }
                    }
                    let warehouse = ''
                    if (this.SelectWarehouse) {
                        warehouse = this.SelectWarehouse
                    }
                    this.loadingProduct = true
                    this.$http.get("/dashboard/fulfillment/product",{params:{
                            date:order_delivery_date,
                            warehouse:warehouse,
                        }}).then(response => {
                            this.loadingProduct = false
                            let item = response.data.data
                            if(item === null){
                                this.totalData = 0
                                this.items = []
                            } else {
                                this.items = item
                                this.totalData = response.data.data.length
                            }
                        }
                    );
                }
            },
            // For select week filter
            weekSelected(d) {
                this.week_date_input = ''
                if (d) {
                    this.order_delivery_date = [d.start, d.end]
                    this.week_date_input = d.start+' to '+d.end
                    this.order_delivery_date_input = d.start+' to '+d.end
                }
            },
            // For select warehouse filter
            warehouseSelected(d) {
                this.SelectWarehouse = ""
                this.warehouse = null
                if (d) {
                    this.warehouse = d
                    this.SelectWarehouse = d.id
                    this.page = 1
                    this.getDataSummary()
                    this.getDataProduct()
                }
            },
            
            // For select warehouse filter in report
            warehouseSelectedReport(d) {
                this.SelectWarehouse2 = ""
                this.warehouse2 = null
                if (d) {
                    this.warehouse2 = d
                    this.SelectWarehouse2 = d.id
                }
            },
        },
        watch: {
            'order_delivery_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.order_delivery_date[0] = this.$moment(val).format('YYYY-MM-DD')
                                this.page = 1
                                this.getDataSummary()
                                this.getDataProduct()
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0,10)
                            let date2 = val.substr(14,23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                this.order_delivery_date[0] = this.$moment(date1).format('YYYY-MM-DD')
                                this.order_delivery_date[1] = this.$moment(date2).format('YYYY-MM-DD')
                                this.page = 1
                                this.getDataSummary()
                                this.getDataProduct()
                            }
                        }
                    }
                },
                deep: true
            },
            'order_delivery_date': {
                handler: function (val) {
                    if (val) {
                        this.order_delivery_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
        },
    }
</script>
