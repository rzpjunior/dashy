<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-tabs v-model="tab" class="mb14">
                <v-tab :href="`/sales/assignment`"><b class="no-caps">Sales Assignment</b></v-tab>
                <v-tab :href="`/sales/assignment/objective`"><b class="no-caps">Sales Assignment Objective</b></v-tab>
            </v-tabs>
            <v-row class="-mb48">
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
                        <span>Search by Order Code</span>
                    </v-tooltip>
                </v-col>
            </v-row>
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
                    <v-select
                        v-model="statusObjective"
                        :items="status_objective"
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
                    <router-link :to="{ name: 'AssignmentObjectiveCreate' }" class="routerLink" v-privilege="'sla_obj_crt'">
                        <v-btn
                            depressed
                            color="#50ABA3"
                            class="no-caps bold white--text"
                        >Create Assignment Objective</v-btn>
                    </router-link>
                </v-col>
            </v-row>
        </div>
        <div class="box-body-table">
            <v-data-table
                :headers="table_objective.fields"
                :items="itemsObjective"
                :loading="loading"
                :items-per-page="10"
                :mobile-breakpoint="0"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{props.item.code ? props.item.code : '-'}}</td>
                        <td>{{props.item.name ? props.item.name : '-'}}</td>
                        <td>{{props.item.objective ? props.item.objective : '-'}}</td>
                        <td>
                            <a :href="props.item.surveylink" class="routerLink linkReload" target="_blank">{{props.item.surveylink ? props.item.surveylink : '-'}}</a>
                        </td>
                        <td>{{props.item.created_by ? (props.item.created_by.display_name ? props.item.created_by.display_name : '-') : '-'}}</td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                    small
                                ><span class="pa-md-2">Active</span></v-chip>
                            </div>
                            <div v-if="props.item.status == 2">
                                <v-chip
                                    :color="statusMaster('archived')"
                                    small
                                ><span class="pa-md-2">Archived</span></v-chip>
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
                                    <v-list-item v-privilege="'sla_obj_upd'" :to="`/sales/assignment/objective/update/${props.item.id}`" v-if="props.item.status == 1">
                                        <v-list-item-title>Update</v-list-item-title>
                                        <v-list-item-icon><v-icon>mdi-open-in-new</v-icon></v-list-item-icon>
                                    </v-list-item>
                                    <div class="px-md-2" v-if="props.item.status == 1">
                                        <hr>
                                    </div>
                                    <v-list-item v-privilege="'sla_obj_arc'" @click="changeStatus(props.item.status,props.item.id)" v-if="props.item.status == 1">
                                        <v-list-item-content>
                                            <v-list-item-title>Archive</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item v-privilege="'sla_obj_urc'" @click="changeStatus(props.item.status,props.item.id)" v-else>
                                        <v-list-item-content>
                                            <v-list-item-title>Unarchive</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item @click="seeHistory(props.item.id)">
                                        <v-list-item-content>
                                            <v-list-item-title>See History</v-list-item-title>
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
        <AuditLogNew :data="dataAuditLog"/>
    </v-container>
</template>
<script>
    import Vue from 'vue'
    export default {
        name: "AssignmentObjectiveList",
        data() {
            return {
                showFilter : false,
                loading: false,
                statusObjective: 999,
                status_objective: [
                    {
                        text: 'All Status',
                        value: 999
                    },
                    {
                        text: 'Active',
                        value: 1
                    },
                    {
                        text: 'Archived',
                        value: 2
                    }
                ],
                ConfirmData : {},
                dataAuditLog : {},
                itemsObjective:[],
                table_objective: {
                    fields: [
                        {
                            text:'Code',
                            width: "8%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Assignment Name',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Objective',
                            width: "37%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Survey Link',
                            width: "25%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Created By',
                            width: "15%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Status',
                            width: "3%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'',
                            width:'2%',
                            sortable: false
                        },
                    ]
                },
                tab: '/sales/assignment/objective',
                search: '',
            }
        },
        created() {
            this.renderDataObjective()
        },
        mounted() {
            let self = this
            this.$root.$on('event_success', function(res){
                if (res) {
                    self.renderDataObjective()
                }
            });
        },
        methods: {
            // For Render Data Assignment Objective
            renderDataObjective(){
                this.loading = true;
                this.itemsObjective = []
                let statusObj = ''
                if(this.statusObjective === 999){
                    statusObj = ''
                }else{
                    statusObj= this.statusObjective
                }
                this.$http.get("/sales/assignment/objective",{params:{
                        perpage:100,
                        embeds:'created_by',
                        conditions:'Or.name.icontains:'+this.search+'%2COr.code.icontains:'+this.search+'|status.icontains:'+statusObj,
                        orderby:'-id',
                    }}).then(responseObjective => {
                        this.loading = false;
                        this.itemsObjective = responseObjective.data.data
                        if(this.itemsObjective === null){
                            this.itemsObjective = []
                    }
                });
            },
            // For Archive & Unarchive Assignment Objective
            changeStatus(val,id) {
                if (val=='1') {
                    this.ConfirmData = {
                        model : true,
                        status : true,
                        statusMsg : "Success to Archive this assignment objective",
                        title : "Archive",
                        text : "Are you sure want to Archive this assignment objective?",
                        urlApi : '/sales/assignment/objective/archive/'+id,
                        data : {}
                    }
                } else {
                    this.ConfirmData = {
                        model : true,
                        status : true,
                        statusMsg : "Success to Unarchive this assignment objective",
                        title : "Unarchive",
                        text : "Are you sure want to Unarchive this assignment objective?",
                        urlApi : '/sales/assignment/objective/unarchive/'+id,
                        data : {}
                    }
                }
            },
            //For see history audit log
            seeHistory(id) {
                this.dataAuditLog = {
                    model : true,
                    id: id,
                    type: "sales_assignment_objective"
                }
            },
        },
        watch: {
            'search': {
                handler: function (val) {
                    Vue.nextTick(() => {
                        this.renderDataObjective()
                    });
                },
                deep: true
            },
            'statusObjective': {
                handler: function (val) {
                    Vue.nextTick(() => {
                        this.renderDataObjective()
                    });
                },
                deep: true
            },
        },
    }
</script>