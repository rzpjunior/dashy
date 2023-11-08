<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="-mb38">
                <v-col cols="12" md="9">
                    <v-row>
                        <v-col cols="12" md="4" class="-mb30">
                            <SelectArea
                                @selected="areaSelected"
                                :aux_data="2"
                                :clear="clearArea"
                                :dense="true"
                            ></SelectArea>
                        </v-col>
                        <v-col cols="12" md="4" class="-mb30">
                            <SelectWarehouse
                                :norequired="true"
                                :aux_data="2"
                                :disabled="area"
                                :warehouse="warehouse"
                                :area_id="SelectArea"
                                @selected="warehouseSelected"
                                :dense="true"
                            ></SelectWarehouse>
                        </v-col>
                        <v-col cols="12" md="4" class="-mb30">
                            <SelectSupplier
                                :norequired="true"
                                @selected="supplierSelected"
                                :dense="true"
                            ></SelectSupplier>
                        </v-col>
                        <v-col cols="12" md="12">
                            <v-row>
                                <v-col cols="12" md="4" class="-mb30">
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
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on: tooltip }">
                                                        <div v-on="{ ...tooltip}">
                                                            <v-text-field
                                                                prepend-inner-icon="mdi-calendar"
                                                                outlined
                                                                clearable
                                                                maxlength="24"
                                                                @click:clear="eta_date = [],eta_date_input =''"
                                                                v-model="eta_date_input"
                                                                dense
                                                            >
                                                                <template v-slot:label>
                                                                    ETA Date<span class="text-red">*</span>
                                                                </template>
                                                            </v-text-field>
                                                        </div>
                                                    </template>
                                                <span>Estimated Arrival Date</span>
                                                </v-tooltip>
                                            </div>
                                        </template>
                                        <v-date-picker
                                            range
                                            v-model="eta_date"
                                        >
                                            <v-spacer></v-spacer>
                                            <v-btn
                                                text
                                                color="primary"
                                                @click="eta_date_model = false"
                                            >
                                                OK
                                            </v-btn>
                                        </v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col cols="12" md="4">
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
                                                    maxlength="24"
                                                    @click:clear="order_date = [],order_date_input =''"
                                                    v-model="order_date_input"
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
                                            v-model="order_date"
                                        >
                                            <v-spacer></v-spacer>
                                            <v-btn
                                                text
                                                color="primary"
                                                @click="order_date_model = false"
                                            >
                                                OK
                                            </v-btn>
                                        </v-date-picker>
                                    </v-menu>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12" md="3" class="flex-align-end mb30">
                    <v-btn
                        class="only-btn white--text px-10 py-5"
                        depressed
                        color="#50ABA3"
                        elevation="0"
                        @click="downloadReport()"
                        :disabled="disableButton"
                        v-privilege="'src_rpt_3_dl'"
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
                <span class="fs24 bold">Please Download to View Data</span>
            </v-layout>
        </v-col>
        <LoadingBar :value="overlay"/>
    </v-container>
</template>

<script>
import LoadingBar from '../../../../components/com-new/LoadingBar.vue'
    export default {
  components: { LoadingBar },
        name: "ReportSO",
        data() {
            return {
                order_date_input : '',
                order_date_model : '',
                order_date : [],
                eta_date_input : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                eta_date_model : '',
                eta_date : [new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10)],
                SelectArea : '',
                area : true,
                warehouse : '',
                SelectWrt : '',
                SelectWarehouse : '',
                SelectSupplier : '',
                outlet : false,
                overlay: false,
                clearArea: false,
            }
        },
        computed : {
            //For watch disable download
            disableButton() {
                if (this.SelectArea && this.eta_date_input) {
                    return false
                } else {
                    return true
                }
            }
        },
        methods: {
            //For download report
            downloadReport(){
                let area = ''
                if (this.SelectArea) {
                    area = this.SelectArea
                }
                let order_date = ''
                if (this.order_date.length > 0) {
                    if (this.order_date.length == 1) {
                        order_date = this.order_date[0]+'|'+this.order_date[0]
                    } else {
                        let date = this.order_date[0]
                        let date2 = this.order_date[1]
                        if (date > date2) {
                            order_date = date2+'|'+date
                        } else {
                            order_date = date+'|'+date2
                        }
                    }
                }
                let eta_date = ''
                if (this.eta_date.length > 0) {
                    if (this.eta_date.length == 1) {
                        eta_date = this.eta_date[0]+'|'+this.eta_date[0]
                    } else {
                        let date = this.eta_date[0]
                        let date2 = this.eta_date[1]
                        if (date > date2) {
                            eta_date = date2+'|'+date
                        } else {
                            eta_date = date+'|'+date2
                        }
                    }
                }
                let warehouse = ''
                if (this.SelectWarehouse) {
                    warehouse = this.SelectWarehouse
                }
                let supplier = ''
                if (this.SelectSupplier) {
                    supplier = this.SelectSupplier
                }
                this.overlay = true
                this.$http.get("/report/sms/purchase-order-item?export=1",{params:{
                        area:area,
                        order_date:order_date,
                        warehouse:warehouse,
                        eta_date:eta_date,
                        supplier:supplier
                    }}).then(response => {
                        this.overlay = false
                        window.location.href = response.data.file
                });
            },
            // For select area filter
            areaSelected(d) {
                this.SelectArea = ""
                this.clearArea = true
                this.area = true
                this.warehouse = d
                this.warehouse = null
                this.SelectWarehouse = ""
                if (d) {
                    this.area = false
                    this.clearArea = false
                    this.SelectArea = d.id
                }
            },
            // For select warehouse filter
            warehouseSelected(d) {
                this.SelectWarehouse = ""
                this.warehouse = null
                if (d) {
                    this.warehouse = d
                    this.SelectWarehouse = d.id
                }
            },
            // For select supplier filter
            supplierSelected(d) {
                this.SelectSupplier = ""
                if (d) {
                    this.SelectSupplier = d.id
                }
            },
        },
        watch: {
            'order_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.order_date[0] = this.$moment(val).format('YYYY-MM-DD')
                                
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
