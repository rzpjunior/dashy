<template>
    <v-container fill-height class="main-container">
        <div class="capsule mb16">
            Effective Call : 
            {{ itemDetail.effective_call_percentage ? itemDetail.effective_call_percentage.toFixed(2)+"%" : ' -' }}
        </div>
        <div class="box-end">
            <div class="fs16 bold mb12">
                Visit
            </div>
            <v-row>
                <v-col cols="12" md="6" lg="3">
                    <DetailRowNew :name="'Plan'" :value="itemDetail.visit_tracker ? (itemDetail.visit_tracker.total_plan ? itemDetail.visit_tracker.total_plan : '0') : '0'"/>
                </v-col>
                <v-col cols="12" md="6" lg="2">
                    <DetailRowNew :name="'Actual'" :value="itemDetail.visit_tracker.total_finished ? itemDetail.visit_tracker.total_finished : '0'"/>
                </v-col>
                <v-col cols="12" md="6" lg="2">
                    <DetailRowNew :name="'Failed'" :value="itemDetail.visit_tracker.total_failed ? itemDetail.visit_tracker.total_failed : '0'"/>
                </v-col>
                <v-col cols="12" md="6" lg="2">
                    <DetailRowNew :name="'Cancel'" :value="itemDetail.visit_tracker.total_cancelled ? itemDetail.visit_tracker.total_cancelled : '0'"/>
                </v-col>
                <v-col cols="12" md="6" lg="3">
                    <DetailRowNew :name="'Out of Route'" :value="itemDetail.visit_tracker.total_out_of_route ? itemDetail.visit_tracker.total_out_of_route : '0'"/>
                </v-col>
            </v-row>
            <div class="fs16 bold my12">
                Follow Up
            </div>
            <v-row>
                <v-col cols="12" md="6" lg="3">
                    <DetailRowNew :name="'Plan'" :value="itemDetail.follow_up_tracker ? (itemDetail.follow_up_tracker.total_plan ? itemDetail.follow_up_tracker.total_plan : '0') : '0'"/>
                </v-col>
                <v-col cols="12" md="6" lg="2">
                    <DetailRowNew :name="'Actual'" :value="itemDetail.follow_up_tracker.total_finished ? itemDetail.follow_up_tracker.total_finished : '0'"/>
                </v-col>
                <v-col cols="12" md="6" lg="2">
                    <DetailRowNew :name="'Failed'" :value="itemDetail.follow_up_tracker.total_failed ? itemDetail.follow_up_tracker.total_failed : '0'"/>
                </v-col>
                <v-col cols="12" md="6" lg="2">
                    <DetailRowNew :name="'Cancel'" :value="itemDetail.follow_up_tracker.total_cancelled ? itemDetail.follow_up_tracker.total_cancelled : '0'"/>
                </v-col>
                <v-col cols="12" md="6" lg="3">
                    <DetailRowNew :name="'Out of Route'" :value="itemDetail.follow_up_tracker.total_out_of_route ? itemDetail.follow_up_tracker.total_out_of_route : '0'"/>
                </v-col>
            </v-row>
        </div>
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
                    <v-select
                        v-model="task_type"
                        :items="task_type_list"
                        label="Task Type"
                        item-text="text"
                        item-value="value"
                        outlined
                        dense
                    ></v-select>
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
                                        Date
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            v-model="submitted_date"
                            :min="allowedDate[0]"
                            :max="allowedDate[1]"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-select
                        v-show="task_type != 3"
                        v-model="statuses"
                        :items="status"
                        label="Status"
                        item-text="text"
                        item-value="value"
                        outlined
                        dense
                    ></v-select>
                </v-col>
            </v-row>
        </div>
        <div class="box-start" v-if="task_type != 3">
            <v-data-table
                :mobile-breakpoint="0"
                :headers="table.fields"
                :items="items"
                :loading="loading"
                :items-per-page="10"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.item.salesperson ? props.item.salesperson.name : "-" }}<br>
                            <span class="text-black60">{{ props.item.sales_assignment ? props.item.sales_assignment.sales_group.name : "-"}}</span>
                        </td>
                        <td>{{ props.item.branch ? (props.item.branch.name ? props.item.branch.name : "-") : props.item.customer_acquisition ? props.item.customer_acquisition.name : "-" }}
                            <span class="text-red">{{ props.item.customer_type ? (props.item.customer_type == 2 ? "- (CA)" : "") : "" }}</span>
                        </td>
                        <td>{{ props.item.start_date | moment("YYYY-MM-DD") }}</td>
                        <td>{{ props.item.task ? props.item.task : "-" }}</td>
                        <td>{{ props.item.out_of_route === 1 ? "Yes" : "No" }}</td>
                        <td>{{ props.item.effective_call ? "Yes" : "No" }}</td>
                        <td>{{ props.item.revenue_effective_call ? formatPrice(props.item.revenue_effective_call) : "-" }}</td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                    small
                                ><span class="pa-md-2">Active</span></v-chip>
                            </div>
                            <div v-if="props.item.status == 2">
                                <v-chip
                                    :color="statusMaster('finished')"
                                    small
                                >Finished</v-chip>
                            </div>
                            <div v-if="props.item.status == 3">
                                <v-chip
                                    :color="statusMaster('cancelled')"
                                    small
                                >Cancelled</v-chip>
                            </div>
                            <div v-if="props.item.status == 14">
                                <v-chip
                                    :color="statusMaster('failed')"
                                    small
                                >Failed</v-chip>
                            </div>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <div class="box-start" v-if="task_type != 1 && task_type != 2">
            <v-data-table
                :mobile-breakpoint="0"
                :headers="table_ca.fields"
                :items="itemCA"
                :loading="loading"
                :items-per-page="10"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.item.salesperson ? props.item.salesperson.name : "-" }}<br>
                            <span class="text-black60">{{ props.item.sales_group ? props.item.sales_group.name : "-"}}</span>
                        </td>
                        <td>{{ props.item.name ? props.item.name : "-" }}</td>
                        <td>{{ props.item.submit_date | moment("YYYY-MM-DD") }}</td>
                        <td>{{ props.item.task ? props.item.task : "-" }}</td>
                        <td>{{ props.item.phone_number ? props.item.phone_number : "-" }}</td>
                        <td>{{ props.item.address_name ? props.item.address_name : "-" }}</td>
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
        name: "PerformanceDetail",
        data() {
            return {
                id: '',
                showFilter : false,
                loading: false,
                overlay: false,
                items: [{
                    sales_assignment: {
                        sales_group: {
                            name: ''
                        }
                    },
                    salesperson: {
                        name: ''
                    },
                    customer_type: '',
                    task: '',
                    start_date: '',
                    status: ''
                }],
                itemDetail: [{
                    effective_call_percentage: '',
                    follow_up_tracker: {
                        total_cancelled: '',
                        total_failed: '',
                        total_finished: '',
                        total_plan: ''
                    },
                    visit_tracker: {
                        total_cancelled: '',
                        total_failed: '',
                        total_finished: '',
                        total_plan: ''
                    },
                }],
                itemCA: [],
                statuses: 999,
                status: [
                    {
                        text: 'All Status',
                        value: 999
                    },
                    {
                        text: 'Active',
                        value: 1
                    },
                    {
                        text: 'Finished',
                        value: 2
                    },
                    {
                        text: 'Cancelled',
                        value: 3
                    },
                    {
                        text: 'Failed',
                        value: 14
                    }
                ],
                task_type: '',
                task_type_list: [
                    {
                        text: 'All Type',
                        value: ''
                    },
                    {
                        text: 'Visit',
                        value: 1
                    },
                    {
                        text: 'Follow Up',
                        value: 2
                    },
                    {
                        text: 'Customer Acquisition',
                        value: 3
                    }
                ],
                table: {
                    fields: [
                        {
                            text: 'Salesperson',
                            width: "17%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text: 'Outlet',
                            width: "17%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text: 'Assignment Date',
                            width: "8%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Task',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Out of Route',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Effective Call',
                            width: "11%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Revenue Effective Call',
                            width: "13%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Status',
                            width: "5%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                    ],
                },
                table_ca: {
                    fields: [
                        {
                            text: 'Salesperson',
                            width: "20%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text: 'Outlet',
                            width: "19%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text: 'Submitted Date',
                            width: "9%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Task',
                            width: "11%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Phone Number',
                            width: "9%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Address',
                            width: "26%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        }
                    ],
                },
                submitted_date_model: '',
                submitted_date: [],
                submitted_date_input: "",
                allowedDate: [],
                salesperson: this.$route.params.id,
                error: {},
            }
        },
        mounted() {
            this.decryptDate(this.$route.params.date)
            this.renderData()
        },
        methods: {
            // For get data from API
            renderData() {
                this.loading = true;
                this.overlay = true;
                this.items = []
                let assigmentDate = ''
                let submittedDate = ''
                let fromdate = ''
                let todate = ''
                if (this.submitted_date.length > 0) {
                    if (this.submitted_date.length == 1) {
                            assigmentDate = 'start_date.gte:'+this.submitted_date[0]+'T00:00:00Z'+ '|start_date.lte:'+this.submitted_date[0]+'T23:59:59Z'
                            submittedDate = 'submit_date.gte:'+this.submitted_date[0]+'T00:00:00Z'+ '|submit_date.lte:'+this.submitted_date[0]+'T23:59:59Z'
                            fromdate = this.submitted_date[0]
                            todate = this.submitted_date[0]
                    } else {
                        let date = this.submitted_date[0]
                        let date2 = this.submitted_date[1]
                        if (date > date2) {
                            assigmentDate = 'start_date.gte:'+date2+'T00:00:00Z'+ '|start_date.lte:'+date+'T23:59:59Z'
                            submittedDate = 'submit_date.gte:'+date2+'T00:00:00Z'+ '|submit_date.lte:'+date+'T23:59:59Z'
                            fromdate = date2
                            todate = date
                        } else {
                            assigmentDate = 'start_date.gte:'+date+'T00:00:00Z'+ '|start_date.lte:'+date2+'T23:59:59Z'
                            submittedDate = 'submit_date.gte:'+date+'T00:00:00Z'+ '|submit_date.lte:'+date2+'T23:59:59Z'
                            fromdate = date
                            todate = date2
                        }
                    }
                }
                let taskType = ''
                if(this.task_type){
                    if(this.task_type == 1){
                        taskType = '|task:' + this.task_type
                    }else if(this.task_type == 2){
                        taskType = '|task:' + this.task_type
                    }else if(this.task_type == 3){
                        taskType = '|task:' + this.task_type
                    }else{
                        taskType =  ''
                    }
                }
                let status = ''
                if(this.statuses === 999){
                    status = ''
                }else{
                    status= '|status:'+this.statuses
                }
                let salespersonID = ''
                if (this.salesperson) {
                    salespersonID = "|salesperson_id.e:" + this.salesperson
                }
                let forEmbeds = 'Salesperson,Salesperson,salesassignment,salesassignment.salesgroup,branch'
                // Get data list visit & follow up
                this.$http.get("/sales/assignment/submission", {
                    params: {
                        perpage: 100,
                        embeds: forEmbeds,
                        conditions: assigmentDate+salespersonID+taskType+status,
                        orderby: '-start_date',
                    }
                }).then(response => {
                    this.loading = false;
                    this.items = response.data.data
                    if (this.items === null) {
                        this.items = []
                    }
                    this.overlay = false;
                });
                // Get data list customer acquisition
                this.$http.get("/sales/assignment/submission", {
                    params: {
                        perpage: 100,
                        embeds: 'Salesperson',
                        task: 3,
                        conditions: submittedDate+salespersonID,
                        orderby: '-submit_date',
                    }
                }).then(responseCA => {
                    this.loading = false;
                    this.itemCA = responseCA.data.data
                    if (this.itemCA === null) {
                        this.itemCA = []
                    }
                    this.overlay = false;
                });
                // Get data detail performance
                this.$http.get("/sales/assignment/visit_tracker/"+this.salesperson, {
                    params: {
                        fromdate: fromdate,
                        todate: todate,
                    }
                }).then(responseDetail => {
                    if (responseDetail.data.data && responseDetail.data.data != null) {
                        this.itemDetail = responseDetail.data.data
                    } else {
                        this.itemDetail = []
                    }
                    this.overlay = false;
                });
            },
            // For decrypt date
            decryptDate(d){
                let arrDate = parseInt(d)
                arrDate = arrDate / 8
                arrDate = arrDate.toString()
                let date1 = arrDate.slice(0,4)+'-'+arrDate.slice(4,6)+'-'+arrDate.slice(6,8)
                let date2 = arrDate.slice(8,12)+'-'+arrDate.slice(12,14)+'-'+arrDate.slice(14,16)
                if (date1 > date2){
                    this.allowedDate = [date2,date1]
                } else {
                    this.allowedDate = [date1,date2]
                }
                this.submitted_date = [date1,date2]
                this.submitted_date_input = date1+' to '+date2
            }
        },
        watch: {
            'statuses': {
                handler: function (val) {
                    Vue.nextTick(() => {
                        this.renderData()
                    });
                },
                deep: true
            },
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
                                this.submitted_date[0] = this.$moment(date1).format('YYYY-MM-DD')
                                this.submitted_date[1] = this.$moment(date2).format('YYYY-MM-DD')
                                if (this.submitted_date.length == 2) {
                                    Vue.nextTick(() => {
                                        this.items = []
                                        this.renderData()
                                    });
                                }
                            }
                        }
                    } else if (val == "") {
                        this.submitted_date = []
                        Vue.nextTick(() => {
                            this.items = []
                            this.renderData()
                        });
                    }
                },
                deep: true
            },
            'submitted_date': {
                handler: function (val) {
                    if (val) {
                        this.submitted_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
            'task_type': {
                handler: function (val) {
                    let that = this
                    that.renderData()
                },
                deep: true
            },
        },
    }
</script>