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
                        :clear="clearGroup"
                    ></SelectSalesGroup>
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
                                        Submitted Date
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
                    <SelectTaskTipe
                        v-model="task_type"
                        :default="1"
                        :dense="true"
                        @selected="taskTypeSelected"
                        v-privilege="'filter_rdl'"
                    ></SelectTaskTipe>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-select
                        v-model="statuses"
                        :items="status"
                        label="Status"
                        item-text="text"
                        item-value="value"
                        outlined
                        dense
                    ></v-select>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-select
                        v-model="out_of_route"
                        :items="out_of_route_options"
                        label="Out Of Route"
                        item-text="text"
                        item-value="value"
                        outlined
                        dense
                    ></v-select>
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
                        <td>{{ props.item.sales_assignment ? props.item.sales_assignment.sales_group.name : props.item.sales_group ? props.item.sales_group.name : "-"}}</td>
                        <td>{{ props.item.salesperson ? props.item.salesperson.name : "-" }}</td>
                        <td>{{ props.item.task ? props.item.task : "-" }}</td>
                        <td>{{ props.item.out_of_route === 1 ? "Yes" : "No" }}</td>
                        <td>{{ props.item.submit_date == '0001-01-01T00:00:00Z' ? '-' : props.item.submit_date | moment("YYYY-MM-DD HH:mm:ss") }}</td>
                        <td>{{ props.item.finish_date == '0001-01-01T00:00:00Z' ? '-' : props.item.finish_date | moment("YYYY-MM-DD HH:mm:ss") }}</td>
                        <td>
                            <div v-if="props.item.status == 2">
                                <v-chip
                                    :color="statusMaster('finished')"
                                    small
                                >Finished</v-chip>
                            </div>
                            <div v-if="props.item.status == 14">
                                <v-chip
                                    :color="statusMaster('failed')"
                                    small
                                >Failed</v-chip>
                            </div>
                        </td>
                        <td>
                            <v-menu offset-y>
                                <template v-slot:activator="{ on: menu }">
                                    <v-btn
                                        icon
                                        v-on="{ ...menu }"
                                    ><v-icon dark>mdi-dots-vertical</v-icon></v-btn>
                                </template>
                                <v-list class="bg-white">
                                    <v-list-item  :to="`/sales/submission/detail/${props.item.id}/`+task_type" v-privilege="'sla_sub_rdd'">
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
        name: "SubmissionList",
        data() {
            return {
                id: '',
                showFilter : false,
                loading: false,
                items: [],
                overlay: false,
                statuses: 999,
                status: [
                    {
                        text: 'All Status',
                        value: 999
                    },
                    {
                        text: 'Finished',
                        value: 2
                    },
                    {
                        text: 'Failed',
                        value: 14
                    }
                ],
                out_of_route: 999,
                out_of_route_options: [
                    {
                        text: 'Show All',
                        value: 999
                    },
                    {
                        text: 'Yes',
                        value: 1
                    },
                    {
                        text: 'No',
                        value: 0
                    }
                ],
                table: {
                    fields: [
                        {
                            text: 'Group',
                            width: "20%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text: 'Salesperson',
                            width: "30%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
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
                            text: 'Submitted Date',
                            width: "15%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Finished Date',
                            width: "15%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Status',
                            width: "5%",
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
                salesperson: '',
                task_type:1,
                clearGroup:false,
                error: {},
            }
        },
        mounted() {
            this.renderData('')
        },
        methods: {
            // For get data from API
            renderData() {
                this.loading = true;
                this.overlay = true;
                this.items = []
                let salesGroup = ''
                if (this.sales_group_id) {
                    if (this.task_type == 3){
                        salesGroup = '|salesperson.sales_group_id.e:' + this.sales_group_id
                    } else {
                        salesGroup = '|salesperson.sales_group_id.e:' + this.sales_group_id
                    }
                }
                let submittedDate = ''
                if (this.submitted_date.length > 0) {
                    if (this.submitted_date.length == 1) {
                            submittedDate = 'submit_date.gte:'+this.submitted_date[0]+'T00:00:00Z'+ '|submit_date.lte:'+this.submitted_date[0]+'T23:59:59Z'
                    } else {
                        let date = this.submitted_date[0]
                        let date2 = this.submitted_date[1]
                        if (date > date2) {
                            submittedDate = 'submit_date.gte:'+date2+'T00:00:00Z'+ '|submit_date.lte:'+date+'T23:59:59Z'
                        } else {
                            submittedDate = 'submit_date.gte:'+date+'T00:00:00Z'+ '|submit_date.lte:'+date2+'T23:59:59Z'
                        }
                    }
                }
                let salespersonID = ''
                if (this.salesperson) {
                    salespersonID = "|salesperson_id.e:" + this.salesperson
                }
                let taskType = ''
                let forEmbeds = ''
                if(this.task_type){
                    taskType = this.task_type
                    if(taskType == 3){
                        forEmbeds = 'Salesperson'
                    }else{
                        forEmbeds = 'Salesperson,salesassignment,salesassignment.salesgroup'
                    }
                }
                let status = ''
                if(this.statuses === 999){
                    status = ''
                }else{
                    status= '|status.icontains:'+this.statuses
                }
                let oor = ''
                if(this.out_of_route === 999){
                    oor = ''
                }else{
                    oor = this.out_of_route === 1 ? '|out_of_route:1' : '|out_of_route.in:0.2'
                }
                this.$http.get("/sales/assignment/submission", {
                    params: {
                        perpage: 100,
                        embeds: forEmbeds,
                        task: taskType,
                        conditions: submittedDate+salesGroup+salespersonID+status+oor,
                        orderby: '-submit_date',
                    }
                }).then(response => {
                    this.loading = false;
                    this.items = response.data.data
                    if (this.items === null) {
                        this.items = []
                    }
                    this.overlay = false;
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
            // For select task type filter
            taskTypeSelected(val) {
                this.task_type = null;
                if (val){
                    this.task_type = val.value;
                    if(this.task_type == 3){
                        this.sales_group_id = '';
                        this.clearGroup = true
                    }else{
                        this.clearGroup = false
                    }
                }
            },
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
            'out_of_route': {
                handler: function (val) {
                    let that = this
                    that.renderData()
                },
                deep: true
            },
        },
    }
</script>
