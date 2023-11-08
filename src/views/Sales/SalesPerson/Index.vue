<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row>
                <v-col cols="12" md="4" class="h70">
                    <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }" v-privilege="'filter_rdl'">
                            <v-text-field
                                name="search"
                                v-model="search"
                                prepend-inner-icon="search"
                                placeholder="Search..."
                                outlined
                                filled
                                dense
                                v-on="{ ...tooltip }"
                            ></v-text-field>
                        </template>
                       <span>Search by code, name, display name</span>
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
                        @click="filter = !filter"
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
            <v-row :class="filter? '':'hidden'">
                <v-col cols="12" md="3" class="-mt24">
                    <v-select
                        v-model="statuses"
                        :items="status"
                        item-text="text"
                        item-value="value"
                        dense
                        outlined
                    ></v-select>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectArea
                        name= "area"
                        @selected="areaSelected"
                        :norequired="true"
                        :dense="true">
                    </SelectArea>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectSupervisor
                        :norequired="true"
                        :dense="true"
                        name="supervisor"
                        @selected="supervisorSelected">
                    </SelectSupervisor>
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row>
                <v-col class="flex-align-end">
                    <v-btn
                        depressed
                        color="#50ABA3"
                        to="/sales/person/bulkchange"
                        class="no-caps bold white--text"
                        v-privilege="'sps_blk_upl'"
                    >Bulk Change Salesperson</v-btn>
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
                        <td>
                            {{props.item.code}}<br>
                            <label style="color: #768F9C;">
                                {{ props.item.name }}
                            </label>
                        </td>
                        <td>{{props.item.display_name}}</td>
                        <td>{{props.item.parent == undefined ? "-" : props.item.parent.display_name}}</td>
                        <td>{{props.item.phone_number}}</td>
                        <td>{{props.item.area.name}}</td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                    small
                                ><span class="pa-md-2">Active</span></v-chip>
                            </div>
                            <div v-else-if="props.item.status == 2">
                                <v-chip
                                    :color="statusMaster('archived')"
                                    small
                                >Archived</v-chip>
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
                                    <v-list-item @click="changeStatus(props.item.status,props.item.id)" v-if="props.item.status=='1'" v-privilege="'sps_arc'">
                                        <v-list-item-content>
                                            <v-list-item-title>Archive</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <v-list-item @click="changeStatus(props.item.status,props.item.id)" v-else v-privilege="'sps_urc'">
                                        <v-list-item-content>
                                            <v-list-item-title>Unarchive</v-list-item-title>
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
                <v-alert slot="no-results" :value="true" color="error" icon="warning">
                    Your search for "{{ search }}" found no results.
                </v-alert>
            </v-data-table>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </v-container>
</template>

<script>
    export default {
        name: "SalesPerson",
        data() {
            return {
                search: '',
                filter : false,
                loading: false,
                statuses:1,
                area: "",
                area_id : "",
                supervisor_id: "",
                salesperson_id: "",
                ConfirmData : {},
                items:[],
                reload:false,
                table: {
                    fields: [
                        {
                            text:'Code',
                            width: "16%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Display Name',
                            width: "16%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Supervisor',
                            width: "16%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Phone Number',
                            width: "16%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Area',
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
                            width:'3%',
                            sortable: false
                        },
                    ]
                }
            }
        },
        created() {
            this.renderData('',this.statuses,this.area_id,this.supervisor_id)
        },
        mounted() {
            let self = this
            this.$root.$on('event_success', function(res){
                if (res) {
                    self.reload = true
                    self.renderData(self.search,self.statuses,self.area_id,self.supervisor_id)
                }
            });
        },
        methods: {
            areaSelected(d) {
                this.area_id = ''
                if (d) {
                    this.area_id = d.value
                }
                this.renderData(this.search,this.statuses,this.area_id,this.supervisor_id)
            },
            supervisorSelected(d) {
                this.supervisor_id = ''
                if (d) {
                    this.supervisor_id = d.id
                }
                this.renderData(this.search,this.statuses,this.area_id,this.supervisor_id)
            },
            renderData(search,statuses,area,supervisor){
                this.loading = true;
                this.items = []
                if(statuses === 999){
                    statuses = ''
                }else{
                    statuses= "|status:"+statuses
                }

                if(area != ""){
                    area = "|area.value:"+area
                }

                if(supervisor != "" && supervisor != undefined){
                    supervisor = "|parent_id.e:"+supervisor
                } else {
                    supervisor = ""
                }

                this.$http.get("/sales/person",{params:{
                        perpage:100,
                        embeds:'parent_id,area_id',
                        conditions:'Or.role_group:1|name.icontains:'+search+'%2COr.code.icontains:'
                        +search+'%2COr.display_name.icontains:'+search+statuses+area+supervisor,
                        orderby:'-id',
                    }}).then(response => {
                        this.loading = false;
                        this.items = response.data.data
                        if(this.items === null){
                            this.items = []
                    }
                });
            },
            changeStatus(val,id) {
                this.reload = false
                if (val==1) {
                    this.ConfirmData = {
                        model : true,
                        status : true,
                        statusMsg : "Success to Archive this Salesperson",
                        title : "Archive Salesperson",
                        text : "Are you sure want to Archive this Salesperson?",
                        urlApi : "/sales/person/archive/"+id,
                        data : {}
                    }
                } else {
                    this.ConfirmData = {
                        model : true,
                        status : true,
                        statusMsg : "Success to Unarchive this Salesperson",
                        title : "Unarchive Salesperson",
                        text : "Are you sure want to Unarchive this Salesperson?",
                        urlApi : "/sales/person/unarchive/"+id,
                        data : {}
                    }
                }
            },
        },
        watch: {
            'search': {
                handler: function (val) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function(){
                        that.renderData(val,that.statuses,that.area_id)
                    }, 1000);
                },
                deep: true
            },
            'statuses': {
                handler: function (val) {
                    let that = this
                    that.renderData(this.search,val,this.area_id)
                },
                deep: true
            },
        },
    }
</script>
