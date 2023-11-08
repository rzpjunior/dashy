<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row>
                <v-col cols="6" class="fs24 bold">
                    {{items.code}}
                </v-col>
                <v-col cols="6" class="d-flex justify-end">
                   <v-btn
                        v-if="items.id"
                        depressed
                        color="#50ABA3"
                        :to="`/warehouse/picking-order/assignment/${items.id}`"
                        class="no-caps bold"
                        v-privilege="'pco_asg_picker'"
                    >
                    <span class="text-white">
                        Assign Lead Picker
                    </span>
                    </v-btn>
                </v-col>
                <v-col cols="12" md="6" class="mt18">
                    <DetailRowNew :name="'Delivery Date'" :value="formatDate(items.recognition_date)"/>
                </v-col>
                <v-col cols="12" md="6" class="mt18">
                    <DetailRowNew :name="'Warehouse'" :value="items.warehouse.name"/>
                </v-col>
            </v-row>
        </div>
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
                        <span>Search by SO Code, Customer, &amp; Helper name &amp; Note ..</span>
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
                    <SelectWrt
                        :norequired="true"
                        @selected="wrtSelected"
                        :dense="true"
                    ></SelectWrt>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectBranch
                        :norequired="true"
                        :label="'Customer Name'"
                        @selected="branchSelected"
                        :dense="true"
                    ></SelectBranch>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectBusinessType
                        :norequired="true"
                        :label="'Customer Type'"
                        @selected="businessTypeSelected"
                        :dense="true"
                    ></SelectBusinessType>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectDistrict
                        :norequired="true"
                        @selected="districtSelected"
                        :dense="true"
                    ></SelectDistrict>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-select
                        v-model="statuses"
                        :items="status2"
                        item-text="text"
                        item-value="value"
                        outlined
                        dense
                    ></v-select>
                </v-col>
            </v-row>
        </div>
        <div class="box">
            <v-data-table
                :headers="table.fields"
                :items="items_so"
                :loading="loading"
                :items-per-page="10"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.item.picking_list.code }}</td>
                        <td>{{ props.item.sales_order.code }} <br>
                            <span class="text-black60">{{ props.item.sales_order.wrt.name }}</span>
                        </td>
                        <td>{{ props.item.total_koli }} Koli<br>
                            <span class="text-black60">{{ props.item.sales_order.total_weight }} Kg</span>
                        </td>
                        <td>{{ props.item.sales_order.branch.name }}  <br>
                            <span class="text-black60">{{ props.item.sales_order.sub_district.district.name }}, {{ props.item.sales_order.sub_district.postal_code }}</span></td>
                        <td>{{ props.item.assign_timestamp_str }}</td>
                        <td>{{ props.item.helper.display_name == "" ? "-" :  props.item.helper.display_name}} <br>
                            <span class="text-black60">{{ props.item.courier.name }}</span>
                        </td>
                        <td>{{ props.item.checked_by.display_name }}
                        </td>
                        <td>{{ props.item.checkin_timestamp_str == "" ? "-" : formatTime(props.item.checkin_timestamp_str)}} <br>
                            <span class="text-black60">{{ props.item.checkout_timestamp_str == "" ? "-" : formatTime(props.item.checkout_timestamp_str) }}</span>
                        </td>
                        <td>{{ props.item.checker_in_timestamp_str == "" ? "-" : formatTime(props.item.checker_in_timestamp_str)}} <br>
                            <span class="text-black60">{{ props.item.checker_out_timestamp_str == "" ? "-" : formatTime(props.item.checker_out_timestamp_str) }}</span>
                        </td>
                        <td>{{ props.item.total_item_on_progress }}/{{ props.item.total_item_so }}</td>
                        <td>{{ props.item.picking_list.note }}</td>
                        <td>
                            <div v-if="props.item.status_convert == 'New'">
                                <v-chip
                                    :color="statusMaster('active')"
                                    :text-color="statusMasterText('active')"
                                ><span class="pa-md-2">New</span></v-chip>
                            </div>
                            <div v-if="props.item.status_convert == 'On Progress'">
                                <v-chip
                                    :color="statusMaster('on_process')"
                                    :text-color="statusMasterText('on_process')"
                                ><span class="pa-md-2">On Progress</span></v-chip>
                            </div>
                            <div v-if="props.item.status_convert == 'Need Approval'">
                                <v-chip
                                    :color="statusMaster('partial')"
                                    :text-color="statusMasterText('partial')"
                                ><span class="pa-md-2">Need Approval</span></v-chip>
                            </div>
                            <div v-if="props.item.status_convert == 'Picked'">
                                <v-chip
                                    :color="statusMaster('picked')"
                                    :text-color="statusMasterText('picked')"
                                ><span class="pa-md-2">Picked</span></v-chip>
                            </div>
                            <div v-if="props.item.status_convert == 'Checking'">
                                <v-chip
                                    :color="statusMaster('invoiced_on_delivery')"
                                    :text-color="statusMasterText('invoiced_on_delivery')"
                                ><span class="pa-md-2">Checking</span></v-chip>
                            </div>
                            <div v-if="props.item.status_convert == 'Finished'">
                                <v-chip
                                    :color="statusMaster('finished')"
                                    :text-color="statusMasterText('finished')"
                                ><span class="pa-md-2">Finished</span></v-chip>
                            </div>
                            <div v-if="props.item.status_convert == 'Rejected'">
                                <v-chip
                                    :color="statusMaster('cancelled')"
                                    :text-color="statusMasterText('cancelled')"
                                ><span class="pa-md-2">Rejected</span></v-chip>
                            </div>
                        </td>
                        <td>
                            <div v-if="props.item.sales_order.status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                    :text-color="statusMasterText('active')"
                                ><span class="pa-md-2">Active</span></v-chip>
                            </div>
                            <div v-else-if="props.item.sales_order.status == 2">
                                <v-chip
                                    :color="statusMaster('finished')"
                                    :text-color="statusMasterText('finished')"
                                ><span class="pa-md-2">Finished</span></v-chip>
                            </div>
                            <div v-else-if="props.item.sales_order.status == 3">
                                <v-chip
                                    :color="statusMaster('cancelled')"
                                    :text-color="statusMasterText('cancelled')"
                                ><span class="pa-md-2"> Cancelled </span></v-chip>
                            </div>
                            <div v-else-if="props.item.sales_order.status == 7">
                                <v-chip
                                    :color="statusMaster('on_delivery')"
                                    :text-color="statusMasterText('on_delivery')"
                                ><span class="pa-md-2">On Delivery</span></v-chip>
                            </div>
                            <div v-else-if="props.item.sales_order.status == 8">
                                <v-chip
                                    :color="statusMaster('delivered')"
                                    :text-color="statusMasterText('delivered')"
                                ><span class="pa-md-2">Delivered</span></v-chip>
                            </div>
                            <div v-else-if="props.item.sales_order.status == 9">
                                <v-chip
                                    :color="statusMaster('invoiced_not_delivered')"
                                    :text-color="statusMasterText('invoiced_not_delivered')"
                                ><span class="pa-md-2">Invoiced not Delivered</span></v-chip>
                            </div>
                            <div v-else-if="props.item.sales_order.status == 10">
                                <v-chip
                                    :color="statusMaster('invoiced_on_delivery')"
                                    :text-color="statusMasterText('invoiced_on_delivery')"
                                ><span class="pa-md-2">Invoiced on Delivery</span></v-chip>
                            </div>
                            <div v-else-if="props.item.sales_order.status == 11">
                                <v-chip
                                    :color="statusMaster('invoiced_delivered')"
                                    :text-color="statusMasterText('invoiced_delivered')"
                                ><span class="pa-md-2">Invoiced Delivered</span></v-chip>
                            </div>
                            <div v-else-if="props.item.sales_order.status == 12">
                                <v-chip
                                    :color="statusMaster('paid_not_delivered')"
                                    :text-color="statusMasterText('paid_not_delivered')"
                                ><span class="pa-md-2">Paid not Delivered</span></v-chip>
                            </div>
                            <div v-else-if="props.item.sales_order.status == 13">
                                <v-chip
                                    :color="statusMaster('paid_on_delivery')"
                                    :text-color="statusMasterText('paid_on_delivery')"
                                ><span class="pa-md-2">Paid on Delivery</span></v-chip>
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
                                    <v-list-item @click="modalSOI(props.item.id)">
                                        <v-list-item-content>
                                            <v-list-item-title>Detail</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <hr v-if="props.item.status == 2  && (props.item.sales_order.status == 1 || props.item.sales_order.status == 9 || props.item.sales_order.status == 12)">
                                    <v-list-item v-if="props.item.status == 2  && (props.item.sales_order.status == 1 || props.item.sales_order.status == 9 || props.item.sales_order.status == 12)" :to="`/warehouse/delivery-order/create/${props.item.sales_order.id}`">
                                        <v-list-item-content>
                                            <v-list-item-title>Create Delivery</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <LoadingBar :value="overlay"/>
        <v-dialog
            v-model="modal_SOI"
            max-width="602px"
        >
            <v-card class="OpenSans">
                <v-card-title>
                    <v-spacer></v-spacer>
                        <v-btn
                            icon
                            @click="modal_SOI = false"
                        >
                            <v-img src="/icon/close-new.png" max-height="20px" max-width="20px"></v-img>
                        </v-btn>
                </v-card-title>
                <v-card-text>
                    <v-data-table
                        :headers="table_soi.fields_soi"
                        :items="items_soi"
                        :items-per-page="10"
                        :mobile-breakpoint="0"
                    >
                        <template v-slot:item="props">
                            <tr style="height: 48px;">
                                <td>{{ props.item.product.name }}</td>
                                <td>{{ props.item.product.uom.name }}</td>
                                <td>{{ props.item.order_qty }}</td>
                                <td>{{ props.item.pick_qty }}</td>
                                <td>{{ props.item.order_qty == props.item.pick_qty || props.item.order_qty > props.item.pick_qty ? props.item.unfullfill_note : ' ' }}</td>
                            </tr>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
