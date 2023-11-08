<template>
    <v-container fill-height class="main-container">
        <div class="box-title fs16 bold">
            Merchant Info
        </div>
        <div class="box-body">
            <v-row class="mb6">
                <v-col cols="12" md="6" class="-mb24">
                    <DetailRowNew :name="'Merchant Code'" :value="item_info.code"/>
                </v-col>
                <v-col cols="12" md="6" class="-mb24">
                    <DetailRowNew :name="'Merchant Name'" :value="item_info.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mb24">
                    <DetailRowNew :name="'Business Type'" :value="item_info.business_type.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mb24">
                    <DetailRowNew :name="'Area'" :value="item_info.finance_area.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mb24">
                    <DetailRowNew :name="'Total Current EdenPoint'" :value="formatUnitPrice(item_info.total_point)"/>
                </v-col>
            </v-row>
        </div>
        <div class="box-end">
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
            <v-row :class="filterDropdown? '-mb38':'hidden'">
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
                                    clearable
                                    maxlength="24"
                                    @click:clear="period_date = [],period_date_input =''"
                                    v-model="period_date_input"
                                    dense
                                >
                                    <template v-slot:label>Date</template>
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
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.item.sales_oder.code }}</td>
                        <td>{{ props.item.sales_oder.finished_at | moment("DD/MM/YYYY")}}</td>
                        <td>{{ props.item.eden_point_campaign? props.item.eden_point_campaign.name? props.item.eden_point_campaign.name : '-' : '-'}}</td>
                        <td>{{ props.item.created_date | moment("DD/MM/YYYY")}}</td>
                        <td class="right">{{ props.item.status == 1? formatUnitPrice(props.item.point_value) : 0 }}</td>
                        <td class="right">{{ props.item.status == 2? formatUnitPrice(props.item.point_value) : 0 }}</td>
                        <td class="right">{{ props.item.status == 3 || props.item.status == 4? formatUnitPrice(props.item.point_value) : 0 }}</td>
                        <td>{{ props.item.note }}</td>
                    </tr>
                </template>
            </v-data-table>
        </div>
    </v-container>
</template>

<script>
    import Vue from 'vue'
    export default {
        name: "EdenPointLogDetail",
        data() {
            return {
                filterDropdown : false,
                period_date_model : '',
                period_date : [],
                period_date_input : '',
                loading: false,
                item_info: {
                    name: '',
                    code: '',
                    business_type: {
                        name: ''
                    },
                    finance_area: {
                        name: ''
                    },
                    total_point: 0
                },
                items:[
                    {
                        sales_oder: {
                            code: '',
                            finished_at: ''
                        },
                        campaign: {
                            name: ''
                        },
                        created_date: '',
                        status: 0,
                        point_value: 0,
                        note: ''
                    }
                ],
                table: {
                    fields: [
                        {
                            text:'Sales Order',
                            width: "15%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'SO Finished Date',
                            width: "15%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Campaign',
                            width: "15%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'EdenPoint Created At',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Earned EdenPoint',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                            align: "right"
                        },
                        {
                            text:'Redeemed EdenPoint',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                            align: "right"
                        },
                        {
                            text:'Cancelled EdenPoint',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                            align: "right"
                        },
                        {
                            text:'Note',
                            width: "20%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                    ],
                },
            }
        },
        methods:{
            renderData(){
                let period_date = ''
                if (this.period_date.length > 0) {
                    if (this.period_date.length == 1) {
                        period_date = this.period_date[0] + '|' + this.period_date[0]
                    } else {
                        let date = this.period_date[0]
                        let date2 = this.period_date[1]
                        if (date > date2) {
                            period_date = date2 + '|' + date
                        } else {
                            period_date = date + '|' + date2
                        }
                    }
                }
                this.$http.get("/campaign/eden-point-log/" + this.$route.params.id,{params:{
                    period: period_date,
                    perpage: 100,
                    orderby: '-id',
                }}).then(response => {
                    if (response.data.data.point_logs && response.data.data.point_logs != null) {
                        this.item_info = response.data.data.merchant
                        this.items = response.data.data.point_logs
                    } else {
                        this.item_info = response.data.data.merchant
                        this.items = []
                    }
                });
            },
        },
        mounted() {
            this.renderData();
        },
        watch: {
            'period_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.period_date[0] = this.$moment(val).format('YYYY-MM-DD')
                                Vue.nextTick(() => {
                                    this.items = []
                                    this.renderData()
                                });
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0, 10)
                            let date2 = val.substr(14, 23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                this.period_date[0] = this.$moment(date1).format('YYYY-MM-DD')
                                this.period_date[1] = this.$moment(date2).format('YYYY-MM-DD')
                                if (this.period_date.length == 2) {
                                    Vue.nextTick(() => {
                                        this.items = []
                                        this.renderData()
                                    });
                                }
                            }
                        }
                    } else if (val == "") {
                        this.period_date = []
                        Vue.nextTick(() => {
                            this.items = []
                            this.renderData()
                        });
                    }
                },
                deep: true
            },
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