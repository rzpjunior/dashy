<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="-mb38">
                <v-col cols="12" md="4">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }" v-privilege="'filter_rdl'">
                            <v-text-field
                                dense
                                v-model="search"
                                outlined
                                filled
                                placeholder="Search..."
                                v-on="{ ...tooltip }"
                                prepend-inner-icon="search"
                            >
                            </v-text-field>
                        </template>
                       <span>Search by promotion name</span>
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row class="hr-title"/>
            <v-row :class="filterDropdown?'mb24':''">
                <v-col>
                    Filter 
                    <v-btn 
                        depressed
                        x-small
                        @click="filterDropdown = !filterDropdown"
                        v-if="filterDropdown"
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
                        @click="filterDropdown = !filterDropdown"
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
            <v-row :class="filterDropdown? '':'hidden'">
                <v-col cols="12" md="3" class="-mt24">
                    <v-select
                        v-model="statuses"
                        :items="status"
                        item-text="text"
                        item-value="value"
                        label="Status"
                        outlined
                        dense
                    ></v-select>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectPriceSet
                        @selected="priceSetSelected"
                        :norequired="true"
                        :dense="true"
                    ></SelectPriceSet>
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row >
                <v-col class="flex-align-end">
                    <v-row>
                        <v-col>
                            <v-btn
                                depressed
                                color="#50ABA3"
                                :to="{ name: 'SKUDiscountCreate' }"
                                class="no-caps bold"
                                v-privilege="'sku_dsc_crt'"
                            >
                                <span class="text-white">
                                    Create SKU Discount
                                </span>
                            </v-btn>
                        </v-col>
                    </v-row>
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
                        <td>{{ props.item.name }}</td>
                        <td>{{ props.item.price_set_name }}</td>
                        <td>{{ props.item.start_timestamp | moment("DD/MM/YYYY HH:mm:ss") }}</td>
                        <td>{{ props.item.end_timestamp | moment("DD/MM/YYYY HH:mm:ss") }}</td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                ><span class="pa-md-2">Active</span></v-chip>
                            </div>
                            <div v-if="props.item.status == 2">
                                <v-chip
                                    :color="statusMaster('archived')"
                                >Archived</v-chip>
                            </div>
                        </td>
                        <td>
                            <v-menu>
                                <template v-slot:activator="{ on: menu }">
                                    <v-btn
                                        icon
                                        v-on="{ ...menu }"
                                    ><v-icon dark>mdi-dots-vertical</v-icon></v-btn>
                                </template>
                                <v-list class="bg-white">
                                    <v-list-item  :to="{name: 'SKUDiscountDetail', params: { id: props.item.id }}" v-privilege="'sku_dsc_rdd'">
                                        <v-list-item-content>
                                            <v-list-item-title>Detail</v-list-item-title>
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
        name: "SKUDiscountList",
        data() {
            return {
                filterDropdown : false,
                ConfirmData : {},
                modalOpen: false,
                search: '',
                loading: false,
                overlay: false,
                statuses:1,
                filter:{
                    price_set:''
                },
                table: {
                    fields: [
                        {
                            text:'Promotion Name',
                            width: "20%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Price Set',
                            width: "30%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Start Date',
                            width: "20%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'End Date',
                            width: "20%",
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
                            width: "5%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                    ],
                },
                items:[],
                error: {},
            }
        },
        mounted() {
            this.renderData(this.search,this.statuses)
            let self = this
            this.$root.$on('event_success', function(res){
                if (res) {
                    self.renderData(self.search,self.statuses)
                }
            });
        },
        methods: {
            renderData(search, status){
                this.loading = true;
                this.items = []
                if(status === 999){
                    status = ''
                }else{
                    status= "|status:"+status
                }
                let price_set = ''
                if(this.filter.price_set == ''){
                    price_set = ''
                }else{
                    price_set = this.filter.price_set
                }

                this.$http.get("/promotion/sku_discount",{params:{
                    "price_set.e": price_set,
                    perpage:100,
                    conditions:'Or.name.icontains:'+ search + status,
                    orderby:'-id',
                }}).then(response => {
                    this.loading = false;
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }
                });
            },
            //For Filter PriceSet
            priceSetSelected(d) {
                this.filter.price_set = '';
                if (d) {
                    this.filter.price_set = d.id
                }
                this.renderData(this.search,this.statuses)
            },
        },
        watch: {
            'search': {
                handler: function (search) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function(){ 
                        that.renderData(search,that.statuses)
                    }, 1000);
                },
                deep: true
            },
            'statuses': {
                handler: function (status) {
                    let that = this
                    that.renderData(this.search,status)
                },
                deep: true
            },
        },
    }
</script>