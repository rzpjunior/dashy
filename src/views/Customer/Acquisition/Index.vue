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
                        <span>Search by outlet name & phone number</span>
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
                    <SelectSalesPerson
                        v-model="salesperson"
                        :norequired="true"
                        :dense="true"
                        @selected="salespersonSelected"
                        v-privilege="'filter_rdl'"
                    ></SelectSalesPerson>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectSalesGroup
                        v-model="sales_group_id"
                        @selected="salesGroupSelected"
                        :norequired="true"
                        :dense="true"
                        v-privilege="'filter_rdl'"
                    ></SelectSalesGroup>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="submitted_date_model"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-text-field
                                    prepend-inner-icon="mdi-calendar"
                                    outlined
                                    maxlength="24"
                                    v-model="submitted_date_input"
                                    dense
                                    clearable
                                >
                                    <template v-slot:label>
                                        Submitted Date
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            v-model="submitted_date"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
            </v-row>
        </div>
        <div class="box-table">
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
                        <td>{{ props.item.phone_number ?  props.item.phone_number : '-'}}</td>
                        <td>{{ props.item.address_name ? props.item.address_name : '-'}}</td>
                        <td>{{ props.item.salesperson.display_name ? props.item.salesperson.display_name : '-'}}</td>
                        <td>{{ props.item.sales_group ? (props.item.sales_group.name ? props.item.sales_group.name : '-') : '-'}}</td>
                        <td>{{ props.item.submit_date == '0001-01-01T00:00:00Z' ? '-' : props.item.submit_date | moment("YYYY-MM-DD HH:mm:ss") }}</td>
                        <td>
                            <v-menu offset-y>
                                <template v-slot:activator="{ on: menu }">
                                    <v-btn
                                        icon
                                        v-on="{ ...menu }"
                                    ><v-icon dark>mdi-dots-vertical</v-icon></v-btn>
                                </template>
                                <v-list class="bg-white">
                                    <v-list-item v-privilege="'ca_rdd'" :to="{ name: 'AcquisitionDetail', params: { id: props.item.id } }">
                                        <v-list-item-title>Detail</v-list-item-title>
                                        <v-list-item-icon><v-icon>mdi-open-in-new</v-icon></v-list-item-icon>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <LoadingBar :value="overlay"/>
    </v-container>
</template>

<script>
    import Vue from 'vue'
    export default {
        name: "CustomerAcquisition",
        data() {
            return {
                showFilter : false,
                loading: false,
                search: '',
                salesperson : '',
                sales_group_id: '',
                submitted_date_model: '',
                submitted_date: [],
                submitted_date_input: '',
                table: {
                    fields: [
                        {
                            text:'Outlet Name',
                            width:'20%',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Phone Number',
                            width:'10%',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Address',
                            width:'25%',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Salesperson',
                            width:'15%',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Sales Group',
                            width:'10%',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Submit Date',
                            width:'13%',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            width:'2%',
                            sortable: false
                        },
                    ],
                },
                items:[
                    {
                        user_merchant:{
                            status: ''
                        },
                        business_type:{
                            name: ''
                        },
                        invoice_term:{
                            name: ''
                        },
                        payment_term:{
                            name: ''
                        },
                        finance_area:{
                            name: ''
                        },
                        payment_group:{
                            name: ''
                        }
                    },
                ],
                overlay: false
            }
        },
        mounted() {
            this.renderData()
        },
        methods: {
            // For get data from API
            renderData(){
                this.loading = true;
                let searchkey = ''
                if (this.search){
                    searchkey = this.search
                }
                let salesGroup = ''
                if (this.sales_group_id) {
                    if (this.task_type == 3){
                        salesGroup = '|sales_group_id.e:' + this.sales_group_id
                    } else {
                        salesGroup = '|salesgroup.id.e:' + this.sales_group_id
                    }
                }
                let submittedDate = ''
                if (this.submitted_date.length > 0) {
                    if (this.submitted_date.length == 1) {
                            submittedDate = '|submit_date.gte:'+this.submitted_date[0]+'T00:00:00Z'+ '|submit_date.lte:'+this.submitted_date[0]+'T23:59:59Z'
                    } else {
                        let date = this.submitted_date[0]
                        let date2 = this.submitted_date[1]
                        if (date > date2) {
                            submittedDate = '|submit_date.gte:'+date2+'T00:00:00Z'+ '|submit_date.lte:'+date+'T23:59:59Z'
                        } else {
                            submittedDate = '|submit_date.gte:'+date+'T00:00:00Z'+ '|submit_date.lte:'+date2+'T23:59:59Z'
                        }
                    }
                }
                let salespersonID = ''
                if (this.salesperson) {
                    salespersonID = "|salesperson_id.e:" + this.salesperson
                }
                this.$http.get("/customer/acquisition",{params:{
                        perpage:100,
                        embeds:'salesperson,salesgroup',
                        conditions:'Or.name.icontains:'+searchkey+'%2COr.phone_number.icontains:'+searchkey+salespersonID+salesGroup+submittedDate,
                        orderby:'-id',
                    }}).then(response => {
                    if(response.data){
                        this.items = response.data.data
                    }
                    if(this.items === null){
                        this.items = []
                    }
                    this.loading = false;
                });
            },
            //For Filter Salesperson
            salespersonSelected(d) {
                this.salesperson = '';
                if (d) {
                    this.salesperson = d.id;
                }
                this.renderData()
            },
             // For Filter Sales Group
             salesGroupSelected(d) {
                this.sales_group_id = '';
                if(d){
                    this.sales_group_id = d.id
                }
                this.renderData()
            },
        },
        watch: {
            'search': {
                handler: function (val) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function(){
                    that.renderData()
                    }, 1000);
                },
                deep: true
            },
            'submitted_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.submitted_date[0] = this.$moment(val).format('YYYY-MM-DD')
                                Vue.nextTick(() => {
                                    this.items = []
                                    this.renderData()
                                });
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0, 10)
                            let date2 = val.substr(14, 23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                this.submitted_date[0] = this.$moment(date1).format('YYYY-MM-DD')
                                this.submitted_date[1] = this.$moment(date2).format('YYYY-MM-DD')
                                if (this.submitted_date.length == 2) {
                                    Vue.nextTick(() => {
                                        this.items = []
                                        this.renderData()
                                    });
                                }
                            }
                        }
                    } else if (val == "") {
                        this.submitted_date = []
                        Vue.nextTick(() => {
                            this.items = []
                            this.renderData()
                        });
                    }
                },
                deep: true
            },
            'submitted_date': {
                handler: function (val) {
                    if (val) {
                        this.submitted_date_input = this.formatDateRange(val)
                    } else {
                        this.item
                    }
                },
                deep: true
            },
        }
    }
</script>