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
                            <v-menu
                                ref="menu"
                                v-model="payment_date_model"
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
                                            @click:clear="payment_date = [],payment_date_input =''"
                                            v-model="payment_date_input"
                                            dense
                                        >
                                            <template v-slot:label>
                                                Payment Date<span class="text-red">*</span>
                                            </template>
                                        </v-text-field>
                                    </div>
                                </template>
                                <v-date-picker
                                    range
                                    v-model="payment_date"
                                >
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        text
                                        color="primary"
                                        @click="payment_date_model = false"
                                    >
                                        OK
                                    </v-btn>
                                </v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col cols="12" md="4" class="-mb30">
                            <SelectSupplier
                                :norequired="true"
                                @selected="supplierSelected"
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
                        @click="downloadReport()"
                        :disabled="disableButton"
                        v-privilege="'fin_rpt_6_dl'"
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
    export default {
        name: "ReportSO",
        data() {
            return {
                payment_date_input : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                payment_date_model : '',
                payment_date : [new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10)],
                eta_date_model : '',
                eta_date : [new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10)],
                SelectArea : '',
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
                if (this.SelectArea && this.payment_date_input) {
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
                let payment_date = ''
                if (this.payment_date.length > 0) {
                    if (this.payment_date.length == 1) {
                        payment_date = this.payment_date[0]+'|'+this.payment_date[0]
                    } else {
                        let date = this.payment_date[0]
                        let date2 = this.payment_date[1]
                        if (date > date2) {
                            payment_date = date2+'|'+date
                        } else {
                            payment_date = date+'|'+date2
                        }
                    }
                }
                let supplier = ''
                if (this.SelectSupplier) {
                    supplier = this.SelectSupplier
                }
                this.overlay = true
                this.$http.get("/report/sms/purchase-payment?export=1",{params:{
                        area:area,
                        payment_date:payment_date,
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
                if (d) {
                    this.clearArea = false
                    this.SelectArea = d.id
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
            'payment_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.payment_date[0] = this.$moment(val).format('YYYY-MM-DD')
                                
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0,10)
                            let date2 = val.substr(14,23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                this.payment_date[0] = this.$moment(date1).format('YYYY-MM-DD')
                                this.payment_date[1] = this.$moment(date2).format('YYYY-MM-DD')
                                if (this.payment_date.length == 2) {
                                    
                                }
                            }
                        }
                    }
                },
                deep: true
            },
            'payment_date': {
                handler: function (val) {
                    if (val) {
                        this.payment_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
        },
    }
</script>
