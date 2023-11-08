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
                        <span>Search by code and name</span>
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row class="hr-title"/>
            <v-row :class="filter2?'mb24':''">
                <v-col>
                    Filter 
                    <v-btn 
                        depressed
                        x-small
                        @click="filter2 = !filter2"
                        v-if="filter2"
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
                        @click="filter2 = !filter2"
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
            <v-row :class="filter2? '-mb38':'hidden'">
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
                <v-col cols="12" md="3" class="-mt24">
                    <SelectDivision
                        :dense="true"
                        :norequired="true"
                        v-model="division"
                        @selected="divisionSelected"
                    ></SelectDivision>
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row >
                <v-col class="flex-align-end">
                    <v-btn
                        depressed
                        color="#50ABA3"
                        :to="{ name: 'RoleCreate' }"
                        class="no-caps bold"
                        v-privilege="'rol_crt'"
                    >
                        <span class="text-white">
                            Create Role
                        </span>
                    </v-btn>
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
                            {{ props.item.code }}<br>
                            <div class="text-black60">
                                {{ props.item.name }}
                            </div>
                        </td>
                        <td>{{ props.item.division.name }}</td>
                        <td>{{ props.item.note }}</td>
                        <td>
                            <v-btn
                                elevation="0"
                                rounded
                                depressed
                                small
                                class="no-caps mb4"
                                :color="statusMaster(props.item.status_convert)"
                            >
                                {{capitalizeFirstLetter(props.item.status_convert)}}
                            </v-btn>
                        </td>
                        <td>
                            <v-menu>
                                <template v-slot:activator="{ on: menu }">
                                    <template >
                                        <v-btn
                                            icon
                                            v-on="{ ...menu }"
                                        >  
                                            <v-icon dark>mdi-dots-vertical</v-icon>
                                        </v-btn>
                                    </template>
                                </template>
                                <v-list class="bg-white">
                                    <v-list-item v-privilege="'rol_rdd'" :to="{ name: 'RoleDetail', params: { id: props.item.id } }">
                                        <v-list-item-content>
                                            <v-list-item-title>Detail</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <v-list-item v-privilege="'rol_upd'" :to="{ name: 'RoleUpdate', params: { id: props.item.id } }" v-if="props.item.status == 1">
                                        <v-list-item-content>
                                            <v-list-item-title>Update</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <div>
                                        <hr/>
                                    </div>
                                    <v-list-item @click="changeStatus(props.item.status,props.item.id)" v-if="props.item.status=='1'" v-privilege="'rol_arc'">
                                        <v-list-item-content>
                                            <v-list-item-title>Archive</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item @click="changeStatus(props.item.status,props.item.id)" v-else v-privilege="'rol_urc'">
                                        <v-list-item-content>
                                            <v-list-item-title>Unarchive</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <router-view></router-view>
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
    export default {
        name: "RoleList",
        data() {
            return {
                search: '',
                loading: false,
                area:null,
                division:null,
                role:null,
                filter2 : false,
                warehouse:null,
                filter:{
                    area_id:'',
                    division_id:'',
                    role_id:'',
                    warehouse_id:'',
                },
                disabled_warehouse:true,
                clearWarehouse:false,
                disabled_role:true,
                clearRole:false,
                statuses:1,
                table: {
                    fields: [
                        {
                            text:'Code',
                            class: 'grey--text text--darken-4',
                            width: "15%",
                            sortable: false,
                        },
                        {
                            text:'Division',
                            class: 'grey--text text--darken-4',
                            width: "15%",
                            sortable: false
                        },
                        {
                            text:'Note',
                            class: 'grey--text text--darken-4',
                            width: "25%",
                            sortable: false
                        },
                        {
                            text:'Status',
                            class: 'grey--text text--darken-4',
                            width: "10%",
                            sortable: false
                        },
                        {
                            text:'',
                            width: "5%",
                            sortable: false
                        },
                    ],
                },
                items:[],
                ConfirmData : {},
            }
        },
        created() {
            this.renderData('',this.statuses,this.filter.division_id)
        },
        mounted() {
            let self = this
            this.$root.$on('event_success', function(res){
                if (res) {
                    self.renderData(self.search,self.statuses,self.filter.division_id)
                }
            });
        },
        methods: {
            changeStatus(val,id) {
                if (val=='1') {
                    this.ConfirmData = {
                        model : true,
                        status : true,
                        title : "Archive",
                        statusMsg : "Success to Archive this Role",
                        text : "Are you sure want to Archive this Role?",
                        urlApi : '/role/archive/'+id,
                        nextPage : "/user/role/detail/"+id,
                        data : {}
                    }
                } else {
                    this.ConfirmData = {
                        model : true,
                        status : true,
                        title : "Unarchive",
                        statusMsg : "Success to Unarchive this Role",
                        text : "Are you sure want to Unarchive this Role?",
                        urlApi : '/role/unarchive/'+id,
                        nextPage : "/user/role/detail/"+id,
                        data : {}
                    }
                }
            },
            renderData(search, statuses, divisionID){
                this.loading = true;
                this.items = []
                if(statuses === 999){
                  statuses = ''
                }else{
                  statuses= "|status:"+statuses
                }
                if(divisionID === ''){
                    divisionID = ''
                }else{
                    divisionID = "|division_id.e:"+ divisionID
                }
                this.$http.get("/role",{params:{
                      perpage:10000,
                      embeds:'division_id',
                      conditions:'Or.name.icontains:'+search+'%2COr.code.icontains:'+search+statuses+divisionID,
                      orderby:'-id',
                  }}).then(response => {
                  this.loading = false;
                  this.items = response.data.data
                  if(this.items === null){
                      this.items = []
                  }
                })
                .catch(e => {
                    this.items = []
                });
            },
            divisionSelected(d) {
                this.division = '';
                this.filter.division_id = '';
                this.disabled_role = true;
                if (d) {
                    this.division = d;
                    this.filter.division_id = d.id;
                    this.role = null;
                    this.filter.role_id = '';
                    this.disabled_role = false;
                }
            },
        },
        watch: {
            'search': {
                handler: function (search) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function(){
                        that.renderData(search,that.statuses,that.filter.division_id)
                    }, 1000);
                },
                deep: true
            },
            'statuses': {
                handler: function (statuses) {
                    let that = this;
                    that.renderData(this.search,statuses,this.filter.division_id)
                },
                deep: true
            },
            'filter.division_id': {
                handler: function (division_id) {
                    let that = this;
                    that.renderData(this.search,this.statuses,division_id)
                },
                deep: true
            }
        },
    }
</script>