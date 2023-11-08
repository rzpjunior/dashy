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
                                :aux_data="2"
                                @selected="warehouseSelected"
                                :dense="true"
                            ></SelectWarehouse>
                        </v-col>
                        <v-col cols="12" md="4" class="-mb30">
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
                                            name="filter_transaction_date"
                                            prepend-inner-icon="mdi-calendar"
                                            outlined
                                            clearable
                                            maxlength="24"
                                            @click:clear="recognition_date = ''"
                                            v-model="recognition_date"
                                            dense

                                        >
                                            <template v-slot:label>
                                                Transaction Date <span class="text-red">*</span>
                                            </template>
                                        </v-text-field>
                                    </div>
                                </template>
                                <v-date-picker
                                    v-model="recognition_date"
                                    @input="recognition_date_model = false"
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
                        :disabled="disableButton"
                        @click="downloadReport()"
                        v-privilege="'wrh_rpt_9_dl'"
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
        name: "ReportMovementStock",
        data() {
            return {
                recognition_date_input : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                recognition_date_model : '',
                recognition_date : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                SelectArea : '',
                SelectWrt : '',
                SelectWarehouse : '',
                outlet : false,
                overlay: false,
                clearArea: false,
            }
        },
        computed : {
            //disabled download button if not fulfill
            disableButton() {
                if (this.SelectArea && this.SelectWarehouse && this.recognition_date) {
                    return false
                } else {
                    return true
                }
            }
        },
        methods: {
            //to download report
            downloadReport(){
                let area = ''
                if (this.SelectArea) {
                    area = this.SelectArea
                }
                let recognition_date = ''
                if (this.recognition_date) {
                    recognition_date = this.recognition_date
                }
                let warehouse = ''
                if (this.SelectWarehouse) {
                    warehouse = this.SelectWarehouse
                }
                this.overlay = true
                this.$http.get("/report/wms/movement-stock?export=1",{params:{
                        area: area,
                        recognition_date: recognition_date,
                        warehouse: warehouse
                    }}).then(response => {
                        this.overlay = false
                        window.location.href = response.data.file
                });
            },
            //to select area by id
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
            //to select warehouse by id
            warehouseSelected(d) {
                this.SelectWarehouse = ""
                if (d) {
                    this.SelectWarehouse = d.id
                }
            },
        },
    }
</script>
