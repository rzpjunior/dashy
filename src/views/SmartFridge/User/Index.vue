<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
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
                        <span>Search by Code or Name</span>
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
            <v-row>
                <v-col class="flex-align-end">
                    <router-link :to="{ name: 'UserFridgeCreate' }" class="routerLink" v-privilege="'usf_crt'">
                        <v-btn
                            depressed
                            color="#50ABA3"
                            class="no-caps bold white--text"
                        >Create User Fridge</v-btn>
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
                        <td>{{props.item.code ? props.item.code : '-'}}</td>
                        <td>{{props.item.username ? props.item.username : '-'}}</td>
                        <td>{{props.item.warehouse.name ? props.item.warehouse.name : '-'}}</td>
                        <td>{{props.item.branch.name ? props.item.branch.name : '-'}}</td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                    small
                                ><span class="pa-md-1">Active</span></v-chip>
                            </div>
                            <div v-if="props.item.status == 2">
                                <v-chip
                                    :color="statusMaster('finished')"
                                    small
                                ><span class="pa-md-2">Sold</span></v-chip>
                            </div>
                            <div v-if="props.item.status == 3">
                                <v-chip
                                    :color="statusMaster('archieved')"
                                    small
                                >Archieved</v-chip>
                            </div>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
    </v-container>
</template>
<script>
    import Vue from 'vue'
    export default {
        name: "UserFridgeList",
        data() {
            return {
                loading: false,
                showFilter : false,
                search: '',
                items:[
                    {
                        code: '',
                        username: '',
                        warehouse: {
                            name: '',
                        },
                        branch: {
                            name: ''
                        }
                    }
                ],
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
                        text: 'Archived',
                        value: 2
                    }
                ],
                table: {
                    fields: [
                        {
                            text:'Code',
                            width: "22%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Username',
                            width: "25%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Warehouse',
                            width: "25%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Branch',
                            width: "25%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Status',
                            width: "3%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                    ]
                },
            }
        },
        mounted() {
            this.renderData()
        },
        methods: {
            // For Render Data User Fridge List From API
            renderData(){
                this.loading = true;
                this.items = []
                let status = ''
                if(this.statuses === 999){
                    status = ''
                }else{
                    status= '|status:'+this.statuses
                }
                this.$http.get("/fridge/user_fridge",{params:{
                        perpage:100,
                        conditions:'Or.username.icontains:'+this.search+'%2COr.code.icontains:'+this.search+status,
                        orderby:'-id',
                    }}).then(response => {
                        this.loading = false;
                        this.items = response.data.data
                        if(this.items === null){
                            this.items = []
                    }
                })
                .catch(e => {
                    this.loading = false;
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
            'search': {
                handler: function (val) {
                    Vue.nextTick(() => {
                        this.renderData()
                    });
                },
                deep: true
            },
        },
    }
</script>
