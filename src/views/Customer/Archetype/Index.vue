<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
             <v-row>
                <v-col cols="12" md="4" class="h70">
                    <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                            <v-text-field
                                name="search"
                                v-model="search"
                                prepend-inner-icon="search"
                                placeholder="Search..."
                                v-on="{ ...tooltip }"
                                outlined
                                filled
                                dense
                                v-privilege="'filter_rdl'"
                            >
                            </v-text-field>
                        </template>
                        <span>Search by code and name</span>
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row class="hr-title"/>
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
                    <SelectStatus
                        v-model="statuses"
                        :default="1"
                        :dense="true"
                        @selected="statusSelected"
                        v-privilege="'filter_rdl'"
                    ></SelectStatus>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectFilterBusinessType
                        v-model="statuses"
                        :dense="true"
                        @selected="BusinessTypeSelected"
                        v-privilege="'filter_rdl'"
                    ></SelectFilterBusinessType>
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row >
                <v-col class="flex-align-end">
                    <v-btn
                        depressed
                        color="#50ABA3"
                        to="/customer/archetype/create"
                        class="no-caps bold"
                        v-privilege="'arc_crt'"
                    >
                        <span class="text-white">Create Archetype</span>
                    </v-btn>
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
                        <td>
                            {{ props.item.code }}<br>
                        <span class="second-color">{{ props.item.name }}</span>
                        </td>
                        <td>{{ props.item.business_type.name }}</td>
                        <td>{{ props.item.customer_group == 1 ? 'Outlet' : 'Agent' }}</td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                    small
                                ><span class="pa-md-2">Active </span></v-chip>
                            </div>
                            <div v-else>
                                <v-chip
                                    :color="statusMaster('archived')"
                                    small
                                >Archived </v-chip>
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
                                    <v-list-item v-privilege="'arc_arc'" @click="changeStatus(props.item.status,props.item.id)" v-if="props.item.status=='1'">
                                        <v-list-item-content>
                                            <v-list-item-title>Archive</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item v-privilege="'arc_urc'" @click="changeStatus(props.item.status,props.item.id)" v-else>
                                        <v-list-item-content>
                                            <v-list-item-title>Unarchive</v-list-item-title>
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
    export default {
        name: "Archetype",
        data() {
            return {
                search: '',
                loading: false,
                showFilter : false,
                statuses:1,
                business_type_id:'',
                table: {
                    fields: [
                        {
                            text:'Code',
                            width: "30%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Business Type',
                            width: "30%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Customer Group',
                            width: "30%",
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
                            width: "3%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                    ],
                },
                items:[],
                ConfirmData:{}
            }
        },
        mounted() {
            let self = this
            this.$root.$on('event_success', function(res){
                if (res) {
                    self.renderData(self.search,self.statuses)
                }
            });
        },
        created() {
            this.renderData('',this.statuses)
        },
        methods: {
            changeStatus(val,id) {
                if (val=='1') {
                    this.ConfirmData = {
                        model : true,
                        status : true,
                        title : "Archive",
                        text : "Are you sure want to Archive this Archetype?",
                        urlApi : '/customer/archetype/archive/'+id,
                        data : {}
                    }
                } else {
                    this.ConfirmData = {
                        model : true,
                        status : true,
                        title : "Unarchive",
                        text : "Are you sure want to Unarchive this Archetype?",
                        urlApi : '/customer/archetype/unarchive/'+id,
                        data : {}
                    }
                }
            },
            renderData(search,statuses,business_type_id){
                this.loading = true;
                this.items = []
                if(statuses === 999){
                    statuses = ''
                }else{
                    statuses= "|status:"+statuses
                }
                if(business_type_id === '' || business_type_id === undefined){
                    business_type_id = ''
                }else{
                    business_type_id = "|business_type_id.e:"+business_type_id
                }
                this.$http.get("/customer/archetype",{params:{
                        perpage:100,
                        embeds:'business_type_id',
                        conditions:'Or.name.icontains:'+search+'%2COr.code.icontains:'
                        +search+statuses+business_type_id+'|aux_data:2',
                        orderby:'-id',
                    }}).then(response => {
                    this.loading = false
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }
                });
            },
            statusSelected(val) {
                this.statuses = null;
                if (val){
                    this.statuses = val.value;
                }
            },
            BusinessTypeSelected(d) {
                this.business_type_id = ''
                if (d !== '' && d !== undefined) {
                    this.business_type_id = d.id
                }
            },
        },
        watch: {
            'search': {
                handler: function (val) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function(){
                        that.renderData(val,that.statuses,that.business_type_id)
                    }, 1000);
                },
                deep: true
            },
            'statuses': {
                handler: function (val) {
                    let that = this
                    that.renderData(this.search,val,this.business_type_id)
                },
                deep: true
            },
            'business_type_id': {
                handler: function (val) {
                    let that = this
                    that.renderData(this.search,this.statuses,val)
                },
                deep: true
            },
        },
    }
</script>
