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
                                @selected="warehouseSelected"
                                :label="'Warehouse'"
                                :dense="true"
                            ></SelectWarehouse>
                        </v-col>
                        <v-col cols="12" md="4" class="-mb30">
                            <v-select
                                v-model="dateType"
                                :items="dateTypes"
                                item-text="text"
                                item-value="text"
                                outlined
                                dense
                            ></v-select>
                        </v-col>
                        <v-col cols="12" md="12">
                            <v-row>
                                <v-col cols="12" md="4" class="-mb30">
                                    <v-menu
                                        ref="menu"
                                        v-model="date_model"
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
                                                    @click:clear="date = [],date_input =''"
                                                    v-model="date_input"
                                                    dense
                                                >
                                                    <template v-slot:label>{{dateType}}<span style="color:red">*</span></template>
                                                </v-text-field>
                                            </div>
                                        </template>
                                        <v-date-picker
                                            range
                                            v-model="date"
                                        >
                                            <v-spacer></v-spacer>
                                            <v-btn
                                                text
                                                color="primary"
                                                @click="date_model = false"
                                            >OK</v-btn>
                                        </v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <SelectMerchant
                                        :norequired="true"
                                        @selected="merchantSelected"
                                        :label="'Customer'"
                                        :dense="true"
                                    ></SelectMerchant>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <SelectBranch
                                        v-if="outlet"
                                        :dense="true"
                                        :norequired="true"
                                        :merchant="SelectMerchant"
                                        @selected="branchSelected"
                                        :label="'Outlet'"
                                    ></SelectBranch>
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
                        @click="renderData()"
                        :disabled="disableButton"
                        v-privilege="'fin_rpt_3_dl'"
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
        name: "ReportSP",
        data() {
            return {
                date_input : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                date_model : '',
                date : [new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10)],
                loading: false,
                SelectArea : '',
                SelectMerchant : '',
                SelectBranch : '',
                SelectWarehouse: '',
                outlet : false,
                overlay: false,
                clearArea: false,
                dateType: "Payment Date",
                dateTypes: [
                    {
                        text: "Payment Date",
                        value: 1,
                    },
                    {
                        text: "Receive Date",
                        value: 2,
                    },
                ],
            }
        },
        computed : {
            disableButton() {
                if (this.SelectArea && this.date ) {
                    return false
                } else {
                    return true
                }
            },
        },
        methods: {
            renderData(){
                this.overlay = true
                let area = ''
                if (this.SelectArea) {
                    area = this.SelectArea
                }
                let merchant = ''
                if (this.SelectMerchant) {
                    merchant = this.SelectMerchant
                }
                let branch = ''
                if (this.SelectBranch) {
                    branch = this.SelectBranch
                }
                let warehouse = ''
                if (this.SelectWarehouse) {
                    warehouse = this.SelectWarehouse
                }
                let payment_date = ''
                let received_date = ''
                if(this.dateType == 'Payment Date') {
                    if (this.date.length > 0) {
                        if (this.date.length == 1) {
                            payment_date = this.date[0]+'|'+this.date[0]
                        } else {
                            let date1 = this.date[0]
                            let date2 = this.date[1]
                            if (date1 > date2) {
                                payment_date = date2+'|'+date1
                            } else {
                                payment_date = date1+'|'+date2
                            }
                        }
                    }
                }
                if(this.dateType == 'Receive Date') {
                    if (this.date.length > 0) {
                        if (this.date.length == 1) {
                            received_date = this.date[0]+'|'+this.date[0]
                        } else {
                            let date1 = this.date[0]
                            let date2 = this.date[1]
                            if (date1 > date2) {
                                received_date = date2+'|'+date1
                            } else {
                                received_date = date1+'|'+date2
                            }
                        }
                    }
                }
                this.$http.get("/report/cms/sales-payment?export=1",{params:{
                        area:area,
                        recognition_date:payment_date,
                        received_date:received_date,
                        merchant:merchant,
                        branch:branch,
                        warehouse:warehouse,
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
            areaSelected(d) {
                this.SelectArea = ""
                this.clearArea = true
                if (d) {
                    this.clearArea = false
                    this.SelectArea = d.id
                }
            },
            merchantSelected(d) {
                this.outlet = false
                this.SelectMerchant = ""
                this.SelectBranch = ""
                if (d) {
                    if (d.customer_group==1) {
                        this.outlet = true
                    }
                    this.SelectMerchant = d.id
                }
            },
            branchSelected(d) {
                this.SelectBranch = ""
                if (d) {
                    this.SelectBranch = d.id
                }
            },
            warehouseSelected(d) {
                this.SelectWarehouse = ""
                if (d) {
                    this.SelectWarehouse = d.id
                }
            },
        },
        watch: {
            'date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.date[0] = this.$moment(val).format('YYYY-MM-DD')
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0,10)
                            let date2 = val.substr(14,23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                this.date[0] = this.$moment(date1).format('YYYY-MM-DD')
                                this.date[1] = this.$moment(date2).format('YYYY-MM-DD')
                            }
                        }
                    }
                },
                deep: true
            },
            'date': {
                handler: function (val) {
                    if (val) {
                        this.date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
        },
    }
</script>
