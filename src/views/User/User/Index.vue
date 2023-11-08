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
                   <SelectArea
                        v-model="area"
                        :norequired="true"
                        @selected="areaSelected"
                        :aux_data="2"
                        :dense="true"
                   ></SelectArea>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectWarehouse
                        v-model="warehouse"
                        :norequired="true"
                        @selected="warehouseSelected"
                        :area_id="filter.area_id"
                        :disabled="disabled_warehouse"
                        :clear="clearWarehouse"
                        :dense="true"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectDivision
                        :norequired="true"
                        v-model="division"
                        @selected="divisionSelected"
                        :dense="true"
                    ></SelectDivision>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectRole
                        :norequired="true"
                        v-model="role"
                        @selected="roleSelected"
                        :division_id="filter.division_id"
                        :disabled="disabled_role"
                        :clear="clearRole"
                        :dense="true"
                    > </SelectRole>
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row >
                <v-col class="flex-align-end">
                    <v-btn
                        depressed
                        color="#50ABA3"
                        :to="{ name: 'UserCreate' }"
                        class="no-caps bold"
                        v-privilege="'usr_crt'"
                    >
                        <span class="text-white">
                            Create User
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
                            <label class="text-black60">
                                {{ props.item.name }}
                            </label>
                        </td>
                        <td>{{ props.item.display_name }}<br>
                            <label class="text-black60">
                                {{ props.item.sales_group_name == undefined ? " " : props.item.sales_group_name }}
                            </label>
                        </td>
                        <td>
                            {{ props.item.role.code }}-{{ props.item.role.name }}<br>
                            <label class="text-black60">
                                {{ props.item.role.division.code }}-{{ props.item.role.division.name }}
                            </label>
                        </td>
                        <td>
                            <span v-if="props.item.area">
                                {{ props.item.area.code }}-{{ props.item.area.name }}
                            </span>
                            <span v-else>-</span><br>
                            <label class="text-black60">
                                {{ props.item.warehouse.code }}-{{ props.item.warehouse.name }}
                            </label>
                        </td>
                        <td>
                            <v-btn
                                elevation="0"
                                rounded
                                depressed
                                small
                                class="no-caps mb4"
                                :color="statusMaster(props.item.user.status_convert)"
                            >
                                {{capitalizeFirstLetter(props.item.user.status_convert)}}
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
                                    <v-list-item v-privilege="'usr_rdd'" :to="{ name: 'UserDetail', params: { id: props.item.id } }">
                                        <v-list-item-content>
                                            <v-list-item-title>Detail</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <v-list-item v-privilege="'usr_upd'" :to="{ name: 'UserUpdate', params: { id: props.item.id } }" v-if="props.item.status == 1">
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
                                    <v-list-item @click="changeStatus(props.item.user.status,props.item.user.id,props.item.id)" v-if="props.item.status=='1'" v-privilege="'usr_arc'">
                                        <v-list-item-content>
                                            <v-list-item-title>Archive</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item @click="changeStatus(props.item.user.status,props.item.user.id,props.item.id)" v-else v-privilege="'usr_urc'">
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
        name: "User",
        data() {
            return {
                search: '',
                loading: false,
                area:null,
                division:null,
                filter2 : false,
                role:null,
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
                            width: '12%',
                            sortable: false,
                        },
                        {
                            class: 'grey--text text--darken-4',
                            text:'Display Name',
                            sortable: false,
                        },
                        {
                            text:'Role',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Area',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Status',
                            width: '5%',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            width: '3%',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                    ],
                },
                items:[{
                    role : {
                        division : {
                            code : '',
                        }
                    }
                }],
                ConfirmData : {},
            }
        },
        created() {
            this.renderData('',this.statuses)
        },
        mounted() {
            let self = this
            this.$root.$on('event_success', function(res){
                if (res) {
                    self.renderData(self.search,self.statuses)
                }
            });
        },
        methods: {
            changeStatus(val,id,next) {
                if (val=='1') {
                    this.ConfirmData = {
                        model : true,
                        status : true,
                        title : "Archive",
                        statusMsg : "Success to Archive this User",
                        text : "Are you sure want to Archive this User?",
                        urlApi : '/user/archive/'+id,
                        nextPage : "/user/user/detail/"+next,
                        data : {}
                    }

                } else {
                    this.ConfirmData = {
                        model : true,
                        status : true,
                        title : "Unarchive",
                        statusMsg : "Success to Archive this User",
                        text : "Are you sure want to Unarchive this User?",
                        urlApi : '/user/unarchive/'+id,
                        nextPage : "/user/user/detail/"+next,
                        data : {}
                    }
                }
            },
            renderData(search, statuses){
                this.loading = true;
                this.items = []
                if(statuses === 999){
                  statuses = ''
                }else{
                  statuses= "|user_id.status:"+statuses
                }

                let area_ID = ''
                if(this.filter.area_id){
                    area_ID = "|area_id.e:"+ this.filter.area_id
                }

                let division_ID = ''
                if(this.filter.division_id){
                    division_ID = "|role_id.division_id.id.e:"+ this.filter.division_id
                }

                let role_ID = ''
                if(this.filter.role_id){
                    role_ID = "|role_id.e:"+ this.filter.role_id
                }

                let warehouse_ID =''
                if(this.filter.warehouse_id){
                    warehouse_ID = "|warehouse_id.e:"+ this.filter.warehouse_id
                }
                this.$http.get("/user/staff",{params:{
                      perpage:10000,
                      embeds:'role_id__division_id,warehouse_id,area_id,user_id',
                      conditions:'Or.name.icontains:'+search+'%2COr.code.icontains:'
                        +search + statuses + area_ID + division_ID + role_ID + warehouse_ID +'|AndNot.user_id.status:3',
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
            areaSelected(d){
                this.area = null;
                this.filter.area_id = '';
                this.disabled_warehouse = true;
                this.clearWarehouse = true
                if(d){
                    this.area = d;
                    this.filter.area_id = d.id;
                    this.warehouse = null;
                    this.filter.warehouse_id = '';
                    this.disabled_warehouse = false;
                    this.clearWarehouse = false;
                }
                this.renderData(this.search,this.statuses)
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
                this.renderData(this.search,this.statuses)
            },
            roleSelected(d) {
                this.role = null;
                this.filter.role_id = '';
                if (d) {
                    this.role = d;
                    this.filter.role_id = d.id
                }
                this.renderData(this.search,this.statuses)
            },
            warehouseSelected(d) {
                this.warehouse = null;
                this.filter.warehouse_id = '';
                if (d) {
                    this.warehouse = d;
                    this.filter.warehouse_id = d.id
                }
                this.renderData(this.search,this.statuses)
            },

        },
        watch: {
            'search': {
                handler: function (val) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function(){
                        that.renderData(val, that.statuses)
                    }, 1000);
                },
                deep: true
            },
            'statuses': {
                handler: function (statuses) {
                    this.renderData(this.search,statuses)
                },
                deep: true
            },
        },
    }
</script>