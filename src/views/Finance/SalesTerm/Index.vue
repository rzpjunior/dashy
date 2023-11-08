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
                                dense
                                filled
                                v-privilege="'filter_rdl'"
                            >
                            </v-text-field>
                        </template>
                        <span>Search by code, name</span>
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
                        v-model="statuses"
                        :items="status"
                        item-text="text"
                        item-value="value"
                        outlined
                        dense
                        v-privilege="'filter_rdl'"
                    ></v-select>
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row >
                <v-col cols="12" md="9" class="h1"/>
                <v-col cols="12" md="3" class="d-flex justify-end h70">
                    <v-btn
                        depressed
                        color="#50ABA3"
                        to="/finance/spt/term/create"
                        class="no-caps bold mr20"
                        v-privilege="'spt_crt'"
                    ><span class="text-white">Create Sales Term</span></v-btn>
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
                    <tr>
                        <td>
                            {{props.item.code}}<br>
                            <label style="color: #768F9C;">
                                {{ props.item.name }}
                            </label>
                        </td>
                        <td>{{props.item.days_value}}</td>
                        <td>{{props.item.note}}</td>
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
                                    <v-list-item v-privilege="'spt_arc'" @click="changeStatus(props.item.status,props.item.id)" v-if="props.item.status=='1'">
                                        <v-list-item-content>
                                            <v-list-item-title>Archive</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item v-privilege="'spt_urc'" @click="changeStatus(props.item.status,props.item.id)" v-else>
                                        <v-list-item-content>
                                            <v-list-item-title>Unarchive</v-list-item-title>
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
    import ModalDirection from "../../../components/PopupDialog";
    export default {
        name: "salesTerm",
        components: {
            ModalDirection
        },
        data() {
            return {
                showFilter : false,
                ConfirmData : {},
                modalOpen: false,
                search: '',
                loading: false,
                statuses:1,
                table: {
                    fields: [
                        {
                            text:'Code',
                            width: "20%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Days Value',
                            width: "30%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Note',
                            width: "25%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Status',
                            width: "4%",
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
                confirmation:{
                    valueName: 'Sales Term',
                    action:'',
                    status: '',
                    urlPath:'',
                    parentPath:'/finance/spt/term',
                }
            }
        },
        created() {
            this.renderData('',this.statuses)
        },
        mounted() {
            this.renderData('',this.statuses)
            let self = this
            this.$root.$on('event_success', function(res){
                if (res) {
                    self.renderData(self.search,self.statuses)
                }
            });
        },
        methods: {
            renderData(search,statuses){
                this.loading = true;
                this.items = []
                if(statuses === 999){
                    statuses = ''
                }else{
                    statuses= "|status:"+statuses
                }
                this.$http.get("/finance/sales/term",{params:{
                        perpage:100,
                        conditions:'Or.name.icontains:'+search+'%2COr.code.icontains:'
                        +search+statuses,
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
                if (val==1) {
                    this.ConfirmData = {
                        model : true,
                        status : true,
                        statusMsg : "Success to Archive this Sales Term",
                        title : "Archive Sales Term",
                        text : "Are you sure want to Archive this sales term?",
                        urlApi : "/finance/sales/term/archive/"+id,
                        data : {}
                    }
                } else {
                    this.ConfirmData = {
                        model : true,
                        status : true,
                        statusMsg : "Success to Unarchive this Sales Term",
                        title : "Unarchive Sales Term",
                        text : "Are you sure want to Unarchive this sales term?",
                        urlApi : "/finance/sales/term/unarchive/"+id,
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
                        that.renderData(val, that.statuses)
                    }, 1000);
                },
                deep: true
            },
            'statuses': {
                handler: function (val) {
                    let that = this
                    that.renderData(this.search,val)
                },
                deep: true
            },
        },
    }
</script>