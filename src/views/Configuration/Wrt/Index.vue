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
                       <span>Search by code, name</span>
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
            <v-row :class="filter? '-mb38':'hidden'">
                <v-col cols="12" md="3" class="-mt24">
                    <SelectStatus
                        v-model="statuses"
                        :default="1"
                        :dense="true"
                        @selected="statusSelected"
                    ></SelectStatus>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectArea
                        :norequired="true"
                        name="area"
                        :dense="true"
                        :aux_data="2"
                        @selected="areaSelected"
                    >
                    </SelectArea>
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row >
                <v-col class="flex-align-end">
                    <v-btn
                        depressed
                        color="#50ABA3"
                        :to="{ name: 'WrtCreate' }"
                        class="no-caps bold"
                        v-privilege="'wrt_crt'"
                    >
                    <span class="text-white">
                        Create WRT
                    </span>
                    </v-btn>
                </v-col>
            </v-row>
        </div>
        <div class="box-body-table">
            <v-data-table
                :mobile-breakpoint="0"
                :headers="table.fields"
                :loading="loading"
                :items="items"
                :items-per-page="10"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.item.code }}<br>
                        <span class="text-black60">{{ props.item.name }}</span></td>
                        <td>{{ props.item.area_id.name }}</td>
                        <td>{{ props.item.note }}</td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                ><span class="pa-md-2">Active </span></v-chip>
                            </div>
                            <div v-else>
                                <v-chip
                                    :color="statusMaster('archived')"
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
                                    <v-list-item v-privilege="'wrt_arc'" @click="changeStatus(props.item.status,props.item.id)" v-if="props.item.status=='1'">
                                        <v-list-item-content>
                                            <v-list-item-title>Archive</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item v-privilege="'wrt_urc'" @click="changeStatus(props.item.status,props.item.id)" v-else>
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
        name: "wrt",
        data() {
            return {
                search: '',
                area:'',
                statuses:1,
                filter : false,
                loading: false,
                table: {
                    fields: [
                        {
                            text:'Code',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Area',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Note',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Status',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            width: "5%",
                            sortable: false
                        },
                    ],
                },
                items:[],
                ConfirmData : {}
            }
        },
        mounted() {
            this.renderData('',this.statuses,this.area)
            let self = this
            this.$root.$on('event_success', function(res){
                if (res) {
                    self.renderData('',self.statuses,self.area)
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
                        text : "Are you sure want to Archive this WRT?",
                        urlApi : '/config/wrt/archive/'+id,
                        statusMsg : "Success to Archive this WRT",
                        data : {}
                    }
                } else {
                    this.ConfirmData = {
                        model : true,
                        status : true,
                        title : "Unarchive",
                        text : "Are you sure want to Unarchive this WRT?",
                        urlApi : '/config/wrt/unarchive/'+id,
                        statusMsg : "Success to Unarchive this WRT",
                        data : {}
                    }
                }
            },
            renderData(search,statuses,area){
                this.loading = true;
                this.items = []
                if(statuses === 999){
                    statuses = ''
                }else{
                    statuses= "|status:"+statuses
                }
                if(area === '' || area === undefined){
                    area = ''
                }else{
                    area = "|area_id.value:"+area
                }
                this.$http.get("/config/wrt",{params:{
                        perpage:100,
                        conditions:'Or.name.icontains:'+search+'%2COr.code.icontains:'
                        +search+statuses+area,
                        embeds: 'area_id',
                        orderby:'-id',
                    }}).then(response => {
                    this.loading = false;
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }
                });
            },
            statusSelected(val) {
                this.statuses = null;
                if (val !== ''  && val !== undefined) {
                    this.statuses = val.value;
                }
            },
            areaSelected(val) {
                this.area = ''
                if (val) {
                    this.area = val.value
                }
            },
        },
        watch: {
            'search': {
                handler: function (val) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function(){
                        that.renderData(val,that.statuses,that.area)
                    }, 1000);
                },
                deep: true
            },
            'statuses': {
                handler: function (val) {
                    let that = this
                    that.renderData(this.search,val,this.area)
                },
                deep: true
            },
            'area': {
                handler: function (val) {
                    let that = this
                    that.renderData(this.search,this.statuses,val)
                },
                deep: true
            },
        },
    }
</script>