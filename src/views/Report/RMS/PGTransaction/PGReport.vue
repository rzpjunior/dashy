<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="-mb38">
                <v-col cols="12" md="9">
                    <v-row>
                        <v-col cols="12" md="4" class="-mb30">
                            <v-menu
                                ref="menu"
                                v-model="transaction_date_model"
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
                                            @click:clear="transaction_date = [],transaction_date_input =''"
                                            v-model="transaction_date_input"
                                            dense
                                        >
                                            <template v-slot:label>Transaction Date<span style="color:red">*</span></template>
                                        </v-text-field>
                                    </div>
                                </template>
                                <v-date-picker
                                    range
                                    v-model="transaction_date"
                                >
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        text
                                        color="primary"
                                        @click="transaction_date_model = false"
                                    >OK</v-btn>
                                </v-date-picker>
                            </v-menu>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12" md="3" class="flex-align-end mb30">
                    <v-btn
                        class="only-btn white--text px-10 py-5"
                        color="#50ABA3"
                        elevation="0"
                        @click="downloadData()"
                        :disabled="disableButton"
                        v-privilege="'fin_rpt_7_dl'"
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
        name: "ReportPG",
        data() {
            return {
                transaction_date_input : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                transaction_date_model : '',
                transaction_date : [new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10)],
                loading: false,
                overlay: false,
            }
        },
        computed : {
            // for hidden download button if transaction date not have value
            disableButton() {
                if ( this.transaction_date.length > 0 ) {
                    return false
                } else {
                    return true
                }
            },
        },
        methods: {
            //For send filtered data request to API
            downloadData(){
                this.overlay = true
                let transaction_date = ''
                if (this.transaction_date.length > 0) {
                    if (this.transaction_date.length == 1) {
                        transaction_date = this.transaction_date[0]+'|'+this.transaction_date[0]
                    } else {
                        let date = this.transaction_date[0]
                        let date2 = this.transaction_date[1]
                        if (date > date2) {
                            transaction_date = date2+'|'+date
                        } else {
                            transaction_date = date+'|'+date2
                        }
                    }
                }
                this.$http.get("/report/rms/payment-gateway?export=1",{params:{
                        transaction_date:transaction_date,
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
        },
        watch: {
            // for build and validation formated date
            'transaction_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.transaction_date[0] = this.$moment(val).format('YYYY-MM-DD')
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0,10)
                            let date2 = val.substr(14,23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                this.transaction_date[0] = this.$moment(date1).format('YYYY-MM-DD')
                                this.transaction_date[1] = this.$moment(date2).format('YYYY-MM-DD')
                            }
                        }
                    }
                },
                deep: true
            },
            'transaction_date': {
                handler: function (val) {
                    if (val) {
                        this.transaction_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
        },
    }
</script>
