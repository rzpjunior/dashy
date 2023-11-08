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
                        <span>Search by Delivery Code, Order Code</span>
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
                    <SelectArea
                        :norequired="true"
                        @selected="areaSelected"
                        :dense="true"
                        :aux_data="2"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectMerchant
                        :norequired="true"
                        :dense="true"
                        @selected="merchantSelected"
                        :label="'Customer'"
                    ></SelectMerchant>
                </v-col>
                <v-col cols="12" md="3" class="-mt24" v-if="outlet">
                    <SelectBranch
                        :norequired="true"
                        :dense="true"
                        :merchant="SelectMerchant"
                        @selected="branchSelected"
                        :label="'Outlet'"
                    ></SelectBranch>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectWrt
                        :norequired="true"
                        :dense="true"
                        @selected="wrtSelected"
                        :area="SelectArea"
                    ></SelectWrt>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectWarehouse
                        :norequired="true"
                        :dense="true"
                        :aux_data="2"
                        @selected="warehouseSelected"
                        :label="'Warehouse'"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="delivery_date_model"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-text-field
                                    style="margin-bottom:-30px;"
                                    prepend-inner-icon="mdi-calendar"
                                    outlined
                                    maxlength="24"
                                    @blur="setDateDelivery()"
                                    v-model="delivery_date_input"
                                    dense
                                >
                                    <template v-slot:label>
                                        Delivery Date
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            v-model="delivery_date"
                        >
                            <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="delivery_date_model = false,renderData(search,statuses)"
                            >
                                OK
                            </v-btn>
                        </v-date-picker>
                    </v-menu>
                    <span class="text-black60 fs12">Max 31 days can be selected</span>
                </v-col>
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
                    <SelectOrderType
                        :norequired="true"
                        name="order_type"
                        @selected="ordertypeSelected"
                        :dense="true"
                    ></SelectOrderType>
                </v-col>
            </v-row>
        </div>
        <div class="box">
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
                        <td>{{ formatDate(props.item.recognition_date) }}<br>
                        <span class="text-black60">{{ props.item.wrt.name }}</span>
                        </td>
                        <td>{{ props.item.sales_order.code }}</td>
                        <td>{{ props.item.sales_order.order_type.name }}</td>
                        <td>{{ props.item.sales_order.branch.name }}</td>
                        <td>{{ props.item.sales_order.area.name }}</td>
                        <td>{{ props.item.warehouse.name }}</td>
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
                            <div v-if="props.item.status == 4">
                                <v-chip
                                    :color="statusMaster('deleted')"
                                > Deleted </v-chip>
                            </div>
                            <div v-if="props.item.status == 5">
                                <v-chip
                                    :color="statusMaster('on_delivery')"
                                > On Delivery </v-chip>
                            </div>
                            <div v-if="props.item.status == 6">
                                <v-chip
                                    :color="statusMaster('delivered')"
                                > Delivered </v-chip>
                            </div>
                            <div v-if="props.item.status == 7">
                                <v-chip
                                    :color="statusMaster('failed')"
                                > Failed </v-chip>
                            </div>
                        </td>
                        <td>
                            <v-menu>
                                <template v-slot:activator="{ on: menu }">
                                    <template>
                                        <v-btn
                                            icon
                                            v-on="{ ...menu }"
                                        >
                                            <v-icon dark>mdi-dots-vertical</v-icon>
                                        </v-btn>
                                    </template>
                                </template>
                                <v-list class="bg-white">
                                    <v-list-item v-if="props.item.status == 1 || props.item.status == 5 || props.item.status == 6 || props.item.status == 7" v-privilege="'do_upd'" :to="{ name: 'DeliveryOrderUpdate', params: { id: props.item.id } }" >
                                        <v-list-item-title>
                                            Update
                                        </v-list-item-title>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <v-list-item :to="{ name: 'DeliveryOrderDetail', params: { id: props.item.id } }" v-privilege="'do_rdd'">
                                        <v-list-item-title>
                                            Detail
                                        </v-list-item-title>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <v-list-item v-if="props.item.status == 1 || props.item.status == 6 || props.item.status == 7" :to="{ name: 'DeliveryOrderConfirm', params: { id: props.item.id } }" v-privilege="'do_cnf'">
                                        <v-list-item-content>
                                            <v-list-item-title>Confirm</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <div>
                                        <hr>
                                    </div>
                                    <v-list-item v-if="props.item.has_delivered == 1" @click="getCourier(props.item.id)">
                                        <v-list-item-title>
                                            Courier
                                        </v-list-item-title>
                                    </v-list-item>
                                    <div v-if="props.item.has_delivered == 1">
                                        <hr>
                                    </div>
                                    <v-list-item @click="print(props.item.id)" v-privilege="'do_prt'">
                                        <v-list-item-title>
                                            Print
                                        </v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <v-dialog
            v-model="modalCourier"
            max-width="502px"
        >
            <v-card class="OpenSans">
                <LoadingBar :value="overlayCourier"/> 
                <v-card-title>
                    
                    <span class="text-title-modal">Courier Tracking</span>
                    <v-spacer></v-spacer>
                      <v-btn
                          icon
                          @click="modalCourier = false"
                      >
                          <v-img src="/icon/close-new.png" max-height="20px" max-width="20px"></v-img>
                      </v-btn>
                </v-card-title>
                <v-card-text>
                    <div style="padding:15px;">
                        <DetailRowNew :name="'Courier Name'" :value="courier.courier_name"/>
                        <DetailRowNew :name="'Delivery Order Code'" :value="courier.delivery_order.code"/>
                        <div class="row">
                            <div class="col mt-1 text-black60">Location :</div>
                        </div>
                        <div class="row" style="margin:-12px">
                            <div class="col">
                                <a style="text-decoration:none;" @click="gotoLoc">
                                   {{locLink}}
                                </a>
                            </div>
                        </div>
                        <v-divider class="my-3"/>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
        <LoadingBar :value="overlay"/> 
    </v-container>
