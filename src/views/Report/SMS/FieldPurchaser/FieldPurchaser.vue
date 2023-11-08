<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="-mb38">
                <v-col cols="12" md="9">
                    <v-row>
                        <v-col cols="12" md="4" class="-mb30">
                            <SelectArea
                                name="filter_area"
                                :aux_data="2"
                                :dense="true"
                                @selected="areaSelected"
                                v-privilege="'filter_rdl'"
                            ></SelectArea>
                        </v-col>
                        <v-col cols="12" md="4" class="-mb30">
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
                        <v-col cols="12" md="4" class="-mb30">
                            <SelectSupplier
                                :norequired="true"
                                :dense="true"
                                @selected="supplierSelected"
                                suppliertype="458752"
                            ></SelectSupplier>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-menu
                                ref="menu"
                                v-model="pp_date_model"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                                :disabled="SelectPurchasePlan.length > 0"
                            >
                                <template v-slot:activator="{ on }">
                                    <div v-on="on">
                                        <v-text-field
                                            name="filter_order_pp_date"
                                            prepend-inner-icon="mdi-calendar"
                                            outlined
                                            clearable
                                            maxlength="24"
                                            @click:clear="(pp_date = []),(pp_date_input = '')"
                                            v-model="pp_date_input"
                                            dense
                                            :disabled="SelectPurchasePlan.length > 0"
                                        >
                                            <template v-slot:label>
                                                PP Date
                                                <span style="color: red">*</span>
                                            </template>
                                        </v-text-field>
                                    </div>
                                </template>
                                <v-date-picker range v-model="pp_date" :min="pp_date.length > 0 ? min_date : ''" :max="pp_date.length > 0 ? max_date : ''">
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        text
                                        color="primary"
                                        @click="pp_date_model = false"
                                    >
                                        OK
                                    </v-btn>
                                </v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col cols="12" md="4" class="-mb30">
                            <SelectPurchasePlan
                                :norequired="true"
                                @selected="purchasePlanSelected"
                                :disabled="!pp_date.length"
                                :from="pp_date.length > 0 ? pp_date[0] : ''"
                                :to="pp_date.length > 1 ? pp_date[1] : pp_date[0]"
                            ></SelectPurchasePlan>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12" md="3" class="flex-align-end mb30">
                    <v-btn
                        class="only-btn white--text px-10 py-5"
                        depressed
                        color="#50ABA3"
                        elevation="0"
                        @click="downloadReport"
                        :disabled="validation"
                        v-privilege="'src_rpt_7_dl'"
                        >Download</v-btn
                    >
                </v-col>
            </v-row>
        </div>
        <v-col cols="12" md="12">
            <v-layout justify-center>
                <v-card-actions>
                    <v-img width="350" src="/img/reportpacking.png"></v-img>
                </v-card-actions>
            </v-layout>
            <v-layout justify-center>
                <span class="fs24 bold">Please download to view data</span>
            </v-layout>
        </v-col>
        <LoadingBar :value="overlay" />
    </v-container>
</template>

<script>
export default {
    name: "FieldPurchaserReport",
    data() {
        return {
            overlay: false,
            pp_date_model: "",
            pp_date: [],
            pp_date_input: "",
            SelectWarehouse: "",
            SelectArea: "",
            SelectSupplier: "",
            SelectPurchasePlan: "",
            area_id: null,
            loading: false,
            disWrh: true,
            warehouse: null,
            min_date: "",
            max_date: "",
        };
    },
    computed: {
        validation() {
            if (this.SelectWarehouse && this.pp_date_input) {
                return false;
            } else {
                return true;
            }
        },
    },
    methods: {
        // For download 
        downloadReport() {
            this.overlay = true;
            let pp_date = "";
            if (this.pp_date.length > 0) {
                if (this.pp_date.length == 1) {
                    pp_date = this.pp_date[0] + "|" + this.pp_date[0];
                } else {
                    let date = this.pp_date[0];
                    let date2 = this.pp_date[1];
                    if (date > date2) {
                        pp_date = date2 + "|" + date;
                    } else {
                        pp_date = date + "|" + date2;
                    }
                }
            }
            let area = '';
            if (this.SelectArea){
                area = this.SelectArea
            }
            let warehouse = "";
            if (this.SelectWarehouse) {
                warehouse = this.SelectWarehouse;
            }
            let supplier = "";
            if (this.SelectSupplier) {
                supplier = this.SelectSupplier;
            }
            let purchase_plan = "";
            if (this.SelectPurchasePlan) {
                purchase_plan = this.SelectPurchasePlan;
            }
            this.$http.get("/report/sms/field-purchase-order-item?export=1", {
                params: {
                    recognition_date: pp_date,
                    warehouse: warehouse,
                    supplier: supplier,
                    area: area,
                    pp_code: purchase_plan
                },
                }).then((response) => {
                    this.overlay = false;
                    window.location.href = response.data.file;
                });
        },
        // For select area filter
        areaSelected(d) {
            this.SelectArea = "";
            this.area = "";
            this.SelectWarehouse = "";
            this.warehouse = "";
            this.disWrh = true;
            if (d) {
                this.disWrh = false;
                this.SelectArea = d.id;
            }
        },
        // For select warehouse filter
        warehouseSelected(d) {
            this.SelectWarehouse = "";
            this.warehouse = "";
            if (d) {
                this.SelectWarehouse = d.id;
                this.warehouse = d;
            }
        },
        // For select supplier filter
        supplierSelected(d) {
            this.SelectSupplier = "";
            if (d) {
                this.SelectSupplier = d.id;
            }
        },
        // For select purchase plan
        purchasePlanSelected(d) {
            this.SelectPurchasePlan = "";
            if (d) {
                this.SelectPurchasePlan = d.code
            }
        }
    },
    watch: {
        pp_date_input: {
            handler: function (val) {
                if (val) {
                    if (val.length == 10) {
                        let valid = this.$moment(val, "YYYY-MM-DD", true).isValid();
                        if (valid == true) {
                            this.pp_date[0] = this.$moment(val).format("YYYY-MM-DD");
                        }
                    } else if (val.length == 24) {
                        let date1 = val.substr(0, 10);
                        let date2 = val.substr(14, 23);
                        let valid1 = this.$moment(date1, "YYYY-MM-DD", true).isValid();
                        let valid2 = this.$moment(date2, "YYYY-MM-DD", true).isValid();
                        if (valid1 == true && valid2 == true) {
                            this.pp_date[0] = this.$moment(date1).format("YYYY-MM-DD");
                            this.pp_date[1] = this.$moment(date2).format("YYYY-MM-DD");
                        }
                    }
                }
            },
            deep: true,
        },
        pp_date: {
            handler: function (val) {
                if (val) {
                    this.pp_date_input = this.formatDateRange(val);
                    if(val[0]){
                        this.min_date = this.$moment(val[0]).add(-31, 'days').toISOString().substr(0, 10)
                        this.max_date = this.$moment(val[0]).add(31, 'days').toISOString().substr(0, 10)
                    }
                }
            },
            deep: true,
        },
    },
};
</script>
