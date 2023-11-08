<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="-mb38">
                <v-col cols="12" md="9">
                    <v-row>
                        <v-col cols="12" md="4" class="-mb30">
                            <SelectWarehouse
                                @selected="warehouseOriginSelected"
                                :dense="true"
                                :norequired="true"
                                :label="'Warehouse Origin'"
                            ></SelectWarehouse>
                        </v-col>
                        <v-col cols="12" md="4" class="-mb30">
                            <SelectWarehouse
                                @selected="warehouseDestinationSelected"
                                :dense="true"
                                :norequired="true"
                                :label="'Warehouse Destination'"
                            ></SelectWarehouse>
                        </v-col>
                        <v-col cols="12" md="4" class="-mb30">
                            <v-menu
                                ref="menu"
                                v-model="gt_date_model"
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
                                            @click:clear="gt_date = [],gt_date_input = ''"
                                            v-model="gt_date_input"
                                            maxlength="24"
                                            dense
                                        >
                                            <template v-slot:label>
                                                Goods Transfer Date<span class="text-red">*</span>
                                            </template>
                                        </v-text-field>
                                    </div>
                                </template>
                                <v-date-picker
                                    range
                                    persistent-hint
                                    :available-dates='{ start: new Date(), end: null }'
                                    v-model="gt_date"
                                >
                                <v-spacer></v-spacer>
                                    <v-btn
                                        text
                                        color="primary"
                                        @click="gt_date_model = false"
                                    >OK</v-btn>
                                </v-date-picker>
                            </v-menu>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12" md="3" class="flex-align-end mb30">
                    <v-btn
                        class="only-btn white--text px-10 py-5"
                        depressed
                        color="#50ABA3"
                        :disabled="disableButton"
                        @click="downloadReport()"
                        v-privilege="'wrh_rpt_12_dl'"
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
        name: "ReportGoodsTransferItem",
        data() {
            return {
                gt_date_input : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                search: '',
                gt_date_model : '',
                gt_date : [new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10)],
                loading: false,
                statuses:999,
                datetype:1,
                warehouse_origin : '',
                warehouse_destination: '',
                overlay: false,
                clearArea: false,
            }
        },
        computed : {
            //disabling the button when the condition not fulfill
            disableButton() {
                if (this.warehouse_origin && this.warehouse_destination && this.gt_date_input) {
                    if (this.warehouse_origin == this.warehouse_destination) {
                        return true
                    }
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
                let gt_date = ''
                if (this.gt_date.length > 0) {
                    if (this.gt_date.length == 1) {
                        gt_date = this.gt_date[0]+'|'+this.gt_date[0]
                    } else {
                        let date = this.gt_date[0]
                        let date2 = this.gt_date[1]
                        if (date > date2) {
                            gt_date = date2+'|'+date
                        } else {
                            gt_date = date+'|'+date2
                        }
                    }
                }
                this.$http.get("/report/wms/goods-transfer-item?export=1",{params:{
                        recognition_date:gt_date,
                        warehouse_origin:this.warehouse_origin,
                        warehouse_destination:this.warehouse_destination,
                    }}).then(response => {
                        this.overlay = false
                        window.location.href = response.data.file
                }).catch(e => {
                    console.log(e)
                    this.overlay = false
                    Vue.$toast.open({
                        position: 'top-right',
                        message: 'Something Wrong',
                        type: 'error',
                    });
                });
            },
            //function select warehouse to get warehouse origin id
            warehouseOriginSelected(d) {
                this.warehouse_origin = ""
                if (d) {
                    this.warehouse_origin = d.id
                }
            },
            //function select warehouse to get warehouse destination id
            warehouseDestinationSelected(d) {
                this.warehouse_destination = ""
                if (d) {
                    this.warehouse_destination = d.id
                }
            },
        },
        //watch for date range
        watch: {
            'gt_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.gt_date[0] = this.$moment(val).format('YYYY-MM-DD')

                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0,10)
                            let date2 = val.substr(14,23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                let date3 = new Date(this.gt_date[0])
                                let date4 = new Date(this.gt_date[1])
                                if (parseInt((date4-date3)/(24*3600*1000)) > 6 || parseInt((date4-date3)/(24*3600*1000)) < -6) {
                                    if (date4 < date3) {
                                        this.gt_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                        this.gt_date.splice(1,1)
                                    } else {
                                        this.gt_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                        this.gt_date.splice(1,1)
                                    }
                                } 
                            }
                        }
                    }
                },
                deep: true
            },
            'gt_date': {
                handler: function (val) {
                    if (val) {
                        this.gt_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
        },
    }
</script>
