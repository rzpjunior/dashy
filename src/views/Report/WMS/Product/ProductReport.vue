<template>
    <v-container  fill-height class="main-container">
        <div class="box">
            <v-row class="-mb38">
                <v-col cols="12" md="9">
                    <v-row>
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
                        <v-col cols="12" md="4" class="-mb30">
                            <SelectWarehouse
                                :aux_data="2"
                                label="Storability"
                                @selected="storabilitySelected"
                                :norequired="true"
                                :dense="true"
                            ></SelectWarehouse>
                        </v-col>
                        <v-col cols="12" md="4" class="-mb30">
                            <SelectWarehouse
                                :aux_data="2"
                                label="Salability"
                                @selected="salabilitySelected"
                                :norequired="true"
                                :dense="true"
                            ></SelectWarehouse>
                        </v-col>
                        <v-col cols="12" md="4">
                            <SelectWarehouse
                                :aux_data="2"
                                label="Purchasability"
                                @selected="purchasabilitySelected"
                                :norequired="true"
                                :dense="true"
                            ></SelectWarehouse>
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
                        v-privilege="'src_rpt_4_dl'"
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
        name: "ReportStock",
        data() {
            return {
                search: '',
                statuses:999,
                loading: false,
                SelectStorability : '',
                SelectSalability : '',
                SelectPurchasability : '',
                options:[
                    {
                        text:'Yes',
                        value:1
                    },
                    {
                        text:'No',
                        value:2
                    }
                ],
                overlay: false,
                clearArea: false,
            }
        },
        methods: {
            //function for download report
            downloadReport(){
                this.overlay = true
                let salability = ''
                if (this.SelectSalability) {
                    salability = this.SelectSalability
                }
                let purchasability = ''
                if (this.SelectPurchasability) {
                    purchasability = this.SelectPurchasability
                }
                let storability = ''
                if (this.SelectStorability) {
                    storability = this.SelectStorability
                }

                this.$http.get("/report/wms/products?export=1",{params:{
                        status:this.statuses,
                        salability:salability,
                        purchasability:purchasability,
                        storability:storability,
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
            //function select storability to get warehouse id
            storabilitySelected(d) {
                this.SelectStorability = ""
                if (d) {
                    this.SelectStorability = d.id
                }
            },
            //function select salability to get warehouse id
            salabilitySelected(d) {
                this.SelectSalability = ""
                if (d) {
                    this.SelectSalability = d.id
                }
            },
            //function select purchasability to get warehouse id
            purchasabilitySelected(d) {
                this.SelectPurchasability = ""
                if (d) {
                    this.SelectPurchasability = d.id
                }
            },
        },
    }
</script>
