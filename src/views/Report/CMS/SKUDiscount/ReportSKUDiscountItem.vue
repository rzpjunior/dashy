<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="-mb38">
                <v-col cols="12" md="9">
                    <v-row>
                        <v-col cols="12" md="4" class="-mb30">
                            <SelectPromotionSKUDiscount
                                :norequired="true"
                                @selected="promotionNameSelected"
                            ></SelectPromotionSKUDiscount>
                        </v-col>
                        <v-col cols="12" md="4" class="-mb30">
                            <SelectPriceSet
                                @selected="priceSetSelected"
                                :norequired="true"
                                :dense="true"
                            ></SelectPriceSet>
                        </v-col>
                        <v-col cols="12" md="4">
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
                    </v-row>
                </v-col>
                <v-col cols="12" md="3" class="flex-align-end mb30">
                    <v-btn
                        class="only-btn white--text px-10 py-5"
                        depressed
                        color="#50ABA3"
                        elevation="0"
                        @click="downloadReport"
                        v-privilege="'sls_rpt_10_dl'"
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
        name: "ReportSKUDiscountItem",
        data() {
            return {
                overlay: false,
                loading: false,
                SelectPriceSet: '',
                SelectPromotionName: '',
                statuses:1,
            }
        },
        methods: {
            //Downloading the Report
            downloadReport() {
                this.overlay = true
                let price_set = ''
                if (this.SelectPriceSet) {
                    price_set = this.SelectPriceSet
                }
                let status = ''
                if (this.statuses && this.statuses != 999) {
                    status = this.statuses
                }
                let promotion_id = ''
                if (this.SelectPromotionName) {
                    promotion_id = this.SelectPromotionName
                }
                this.$http.get("/report/cms/sku-discount-item?export=1", {params: { 
                    price_set: price_set,
                    status: status,
                    promotion_id: promotion_id
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
            //Get Id Price Set when selected PriceSet
            priceSetSelected(d) {
                this.SelectPriceSet = '';
                if (d) {
                    this.SelectPriceSet = d.id
                }
            },
            //For Id Promotion when selectedPromotion
            promotionNameSelected(d){
                this.SelectPromotionName = '';
                if(d){
                    this.SelectPromotionName = d.id;
                }
            },
        },
    }
</script>
