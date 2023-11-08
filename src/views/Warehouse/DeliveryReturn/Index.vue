<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row>
                <v-col cols="12" md="4" class="h70">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }" v-privilege="'filter_rdl'">
                            <v-text-field
                                dense
                                v-model="search"
                                outlined
                                filled
                                placeholder="Search..."
                                prepend-inner-icon="search"
                                v-on="{ ...tooltip }"
                            >
                            </v-text-field>
                        </template>
                       <span>Search by delivery return code or delivery order code</span>
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
            <v-row :class="filter? '':'hidden'">
                <v-col cols="12" md="3" class="-mt24">
                    <v-select
                        v-model="statuses"
                        :items="regStatus"
                        item-text="text"
                        item-value="value"
                        label="Status"
                        dense
                        outlined
                    ></v-select>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectWarehouse
                        :norequired="true"
                        :aux_data="2"
                        @selected="warehouseSelected"
                        :label="'Warehouse'"
                        :dense="true"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectOrderType
                        :norequired="true"
                        name="order_type"
                        @selected="ordertypeSelected"
                        :dense="true"
                    ></SelectOrderType>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="return_date_model"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-text-field
                                    name="filter_return_date"
                                    prepend-inner-icon="mdi-calendar"
                                    outlined
                                    clearable
                                    @click:clear="return_date = [],return_date_input = '',renderData(search,statuses)"
                                    v-model="return_date_input"
                                    maxlength="24"
                                    dense
                                >
                                    <template v-slot:label>
                                        Delivery Return Date
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            persistent-hint
                            v-model="return_date"
                            @input="return_date_model = false,renderData(search,statuses)"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row >
                <v-col class="flex-align-end">
                    <v-btn
                        depressed
                        color="#50ABA3"
                        to="/warehouse/delivery-return/create"
                        class="no-caps bold"
                        v-privilege="'dr_crt'"
                    >
                    <span class="text-white">
                        Create Delivery Return
                    </span>
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
                        <td>{{ props.item.code }}</td>
                        <td>{{ props.item.recognition_date | moment("DD/MM/YYYY")}}</td>
                        <td>
                            {{ props.item.warehouse.area.code }} - {{ props.item.warehouse.area.name }}<br>
                            <span class="text-black60">{{ props.item.warehouse.code }} - {{ props.item.warehouse.name }}</span>
                        </td>
                        <td>{{ props.item.delivery_order.code }}</td>
                        <td>{{ props.item.delivery_order.sales_order.order_type.name }}</td>
                        <td>{{ props.item.note }}</td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                ><span class="pa-md-2">Active</span></v-chip>
                            </div>
                            <div v-if="props.item.status == 2">
                                <v-chip
                                    :color="statusMaster('finished')"
                                >Finished</v-chip>
                            </div>
                            <div v-if="props.item.status == 3">
                                <v-chip
                                    :color="statusMaster('cancelled')"
                                > Cancelled </v-chip>
                            </div>
                        </td>
                        <td>
                            <v-menu>
                                <template v-slot:activator="{ on: menu }">
                                    <template>
                                        <v-btn
                                                icon
                                                v-on="{ ...menu }"
                                        >  <v-icon dark>mdi-dots-vertical</v-icon></v-btn>
                                    </template>
                                </template>
                                <v-list class="bg-white">
                                    <v-list-item v-privilege="'dr_rdd'" :to="{ name: 'DeliveryReturnDetail', params: { id: props.item.id } }">
                                        <v-list-item-title>
                                            Detail
                                        </v-list-item-title>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <div v-if="props.item.status == 1">
                                        <hr/>
                                    </div>
                                    <v-list-item v-if="props.item.status == 1" v-privilege="'dr_upd'" :to="{ name: 'DeliveryReturnUpdate', params: { id: props.item.id } }">
                                        <v-list-item-title>
                                            Update
                                        </v-list-item-title>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <router-view></router-view>
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
    import Vue from "vue";

    export default {
        name: "DeliveryReturn",
        data() {
            return {
                id:'',
                search: '',
                filter : false,
                loading: false,
                overlay: false,
                openDialog: false,
                return_date_model : '',
                return_date_input : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                return_date : [
                    new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10)
                ],
                statuses:999,
                regStatus:[
                    {
                        text:'All Status',
                        value:999
                    },
                    {
                        text:'Active',
                        value:1
                    },
                    {
                        text:'Finished',
                        value:2
                    },
                    {
                        text:'Cancelled',
                        value:3
                    }
                ],
                table: {
                    fields: [
                        {
                            text:'Code',
                            width: '15%',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Delivery Return Date',
                            width: '15%',
                            class: 'grey--text text--darken-4',
                            sortable: true
                        },
                        {
                            text:'Area',
                            width: '20%',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'DO Code',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Order Type',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Note',
                            width: '20%',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Status',
                            width: '5%',
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
                SelectWarehouse : '',
                order_type_id: '',
                items:[{
                    code : '',
                    recognition_date : '',
                    status : '',
                    warehouse : {
                        code: '',
                        name: '',
                        area : {
                            code : '',
                            name : '',
                        },
                    },
                    delivery_order : {
                        code : '',
                        note : '',
                        sales_order: {
                            order_type: {
                                name: ''
                            }
                        }
                    },
                }],
            }
        },

        mounted() {
            this.renderData('',this.statuses)
        },

        methods: {
            renderData(search,statuses){
                if(statuses === 999){
                    statuses = ''
                }else{
                    statuses= "|status:"+statuses
                }

                let returnDate = ''
                if (this.return_date.length > 0) {
                    if (this.return_date.length == 1) {
                        returnDate = '|recognition_date:'+this.return_date[0]
                    } else {
                        let date = this.return_date[0]
                        let date2 = this.return_date[1]
                        if (date > date2) {
                            returnDate = '|recognition_date.gte:'+date2+'|recognition_date.lte:'+date
                        } else {
                            returnDate = '|recognition_date.gte:'+date+'|recognition_date.lte:'+date2
                        }
                    }
                }

                let warehouse = ''
                if (this.SelectWarehouse) {
                    warehouse = '|warehouse.id.e:'+this.SelectWarehouse
                }
                let ordertype = ''
                if (this.order_type_id) {
                    ordertype = '|deliveryorder.salesorder.ordertype.id.e:' + this.order_type_id
                }
                this.loading = true;
                this.items = []
                this.$http.get("/warehouse/delivery_return", {params: {
                    perpage:100,
                    conditions:'code.icontains:'+search+'%2COr.delivery_order_id.code.icontains:'
                    +search+returnDate+warehouse+ordertype+statuses,
                    embeds:'warehouse_id,warehouse.area_id,delivery_order_id,delivery_order_id.sales_order_id.order_type_sls_id',
                    orderby:'-id',
                }}).then(response => {
                    this.loading = false
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            warehouseSelected(d) {
                this.SelectWarehouse = ""
                if (d) {
                    this.SelectWarehouse = d.id
                }
                this.renderData(this.search,this.statuses)
            },
            ordertypeSelected(d) {
                this.order_type_id = ""
                if (d) {
                    this.order_type_id = d.id
                }
                Vue.nextTick(() => {
                    this.items = []
                    this.renderData(this.search, this.statuses)
                });
            },
        },
        computed: {
            staff () {
                return this.$store.getters.getStaff
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
            'return_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.return_date[0] = this.$moment(val).format('YYYY-MM-DD')
                                this.renderData(this.search,this.statuses)
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0,10)
                            let date2 = val.substr(14,23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                this.return_date[0] = this.$moment(date1).format('YYYY-MM-DD')
                                this.return_date[1] = this.$moment(date2).format('YYYY-MM-DD')
                                if (this.return_date.length == 2) {
                                    this.renderData(this.search,this.statuses)
                                }
                            }
                        }
                    }
                },
                deep: true
            },
            'return_date': {
                handler: function (val) {
                    if (val) {
                        this.return_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
        },
    }
</script>