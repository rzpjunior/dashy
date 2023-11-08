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
                                :norequired="false"
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
                                        <v-text-field
                                            prepend-inner-icon="mdi-calendar"
                                            outlined
                                            maxlength="24"
                                            clearable
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
                                <v-date-picker
                                    v-model="eta_date_input"
                                    scrollable
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
                <span class="fs24 bold">Please Download to View Data</span>
            </v-layout>
        </v-col>
        <LoadingBar :value="overlay"/>
    </v-container>
</template>
<script>
    export default {
        name: "ReportCOGS",
        data() {
            return {
                eta_date_input : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                eta_date_model : '',
                eta_date : [new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10)],
                SelectArea : '',
                area : true,
                warehouse : '',
                SelectWarehouse : '',
                SelectSupplier : '',
                overlay: false,
                clearArea: false,
            }
        },
        computed : {
            //For watch disable download
            disableButton() {
                if (this.eta_date_input && this.SelectArea) {
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
                let eta_date = ''
                if (this.eta_date.length > 0) {
                    eta_date = this.eta_date[0]+'|'+this.eta_date[0]
                }
                let warehouse = ''
                if (this.SelectWarehouse) {
                    warehouse = this.SelectWarehouse
                }
                this.overlay = true
                this.$http.get("/report/sms/cogs?export=1",{params:{
                        area:area,
                        warehouse:warehouse,
                        eta_date:eta_date,
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
        },
        watch: {
            'eta_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.eta_date[0] = this.$moment(val).format('YYYY-MM-DD')
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
