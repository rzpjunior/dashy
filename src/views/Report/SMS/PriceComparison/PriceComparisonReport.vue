<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="-mb38">
                <v-col>
                    <div class="mb15">
                        Eden Farm price data are "High" price sets
                    </div>
                </v-col>
            </v-row>
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
                                v-model="survey_date_model"
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
                                            maxlength="24"
                                            clearable
                                            @click:clear="survey_date = [],survey_date_input =''"
                                            v-model="survey_date_input"
                                            dense
                                        >
                                            <template v-slot:label>
                                                Survey Date<span class="text-red">*</span>
                                            </template>
                                        </v-text-field>
                                    </div>
                                </template>
                                <v-date-picker
                                    v-model="survey_date_input"
                                    scrollable
                                    min="2021-09-22"
                                >
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
                        elevation="0"
                        @click="downloadReport()"
                        :disabled="disableButton"
                        v-privilege="'fin_rpt_8_dl'"
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
        name: "ReportPriceComparison",
        data() {
            return {
                survey_date_input : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                survey_date_model : '',
                survey_date : [new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10)],
                SelectArea : '',
                area : true,
                overlay: false,
            }
        },
        computed : {
            //For watch disable download
            disableButton() {
                if (this.survey_date_input && this.SelectArea) {
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
                let survey_date = ''
                if (this.survey_date.length > 0) {
                    survey_date = this.survey_date[0]+'|'+this.survey_date[0]
                }
                this.overlay = true
                this.$http.get("/report/sms/price-comparison?export=1",{params:{
                        area:area,
                        survey_date:survey_date,
                    }}).then(response => {
                        this.overlay = false
                        window.location.href = response.data.file
                });
            },
            // For select area filter
            areaSelected(d) {
                this.SelectArea = ""
                this.area = true
                if (d) {
                    this.area = false
                    this.SelectArea = d.id
                }
            }
        },
        watch: {
            'survey_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.survey_date[0] = this.$moment(val).format('YYYY-MM-DD')
                            }
                        }
                    }
                },
                deep: true
            },
            'survey_date': {
                handler: function (val) {
                    if (val) {
                        this.survey_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
        },
    }
</script>
