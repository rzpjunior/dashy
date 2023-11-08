<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row :class="filterDropdown?'mb24':''">
                <v-col>
                    Filter 
                    <v-btn 
                        depressed
                        x-small
                        @click="filterDropdown = !filterDropdown"
                        v-if="filterDropdown"
                        class="no-caps fs12"
                    >
                        Hide
                        <v-icon
                            right
                        >
                            mdi-chevron-up
                        </v-icon>
                    </v-btn>
                    <v-btn 
                        depressed
                        x-small
                        @click="filterDropdown = !filterDropdown"
                        v-else
                        class="no-caps fs12"
                    >
                        Show
                        <v-icon
                            right
                        >
                            mdi-chevron-down
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row :class="filterDropdown? '-mb24':'hidden'">
                <v-col cols="12" md="3" class="-mt24">
                    <SelectArea 
                        @selected="areaSelected"
                        :norequired="true"
                        :dense="true"
                        :aux_data="2"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectBusinessType 
                        @selected="businesstypeSelected"
                        :norequired="true"
                        :dense="true"
                        :aux_data="2"
                    ></SelectBusinessType>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectMerchant
                        :label="'Merchant'"
                        @selected="merchantSelected"
                        :norequired="true"
                        :dense="true"
                        :aux_data="2"
                    ></SelectMerchant>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="period_date_model"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-text-field
                                    name="filter_period_date"
                                    prepend-inner-icon="mdi-calendar"
                                    outlined
                                    @blur="setDateValidation()"
                                    maxlength="24"
                                    v-model="period_date_input"
                                    dense
                                    style="margin-bottom:-30px;"
                                >
                                    <template v-slot:label>Period Date<span class="text-red">*</span></template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            v-model="period_date"
                        >
                            <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="period_date_model = false"
                            >
                                OK
                            </v-btn>
                        </v-date-picker>
                    </v-menu>
                    <span class="text-black60 fs12">Max 31 days can be selected</span>
                </v-col>
            </v-row>
        </div>
        <div class="ma12 wp100">
            <v-row>
                <v-col cols="12" md="6">
                    <div class="box-col-ep">
                        <v-row v-if="!comload">
                            <v-col cols="12" md="8" class="text-secondary mt5">
                                <span class="vertical-middle">Total EdenPoint Earned</span>
                                <img
                                    src="/icon/EdenPointEarned-Icon.svg"
                                    alt="icon buy"
                                    height="26px"
                                    width="26px"
                                    class="ml10 vertical-middle"
                                />
                            </v-col>
                            <v-col v-if="!comload" class="flex-align-end fs24 bold">
                                {{ formatUnitPrice(widget.total_earned_point) }}
                            </v-col>
                        </v-row>
                        <v-card>
                            <v-progress-linear
                                v-if="comload"
                                indeterminate
                                color="#50ABA3"
                            ></v-progress-linear>
                        </v-card>
                    </div>
                </v-col>
                <v-col cols="12" md="6">
                    <div class="box-col-ep">
                        <v-row v-if="!comload">
                            <v-col cols="12" md="8" class="text-secondary mt5">
                                <span class="vertical-middle">Total EdenPoint Redeemed</span>
                                <img
                                    src="/icon/EdenPointRedeemed-Icon.svg"
                                    alt="icon buy"
                                    height="26px"
                                    width="26px"
                                    class="ml10 vertical-middle"
                                />
                            </v-col>
                            <v-col v-if="!comload" class="flex-align-end fs24 bold">
                                {{ formatUnitPrice(widget.total_redeemed_point) }}
                            </v-col>
                        </v-row>
                        <v-card>
                            <v-progress-linear
                                v-if="comload"
                                indeterminate
                                color="#50ABA3"
                            ></v-progress-linear>
                        </v-card>
                    </div>
                </v-col>
            </v-row>
        </div>
        <div class="box-title-end">
            <v-row >
                <v-col class="flex-justify-center fs20 bold">
                    Total Current EdenPoint : {{ !comload? formatUnitPrice(widget.total_point) : '' }}
                </v-col>
                <v-col class="flex-align-end">
                    <v-btn
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="no-caps mr4"
                        @click="refreshData()"
                        v-privilege="'ep_log_rfs'"
                    >
                        <span class="text-black80">
                            <v-icon left>mdi-refresh</v-icon>
                            Refresh Data
                        </span>
                    </v-btn>
                    <div 
                        class="d-flex justify-end fs12 align-center mr-4" 
                        v-privilege="'ep_log_rfs'"
                    >
                        Last updated at {{this.$moment(widget.last_updated).format('DD/MM/YYYY HH:mm:ss')}}
                    </div>
                </v-col>
            </v-row>
        </div>
        <div class="box-body-table">
            <v-data-table
                :mobile-breakpoint="0"
                :headers="table.fields"
                :items="items"
                :loading="loading"
                :items-per-page="10"
                :footer-props="{
                    'items-per-page-options': [5, 10, 15, 20, 50]
                }"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>
                            {{ props.item.merchant.name }}<br>
                            <span class="second-color">{{ props.item.merchant.code }}</span>
                        </td>
                        <td>{{ props.item.merchant.business_type.name }}</td>
                        <td>{{ props.item.merchant.finance_area.name }}</td>
                        <td class="right">{{ formatUnitPrice(props.item.merchant.total_point) }}</td>
                        <td class="right">{{ formatUnitPrice(props.item.earned_point) }}</td>
                        <td class="right">{{ formatUnitPrice(props.item.redeemed_point) }}</td>
                        <td>
                            <v-menu>
                                <template v-slot:activator="{ on: menu }">
                                    <v-btn
                                        icon
                                        v-on="{ ...menu }"
                                    ><v-icon dark>mdi-dots-vertical</v-icon></v-btn>
                                </template>
                                <v-list class="bg-white">
                                    <v-list-item  :to="{name: 'EdenPointLogDetail', params: { id: props.item.merchant.id }}" v-privilege="'ep_log_rdd'">
                                        <v-list-item-content>
                                            <v-list-item-title>Detail</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
    </v-container>
