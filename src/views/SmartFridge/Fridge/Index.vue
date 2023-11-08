<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
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
                    <SelectMerchant
                        :norequired="true"
                        @selected="merchantSelected"
                        :dense="true"
                        :label="'Customer'"
                    ></SelectMerchant>
                </v-col>
                <v-col cols="12" md="3" class="-mt24" v-if="outlet">
                    <SelectBranch
                        :norequired="true"
                        :dense="true"
                        :merchant="SelectMerchant"
                        @selected="branchSelected"
                        :label="'Branch'"
                    ></SelectBranch>
                </v-col>
            </v-row>
        </div>
        <div class="box-table">
            <v-data-table
                :headers="table.fields"
                :items="items"
                :loading="loading"
                :items-per-page="10"
                :mobile-breakpoint="0"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{props.item.warehouse_name ? props.item.warehouse_name : '-'}}</td>
                        <td>{{props.item.customer_name ? props.item.customer_name : '-'}}</td>
                        <td>{{props.item.branch_name ? props.item.branch_name : '-'}}</td>
                        <td @click="openDialog=true">{{props.item.status ? props.item.status : '-'}}</td>
                        <td>
                            <v-menu offset-y>
                                <template v-slot:activator="{ on: menu }">
                                    <v-btn
                                        icon
                                        v-on="{ ...menu }"
                                    ><v-icon dark>mdi-information-outline</v-icon></v-btn>
                                </template>
                                <v-list class="bg-white">
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-data-table
                                                :headers="table.dialog"
                                                :items="props.item.all_fridge"
                                                :items-per-page="10"
                                                :mobile-breakpoint="0"
                                                :hide-default-footer="true"
                                            >
                                                <template v-slot:item="props">
                                                    <tr style="height:48px">
                                                        <td>{{props.item.mac_address ? props.item.mac_address : '-'}}</td>
                                                        <td>{{getTimeInterval(props.item.last_seen_at)}}</td>
                                                        <td>
                                                            <v-btn
                                                                v-if="props.item.status == 1"
                                                                icon
                                                                color="primary"
                                                            ><v-icon>mdi-wifi</v-icon></v-btn>
                                                            <v-btn
                                                                v-if="props.item.status == 0"
                                                                icon
                                                                disabled
                                                            ><v-icon>mdi-wifi-off</v-icon></v-btn>
                                                        </td>
                                                    </tr>
                                                </template>
                                            </v-data-table>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
    </v-container>
</template>
<script>
    export default {
        name: "FridgeList",
        data() {
            return {
                loading: false,
                showFilter : false,
                SelectMerchant: '',
                SelectBranch: '',
                outlet: false,
                items:[
                    {
                        warehouse_name: '',
                        customer_name: '',
                        branch_name: '',
                        status: '',
                        all_fridge: '',
                    }
                ],
                table: {
                    fields: [
                        {
                            text:'Warehouse Name',
                            width: "30%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Customer',
                            width: "30%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Branch',
                            width: "36%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Status',
                            width: "2%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'',
                            width: "2%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                    ],
                    dialog: [
                        {
                            text:'Mac Address',
                            width: "45%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Last Seen At',
                            width: "45%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                    ]
                },
            }
        },
        mounted() {
            this.renderData()
        },
        methods: {
            // For Render List Data From API
            renderData(){
                this.loading = true;
                this.items = []
                let branch_id = ''
                if(this.SelectBranch){
                    branch_id = 'Or.branch_id:'+this.SelectBranch
                }
                this.$http.get("/fridge/list_branch_fridge",{params:{
                        perpage:100,
                        conditions: branch_id,
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
            // For Filter Merchant
            merchantSelected(d) {
                this.outlet = false
                this.SelectMerchant = ""
                this.SelectBranch = ""
                if (d) {
                    if (d.customer_group == 1) {
                        this.outlet = true
                    }
                    this.SelectMerchant = d.id
                }
            },
            // For Filter Branch
            branchSelected(d) {
                this.SelectBranch = ""
                if (d) {
                    this.SelectBranch = d.id
                }
                this.renderData()
            },
            // For Compare time to Date Now
            getTimeInterval(date) {
                let lastSeen =this.$moment(date).format("DD/MM/YYYY HH:mm:ss")
                let dateNow =this.$moment(Date.now()).format("DD/MM/YYYY HH:mm:ss")
                let seconds = (this.$moment(dateNow,"DD/MM/YYYY HH:mm:ss").diff(this.$moment(lastSeen,"DD/MM/YYYY HH:mm:ss"))/1000);
                let unit = "second";
                let direction = "ago";
                if (seconds < 0) {
                    seconds = -seconds;
                    direction = "from now";
                }
                let value = seconds;
                if (seconds >= 31536000) {
                    value = Math.floor(seconds / 31536000);
                    unit = "year";
                } else if (seconds >= 86400) {
                    value = Math.floor(seconds / 86400);
                    unit = "day";
                } else if (seconds >= 3600) {
                    value = Math.floor(seconds / 3600);
                    unit = "hour";
                } else if (seconds >= 60) {
                    value = Math.floor(seconds / 60);
                    unit = "minute";
                }
                if (value != 1)
                    unit = unit + "s";
                return value + " " + unit + " " + direction;
            }
        }
    }
</script>
