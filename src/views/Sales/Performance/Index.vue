<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row :class="showFilter?'mb24':''">
                <v-col>
                    Filter 
                    <v-btn 
                        depressed
                        x-small
                        @click="showFilter = !showFilter"
                        v-if="showFilter"
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
                        @click="showFilter = !showFilter"
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
            <v-row :class="showFilter? '':'hidden'">
                <v-col cols="12" md="3" class="-mt24">
                    <SelectSalesGroup
                        v-model="sales_group_id"
                        @selected="salesGroupSelected"
                        :norequired="true"
                        :dense="true"
                    ></SelectSalesGroup>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectSalesPerson
                        v-model="salesperson"
                        :norequired="true"
                        :dense="true"
                        @selected="salespersonSelected"
                        v-privilege="'filter_rdl'"
                    ></SelectSalesPerson>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="submitted_date_model"
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
                                    maxlength="24"
                                    v-model="submitted_date_input"
                                    dense
                                >
                                    <template v-slot:label>
                                        Assignment Date
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            v-model="submitted_date"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
            </v-row>
        </div>
        <div class="box-table">
            <v-data-table
                :mobile-breakpoint="0"
                :headers="table.fields"
                :items="items"
                :loading="loading"
                :items-per-page="10"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>
                            {{ props.item.salesperson ? props.item.salesperson.name : "-" }}<br>
                            <span class="text-black60">{{ props.item.sales_assignment ? props.item.sales_assignment.sales_group.name : "-"}}</span>
                        </td>
                        <td>
                            <span class="text-black60">Plan : </span>{{ props.item.plan_visit ? props.item.plan_visit : "-" }}<br>
                            <span class="text-black60">Actual : </span>{{ props.item.visit_actual ? props.item.visit_actual : "-" }}<br>
                            <span class="text-black60">Percentage : </span>{{ props.item.visit_percentage ? props.item.visit_percentage.toFixed(2)+"%" : "-" }}
                        </td>
                        <td>
                            <span class="text-black60">Plan : </span>{{ props.item.plan_follow_up ? props.item.plan_follow_up : "-" }}<br>
                            <span class="text-black60">Actual : </span>{{ props.item.follow_up_actual ? props.item.follow_up_actual : "-" }}<br>
                            <span class="text-black60">Percentage : </span>{{ props.item.follow_up_percentage ? props.item.follow_up_percentage.toFixed(2)+"%" : "-" }}<br>
                        </td>
                        <td>{{ props.item.total_ca ? props.item.total_ca : "-" }}</td>
                        <td>{{ props.item.revenue_effective_call ? formatPrice(props.item.revenue_effective_call) : "-" }}</td>
                        <td>{{ props.item.revenue_total ? formatPrice(props.item.revenue_total) : "-" }}</td>
                        <td>{{ props.item.effective_call_percentage ? props.item.effective_call_percentage.toFixed(2)+"%" : "-" }}</td>
                        <td>
                            <v-menu offset-y>
                                <template v-slot:activator="{ on: menu }">
                                    <v-btn
                                        icon
                                        v-on="{ ...menu }"
                                    ><v-icon dark>mdi-dots-vertical</v-icon></v-btn>
                                </template>
                                <v-list class="bg-white">
                                    <v-list-item  :to="`/sales/sales-performance/detail/${convert_date}/${props.item.salesperson.id}`" v-privilege="'slp_rdd'">
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
        <LoadingBar :value="overlay"/>
    </v-container>
