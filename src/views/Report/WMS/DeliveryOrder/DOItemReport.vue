<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="-mb38">
                <v-col cols="12" md="9">
                    <v-row>
                        <v-col cols="12" md="4" class="-mb30">
                            <SelectArea
                                :dense="true"
                                @selected="areaSelected"
                                :aux_data="2"
                            ></SelectArea>  
                        </v-col>
                        <v-col cols="12" md="4" class="-mb30">
                            <SelectWarehouse
                                name="filter_warehouse"
                                :aux_data="2"
                                @selected="warehouseSelected"
                                :norequired="false"
                                :dense="true"
                                :area_id="SelectArea"
                            ></SelectWarehouse>
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
                                            name="filter_order_delivery_date"
                                            prepend-inner-icon="mdi-calendar"
                                            outlined
                                            clearable
                                            maxlength="24"
                                            @click:clear="delivery_date = [],delivery_date_input =''"
                                            v-model="delivery_date_input"
                                            dense

                                        >
                                            <template v-slot:label>
                                                Delivery Date <span class="text-red">*</span>
                                            </template>
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
                                    >
                                        OK
                                    </v-btn>
                                </v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col cols="12" md="4">
                            <SelectWrt
                                name="filter_wrt"
                                :norequired="true"
                                @selected="wrtSelected"
                                :area="area_id"
                                :disabled="disWrt"
                                :dense="true"
                            ></SelectWrt>
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
                        v-privilege="'lgs_rpt_2_dl'"
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
        name: "ReportDeliveryOrderItem",
        data() {
            return {
                overlay: false,
                delivery_date_model : '',
                delivery_date : [],
                delivery_date_input : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                SelectWrt: '',
                SelectWarehouse: '',
                area_id: null,
                loading: false,
                SelectArea: '',
                disWrt : true
            }
        },
        computed: {
            validation() {
                if ((this.SelectWarehouse || this.SelectArea)  && this.delivery_date_input) {
                    return false
                } else {
                    return true
                }
            }
        },
        methods: {
            downloadReport() {
                this.overlay = true
                let delivery_date = ''
                if (this.delivery_date.length > 0) {
                    if (this.delivery_date.length == 1) {
                        delivery_date = this.delivery_date[0]+"|"+this.delivery_date[0]
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
                let warehouse = ''
                if (this.SelectWarehouse) {
                    warehouse = this.SelectWarehouse
                }
                let wrt = ''
                if (this.SelectWrt) {
                    wrt = this.SelectWrt
                }
                let area = ''
                if (this.SelectArea) {
                    area = this.SelectArea
                }
                this.$http.get("/report/delivery-order-item?export=1", {params: {
                    recognition_dates: delivery_date,
                    warehouse_id : warehouse,
                    wrt_id: wrt,
                    area_id: area
                }})
                .then(response => {
                    this.overlay = false
                    window.location.href = response.data.file
                })
            },
            wrtSelected(d) {
                this.SelectWrt = ""
                if (d) {
                    this.SelectWrt = d.id
                }
            },
            warehouseSelected(d) {
                this.disWrt = true
                this.SelectWarehouse = ""
                this.area_id = null
                if (d) {
                    this.disWrt = false
                    this.SelectWarehouse = d.id
                    this.area_id = d.area.id
                }
            },
            areaSelected(d) {
                this.SelectArea = ""
                this.SelectWarehouse = ""
                if (d) {
                    this.SelectArea = d.id
                }
            },
        },
        watch: {
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