</template>
<script>
    import Vue from "vue";

    export default {
        name: "DeliveryOrder",
        data() {
            return {
                filter : false,
                id:'',
                id_do : '',
                code_do: '',
                delta_print_do: '',
                search: '',
                modalCourier: false,
                overlayCourier: false,
                outlet:false,
                loading: false,
                overlay: false,
                openDialog: false,
                delivery_date_model : '',
                delivery_date_input : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                delivery_date : [new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10)],
                controlValue:{
                    pdfQuality: 2,
                    paginateElementsByHeight: 1400,
                    pdfOrientation: 'portrait',
                    pdfFormat: "a4",
                    pdfContentWidth: "800px"
                },
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
                    },
                    {
                        text: 'Deleted',
                        value: 4
                    },
                    {
                        text: 'On Delivery',
                        value: 5
                    },
                    {
                        text: 'Delivered',
                        value: 6
                    },
                    {
                        text: 'Failed',
                        value: 7
                    },
                ],
                table: {
                    fields: [
                        {
                            text:'Delivery Order Code',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Delivery Date',
                            class: 'grey--text text--darken-4',
                            sortable: true
                        },
                        {
                            text:'Order Code',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Order Type',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Customer',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Area',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Warehouse Origin',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Status',
                            class: 'grey--text text--darken-4',
                            sortable: true
                        },
                        {
                            width: "5%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                    ],
                },
                SelectArea : '',
                SelectMerchant : '',
                order_type_id: '',
                SelectWrt : '',
                SelectWarehouse : '',
                productItems: [],
                itemPdf: {},
                outlet: false,
                render: true,
                longitude: '',
                latitude: '',
                locLink: '',
                courier: {
                    courier_name: '',
                    longitude: '',
                    latitude: '',
                    delivery_order: {
                        code: '',
                    }
                },
                items:[{
                    code : '',
                    sales_order : {
                        code: '',
                        branch : {
                            name : ''
                        },
                        area : {
                            name : ''
                        },
                        order_type: {
                            name: ''
                        }
                    },
                    wrt : {
                        name : ''
                    },
                    warehouse : {
                        name : ''
                    },
                }],
                filePdf: ''
            }
        },

        mounted() {
            this.renderData('',this.statuses)
        },

        methods: {
             print(id){
                 this.overlay = true
                 this.id_so = id
                 this.$http.get("/warehouse/delivery_order/print/"+this.id_so)
                    .then(response => {
                        this.filePdf = response.data.file
                        window.open(this.filePdf,'_blank');
                        this.overlay = false
                    })
             },
              domRendered() {
                this.contentRendered = true;
            },

            renderData(search,statuses){
                if(statuses === 999){
                    statuses = ''
                }else{
                    statuses= "|status:"+statuses
                }
                let area = ''
                if (this.SelectArea) {
                    area = '|sales_order_id.area__id.e:'+this.SelectArea
                }
                let merchant = ''
                if (this.SelectMerchant) {
                    merchant = '|sales_order_id.branch.merchant.id.e:'+this.SelectMerchant
                }
                let branch = ''
                if (this.SelectBranch) {
                    branch = '|sales_order_id.branch.id.e:'+this.SelectBranch
                }
                let delivery_date = ''
                if (this.delivery_date.length > 0) {
                    if (this.delivery_date.length == 1) {
                        delivery_date = '|recognition_date:'+this.delivery_date[0]
                    } else {
                        let date = this.delivery_date[0]
                        let date2 = this.delivery_date[1]
                        if (date > date2) {
                            delivery_date = '|recognition_date.gte:'+date2+'|recognition_date.lte:'+date
                        } else {
                            delivery_date = '|recognition_date.gte:'+date+'|recognition_date.lte:'+date2
                        }
                    }
                }else {
                    delivery_date = '|delivery_date:'+new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10)
                }
                let wrt = ''
                if (this.SelectWrt) {
                    wrt = '|wrt.id.e:'+this.SelectWrt
                }
                let warehouse = ''
                if (this.SelectWarehouse) {
                    warehouse = '|sales_order_id.warehouse.id.e:'+this.SelectWarehouse
                }
                let ordertype = ''
                if (this.order_type_id) {
                    ordertype = '|salesorder.ordertype.id.e:' + this.order_type_id
                }
                this.render = true
                this.loading = true;
                this.items = []
                this.$http.get("/warehouse/delivery_order", {params: {
                    perpage:100,
                    embeds:'sales_order_id,sales_order_id.area_id,sales_order_id.branch_id,wrt_id,warehouse_id,sales_order_id.order_type_sls_id',
                    conditions:'Or.code.icontains:'+search+'%2COr.sales_order_id.code.icontains:'+search+area+merchant+branch+delivery_date+wrt+warehouse+ordertype+statuses,
                    orderby:'-id',
                }}).then(res => {
                    this.loading = false
                    this.items = res.data.data
                    if(this.items === null){
                        this.items = []
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            //get endpoint courier for modal
            async getCourier(id){
                this.modalCourier = true
                this.overlayCourier = true
                this.id_do = id
                await this.$http.get("/warehouse/delivery_order/courier/"+this.id_do).then(res => {
                    this.courier = res.data.data
                    this.courier.name = res.data.data.name
                    this.courier.longitude = res.data.data.longitude
                    this.courier.latitude = res.data.data.latitude
                    this.courier.delivery_order.code = res.data.data.delivery_order.code
                    this.locLink = "https://www.google.com/maps/?q="+this.courier.latitude+','+this.courier.longitude
                    this.overlayCourier = false
                }).catch(err => {
                    console.log(err)
                })
            },
            //get gmaps link location
            gotoLoc(){
                return window.open(this.locLink,'_blank');
            },

            areaSelected(d) {
                this.SelectArea = ""
                if (d) {
                    this.SelectArea = d.id
                }
                this.renderData(this.search,this.statuses)
            },
            merchantSelected(d) {
                this.outlet = false
                this.SelectMerchant = ""
                if (d) {
                    if (d.customer_group==1) {
                        this.outlet = true
                    }
                    this.SelectMerchant = d.id
                }
                this.renderData(this.search,this.statuses)
            },
            wrtSelected(d) {
                this.SelectWrt = ""
                if (d) {
                    this.SelectWrt = d.id
                }
                this.renderData(this.search,this.statuses)
            },
            warehouseSelected(d) {
                this.SelectWarehouse = ""
                if (d) {
                    this.SelectWarehouse = d.id
                }
                this.renderData(this.search,this.statuses)
            },
            setDateDelivery() {
                if (this.delivery_date_input == '') {
                    this.delivery_date_input = new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                    this.delivery_date = [new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10)]
                }

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
              'delivery_date_input': {
                handler: function (val) {
                    if (val) {
                         if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                if (this.render == true) {
                                    this.delivery_date[0] = this.$moment(val).format('YYYY-MM-DD')
                                    this.renderData(this.search,this.statuses)
                                }
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0,10)
                            let date2 = val.substr(14,23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                if (this.delivery_date.length == 2) {
                                    let date3 = new Date(this.delivery_date[0])
                                    let date4 = new Date(this.delivery_date[1])
                                    if (parseInt((date4-date3)/(24*3600*1000)) > 30 || parseInt((date4-date3)/(24*3600*1000)) < -30) {
                                        if (date4 < date3) {
                                            this.render = false
                                            this.delivery_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                            this.delivery_date.splice(1,1)
                                        } else {
                                            this.render = false
                                            this.delivery_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                            this.delivery_date.splice(1,1)
                                        }
                                    } else {
                                        this.renderData(this.search,this.statuses)
                                    }
                                }
                            }
                        }
                    }
                },
                deep: true
            },
            'delivery_date': {
                handler: function (val) {
                    if (val) {
                        this.delivery_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
        },
    }
</script>