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
                                :dense="true"
                                :clear="clearArea"
                            ></SelectArea>
                        </v-col>
                        <v-col cols="12" md="4" class="-mb30">
                            <SelectWarehouse
                                :norequired="true"
                                :aux_data="2"
                                :dense="true"
                                :disabled="area"
                                :warehouse="warehouse"
                                :area_id="SelectArea"
                                @selected="warehouseSelected"
                            ></SelectWarehouse>
                        </v-col>
                        <v-col cols="12" md="4" class="-mb30">
                            <SelectSupplier
                                :norequired="true"
                                :dense="true"
                                @selected="supplierSelected"
                            ></SelectSupplier>
                        </v-col>
                        <v-col cols="12" md="12">
                            <v-row>
                                <v-col cols="12" md="4" class="-mb30">
                                    <v-menu
                                        ref="menu"
                                        v-model="invoice_date_model"
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
                                                    @click:clear="invoice_date = [],invoice_date_input =''"
                                                    v-model="invoice_date_input"
                                                    dense

                                                >
                                                    <template v-slot:label>
                                                        Invoice Date<span style="color:red">*</span>
                                                    </template>
                                                </v-text-field>
                                            </div>
                                        </template>
                                        <v-date-picker
                                            range
                                            v-model="invoice_date"
                                        >
                                            <v-spacer></v-spacer>
                                            <v-btn
                                                text
                                                color="primary"
                                                @click="invoice_date_model = false"
                                            >
                                                OK
                                            </v-btn>
                                        </v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col cols="12" md="4" class="-mb30">
                                    <v-menu
                                        ref="menu"
                                        v-model="invoice_due_date_model"
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
                                                    @click:clear="invoice_due_date = [],invoice_due_date_input =''"
                                                    v-model="invoice_due_date_input"
                                                    dense

                                                >
                                                    <template v-slot:label>
                                                        Invoice Due Date
                                                    </template>
                                                </v-text-field>
                                            </div>
                                        </template>
                                        <v-date-picker
                                            range
                                            v-model="invoice_due_date"
                                        >
                                            <v-spacer></v-spacer>
                                            <v-btn
                                                text
                                                color="primary"
                                                @click="invoice_due_date_model = false"
                                            >
                                                OK
                                            </v-btn>
                                        </v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-menu
                                        ref="menu"
                                        v-model="ata_date_model"
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
                                                    @click:clear="ata_date = [],ata_date_input =''"
                                                    v-model="ata_date_input"
                                                    dense

                                                >
                                                    <template v-slot:label>
                                                        GR ATA Date
                                                    </template>
                                                </v-text-field>
                                            </div>
                                        </template>
                                        <v-date-picker
                                            range
                                            v-model="ata_date"
                                        >
                                            <v-spacer></v-spacer>
                                            <v-btn
                                                text
                                                color="primary"
                                                @click="ata_date_model = false"
                                            >
                                                OK
                                            </v-btn>
                                        </v-date-picker>
                                    </v-menu>
                                </v-col>
                            </v-row>
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
                        v-privilege="'fin_rpt_4_dl'"
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
        name: "ReportSO",
        data() {
            return {
                invoice_date_input : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                invoice_date_model : '',
                invoice_date : [new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10)],
                invoice_due_date_input : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                invoice_due_date_model : '',
                invoice_due_date : [new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10)],
                ata_date_input : '',
                ata_date_model : '',
                ata_date : [],
                SelectArea : '',
                area : true,
                warehouse : '',
                SelectWrt : '',
                SelectWarehouse : '',
                SelectSupplier : '',
                outlet : false,
                overlay: false,
                clearArea: false,
            }
        },
        computed : {
            //For watch disable download
            disableButton() {
                if (this.SelectArea && this.invoice_date_input) {
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
                let invoice_date = ''
                if (this.invoice_date.length > 0) {
                    if (this.invoice_date.length == 1) {
                        invoice_date = this.invoice_date[0]+'|'+this.invoice_date[0]
                    } else {
                        let date = this.invoice_date[0]
                        let date2 = this.invoice_date[1]
                        if (date > date2) {
                            invoice_date = date2+'|'+date
                        } else {
                            invoice_date = date+'|'+date2
                        }
                    }
                }
                let invoice_due_date = ''
                if (this.invoice_due_date.length > 0) {
                    if (this.invoice_due_date.length == 1) {
                        invoice_due_date = this.invoice_due_date[0]+'|'+this.invoice_due_date[0]
                    } else {
                        let date = this.invoice_due_date[0]
                        let date2 = this.invoice_due_date[1]
                        if (date > date2) {
                            invoice_due_date = date2+'|'+date
                        } else {
                            invoice_due_date = date+'|'+date2
                        }
                    }
                }
                let ata_date = ''
                if (this.ata_date.length > 0) {
                    if (this.ata_date.length == 1) {
                        ata_date = this.ata_date[0]+'|'+this.ata_date[0]
                    } else {
                        let date = this.ata_date[0]
                        let date2 = this.ata_date[1]
                        if (date > date2) {
                            ata_date = date2+'|'+date
                        } else {
                            ata_date = date+'|'+date2
                        }
                    }
                }
                let warehouse = ''
                if (this.SelectWarehouse) {
                    warehouse = this.SelectWarehouse
                }
                let supplier = ''
                if (this.SelectSupplier) {
                    supplier = this.SelectSupplier
                }
                this.overlay = true
                this.$http.get("/report/sms/purchase-invoice?export=1",{params:{
                        area:area,
                        invoice_date:invoice_date,
                        warehouse:warehouse,
                        ata_date:ata_date,
                        invoice_due_date:invoice_due_date,
                        supplier:supplier
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
            // For select supplier filter
            supplierSelected(d) {
                this.SelectSupplier = ""
                if (d) {
                    this.SelectSupplier = d.id
                }
            },
        },
        watch: {
            'invoice_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.invoice_date[0] = this.$moment(val).format('YYYY-MM-DD')
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0,10)
                            let date2 = val.substr(14,23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                this.invoice_date[0] = this.$moment(date1).format('YYYY-MM-DD')
                                this.invoice_date[1] = this.$moment(date2).format('YYYY-MM-DD')
                            }
                        }
                    }
                },
                deep: true
            },
            'invoice_date': {
                handler: function (val) {
                    if (val) {
                        this.invoice_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
            'invoice_due_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.invoice_due_date[0] = this.$moment(val).format('YYYY-MM-DD')
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0,10)
                            let date2 = val.substr(14,23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                this.invoice_due_date[0] = this.$moment(date1).format('YYYY-MM-DD')
                                this.invoice_due_date[1] = this.$moment(date2).format('YYYY-MM-DD')
                            }
                        }
                    }
                },
                deep: true
            },
            'invoice_due_date': {
                handler: function (val) {
                    if (val) {
                        this.invoice_due_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
            'ata_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.ata_date[0] = this.$moment(val).format('YYYY-MM-DD')
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0,10)
                            let date2 = val.substr(14,23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                this.ata_date[0] = this.$moment(date1).format('YYYY-MM-DD')
                                this.ata_date[1] = this.$moment(date2).format('YYYY-MM-DD')
                            }
                        }
                    }
                },
                deep: true
            },
            'ata_date': {
                handler: function (val) {
                    if (val) {
                        this.ata_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
        },
    }
</script>
