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
                                :dense="true"
                                :clear="clearArea"
                            ></SelectArea>
                        </v-col>
                        <v-col cols="12" md="4" class="-mb30">
                            <v-menu
                                ref="menu"
                                v-model="delivery_date_model"
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
                                            @click:clear="delivery_date = [],delivery_date_input =''"
                                            v-model="delivery_date_input"
                                            dense
                                        >
                                            <template v-slot:label>Order Delivery Date</template>
                                        </v-text-field>
                                    </div>
                                </template>
                                <v-date-picker
                                    range
                                    v-model="delivery_date"
                                >
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        text
                                        color="primary"
                                        @click="delivery_date_model = false"
                                    >OK</v-btn>
                                </v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col cols="12" md="4" class="-mb30">
                            <v-menu
                                ref="menu"
                                v-model="invoice_date_model"
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
                                            @click:clear="invoice_date = [],invoice_date_input =''"
                                            v-model="invoice_date_input"
                                            dense
                                        >
                                            <template v-slot:label>Invoice Date</template>
                                        </v-text-field>
                                    </div>
                                </template>
                                <v-date-picker
                                    range
                                    v-model="invoice_date"
                                >
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        text
                                        color="primary"
                                        @click="invoice_date_model = false"
                                    >OK</v-btn>
                                </v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col cols="12" md="12">
                            <v-row>
                                <v-col cols="12" md="4" class="-mb30">
                                    <v-menu
                                        ref="menu"
                                        v-model="due_date_model"
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
                                                    @click:clear="due_date = [],due_date_input =''"
                                                    v-model="due_date_input"
                                                    dense
                                                >
                                                    <template v-slot:label>Invoice Due Date</template>
                                                </v-text-field>
                                            </div>
                                        </template>
                                        <v-date-picker
                                            range
                                            v-model="due_date"
                                        >
                                            <v-spacer></v-spacer>
                                            <v-btn
                                                text
                                                color="primary"
                                                @click="due_date_model = false"
                                            >OK</v-btn>
                                        </v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col cols="12" md="4" class="-mb30">
                                    <v-select
                                        v-model="statuses"
                                        :items="status2"
                                        dense
                                        item-text="text"
                                        item-value="value"
                                        outlined
                                    ></v-select>
                                </v-col>
                                <v-col cols="12" md="4" class="-mb30">
                                    <SelectMerchant
                                        :norequired="true"
                                        :dense="true"
                                        @selected="merchantSelected"
                                        :label="'Customer'"
                                    ></SelectMerchant>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12" md="12">
                            <v-row>
                                <v-col cols="12" md="4">
                                    <SelectBranch
                                        v-if="outlet"
                                        :norequired="true"
                                        :merchant="SelectMerchant"
                                        :dense="true"
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
                        @click="downloadData()"
                        :disabled="disableButton"
                        v-privilege="'fin_rpt_1_dl'"
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
        name: "ReportSI",
        data() {
            return {
                invoice_date_input : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                invoice_date_model : '',
                invoice_date : [new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10)],

                due_date_input : '',
                due_date_model : '',
                due_date : [],

                delivery_date_input : '',                
                delivery_date_model : '',
                delivery_date : [],

                loading: false,
                statuses:'',
                status2:[
                    {
                        text:'All Status',
                        value:''
                    },
                    {
                        text:'Active',
                        value:1
                    },
                    {
                        text:'Finished',
                        value:2
                    },
                    {
                        text:'Cancelled',
                        value:3
                    },
                    {
                        text:'Partial',
                        value:6
                    },
                ],
                SelectArea : '',
                SelectMerchant : '',
                SelectBranch : '',
                outlet : false,
                overlay: false,
                clearArea: false,
            }
        },
        computed : {
            disableButton() {
                if (this.SelectArea) {
                    return false
                } else {
                    return true
                }
            },
        },
        methods: {
            downloadData(){
                this.overlay = true
                let area = ''
                if (this.SelectArea) {
                    area = this.SelectArea
                }
                let status = ''
                if (this.statuses){
                    status = this.statuses
                }
                let merchant = ''
                if (this.SelectMerchant) {
                    merchant = this.SelectMerchant
                }
                let branch = ''
                if (this.SelectBranch) {
                    branch = this.SelectBranch
                }
                let due_date = ''
                if (this.due_date.length > 0) {
                    if (this.due_date.length == 1) {
                        due_date = this.due_date[0]+'|'+this.due_date[0]
                    } else {
                        let date = this.due_date[0]
                        let date2 = this.due_date[1]
                        if (date > date2) {
                            due_date = date2+'|'+date
                        } else {
                            due_date = date+'|'+date2
                        }
                    }
                }
                let invoice_date = ''
                if (this.invoice_date.length > 0) {
                    if (this.invoice_date.length == 1) {
                        invoice_date = this.invoice_date[0]+'|'+this.invoice_date[0]
                    } else {
                        let date = this.invoice_date[0]
                        let date2 = this.invoice_date[1]
                        if (date > date2) {
                            invoice_date = date2+'|'+date
                        } else {
                            invoice_date = date+'|'+date2
                        }
                    }
                }
                let delivery_date = ''
                if (this.delivery_date.length > 0) {
                    if (this.delivery_date.length == 1) {
                        delivery_date = this.delivery_date[0]+'|'+this.delivery_date[0]
                    } else {
                        let date = this.delivery_date[0]
                        let date2 = this.delivery_date[1]
                        if (date > date2) {
                            delivery_date = date2+'|'+date
                        } else {
                            delivery_date = date+'|'+date2
                        }
                    }
                }
                this.$http.get("/report/cms/sales-invoice?export=1",{params:{
                        area:area,
                        invoice_date:invoice_date,
                        invoice_due_date:due_date,
                        order_delivery_date:delivery_date,
                        branch:branch,
                        merchant:merchant,
                        status:status
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
        },
        watch: {
            'due_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.due_date[0] = this.$moment(val).format('YYYY-MM-DD')
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0,10)
                            let date2 = val.substr(14,23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                this.due_date[0] = this.$moment(date1).format('YYYY-MM-DD')
                                this.due_date[1] = this.$moment(date2).format('YYYY-MM-DD')
                            }
                        }
                    }
                },
                deep: true
            },
            'due_date': {
                handler: function (val) {
                    if (val) {
                        this.due_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
            'invoice_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.invoice_date[0] = this.$moment(val).format('YYYY-MM-DD')

                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0,10)
                            let date2 = val.substr(14,23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                this.invoice_date[0] = this.$moment(date1).format('YYYY-MM-DD')
                                this.invoice_date[1] = this.$moment(date2).format('YYYY-MM-DD')
                                if (this.invoice_date.length == 2) {

                                }
                            }
                        }
                    }
                },
                deep: true
            },
            'invoice_date': {
                handler: function (val) {
                    if (val) {
                        this.invoice_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
            'delivery_date_input': {
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
                                this.delivery_date[0] = this.$moment(date1).format('YYYY-MM-DD')
                                this.delivery_date[1] = this.$moment(date2).format('YYYY-MM-DD')
                                if (this.delivery_date.length == 2) {

                                }
                            }
                        }
                    }
                },
                deep: true
            },
            'delivery_date': {
                handler: function (val) {
                    if (val) {
                        this.delivery_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
        },
    }
</script>
