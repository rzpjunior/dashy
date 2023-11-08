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
                                :norequired="true"
                                :dense="true"
                                :clear="clearArea"
                            ></SelectArea>
                        </v-col>
                        <v-col cols="12" md="4" class="-mb30">
                            <SelectWarehouse
                                :aux_data="2"
                                :area_id="SelectArea"
                                :warehouse_type="'9'"
                                :norequired="true"
                                :clear="clearWarehouse"
                                :dense="true"
                                @selected="warehouseSelected"
                            ></SelectWarehouse>
                        </v-col>
                        <v-col cols="12" md="4" class="-mb30">
                            <v-menu
                                ref="menu"
                                v-model="order_date_model"
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
                                            @click:clear="order_date = [],order_date_input = ''"
                                            v-model="order_date_input"
                                            maxlength="24"
                                            dense
                                        >
                                            <template v-slot:label>
                                                Date<span style="color:red">*</span>
                                            </template>
                                        </v-text-field>
                                    </div>
                                </template>
                                <v-date-picker
                                    range
                                    persistent-hint
                                    v-model="order_date"
                                >
                                <v-spacer></v-spacer>
                                    <v-btn
                                        text
                                        color="primary"
                                        @click="order_date_model = false"
                                    >OK</v-btn>
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
                        @click="downloadData()"
                        :disabled="disableButton"
                        v-privilege="'sls_rpt_1_dl'"
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
        name: "ReportFridgeSO",
        data() {
            return {
                order_date_input : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                order_date : [new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10)],
                order_date_model : '',
                SelectArea : '',
                SelectWarehouse : '',
                overlay: false,
                clearArea: false,
                clearWarehouse:false,
            }
        },
        // For check date not empty
        computed : {
            disableButton() {
                if (this.order_date_input) {
                    return false
                } else {
                    return true
                }
            },
        },
        methods: {
            // For Download File Data
            downloadData(){
                this.overlay = true
                let order_date = ''
                if (this.order_date.length > 0) {
                    if (this.order_date.length == 1) {
                        order_date = this.order_date[0]+'T00:00:00Z|'+this.order_date[0]+'T23:59:59Z'
                    } else {
                        let date = this.order_date[0]
                        let date2 = this.order_date[1]
                        if(date == date2) {
                            order_date = date+'T00:00:00Z|'+date2+'T23:59:59Z'
                        }else if(date > date2){
                            order_date = date2+'T00:00:00Z|'+date+'T23:59:59Z'
                        }else {
                            order_date = date+'T00:00:00Z|'+date2+'T23:59:59Z'
                        }
                    }
                }
                let warehouse = ''
                if (this.SelectWarehouse) {
                    warehouse = this.SelectWarehouse
                }
                this.$http.get("/report/fridge/sold_product?export=1",{params:{
                        warehouse:warehouse,
                        sold_date:order_date,
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
            // For select filter area
            areaSelected(d) {
                this.SelectArea = ""
                this.clearArea = true
                this.clearWarehouse = true
                if (d) {
                    this.clearArea = false
                    this.clearWarehouse = false
                    this.SelectArea = d.id
                }
            },
            // For select filter warehouse
            warehouseSelected(d) {
                this.SelectWarehouse = ""
                if (d) {
                    this.SelectWarehouse = d.id
                }
            },
        },
        watch: {
            'order_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.order_date[0] = this.$moment(val).format('YYYY-MM-DD')
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0,10)
                            let date2 = val.substr(14,23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                this.order_date[0] = this.$moment(date1).format('YYYY-MM-DD')
                                this.order_date[1] = this.$moment(date2).format('YYYY-MM-DD')
                            }
                        }
                    }
                },
                deep: true
            },
            'order_date': {
                handler: function (val) {
                    if (val) {
                        this.order_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
        },
    }
</script>