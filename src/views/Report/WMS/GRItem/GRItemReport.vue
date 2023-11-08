<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="-mb38">
                <v-col cols="12" md="9">
                    <v-row>
                        <v-col cols="12" md="4" class="-mb30">
                            <SelectWarehouse
                                @selected="warehouseSelected"
                                :dense="true"
                            ></SelectWarehouse>
                        </v-col>
                        <v-col cols="12" md="4" class="-mb30">
                            <v-menu
                            ref="menu"
                            v-model="gr_date_model"
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
                                            @click:clear="gr_date = [],gr_date_input = ''"
                                            v-model="gr_date_input"
                                            maxlength="24"
                                            dense
                                        >
                                            <template v-slot:label>
                                                Goods Receipt Date<span class="text-red">*</span>
                                            </template>
                                        </v-text-field>
                                    </div>
                                </template>
                                <v-date-picker
                                    range
                                    persistent-hint
                                    v-model="gr_date"
                                >
                                <v-spacer></v-spacer>
                                    <v-btn
                                        text
                                        color="primary"
                                        @click="gr_date_model = false"
                                    >OK</v-btn>
                                </v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col cols="12" md="4" class="-mb30">
                            <SelectSupplier
                                :aux_data="2"
                                @selected="supplierSelected"
                                :norequired="true"
                                :dense="true"
                            ></SelectSupplier>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12" md="3" class="flex-align-end mb30">
                    <v-btn
                        class="only-btn white--text px-10 py-5"
                        depressed
                        color="#50ABA3"
                        elevation="0"
                        :disabled="disableButton"
                        @click="downloadReport()"
                        v-privilege="'wrh_rpt_2_dl'"
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
        name: "ReportGoodsReceiptItem",
        data() {
            return {
                gr_date_input : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                search: '',
                gr_date_model : '',
                gr_date : [new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10)],
                loading: false,
                statuses:999,
                datetype:1,
                SelectSupplier: '',
                SelectWarehouse : '',
                overlay: false,
                clearArea: false,
            }
        },
        computed : {
            //disabling the button when the condition not fulfill
            disableButton() {
                if (this.SelectWarehouse && this.gr_date_input) {
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
                let gr_date = ''
                    if (this.gr_date.length > 0) {
                        if (this.gr_date.length == 1) {
                            gr_date = this.gr_date[0]+'|'+this.gr_date[0]
                        } else {
                            let date = this.gr_date[0]
                            let date2 = this.gr_date[1]
                            if (date > date2) {
                                gr_date = date2+'|'+date
                            } else {
                                gr_date = date+'|'+date2
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
                this.$http.get("/report/wms/goods-receipt-item?export=1",{params:{
                        ata_date:gr_date,
                        warehouse:warehouse,
                        supplier:supplier,
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
            //function select supplier to get supplier id
            supplierSelected(d) {
                this.SelectSupplier = ""
                if (d) {
                    this.SelectSupplier = d.id
                }
            },
            //function select warehouse to get warehouse id
            warehouseSelected(d) {
                this.SelectWarehouse = ""
                if (d) {
                    this.SelectWarehouse = d.id
                }
            },
        },
        //watch for date range
        watch: {
            'gr_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.gr_date[0] = this.$moment(val).format('YYYY-MM-DD')

                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0,10)
                            let date2 = val.substr(14,23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                this.gr_date[0] = this.$moment(date1).format('YYYY-MM-DD')
                                this.gr_date[1] = this.$moment(date2).format('YYYY-MM-DD')
                                if (this.gr_date.length == 2) {

                                }
                            }
                        }
                    }
                },
                deep: true
            },
            'gr_date': {
                handler: function (val) {
                    if (val) {
                        this.gr_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
        },
    }
</script>