</template>
<script>
    import Vue from 'vue'
    export default {
        name: "PerformanceList",
        data() {
            return {
                id: '',
                showFilter : false,
                loading: false,
                items: [{
                    sales_assignment: {
                        sales_group: {
                           name: "",
                        }
                    },
                    salesperson: {
                        id: "",
                        name: ""
                    },
                    plan_visit: "",
                    plan_follow_up: "",
                    total_success: "",
                    visit_percentage: "",
                    follow_up_percentage: "",
                    effective_call_percentage: "",
                    total_ca: ""
                }],
                overlay: false,
                table: {
                    fields: [
                        {
                            text: 'Salesperson',
                            width: "18%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text: 'Visit',
                            width: "14%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Follow Up',
                            width: "14%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Customer Acquisition',
                            width: "14%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Revenue Effective Call',
                            width: "16%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Revenue Total',
                            width: "16%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Effective Call',
                            width: "8%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            width: "2%",
                            sortable: false
                        },
                    ],
                },
                sales_group_id: "",
                submitted_date_model: '',
                submitted_date: [new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10)],
                submitted_date_input: new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10),
                convert_date: '',
                salesperson: '',
                error: {},
            }
        },
        mounted() {
            this.encryptDate()
            this.renderData('')
        },
        methods: {
            // For get data from API
            renderData() {
                this.loading = true;
                this.overlay = true;
                this.items = []
                let salesGroup = ''
                let salesgroup_id = ''
                if (this.sales_group_id) {
                    salesGroup = '|salesperson.sales_group_id.e:' + this.sales_group_id
                    salesgroup_id = this.sales_group_id
                }
                let salespersonID = ''
                let salesperson_id = ''
                if (this.salesperson) {
                    salespersonID = "|salesperson_id.e:" + this.salesperson
                    salesperson_id = this.salesperson
                }
                let submittedDate = ''
                let date = ''
                let date2 = ''
                let fromdate = ''
                let todate = ''
                if (this.submitted_date.length > 0) {
                    if (this.submitted_date.length == 1) {
                        submittedDate = 'start_date.gte:'+this.submitted_date[0]+'T00:00:00Z'+ '|start_date.lte:'+this.submitted_date[0]+'T23:59:59Z'
                        date = this.submitted_date[0]
                        date2 = this.submitted_date[0]
                        fromdate = date
                        todate = date2
                    } else {
                        date = this.submitted_date[0]
                        date2 = this.submitted_date[1]
                        if (date > date2) {
                            submittedDate = 'start_date.gte:'+date2+'T00:00:00Z'+ '|start_date.lte:'+date+'T23:59:59Z'
                            fromdate = date2
                            todate = date
                        } else {
                            submittedDate = 'start_date.gte:'+date+'T00:00:00Z'+ '|start_date.lte:'+date2+'T23:59:59Z'
                            fromdate = date
                            todate = date2
                        }
                    }
                }
                this.$http.get("/sales/assignment/visit_tracker", {
                    params: {
                        perpage: 100,
                        embeds: 'Salesperson,Salesperson,salesassignment,salesassignment.salesgroup',
                        fromdate: fromdate,
                        todate: todate,
                        salesgroup_id: salesgroup_id,
                        salesperson_id: salesperson_id,
                        conditions: submittedDate+salesGroup+salespersonID,
                        orderby: '-start_date',
                    }
                }).then(response => {
                    if (response.data && response.data.data) {
                        this.items = response.data.data
                    }
                    if (this.items === null) {
                        this.items = []
                    }
                    this.loading = false;
                    this.overlay = false;
                }).catch(e => {
                    this.loading = false;
                    this.overlay = false;
                    Vue.$toast.open({
                        position: 'top-right',
                        message: 'Something Wrong',
                        type: 'error',
                    });
                    this.notifToast("Something went wrong, please try again", "error")
                });
            },
            //For Filter Salesperson
            salespersonSelected(d) {
                this.salesperson = '';
                if (d) {
                    this.salesperson = d.id;
                }
                this.renderData()
            },
            // For select sales group filter
            salesGroupSelected(d) {
                this.sales_group_id = '';
                if(d){
                    this.sales_group_id = d.id
                }
                this.renderData()
            },
            // For encrypt date
            encryptDate(){
                let arrDate = []
                if(this.submitted_date.length == 1){
                    arrDate = [
                        this.submitted_date[0],
                        this.submitted_date[0]
                    ]
                } else if (this.submitted_date.length == 2) {
                    arrDate = [
                        this.submitted_date[0],
                        this.submitted_date[1]
                    ]
                }
                arrDate = arrDate.toString()
                arrDate = arrDate.replace(/-|,/g, "")
                arrDate = parseInt(arrDate) * 8
                this.convert_date = arrDate
            }
        },
        watch: {
            'submitted_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.submitted_date[0] = this.$moment(val).format('YYYY-MM-DD')
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
                                if (this.submitted_date.length == 2) {
                                    let date3 = new Date(this.submitted_date[0])
                                    let date4 = new Date(this.submitted_date[1])
                                    //To limit the range of days not more than 31 days
                                    if (parseInt((date4 - date3) / (24 * 3600 * 1000)) > 30 || parseInt((date4 - date3) / (24 * 3600 * 1000)) < -30) {
                                        if (date4 < date3) {
                                            this.submitted_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                            this.submitted_date.splice(1, 1)
                                        } else {
                                            this.submitted_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                            this.submitted_date.splice(1, 1)
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
            'submitted_date': {
                handler: function (val) {
                    if (val) {
                        this.submitted_date_input = this.formatDateRange(val)
                        this.encryptDate()
                    }
                },
                deep: true
            },
        },
    }
</script>
