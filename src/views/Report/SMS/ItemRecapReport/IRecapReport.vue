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
                                :area_id="SelectArea"
                                :norequired="true"
                                :aux_data="2"
                                @selected="warehouseSelected"
                                :dense="true"
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
                                            prepend-inner-icon="mdi-calendar"
                                            outlined
                                            clearable
                                            maxlength="24"
                                            @click:clear="delivery_date = [],delivery_date_input =''"
                                            v-model="delivery_date_input"
                                            dense
                                        >
                                            <template v-slot:label>
                                                Order Delivery Date<span class="text-red">*</span>
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
                        v-privilege="'src_rpt_1_dl'"
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
                delivery_date_input : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                delivery_date_model : '',
                delivery_date : [new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10)],
                SelectArea : '',
                SelectWrt : '',
                SelectWarehouse : '',
                outlet : false,
                overlay: false,
                clearArea: false,
            }
        },
        computed : {
            disableButton() {
                if (this.SelectArea && (this.order_date_input || this.delivery_date_input)) {
                    return false
                } else {
                    return true
                }
            }
        },
        mounted() {
        },
        methods: {
            renderData(){
                let area = ''
                if (this.SelectArea) {
                    area = this.SelectArea
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
                let warehouse = ''
                if (this.SelectWarehouse) {
                    warehouse = this.SelectWarehouse
                }
                this.overlay = true
                this.$http.get("/report/wms/item-recap?export=1",{params:{
                        area: area,
                        delivery_date: delivery_date,
                        warehouse: warehouse
                    }}).then(response => {
                        this.overlay = false
                        window.location.href = response.data.file
                });
            },
            areaSelected(d) {
                this.SelectArea = ""
                this.SelectWarehouse = ''
                this.warehouse = null
                this.clearArea = true
                if (d) {
                    this.clearArea = false
                    this.SelectArea = d.id
                }
            },
            warehouseSelected(d) {
                this.SelectWarehouse = ""
                if (d) {
                    this.SelectWarehouse = d.id
                }
            },
            wrtSelected(d) {
                this.SelectWrt = ""
                if (d) {
                    this.SelectWrt = d.id
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
