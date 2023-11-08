<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="-mb38">
                <v-col cols="12" md="9">
                    <v-row>
                        <v-col cols="12" md="4" class="-mb30">
                            <v-menu
                                ref="menu"
                                v-model="period_date_model"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                            >
                                <template v-slot:activator="{ on }">
                                    <div v-on="on">
                                        <v-text-field
                                            name="filter_period_date"
                                            prepend-inner-icon="mdi-calendar"
                                            outlined
                                            clearable
                                            maxlength="24"
                                            @click:clear="period_date = [],period_date_input =''"
                                            v-model="period_date_input"
                                            dense
                                        >
                                            <template v-slot:label>
                                                Start Period <span class="text-red">*</span>
                                            </template>
                                        </v-text-field>
                                    </div>
                                </template>
                                <v-date-picker
                                    range
                                    v-model="period_date"
                                >
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        text
                                        color="primary"
                                        @click="period_date_model = false"
                                    >
                                        OK
                                    </v-btn>
                                </v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col cols="12" md="4" class="-mb30">
                            <v-select
                                v-model="statuses"
                                :items="status"
                                item-text="text"
                                item-value="value"
                                label="Status"
                                outlined
                                dense
                            ></v-select>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12" md="3" class="flex-align-end mb30">
                    <v-btn
                        class="only-btn white--text px-10 py-5"
                        depressed
                        color="#50ABA3"
                        elevation="0"
                        :disabled="validation"
                        @click="downloadReport"
                        v-privilege="'sls_rpt_9_dl'"
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
        name: "ReportSKUDiscount",
        data() {
            return {
                overlay: false,
                period_date_model : '',
                period_date : [new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10)],
                period_date_input : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                loading: false,
                statuses:1,
            }
        },
        computed: {
            validation() { // validation for enable button download when required field filled
                if (this.period_date_input) {
                    return false
                } else {
                    return true
                }
            }
        },
        methods: {
            downloadReport() {
                this.overlay = true
                let period_date = ''
                if (this.period_date.length > 0) {
                    if (this.period_date.length == 1) {
                        period_date = this.period_date[0]+"|"+this.period_date[0]
                    } else {
                        let date = this.period_date[0]
                        let date2 = this.period_date[1]
                        if (date > date2) {
                            period_date = date2+'|'+date
                        } else {
                            period_date = date+'|'+date2
                        }
                    }
                }
                let status = ''
                if (this.statuses && this.statuses != 999) {
                    status = this.statuses
                }
                this.$http.get("/report/cms/sku-discount?export=1", {params: { 
                    start_period: period_date,
                    status: status
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
            'period_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.period_date[0] = this.$moment(val).format('YYYY-MM-DD')
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0,10)
                            let date2 = val.substr(14,23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                this.period_date[0] = this.$moment(date1).format('YYYY-MM-DD')
                                this.period_date[1] = this.$moment(date2).format('YYYY-MM-DD')
                            }
                        }
                    }
                },
                deep: true
            },
            'period_date': {
                handler: function (val) {
                    if (val) {
                        this.period_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
        },
    }
</script>
