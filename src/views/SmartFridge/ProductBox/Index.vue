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
                        <span>Search by Name or Rfid</span>
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
                    <v-row>
                        <v-col>
                            <router-link :to="{ name: 'ProductBoxConfirm' }" class="routerLink" v-privilege="'prb_cnf'">
                                <v-btn
                                    depressed
                                    color="#50ABA3"
                                    class="no-caps bold white--text"
                                >Confirm Product Box</v-btn>
                            </router-link>
                        </v-col>
                        <v-col>
                            <router-link :to="{ name: 'ProductBoxCreate' }" class="routerLink" v-privilege="'prb_crt'">
                                <v-btn
                                    depressed
                                    color="#50ABA3"
                                    class="no-caps bold white--text"
                                >Create Product Box</v-btn>
                            </router-link>
                        </v-col>
                    </v-row>
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
                            {{props.item.product_name ?  props.item.product_name : '-'}}<br>
                            <span class="text-black40">{{props.item.rfid ?  props.item.rfid : '-'}}</span>
                        </td>
                        <td>{{props.item.warehouse_name ?  props.item.warehouse_name : '-'}}</td>
                        <td>
                            {{props.item.total_weight ? formatPrice(props.item.total_weight) : '-'}} 
                        </td>
                        <td>{{props.item.uom_name ? props.item.uom_name : '-'}}</td>
                        <td>
                            <div v-if="props.item.status == 'new'">
                                <v-chip
                                    :color="statusMaster('on_delivery')"
                                    small
                                ><span class="pa-md-1">New</span></v-chip>
                            </div>
                            <div v-if="props.item.status == 'active'">
                                <v-chip
                                    :color="statusMaster('active')"
                                    small
                                ><span class="pa-md-1">Active</span></v-chip>
                            </div>
                            <div v-if="props.item.status == 'sold'">
                                <v-chip
                                    :color="statusMaster('paid_on_delivery')"
                                    small
                                ><span class="pa-md-2">Sold</span></v-chip>
                            </div>
                            <div v-if="props.item.status == 'waste'">
                                <v-chip
                                    :color="statusMaster('deleted')"
                                    small
                                ><span class="pa-md-2">Waste</span></v-chip>
                            </div>
                            <div v-if="props.item.status == 'finished'">
                                <v-chip
                                    :color="statusMaster('finished')"
                                    small
                                ><span class="pa-md-2">Finished</span></v-chip>
                            </div>
                        </td>
                        <td>
                            <v-menu offset-y v-if="props.item.status == 'waste'">
                                <template v-slot:activator="{ on: menu }">
                                    <v-btn
                                        icon
                                        v-on="{ ...menu }"
                                    ><v-icon dark>mdi-dots-vertical</v-icon></v-btn>
                                </template>
                                <v-list class="bg-white">
                                    <a 
                                        :href="props.item.item_image"
                                        target="_blank"
                                        class="routerLink"
                                    >
                                        <v-list-item>
                                            <v-list-item-title>See Image</v-list-item-title>
                                            <v-list-item-icon><v-icon>mdi-open-in-new</v-icon></v-list-item-icon>
                                        </v-list-item>
                                    </a>
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
    import Vue from 'vue'
    export default {
        name: "ProductBoxList",
        data() {
            return {
                loading: false,
                showFilter : false,
                search: '',
                items:[
                    {
                        total_weight: '',
                        unit_price: '',
                        total_price: '',
                        product: {
                            name: '',
                            uom: {
                                name: ''
                            }
                        },
                        box: {
                            code: ''
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
                        text: 'Sold',
                        value: 2
                    },
                    {
                        text: 'Waste',
                        value: 3
                    }
                ],
                table: {
                    fields: [
                        {
                            text:'Product Name',
                            width: "27%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Warehouse',
                            width: "28%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Qty',
                            width: "20%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'UOM',
                            width: "20%",
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
                            width: "2%",
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
            // For Render Data Product Box List
            renderData(){
                this.loading = true;
                this.items = []
                let Status = ''
                if(this.statuses === 999){
                    Status = ''
                }else{
                    Status=this.statuses
                }
                this.$http.get("/box/product_box",{params:{
                        perpage:100,
                        status: Status,
                        embeds:'box,product,product.uom',
                        conditions:'Or.product.name.icontains:'+this.search+'%2COr.box.rfid.icontains:'+this.search,
                        orderby:'-id',
                    }}).then(response => {
                        this.loading = false;
                        this.items = response.data.data
                        if(this.items === null){
                            this.items = []
                    }
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