</template>

<script>
    import Vue from 'vue'
    export default {
        name: "EdenPointLogList",
        data() {
            return {
                filterDropdown : false,
                period_date_model : '',
                period_date : [new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10)],
                period_date_input : new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10),
                comload: false,
                loading: false,
                overlay: false,
                render: true,
                filter:{
                    area_id:'',
                    business_type:'',
                    merchant_id:''
                },
                table: {
                    fields: [
                        {
                            text:'Merchant Name',
                            width: "20%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Business Type',
                            width: "15%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Area',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Current EdenPoint',
                            width: "18%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                            align: "right"
                        },
                        {
                            text:'Earned EdenPoint',
                            width: "18%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                            align: "right"
                        },
                        {
                            text:'Redeemed EdenPoint',
                            width: "18%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                            align: "right"
                        },
                        {
                            width: "5%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                    ],
                },
                widget:{},
                items:[],
                error: {},
            }
        },
        mounted() {
            Vue.nextTick(() => {
                this.items = []
                this.renderData()
            });
        },
        methods: {
            //For geting data EdenPoint Campaign
            renderData(){
                this.comload = true;
                this.render = true
                this.loading = true;
                this.items = []
                this.widget = {}
                let area_id = ''
                if(this.filter.area_id){
                    area_id = '|merchant.financearea.id.e:' + this.filter.area_id
                }
                let business_type_id = ''
                if(this.filter.business_type){
                    business_type_id = '|merchant.businesstype.id.e:' + this.filter.business_type
                }
                let merchant_id = ''
                if(this.filter.merchant_id){
                    merchant_id = '|merchant.id.e:' + this.filter.merchant_id
                }
                let period_date = ''
                if (this.period_date.length > 0) {
                    if (this.period_date.length == 1) {
                        period_date = 'summarydate.gte:' + this.period_date[0] + '|summarydate.lte:' + this.period_date[0]
                    } else {
                        let date = this.period_date[0]
                        let date2 = this.period_date[1]
                        if (date > date2) {
                            period_date = 'summarydate.gte:' + date2 + '|summarydate.lte:' + date
                        } else {
                            period_date = 'summarydate.gte:' + date + '|summarydate.lte:' + date2
                        }
                    }
                }
                this.$http.get("/campaign/eden-point-log",{params:{
                    conditions: period_date + area_id + business_type_id + merchant_id,
                    orderby: '-summarydate,merchant',
                }}).then(response => {
                    this.loading = false;
                    if (response.data.data.merchant_point_summary && response.data.data.merchant_point_summary != null) {
                        this.items = response.data.data.merchant_point_summary
                        this.widget = response.data.data.points
                    } else {
                        this.items = []
                        this.widget = response.data.data.points
                    }
                    this.comload = false;
                });
            },
            // For validation and change date format
            setDateValidation() {
                if (this.period_date_input == '' || !this.period_date_input) {
                    this.period_date_input = new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10)
                    this.period_date = [new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10)]
                }
            },
            //For Filter Area
            areaSelected(d){
                this.filter.area_id = '';
                if(d){
                    this.filter.area_id = d.id;
                }
                this.renderData()

            },
            //For Filter Business Type
            businesstypeSelected(d){
                this.filter.business_type = '';
                if(d){
                    this.filter.business_type = d.id;
                }
                this.renderData()
            },
            //For Filter Merchant
            merchantSelected(d) {
                this.filter.merchant_id = ""
                if(d){
                    this.filter.merchant_id = d.id
                }
                this.renderData()
            },
            //For button Refresh data 
            refreshData(){
                this.$http.get("/campaign/eden-point-log/reset").then(response => {
                    this.renderData()
                });
            }
        },
        watch: {
            //For Filter by Period EdenPoint Campaign
            'period_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.period_date[0] = this.$moment(val).format('YYYY-MM-DD')
                                if (this.render == true) {
                                    Vue.nextTick(() => {
                                        this.items = []
                                        this.renderData()
                                    });
                                }
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0, 10)
                            let date2 = val.substr(14, 23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                if (this.period_date.length == 2) {
                                    let date3 = new Date(this.period_date[0])
                                    let date4 = new Date(this.period_date[1])
                                    if (parseInt((date4 - date3) / (24 * 3600 * 1000)) > 30 || parseInt((date4 - date3) / (24 * 3600 * 1000)) < -30) {
                                        if (date4 < date3) {
                                            this.render = false
                                            this.period_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                            this.period_date.splice(1, 1)
                                        } else {
                                            this.render = false
                                            this.period_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                            this.period_date.splice(1, 1)
                                        }
                                    } else {
                                        Vue.nextTick(() => {
                                            this.items = []
                                            this.renderData()
                                        });
                                    }
                                }
                            }
                        }
                    } 
                },
                deep: true
            },
            //For Filter by Period EdenPoint Campaign
            'period_date': {
                handler: function (val) {
                    if (val) {
                        this.period_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
        },
    }
</script>