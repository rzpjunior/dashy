<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="-mb38">
               <v-col cols="12" md="3" class="-mb30">
                    <SelectArea
                        name="filter_area"
                        :aux_data="2"
                        :dense="true"
                        @selected="areaSelected"
                        v-privilege="'filter_rdl'"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="3" class="-mb30">
                    <SelectWarehouse
                        name="filter_warehouse"
                        :aux_data="2"
                        :dense="true"
                        :area_id="SelectArea"
                        :warehouse="warehouse"
                        @selected="warehouseSelected"
                        :disabled="disWrh"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="3" class="-mb30">
                    <v-menu
                        ref="menu"
                        v-model="recognition_date_model"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-text-field
                                    name="filter_order_recognition_date"
                                    prepend-inner-icon="mdi-calendar"
                                    outlined
                                    clearable
                                    maxlength="24"
                                    @click:clear="recognition_date = [],recognition_date_input =''"
                                    v-model="recognition_date_input"
                                    dense

                                >
                                    <template v-slot:label>
                                        Recognition Date <span style="color:red">*</span>
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            v-model="recognition_date"
                        >
                            <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="recognition_date_model = false"
                            >
                                OK
                            </v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="3" class="flex-align-end mb30">
                    <v-btn
                        class="only-btn white--text px-10 py-5"
                        depressed
                        color="#50ABA3"
                        elevation="0"
                        @click="downloadReport"
                        :disabled="validation"
                        v-privilege="'wrh_rpt_13_dl'"
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
        name: "ReportTransferSKUItem",
        data() {
            return {
                overlay: false,
                recognition_date_model : '',
                recognition_date : [new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10)],
                recognition_date_input : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                SelectWarehouse: '',
                SelectArea: '',
                area_id: null,
                loading: false,
                disWrh : true,
                warehouse: null
            }
        },
        computed: {
            //to validate button download report
            validation() {
                if (this.SelectWarehouse && this.recognition_date_input) {
                    return false
                } else {
                    return true
                }
            }
        },
        methods: {
            //to download report
            downloadReport() {
                this.overlay = true
                let recognition_date = ''
                if (this.recognition_date.length > 0) {
                    if (this.recognition_date.length == 1) {
                        recognition_date = this.recognition_date[0]+"|"+this.recognition_date[0]
                    } else {
                        let date = this.recognition_date[0]
                        let date2 = this.recognition_date[1]
                        if (date > date2) {
                            recognition_date = date2+'|'+date
                        } else {
                            recognition_date = date+'|'+date2
                        }
                    }
                }
                let warehouse = ''
                if (this.SelectWarehouse) {
                    warehouse = this.SelectWarehouse
                }
                this.$http.get("/report/wms/transfer-sku-item?export=1", {params: {
                    recognition_date: recognition_date,
                    warehouse : warehouse,
                }})
                .then(response => {
                    this.overlay = false
                    window.location.href = response.data.file
                })
            },
            //to select area filter
            areaSelected(d) {
                this.SelectArea = ""
                this.area = ""
                this.SelectWarehouse = ''
                this.warehouse = ""
                this.disWrh = true
                if (d) {
                    this.disWrh = false
                    this.SelectArea = d.id
                }
            },
            //to select warehouse filter
            warehouseSelected(d) {
                this.SelectWarehouse = ''
                this.warehouse = ""
                if (d) {
                    this.SelectWarehouse = d.id
                    this.warehouse = d
                }
            },
        },
        watch: {
            'recognition_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.recognition_date[0] = this.$moment(val).format('YYYY-MM-DD')
                                
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0,10)
                            let date2 = val.substr(14,23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                if (this.recognition_date.length == 2) {
                                    let date3 = new Date(this.recognition_date[0])
                                    let date4 = new Date(this.recognition_date[1])
                                    if (parseInt((date4-date3)/(24*3600*1000)) > 6 || parseInt((date4-date3)/(24*3600*1000)) < -6) {
                                        if (date4 < date3) {
                                            this.recognition_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                            this.recognition_date.splice(1,1)
                                        } else {
                                            this.recognition_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                            this.recognition_date.splice(1,1)
                                        }
                                    } 
                                }
                            }
                        }
                    }
                },
                deep: true
            },
            'recognition_date': {
                handler: function (val) {
                    if (val) {
                        this.recognition_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
        },
    }
</script>
