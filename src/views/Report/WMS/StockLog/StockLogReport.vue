<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="-mb38">
                <v-col cols="12" md="9">
                    <v-row>
                        <v-col cols="12" md="4" class="-mb30">
                            <SelectWarehouse
                                name="filter_warehouse"
                                @selected="warehouseSelected"
                                :dense="true"
                            ></SelectWarehouse>
                        </v-col>
                        <v-col cols="12" md="4" class="-mb30">
                            <v-menu
                                ref="menu"
                                v-model="created_at_date_model"
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
                                            name="filter_createdat"
                                            @click:clear="created_at_date = [],created_at_date_input = ''"
                                            v-model="created_at_date_input"
                                            maxlength="24"
                                            dense
                                        >
                                            <template v-slot:label>
                                                Created At<span class="text-red">*</span>
                                            </template>
                                        </v-text-field>
                                    </div>
                                </template>
                                <v-date-picker
                                    range
                                    persistent-hint
                                    v-model="created_at_date"
                                >
                                <v-spacer></v-spacer>
                                    <v-btn
                                        text
                                        color="primary"
                                        @click="created_at_date_model = false"
                                    >OK</v-btn>
                                </v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col cols="12" md="4" class="-mb30">
                            <v-select
                                name="filter_logtype"
                                v-model="SelectLogType"
                                :items="optionLogType"
                                dense
                                label="Log Type"
                                outlined
                            ></v-select>
                        </v-col>
                        <v-col cols="12" md="12">
                            <v-row>
                                <v-col cols="12" md="4" class="-mb30">
                                    <v-select
                                        name="filter_reftype"
                                        v-model="SelectRefType"
                                        :items="optionRefType"
                                        dense
                                        label="Ref Type"
                                        outlined
                                    ></v-select>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <SelectProduct
                                        name="filter_product"
                                        @selected="productSelected"
                                        :dense="true"
                                    ></SelectProduct>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12" md="3" class="h70 flex-align-end mb30">
                    <v-btn
                        class="only-btn white--text px-10 py-5"
                        depressed
                        color="#50ABA3"
                        elevation="0"
                        @click="downloadReport()"
                        :disabled="disableButton"
                        v-privilege="'wrh_rpt_6_dl'"
                    >Download</v-btn>
                </v-col>
            </v-row>
        </div>
        <v-col cols="12" md="12">
            <v-layout justify-center>
                <v-card-actions>
                    <v-img
                    width="350"
                    src="/img/reportpacking.png"
                ></v-img>
                </v-card-actions>
            </v-layout>
            <v-layout justify-center>
                <span class="fs24 bold">Please download to view data</span>
            </v-layout>
        </v-col>
        <LoadingBar :value="overlay"/>
    </v-container>
</template>

<script>
    export default {
        name: "ReportSO",
        data() {
            return {
                created_at_date_input : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                search: '',
                created_at_date_model : '',
                created_at_date : [new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10)],
                loading: false,
                statuses:999,
                datetype:1,
                SelectLogType : '',
                SelectWarehouse : '',
                SelectProduct: '',
                SelectRefType : '',
                SelectProduct : '',
                optionRefType:[
                    {
                        text:'Delivery Order',
                        value:1
                    },
                    {
                        text:'Delivery Return',
                        value:2
                    },
                    {
                        text:'Goods Receipt',
                        value:3
                    },
                    {
                        text:'Goods Transfer',
                        value:4
                    },
                    {
                        text:'Stock Opname',
                        value:5
                    },
                    {
                        text:'Waste Entry',
                        value:6
                    },
                    {
                        text:'Transfer SKU',
                        value:7
                    }
                ],
                optionLogType:[
                    {
                        text:'IN',
                        value:1
                    },
                    {
                        text:'OUT',
                        value:2
                    },

                ],
                overlay: false,
                clearArea: false,
            }
        },
        computed : {
            //disabling the button when the condition not fulfill
            disableButton() {
                if (this.SelectWarehouse && this.created_at_date_input) {
                    return false
                } else {
                    return true
                }
            },
        },
        methods: {
            //function for download report
            downloadReport(){
                this.overlay = true
                let created_at_date = ''
                    if (this.created_at_date.length > 0) {
                        if (this.created_at_date.length == 1) {
                            created_at_date = this.created_at_date[0]+'|'+this.created_at_date[0]
                        } else {
                            let date = this.created_at_date[0]
                            let date2 = this.created_at_date[1]
                            if (date > date2) {
                                created_at_date = date2+'|'+date
                            } else {
                                created_at_date = date+'|'+date2
                            }
                        }
                    }
                let warehouse = ''
                if (this.SelectWarehouse) {
                    warehouse = this.SelectWarehouse
                }

                let product = ''
                if (this.SelectProduct) {
                    product = this.SelectProduct
                }

                this.$http.get("/report/wms/stock-log?export=1",{params:{
                        type:this.SelectLogType,
                        ref_type:this.SelectRefType,
                        warehouse:warehouse,
                        created_at:created_at_date,
                        product:product
                    }}).then(response => {
                        this.overlay = false
                        window.location.href = response.data.file
                }).catch(e => {
                    this.overlay = false
                    Vue.$toast.open({
                        position: 'top-right',
                        message: 'Something Wrong',
                        type: 'error',
                    });
                });
            },
            //function select warehouse to get warehouse id
            warehouseSelected(d) {
                this.SelectWarehouse = ""
                if (d) {
                    this.SelectWarehouse = d.id
                }
            },
            //function select product to get product id
            productSelected(d) {
                this.SelectProduct = ""
                if (d) {
                    this.SelectProduct = d.id
                }
            },
        },
        //watch for date range
        watch: {
            'created_at_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.delivery_date[0] = this.$moment(val).format('YYYY-MM-DD')

                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0,10)
                            let date2 = val.substr(14,23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                // this.delivery_date[0] = this.$moment(date1).format('YYYY-MM-DD')
                                // this.delivery_date[1] = this.$moment(date2).format('YYYY-MM-DD')
                                if (this.created_at_date.length == 2) {
                                    let date3 = new Date(this.created_at_date[0])
                                    let date4 = new Date(this.created_at_date[1])
                                    if (parseInt((date4-date3)/(24*3600*1000)) > 14 || parseInt((date4-date3)/(24*3600*1000)) < -14) {
                                        if (date4 < date3) {
                                            this.created_at_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                            this.created_at_date.splice(1,1)
                                        } else {
                                            this.created_at_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                            this.created_at_date.splice(1,1)
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                deep: true
            },
            'created_at_date': {
                handler: function (val) {
                    if (val) {
                        this.created_at_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
        },
    }
</script>