export default {
    name: 'PickingOrderDetail',
    data() {
        return {
            search: '',
            filter: false,
            items : {
                warehouse: {
                    name: ''
                }
            },
            items_soi : [
                {
                    so_code: '',
                    product: {
                        name : '',
                        uom: {
                            name: '',
                        }
                    }
                }
            ],
            items_so: [],
            overlay: false,
            statuses:999,
            status2:[
                {
                    text:'All Status',
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
                {
                    text:'Need Approval',
                    value:4
                },
                {
                    text:'Picked',
                    value:5
                },
                {
                    text:'Checking',
                    value:6
                },
            ],
            loading: false,
            modal_SOI : false,
            dataAuditLog : {},
            productName : '',
            warehouse_id : '',
            ConfirmData : {},
            clear : false,
            error : {},
            filePdf: '',
            SelectDistrict: '',
            SelectBusinessType: '',
            SelectBranch: '',
            SelectWrt: '',
            area : '',
            warehouse : '',
            area_id: '',
            table_soi: {
                fields_soi: [
                    {
                        text:'Product Name',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'UOM',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Order Qty',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Picking Qty',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Unfulfill Note',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                ]
            },
            table: {
                fields: [
                    {
                        text:'Picking List Code',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Order Code',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Weight',
                        class: 'grey--text text--darken-4',
                        sortable: false
                    },
                    {
                        text:'Customer Name',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Time Assign',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Lead Picker',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Checker',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Time Picker',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Time Checker',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Item',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Note',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                        width: '20%',
                    },
                    {
                        text:'Picking Status',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'SO Status',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        width:'5%',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                ],
            },
        }
    },

    mounted() {
        this.renderData()
        this.renderSO('',this.statuses)
    },
    methods : {
        //to render detail picking
        renderData(){
            this.$http.get("/warehouse/picking_order/"+this.$route.params.id).then(response => {
                this.items = response.data.data
            });
        },
        //to render so
        renderSO(search,statuses){
            this.loading = true
            if(statuses === 999){
                statuses = ''
            }else{
                statuses= "|status:"+statuses
            }
            let branch = ''
            if (this.SelectBranch) {
                branch = '|salesorder.branch.id.e:'+this.SelectBranch
            }
            let wrt = ''
            if (this.SelectWrt) {
                wrt = '|salesorder.wrt.id.e:'+this.SelectWrt
            }
            let businesstype = ''
            if (this.SelectBusinessType) {
                businesstype = '|salesorder.archetype.businesstype.id.e:'+this.SelectBusinessType
            }
            let district = ''
            if (this.SelectDistrict) {
                district = '|salesorder.subdistrict.district.id.e:'+this.SelectDistrict
            }
            const conditions = 
                'salesorder.code.icontains:'+search+
                '%2COr.salesorder.branch.name.icontains:'+search+
                '%2COr.helper.display_name.icontains:'+search+
                '%2COr.checked_by.display_name.icontains:'+search+
                '%2COr.pickinglist.code.icontains:'+search+
                '%2COr.pickinglist.note.icontains:'+search+
                '|pickingorder.id.e:'+this.$route.params.id+
                '|salesorder.status__in:1.2.7.8.9.10.11.12.13'+branch+wrt+businesstype+district+statuses
            const embeds = 'sales_order_id,salesorder.branch_id,salesorder.archetype_id,salesorder.archetype.businesstype,salesorder.subdistrict,salesorder.subdistrict.district,staff_id,salesorder.wrt_id,checked_by,pickinglist'
            this.$http.get("/warehouse/picking_order/list-assign",{
                params:{
                    embeds: embeds,
                    conditions: conditions,
                    orderby:'-salesorder.wrt.id,salesorder.code',
                }}).then(response => {
                const newData = response.data.data
                this.loading = false
                this.items_so = response.data.data
                if(newData){
                    for (let i = 0; i < newData.length; i++) {
                        if(newData[i].checked_by === null){
                            newData[i].checked_by = []
                        }
                        if(i===newData.length){
                            this.items_so = newData
                        }
                    }
                } else {
                    this.items_so = []
                }
            });
        },
        //to open modal soi and get soi
        modalSOI(id){
            this.modal_SOI = true
            this.$http.get("/warehouse/picking_order/items/"+id).then(response => {
                this.items_soi = response.data.data
            });
        },
        //to select wrt based on id
        wrtSelected(d) {
            this.SelectWrt= ""
            if (d) {
                this.SelectWrt = d.id
            }
            this.renderSO(this.search,this.statuses)
        },
        //to select business type based on id
        businessTypeSelected(d) {
            this.SelectBusinessType= ""
            if (d) {
                this.SelectBusinessType = d.id
            }
            this.renderSO(this.search,this.statuses)
        },
        //to select branch based on id
        branchSelected(d) {
            this.SelectBranch= ""
            if (d) {
                this.SelectBranch = d.id
            }
            this.renderSO(this.search,this.statuses)
        },
        //to select district based on id
        districtSelected(d) {
            this.SelectDistrict= ""
            if (d) {
                this.SelectDistrict = d.district_id
            }
            this.renderSO(this.search,this.statuses)
        },
    },
    watch: {
        'search': {
                handler: function (val) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function(){
                        that.renderSO(val,that.statuses)
                    }, 1000);
                },
                deep: true
            },
        'statuses': {
                handler: function (val) {
                    let that = this
                    that.renderSO(that.search,val)
                },
                deep: true
            },
        }
}
</script>