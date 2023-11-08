<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-tabs v-model="tab" class="mb14">
                <v-tab :href="`/sales/assignment`"><b class="no-caps">Sales Assignment</b></v-tab>
                <v-tab :href="`/sales/assignment/objective`"><b class="no-caps">Sales Assignment Objective</b></v-tab>
            </v-tabs>
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
                        <v-icon right>
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
                        <v-icon right>
                            mdi-chevron-down
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row :class="showFilter? '':'hidden'">
                <v-col cols="12" md="3" class="-mt24">
                   <SelectSalesGroup
                        @selected="salesGroupSelected"
                        :dense="true"
                        :norequired="true"
                    ></SelectSalesGroup>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="start_date_model"
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
                                    @click:clear="start_date = [],start_date_input = ''"
                                    v-model="start_date_input"
                                    maxlength="24"
                                    dense
                                >
                                    <template v-slot:label>
                                        Start Date
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            persistent-hint
                            v-model="start_date"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="end_date_model"
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
                                    @click:clear="end_date = [],end_date_input = ''"
                                    v-model="end_date_input"
                                    maxlength="24"
                                    dense
                                >
                                    <template v-slot:label>
                                        End Date
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            persistent-hint
                            v-model="end_date"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-select
                        v-model="statuses"
                        :items="status"
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
                 <v-col class="flex-align-end">
                    <router-link :to="{ name: 'AssignmentCreate' }" class="routerLink" v-privilege="'sla_exp'">
                        <v-btn
                            depressed
                            color="#50ABA3"
                            class="no-caps bold white--text"
                        >Create Assignment</v-btn>
                    </router-link>
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
                        <td>{{props.item.code}}</td>
                        <td>{{props.item.sales_group.name}}</td>
                        <td>{{props.item.sales_group.sls_man.name}}</td>
                        <td>{{props.item.start_date | moment("YYYY-MM-DD")}}</td>
                        <td>{{props.item.end_date | moment("YYYY-MM-DD")}}</td>
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
                                    <v-list-item v-privilege="'sla_rdd'" :to="`/sales/assignment/detail/${props.item.id}`">
                                        <v-list-item-title>Detail</v-list-item-title>
                                        <v-list-item-icon><v-icon>mdi-open-in-new</v-icon></v-list-item-icon>
                                    </v-list-item>
                                    <div class="px-md-2" v-if="props.item.status == 1">
                                        <hr>
                                    </div>
                                    <v-list-item v-privilege="'sla_can'" @click="changeStatus(props.item.id)" v-if="props.item.status == 1">
                                        <v-list-item-content>
                                            <v-list-item-title>Cancel</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </v-container>
</template>
<script>
    import Vue from 'vue'
    export default {
        name: "SalesAssignmentList",
        data() {
            return {
                showFilter : false,
                loading: false,
                start_date_model: '',
                start_date_input: '',
                start_date: [],
                end_date_model: '',
                end_date_input: '',
                end_date: [],
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
                ],
                sales_group_id: "",
                ConfirmData : {},
                items:[],
                table: {
                    fields: [
                        {
                            text:'Batch',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Sales Group',
                            width: "20%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Sales Manager',
                            width: "20%",
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
                tab: '/sales/assignment',
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
            // For Render Data Assignment List
            renderData(){
                this.loading = true;
                this.items = []
                let salesGroup = ''
                if (this.sales_group_id) {
                    salesGroup = '|sales_group_id.e:' + this.sales_group_id
                }
                let startDate = ''
                if (this.start_date.length > 0) {
                    if (this.start_date.length == 1) {
                        startDate = '|start_date:' + this.start_date[0]
                    } else {
                        let date = this.start_date[0]
                        let date2 = this.start_date[1]
                        if (date > date2) {
                            startDate = '|start_date.gte:' + date2 + '|start_date.lte:' + date
                        } else {
                            startDate = '|start_date.gte:' + date + '|start_date.lte:' + date2
                        }
                    }
                }
                let endDate = ''
                if (this.end_date.length > 0) {
                    if (this.end_date.length == 1) {
                        endDate = '|end_date:' + this.end_date[0]
                    } else {
                        let date = this.end_date[0]
                        let date2 = this.end_date[1]
                        if (date > date2) {
                            endDate = '|end_date.gte:' + date2 + '|end_date.lte:' + date
                        } else {
                            endDate = '|end_date.gte:' + date + '|end_date.lte:' + date2
                        }
                    }
                }
                let status = ''
                if(this.statuses === 999){
                    status = ''
                }else{
                    status= this.statuses
                }
                this.$http.get("/sales/assignment",{params:{
                        perpage:100,
                        embeds:'sales_group_id,sales_group_id.sls_man_id',
                        conditions:'Or.status.icontains:'+status+salesGroup+startDate+endDate,
                        orderby:'-id',
                    }}).then(response => {
                        this.loading = false;
                        this.items = response.data.data
                        if(this.items === null){
                            this.items = []
                    }
                });
            },
            // For cancel assignment
            changeStatus(id) {
                this.ConfirmData = {
                    model : true,
                    status : true,
                    statusMsg : "Success to cancel this sales assignment",
                    title : "Cancel Sales Assignment",
                    text : "Are you sure want to Cancel this sales assignment?",
                    urlApi : "/sales/assignment/cancel/"+id,
                    data : {}
                }
            },
            // For select sales group filter
            salesGroupSelected(d) {
                this.sales_group_id = '';
                if(d){
                    this.sales_group_id = d.id
                }
                Vue.nextTick(() => {
                    this.renderData()
                });
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
            'start_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.start_date[0] = this.$moment(val).format('YYYY-MM-DD')
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
                                this.start_date[0] = this.$moment(date1).format('YYYY-MM-DD')
                                this.start_date[1] = this.$moment(date2).format('YYYY-MM-DD')
                                if (this.start_date.length == 2) {
                                    Vue.nextTick(() => {
                                        this.items = []
                                        this.renderData()
                                    });
                                }
                            }
                        }
                    } else if (val == "") {
                        this.start_date = []
                        Vue.nextTick(() => {
                            this.items = []
                            this.renderData()
                        });
                    }
                },
                deep: true
            },
            'start_date': {
                handler: function (val) {
                    if (val) {
                        this.start_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
            'end_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.end_date[0] = this.$moment(val).format('YYYY-MM-DD')
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
                                this.end_date[0] = this.$moment(date1).format('YYYY-MM-DD')
                                this.end_date[1] = this.$moment(date2).format('YYYY-MM-DD')
                                if (this.end_date.length == 2) {
                                    Vue.nextTick(() => {
                                        this.items = []
                                        this.renderData()
                                    });
                                }
                            }
                        }
                    } else if (val == "") {
                        this.end_date = []
                        Vue.nextTick(() => {
                            this.items = []
                            this.renderData()
                        });
                    }
                },
                deep: true
            },
            'end_date': {
                handler: function (val) {
                    if (val) {
                        this.end_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
        },
    }
</script>
