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
                    <span>Search by SO Code, Customer, Vendor, Kurir name</span>
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
                                    prepend-inner-icon="mdi-calendar"
                                    readonly
                                    @click:clear="delivery_date = '',renderData(search,statuses)"
                                    v-model="delivery_date"
                                    outlined
                                    dense

                                >
                                    <template v-slot:label>
                                        Delivery Date
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            persistent-hint
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
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-select
                        v-model="statuses"
                        :items="status2"
                        name="filter_status"
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
                <v-col class="right">
                    <v-btn
                        depressed
                        color="#50ABA3"
                        :to="{ name: 'AssignCourier' }"
                        class="no-caps bold mr-4"
                        v-privilege="'dsp_asg_cou'"
                    >
                    <span class="text-white">
                        Assign Courier
                    </span>
                    </v-btn>
                    <v-btn
                        depressed
                        color="#50ABA3"
                        :to="{ name: 'Outgoing' }"
                        class="no-caps bold"
                        v-privilege="'dsp_scn'"
                    >
                    <span class="text-white">
                        Outgoing
                    </span>
                    </v-btn>
                </v-col>
            </v-row>
        </div>
        <div class="box-body-table">
            <v-data-table
                :headers="table.fields"
                :items="items"
                :loading="loading"
                :items-per-page="10"
            >
                <template v-slot:item="props">
                    <tr>
                        <td>{{ props.item.sales_order.code }}</td>
                        <td>{{ props.item.sales_order.branch.merchant.name }} <br>
                            <span class="second-color">{{ props.item.sales_order.shipping_address }}</span>
                        </td>
                        <td>{{ props.item.helper.name }}</td>
                        <td v-if="props.item.courier_vendor.name !== ''">{{ props.item.courier_vendor.name }} <br>
                            <span class="second-color">{{ props.item.planning_vendor }}</span>
                        </td>
                        <td v-else> - </td>
                        <td v-if="props.item.checked_by !== null">{{ props.item.checked_by.name }}</td>
                        <td v-else> - </td>
                        <td>{{ props.item.total_koli }} / {{ props.item.sales_order.total_weight }}</td>
                        <td v-if="props.item.courier.name !== ''">{{ props.item.courier.name }}</td>
                        <td v-else> - </td>
                        <td v-if="props.item.dispatcher.name !== ''">{{ props.item.dispatcher.name }}</td>
                        <td v-else> - </td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                    :text-color="statusMasterText('active')"
                                ><span class="pa-md-2">New</span></v-chip>
                            </div>
                            <div v-else-if="props.item.status == 2">
                                <v-chip
                                    :color="statusMaster('finished')"
                                    :text-color="statusMasterText('finished')"
                                ><span class="pa-md-2">Finished</span></v-chip>
                            </div>
                            <div v-else-if="props.item.status == 3">
                                <v-chip
                                    :color="statusMaster('on_process')"
                                    :text-color="statusMasterText('on_process')"
                                ><span class="pa-md-2"> On Progress </span></v-chip>
                            </div>
                        </td>
                        <td>
                            <div v-if="props.item.dispatch_status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                    :text-color="statusMasterText('active')"
                                ><span class="pa-md-2">New</span></v-chip>
                            </div>
                            <div v-else-if="props.item.dispatch_status == 2">
                                <v-chip
                                    :color="statusMaster('finished')"
                                    :text-color="statusMasterText('finished')"
                                ><span class="pa-md-2">Finished</span></v-chip>
                            </div>
                            <div v-else-if="props.item.dispatch_status == 3">
                                <v-chip
                                    :color="statusMaster('on_process')"
                                    :text-color="statusMasterText('on_process')"
                                ><span class="pa-md-2"> On Progress </span></v-chip>
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
                                    <v-list-item  v-if="props.item.dispatch_status == 1" @click="openVendor(props.item.id)" v-privilege="'dsp_vdr_chg'">
                                        <v-list-item-content>
                                            <v-list-item-title>Change Vendor</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <v-dialog
            v-model="modalVendor"
            max-width="602px"
        >
            <v-card class="Heiti" style="border-radius: 15px;">
                <v-overlay style="z-index: 6 !important;" :value="overlayVendor">
                    <v-progress-circular
                        indeterminate
                        size="84"
                        color="green"
                        width=15
                    ></v-progress-circular>
                </v-overlay>
                <v-card-title>
                    <v-row>
                        <v-col class="text-title-modal" cols="12" md="6">
                            Change Vendor
                        </v-col>
                        <v-col class="flex-align-end" cols="12" md="6">
                            <v-btn
                                icon
                                @click="closeModalVendor()"
                            >
                                <v-img src="/icon/close-new.png" max-height="24px" max-width="24px"></v-img>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-card-text>
                    <div style="padding:20px;">
                        <div class="row" style="margin:-12px">
                            <div class="col">
                                 <SelectVendor
                                    name="vendor"
                                    @selected="vendorSelected"
                                    :dense="true"
                                ></SelectVendor>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <SelectCourier
                                    name="courier"
                                    @selected="courierSelected"
                                    :vendor_id="SelectVendor"
                                    :disabled="disableCourier"
                                    :dense="true"
                                ></SelectCourier>
                            </div>
                        </div>
                    </div>
                </v-card-text>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                        <v-btn
                            depressed
                            color="#50ABA3"
                            class="main-btn white--text"
                            @click="changeVendor()"
                        >
                            Save
                        </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    export default {
        name: "Dispatch",
        data() {
            return {
                filter:false,
                overlay: false,
                disableCourier: true,
                modalVendor: false,
                SelectCourier: '',
                SelectVendor: '',
                vendor_id: '',
                overlayVendor: false,
                search: '',
                delivery_date_model: "",
                delivery_date: new Date(Date.now() + (3600 * 1000 * 24) + (3600 * 1000 * 7)).toISOString().substr(0, 10),
                loading: false,
                table: {
                    fields: [
                        {
                            text:'Order Code',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Customer',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Picker',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Vendor',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Checker',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Koli/Weight',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Courier',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Dispatcher',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Picking Status',
                            class: 'grey--text text--darken-4',
                            width: "10%",
                            sortable: false
                        },
                        {
                            text:'Dispatch Status',
                            class: 'grey--text text--darken-4',
                            width: "10%",
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
                statuses:999,
                status2:[
                    {
                        text:'All Status Dispatch',
                        value:999
                    },
                    {
                        text:'New',
                        value:1
                    },
                    {
                        text:'Finished',
                        value:2
                    },
                    {
                        text:'On Progress',
                        value:3
                    },
                ],
                overlay: false,
                warehouse_id: '',
            }
        },
        mounted() {
            this.renderData('',this.statuses)
        },
        computed: {
            validation() {
                if (this.SelectCourier) {
                    return false
                } else {
                    return true
                }
            },

            //to get staff id
            staff() {
                return this.$store.getters.getStaff
            },
        },
        methods: {
            openVendor(id){
                this.dispatch_id = id
                this.modalVendor = true
            },
            changeVendor(){
                this.$http.put('/logistic/dispatch/vendor/'+this.dispatch_id, {
                    courier_vendor_id: this.SelectVendor,
                    courier_id: this.SelectCourier
                }).then(res => {
                    this.modalVendor = false
                    this.overlayVendor = false
                    this.SelectCourier = ''
                    this.$toast.open({
                        position: 'top-right',
                        message: 'Data has been updated successfully',
                        type: 'success',
                    });
                    this.renderData(this.search,this.statuses)
                })
            },
            closeModalVendor(){
                this.modalVendor = false
                this.SelectCourier = ''
                this.renderData(this.search,this.statuses)
            },
            courierSelected(d) {
                this.SelectCourier = ""
                this.disableAddCourier = true
                if (d) {
                    this.SelectCourier = d.id
                    this.disableAddCourier = false
                }
            },
            vendorSelected(d) {
                this.disableCourier = true
                this.SelectVendor = ""
                this.SelectCourier = ""
                if (d) {
                    this.SelectVendor = d.id
                    this.disableCourier = false
                }
            },
            //to get warehouse id
            renderData(search,statuses){
                this.loaded = false
                this.$http.get("/user/staff/"+this.staff.id)
                .then(response => {
                    let dataWr = response.data.data
                    this.warehouse_id = dataWr.warehouse.id
                    this.loading = true
                    if(statuses === 999){
                        statuses = ''
                    }else{
                        statuses= "|dispatchstatus:"+statuses
                    }
                    let delivery_date = ''
                    if (this.delivery_date) {
                        delivery_date = '|pickingorder.recognitiondate:'+this.delivery_date
                    }
                    this.$http.get("/logistic/dispatch",{params:{
                            conditions:'Or.salesorder.code.icontains:'+search+'%2COr.salesorder.branch.merchant.name.icontains:'+search+'%2COr.couriervendor.name.icontains:'+search+'%2COr.courier.name.icontains:'+search+delivery_date+statuses+'|pickingorder.warehouse.id.e:'+this.warehouse_id+'|status:2',
                            orderby:'-id',
                        }}).then(response => {
                        this.loading = false
                        this.items = response.data.data
                        if(this.items === null){
                            this.items = []
                        }
                    });
                });

            },
        },
        watch: {
            'search': {
                handler: function (val) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function(){
                        that.renderData(val,that.statuses)
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
