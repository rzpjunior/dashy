<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="-mb38">
                <v-col cols="12" md="4">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }">
                            <v-text-field
                                dense
                                v-model="search"
                                outlined
                                filled
                                placeholder="Search..."
                                v-on="{ ...tooltip }"
                                prepend-inner-icon="search"
                            ></v-text-field>
                        </template>
                        <span>Search by salesperson name</span>
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row class="hr-title"/>
            <v-row :class="filter?'mb24':''">
                <v-col>
                    Filter 
                    <v-btn 
                        depressed
                        x-small
                        @click="filter = !filter"
                        v-if="filter"
                        class="no-caps fs12"
                    >
                        Hide<v-icon right>mdi-chevron-up</v-icon>
                    </v-btn>
                    <v-btn 
                        depressed
                        x-small
                        @click="filter = !filter"
                        v-else
                        class="no-caps fs12"
                    >
                        Show<v-icon right>mdi-chevron-down</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row :class="filter? '':'hidden'">
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
                        v-model="finish_date_model"
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
                                    @click:clear="finish_date = [],finish_date_input = ''"
                                    v-model="finish_date_input"
                                    maxlength="24"
                                    dense
                                >
                                    <template v-slot:label>
                                        Finish Date
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            persistent-hint
                            v-model="finish_date"
                        ></v-date-picker>
                    </v-menu>
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
            </v-row>
        </div>
        <div class="box-title">
            <v-row >
                <v-col class="fs24 bold">
                    Batch: {{batch_name}}
                </v-col>
            </v-row>
        </div>
        <div class="box-body-table">
            <v-data-table
                :headers="table.fields"
                :items="items"
                :loading="loading"
                :items-per-page="10"
                :mobile-breakpoint="0"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{props.item.salesperson.name}}</td>
                        <td>{{props.item.task}}</td>
                        <td>{{props.item.branch ? props.item.branch.code+' - '+props.item.branch.name : '-'}}</td>
                        <td>{{props.item.start_date|moment("YYYY-MM-DD")}}</td>
                        <td>{{props.item.end_date|moment("YYYY-MM-DD")}}</td>
                        <td>{{props.item.finish_date == '0001-01-01T00:00:00Z' ? '-' : props.item.finish_date|moment("YYYY-MM-DD HH:mm:ss")}}</td>
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
                        <td>
                            <v-menu offset-y v-if="props.item.status == 1">
                                <template v-slot:activator="{ on: menu }">
                                    <v-btn
                                        icon
                                        v-on="{ ...menu }"
                                    ><v-icon dark>mdi-dots-vertical</v-icon></v-btn>
                                </template>
                                <v-list class="bg-white">
                                    <v-list-item v-privilege="'sla_can'" @click="changeStatus(props.item.id)">
                                        <v-list-item-content>
                                            <v-list-item-title>Cancel</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </template>
                <v-alert slot="no-results" :value="true" color="error" icon="warning">
                    Your search for "{{ search }}" found no results.
                </v-alert>
            </v-data-table>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </v-container>
</template>
<script>
    import Vue from 'vue'
    export default {
        name: "SalesAssignmentDetail",
        data() {
            return {
                filter : false,
                search: '',
                batch_name: '',
                loading: false,
                finish_date_model: '',
                finish_date_input: '',
                finish_date: [],
                ConfirmData : {},
                items:[],
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
                    }
                ],
                table: {
                    fields: [
                        {
                            text:'Salesperson',
                            width: "20%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Task',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Customer',
                            width: "25%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Start Date',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'End Date',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Finish Date',
                            width: "12%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Status',
                            width: "5%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'',
                            width:'3%',
                            sortable: false
                        },
                    ]
                },
            }
        },
        created() {
            this.renderData()
        },
        mounted() {
            let self = this
            this.$root.$on('event_success', function(res){
                if (res) {
                    self.renderData()
                }
            });
        },
        methods: {
            renderData(){
                this.loading = true;
                this.items = []
                let searchKey = ''
                if (this.search) {
                    searchKey = this.search
                }
                let finishDate = ''
                if (this.finish_date.length > 0) {
                    if (this.finish_date.length == 1) {
                        finishDate = '|finish_date.gte:'+this.finish_date[0]+'T00:00:00Z'+ '|finish_date.lte:'+this.finish_date[0]+'T24:59:59Z'
                    } else {
                        let date = this.finish_date[0]
                        let date2 = this.finish_date[1]
                        if (date > date2) {
                            finishDate = '|finish_date.gte:'+date2+'T00:00:00Z'+ '|finish_date.lte:'+date+'T24:59:59Z'
                        } else {
                            finishDate = '|finish_date.gte:'+date+'T00:00:00Z'+ '|finish_date.lte:'+date2+'T24:59:59Z'
                        }
                    }
                }
                let taskType = ''
                if(this.task_type){
                    if(this.task_type == 1){
                        taskType = '|task:' + this.task_type
                    }else if(this.task_type == 2){
                        taskType = '|task:' + this.task_type
                    }else{
                        taskType =  ''
                    }
                }
                let status = ''
                if(this.statuses === 999){
                    status = ''
                }else{
                    status= '|status:' + this.statuses
                }
                this.$http.get("/sales/assignment/item",{params:{
                        perpage:100,
                        embeds:'salesperson_id,branch_id,sales_assignment_id',
                        conditions:'Or.salesperson.name.icontains:'+searchKey+'|sales_assignment_id.e:'+
                            this.$route.params.id+finishDate+status+taskType,
                        orderby:'-id',
                    }}).then(response => {
                        this.loading = false;
                        this.items = response.data.data
                        if(this.items === null){
                            this.items = []
                        }else{
                            this.batch_name = this.items[0].sales_assignment.code
                        }
                });
            },
            //For Cancel Assignment
            changeStatus(id) {
                this.ConfirmData = {
                    model : true,
                    status : true,
                    statusMsg : "Success to cancel this task",
                    title : "Cancel task",
                    text : "Are you sure want to Cancel this task?",
                    urlApi : "/sales/assignment/cancel/item/"+id,
                    data : {}
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
            'search': {
                handler: function (val) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function(){
                        that.renderData()
                    }, 1000);
                },
                deep: true
            },
            'finish_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.finish_date[0] = this.$moment(val).format('YYYY-MM-DD')
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
                                this.finish_date[0] = this.$moment(date1).format('YYYY-MM-DD')
                                this.finish_date[1] = this.$moment(date2).format('YYYY-MM-DD')
                                if (this.finish_date.length == 2) {
                                    Vue.nextTick(() => {
                                        this.items = []
                                        this.renderData()
                                    });
                                }
                            }
                        }
                    } else if (val == "") {
                        this.finish_date = []
                        Vue.nextTick(() => {
                            this.items = []
                            this.renderData()
                        });
                    }
                },
                deep: true
            },
            'finish_date': {
                handler: function (val) {
                    if (val) {
                        this.finish_date_input = this.formatDateRange(val)
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