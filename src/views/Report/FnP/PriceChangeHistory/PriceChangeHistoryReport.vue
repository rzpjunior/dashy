<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="-mb38">
                <v-col cols="12">
                    <v-row>
                        <v-col cols="12" md="12" class="-mb30">
                            <MultiSelectPriceSet
                                name="price_set"
                                required
                                v-model="price_set"
                                @selected="priceSetSelected"
                                :dense="true"
                            ></MultiSelectPriceSet>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12" md="9">
                    <v-row>
                        <v-col cols="12" md="3" :class="{'-mb30':$vuetify.breakpoint.smAndDown}">
                            <v-menu
                                ref="menu"
                                v-model="created_date_model"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                            >
                                <template v-slot:activator="{ on }">
                                    <div v-on="on">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on: tooltip }">
                                                <div v-on="{ ...tooltip}">
                                                    <v-text-field
                                                        prepend-inner-icon="mdi-calendar"
                                                        outlined
                                                        clearable
                                                        maxlength="24"
                                                        @click:clear="created_date = [],created_date_input =''"
                                                        v-model="created_date_input"
                                                        dense
                                                    >
                                                        <template v-slot:label>
                                                            Created At <span class="text-red">*</span>
                                                        </template>
                                                    </v-text-field>
                                                </div>
                                            </template>
                                        <span>Estimated Arrival Date</span>
                                        </v-tooltip>
                                    </div>
                                </template>
                                <v-date-picker
                                    range
                                    v-model="created_date"
                                >
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        text
                                        color="primary"
                                        @click="created_date_model = false"
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
                        @click="downloadReport()"
                        :disabled="disableButton"
                        v-privilege="'pri_rpt_2_dl'"
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
    import LoadingBar from '../../../../components/com-new/LoadingBar.vue'
    export default {
        components: { LoadingBar },
        name: "ReportPriceChangeHistory",
        data() {
            return {
                created_date_input : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                created_date_model : '',
                created_date : [new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10)],
                price_set : '',
                overlay: false,
            }
        },
        computed : {
            //For watch disable download
            disableButton() {
                if (this.price_set.length > 0 && this.created_date_input && this.price_set.length < 6) {
                    return false
                } else {
                    return true
                }
            }
        },
        methods: {
            //For download report
            downloadReport(){
                let price_set = ''
                if (this.price_set) {
                    for (let i = 0; i < this.price_set.length; i++) {
                        if (i === 0) {
                            price_set = price_set + this.price_set[i].id
                        } else {
                            price_set = price_set + '.' + this.price_set[i].id
                        }
                    }
                }
                let created_date = ''
                if (this.created_date.length > 0) {
                    if (this.created_date.length == 1) {
                        created_date = this.created_date[0]+'|'+this.created_date[0]
                    } else {
                        let date = this.created_date[0]
                        let date2 = this.created_date[1]
                        if (date > date2) {
                            created_date = date2+'|'+date
                        } else {
                            created_date = date+'|'+date2
                        }
                    }
                }
                this.overlay = true
                this.$http.get("/report/price-change-history?export=1",{params:{
                        price_set_id:price_set,
                        created_at:created_date,
                    }}).then(response => {
                        this.overlay = false
                        window.location.href = response.data.file
                });
            },
            // For select price set filter
            priceSetSelected(d) {
                this.price_set = null;
                if (d) {
                    this.price_set = d;
                }
            },
        },
        watch: {
            'created_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.created_date[0] = this.$moment(val).format('YYYY-MM-DD')
                                
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0,10)
                            let date2 = val.substr(14,23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                let date3 = new Date(this.created_date[0])
                                let date4 = new Date(this.created_date[1])
                                if (parseInt((date4-date3)/(24*3600*1000)) > 6 || parseInt((date4-date3)/(24*3600*1000)) < -6) {
                                    if (date4 < date3) {
                                        this.created_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                        this.created_date.splice(1,1)
                                    } else {
                                        this.created_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                        this.created_date.splice(1,1)
                                    }
                                }
                            }
                        }
                    }
                },
                deep: true
            },
            'created_date': {
                handler: function (val) {
                    if (val) {
                        this.created_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
        },
    }
</script>