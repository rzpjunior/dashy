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
                        <span>Search by Order Code</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12" md="5" class="h1"/>
                <v-col cols="12" md="3">
                    <v-autocomplete
                        v-model="sortby"
                        :items="sorts"
                        item-text="text"
                        name="sort"
                        placeholder="Select Field"
                        @change="funcSort"
                        return-object
                        label="Sort by"
                        outlined
                        dense
                    >
                        <template slot="selection" slot-scope="data">
                            <div class="select-item">
                                {{ data.item.text }}
                            </div>
                        </template>
                        <template slot="item" slot-scope="data">
                            {{ data.item.text }}
                        </template>
                    </v-autocomplete>
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
                        :aux_data="2"
                        :dense="true"
                        :clear="clearArea"
                    ></SelectArea>
                </v-col>
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
                        :label="'Outlet'"
                    ></SelectBranch>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectPaymentGroup
                        :norequired="true"
                        :dense="true"
                        @selected="paymentgroupSelected"
                    ></SelectPaymentGroup>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="order_date_model"
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
                                    clearable
                                    dense
                                    @click:clear="order_date = [],order_date_input = ''"
                                    v-model="order_date_input"
                                    maxlength="24"
                                >
                                    <template v-slot:label>
                                        Order Date
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            persistent-hint
                            v-model="order_date"
                        ></v-date-picker>
                    </v-menu>
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
                                    prepend-inner-icon="mdi-calendar"
                                    outlined
                                    @blur="setDateValidation()"
                                    maxlength="24"
                                    dense
                                    v-model="delivery_date_input"
                                    style="margin-bottom:-30px;"
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
                        ></v-date-picker>
                    </v-menu>
                    <span class="text-black60 fs12">Max 31 days can be selected</span>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectWrt
                        :norequired="true"
                        :dense="true"
                        @selected="wrtSelected"
                    ></SelectWrt>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectWarehouse
                        :norequired="true"
                        :dense="true"
                        :aux_data="2"
                        @selected="warehouseSelected"
                        :label="'Order Warehouse'"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-select
                        v-model="statuses"
                        :items="status2"
                        item-text="text"
                        item-value="value"
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
                <v-col cols="12" md="3" class="-mt24">
                    <SelectCity 
                        @selected="citySelected" 
                        :norequired="true"
                        :dense="true"
                    ></SelectCity>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectBusinessType
                        :dense="true"
                        :norequired="true"
                        name="businesstype"
                        :aux_data="2"
                        @selected="SelectBusinessTypeFilter"
                    >
                    </SelectBusinessType>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectSalesPerson
                        :dense="true"
                        :norequired="true"
                        name="salesperson"
                        @selected="salespersonSelected"
                        required
                    ></SelectSalesPerson>
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row >
                <v-col class="flex-align-end">
                    <v-btn
                        depressed
                        color="#50ABA3"
                        v-if="user_role_id == 524288"
                        :to="{ name: 'SalesOrderMobileCreate' }"
                        class="no-caps bold"
                        v-privilege="'so_crt'"
                    >
                        <span class="text-white">
                            Create Sales Order
                        </span>
                    </v-btn>
                    <v-btn
                        depressed
                        v-else
                        color="#50ABA3"
                        to="/sales-order/create"
                        class="no-caps bold"
                        v-privilege="'so_crt'"
                    >
                        <span class="text-white">
                            Create Sales Order
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
                :items-per-page="pagination.rowsPerPage"
                @update:items-per-page="getItemPerPage"
                @update:page="getPagination"
                :footer-props="{'items-per-page-options':[5,10,15,20,25],'disable-pagination':false,'disableItemsPerPage':false}"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>
                            <router-link :to="{ path: `/sales-order/detail/${props.item.id}`}"
                                class="routerLink" v-privilege="'so_rdd'">
                                {{ props.item.code }}<br>
                                <span class="text-black60">{{ formatDate(props.item.recognition_date) }}</span>
                            </router-link>
                        </td>
                        <td>{{ props.item.branch.name }}<br>
                            <span class="text-black60">
                                {{ props.item.archetype.business_type.name }}<br>
                                {{ props.item.salesperson.name }}
                            </span>
                        </td>
                        <td>{{ formatDate(props.item.delivery_date) }}<br>
                            <span class="text-black60">{{ props.item.wrt.name }}</span></td>
                        <td>{{ props.item.area.name }}<br>
                            <span class="text-black60">
                                {{ props.item.branch.sub_district.district.city.name }}<br>
                                {{ props.item.warehouse.name }}
                            </span>
                        </td>
                        <td> {{ formatPrice(props.item.total_charge) }}<br>
                            <span class="text-black60">{{ props.item.payment_group.name }}</span></td>
                        <td>{{ props.item.note }}</td>
                        <td>{{ props.item.order_type.name }}</td>
                        <td>
                            <div v-if="props.item.status_picking_order_assign_convert == 'New'">
                                <v-chip
                                    :color="statusMaster('active')"
                                    :text-color="statusMasterText('active')"
                                ><span class="pa-md-2">New</span></v-chip>
                            </div>
                            <div v-else-if="props.item.status_picking_order_assign_convert == 'On Progress'">
                                <v-chip
                                    :color="statusMaster('on_process')"
                                    :text-color="statusMasterText('on_process')"
                                ><span class="pa-md-2">On Progress</span></v-chip>
                            </div>
                            <div v-else-if="props.item.status_picking_order_assign_convert == 'Need Approval'">
                                <v-chip
                                    :color="statusMaster('partial')"
                                    :text-color="statusMasterText('partial')"
                                ><span class="pa-md-2">Need Approval</span></v-chip>
                            </div>
                            <div v-else-if="props.item.status_picking_order_assign_convert == 'Picked'">
                                <v-chip
                                    :color="statusMaster('picked')"
                                    :text-color="statusMasterText('picked')"
                                ><span class="pa-md-2">Picked</span></v-chip>
                            </div>
                            <div v-else-if="props.item.status_picking_order_assign_convert == 'Checking'">
                                <v-chip
                                    :color="statusMaster('invoiced_on_delivery')"
                                    :text-color="statusMasterText('invoiced_on_delivery')"
                                ><span class="pa-md-2">Checking</span></v-chip>
                            </div>
                            <div v-else-if="props.item.status_picking_order_assign_convert == 'Finished'">
                                <v-chip
                                    :color="statusMaster('finished')"
                                    :text-color="statusMasterText('finished')"
                                ><span class="pa-md-2">Finished</span></v-chip>
                            </div>
                            <div v-else>
                                -
                            </div>
                        </td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                    :text-color="statusMasterText('active')"
                                ><span class="pa-md-2">Active</span></v-chip>
                            </div>
                            <div v-else-if="props.item.status == 2">
                                <v-chip
                                    :color="statusMaster('finished')"
                                    :text-color="statusMasterText('finished')"
                                ><span class="pa-md-2">Finished</span></v-chip>
                            </div>
                            <div v-else-if="props.item.status == 3">
                                <v-chip
                                    :color="statusMaster('cancelled')"
                                    :text-color="statusMasterText('cancelled')"
                                ><span class="pa-md-2"> Cancelled </span></v-chip>
                            </div>
                            <div v-else-if="props.item.status == 7">
                                <v-chip
                                    :color="statusMaster('on_delivery')"
                                    :text-color="statusMasterText('on_delivery')"
                                ><span class="pa-md-2">On Delivery</span></v-chip>
                            </div>
                            <div v-else-if="props.item.status == 8">
                                <v-chip
                                    :color="statusMaster('delivered')"
                                    :text-color="statusMasterText('delivered')"
                                ><span class="pa-md-2">Delivered</span></v-chip>
                            </div>
                            <div v-else-if="props.item.status == 9">
                                <v-chip
                                    :color="statusMaster('invoiced_not_delivered')"
                                    :text-color="statusMasterText('invoiced_not_delivered')"
                                ><span class="pa-md-2">Invoiced not Delivered</span></v-chip>
                            </div>
                            <div v-else-if="props.item.status == 10">
                                <v-chip
                                    :color="statusMaster('invoiced_on_delivery')"
                                    :text-color="statusMasterText('invoiced_on_delivery')"
                                ><span class="pa-md-2">Invoiced on Delivery</span></v-chip>
                            </div>
                            <div v-else-if="props.item.status == 11">
                                <v-chip
                                    :color="statusMaster('invoiced_delivered')"
                                    :text-color="statusMasterText('invoiced_delivered')"
                                ><span class="pa-md-2">Invoiced Delivered</span></v-chip>
                            </div>
                            <div v-else-if="props.item.status == 12">
                                <v-chip
                                    :color="statusMaster('paid_not_delivered')"
                                    :text-color="statusMasterText('paid_not_delivered')"
                                ><span class="pa-md-2">Paid not Delivered</span></v-chip>
                            </div>
                            <div v-else-if="props.item.status == 13">
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
                                    >
                                        <v-icon dark>mdi-dots-vertical</v-icon>
                                    </v-btn>
                                </template>
                                <v-list class="bg-white">
                                    <v-list-item :to="`/sales-order/detail/${props.item.id}`" v-privilege="'so_rdd'">
                                        <v-list-item-content>
                                            <v-list-item-title>Detail</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <v-list-item
                                            v-if="props.item.status==1 && props.item.payment_group.id!=65536 && props.item.has_ext_invoice==2"
                                            @click="update(props.item.id)" v-privilege="'so_upd'">
                                        <v-list-item-content>
                                            <v-list-item-title>Update</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <v-list-item
                                            v-if="props.item.status == 1 || props.item.status == 9 || props.item.status == 12"
                                            :to="`/warehouse/delivery-order/create/${props.item.id}`"
                                            v-privilege="'do_crt'">
                                        <v-list-item-content>
                                            <v-list-item-title>Create Delivery</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <v-list-item
                                        v-if="(props.item.status == 1 || props.item.status == 7 || props.item.status == 8) && props.item.payment_group.id != 65536"
                                        :to="`/finance/si/create/${props.item.id}`" v-privilege="'si_crt'">
                                        <v-list-item-content>
                                            <v-list-item-title>Create Invoice</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <div v-if="props.item.status != 3" v-privilege="'so_prt'">
                                        <hr>
                                    </div>
                                    <v-list-item v-if="props.item.status != 3" @click="print(props.item.id)" v-privilege="'so_prt'">
                                        <v-list-item-content>
                                            <v-list-item-title>Print</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </template>
                <template v-slot:[`footer.page-text`]="props">
                    {{ props.pageStart }} - {{ props.pageStop}} of {{pagination.totalItems}}
                </template>
            </v-data-table>
        </div>
        <LockDialog :model="updateCheck" :locked_by="locked_by_name"/>
        <LoadingBar :value="overlay"/>
    </v-container>
</template>
<script>
    import Vue from 'vue'
    export default {
        name: "SalesOrder",
        data() {
            return {
                modalLockSO: false,
                sortby: 'id',
                orderby: 'id',
                filter : false,
                sorts: [
                    {
                        text: 'Created At (A-Z)',
                        value: 'id'
                    },
                    {
                        text: 'Created At (Z-A)',
                        value: '-id'
                    },
                    {
                        text: 'Delivery Date (A-Z)',
                        value: 'delivery_date'
                    },
                    {
                        text: 'Delivery Date (Z-A)',
                        value: '-delivery_date'
                    },
                    {
                        text: 'Total (A-Z)',
                        value: 'total_charge'
                    },
                    {
                        text: 'Total (Z-A)',
                        value: '-total_charge'
                    },
                    {
                        text: 'Status (A-Z)',
                        value: 'status'
                    },
                    {
                        text: 'Status (Z-A)',
                        value: '-status'
                    },
                ],
                order_date_input: "",
                pagination: {
                    page: 0,
                    rowsPerPage: 11,
                    totalItems: 0
                },
                id_so: '',
                code_so: '',
                modalOpen: false,
                search: '',
                order_date_model: '',
                order_date: [],
                delivery_date_model: '',
                delivery_date: [new Date(Date.now() + (3600 * 1000 * 24) + (3600 * 1000 * 7)).toISOString().substr(0, 10)],
                delivery_date_input: new Date(Date.now() + (3600 * 1000 * 24) + (3600 * 1000 * 7)).toISOString().substr(0, 10),
                loading: false,
                statuses: 999,
                status2: [
                    {
                        text: 'All Status',
                        value: 999
                    },
                    {
                        text: 'Active',
                        value: 1
                    },
                    {
                        text: 'Finished',
                        value: 2
                    },
                    {
                        text: 'Cancelled',
                        value: 3
                    },
                    {
                        text: 'On Delivery',
                        value: 7
                    },
                    {
                        text: 'Delivered',
                        value: 8
                    },
                    {
                        text: 'Invoiced not Delivered',
                        value: 9
                    },
                    {
                        text: 'Invoiced on Delivery',
                        value: 10
                    },
                    {
                        text: 'Invoiced Delivered',
                        value: 11
                    },
                    {
                        text: 'Paid not Delivered',
                        value: 12
                    },
                    {
                        text: 'Paid on Delivery',
                        value: 13
                    },
                ],
                table: {
                    fields: [
                        {
                            text: 'Order Code',
                            width: "15%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text: 'Customer',
                            width: "20%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Delivery Date',
                            width: "9%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Area',
                            width: "12%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Total',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Note',
                            width: "13%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Order Type',
                            width: "8%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Picking Status',
                            width: "8%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Status',
                            width: "8%",
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
                items: [{
                    branch: {
                        name: ''
                    },
                    archetype: {
                        business_type: {
                            name: '',
                        }
                    },
                    salesperson: {
                        name: ''
                    },
                    wrt: {
                        name: ''
                    },
                    area: {
                        name: ''
                    },
                    branch: {
                        sub_district: {
                            district: {
                                city: {
                                    name: ''
                                }
                            },
                        }
                    },
                    warehouse: {
                        name: ''
                    },
                    payment_group: {
                        name: ''
                    },
                    order_type: {
                        name: ''
                    }
                }],
                SelectArea: '',
                SelectMerchant: '',
                SelectBranch: '',
                SelectPaymentGroup: '',
                SelectWrt: '',
                SelectWarehouse: '',
                outlet: false,
                overlay: false,
                clearArea: false,
                render: true,
                filePdf: '',
                lastPage: 0,
                user_role_id: '',
                user_id: '',
                order_type_id: '',
                city_id: '',
                business_type_id: '',
                sales_person_id: '',
                updateCheck: false,
                locked_by_name: '',
            }
        },
        mounted() {
            this.user_role_id = this.$store.state.staff.role.id
            this.user_id = this.$store.state.staff.id / 65536
            Vue.nextTick(() => {
                this.items = []
                this.renderData('', this.statuses)
            });
        },
        methods: {
            // For Sortir data table
            funcSort(event) {
                if(event){
                    this.orderby = event.value
                }
                this.pagination.page = 0
                this.lastPage = 1
                Vue.nextTick(() => {
                    this.items = []
                    this.renderData(this.search, this.statuses)
                });
            },
            // Count all data for paggination
            getItemPerPage(val) {
                this.pagination.rowsPerPage = val + 1
                this.lastPage = 1
                Vue.nextTick(() => {
                    this.items = []
                    this.renderData(this.search, this.statuses)
                });
            },
            // For paggination
            getPagination(val) {
                this.pagination.page = val
                if (this.lastPage < val) {
                    this.lastPage = val
                    Vue.nextTick(() => {
                        this.renderData(this.search, this.statuses)
                    });
                }
            },
            update(id) {
                this.overlay = true
                this.id_so = id
                this.$http.get("/sales/order/" + this.id_so)
                    .then(responseCheck => {
                        let locked_by_id = responseCheck.data.data.locked_by
                        let locked = responseCheck.data.data.is_locked
                        let locked_checking = responseCheck.data.data.status_picking_order_assign
                        let order_type_check = responseCheck.data.data.order_type.id
                        
                        if(locked_checking == 6){
                            this.overlay = false
                            this.modalLockSO = true
                        } else{
                            if (locked == 1 && order_type_check == 655360) {
                                if (locked_by_id == this.user_id) {
                                    this.$router.push('/sales-order/update/' + this.id_so);
                                } else {
                                    this.overlay = false
                                    this.updateCheck = true
                                    this.locked_by_name = responseCheck.data.data.locked_by_name
                                }
                            } else {
                                if (order_type_check == 655360) {
                                    this.$http.put('/sales/order/lock/' + this.id_so, {})
                                        .then(responseLock => {
                                            this.$router.push('/sales-order/update/' + this.id_so);
                                        })
                                } else {
                                    this.$router.push('/sales-order/update/' + this.id_so);
                                }
                            } 
                        }
                    })
            },
            // For print SO
            print(id) {
                this.overlay = true
                this.id_so = id
                this.$http.get("/sales/order/print/" + this.id_so)
                    .then(response => {
                        this.filePdf = response.data.file
                        window.open(this.filePdf, '_blank');
                        this.overlay = false
                    })
            },
            // For get data from API
            renderData(search, statuses) {
                if (statuses === 999) {
                    statuses = ''
                } else {
                    statuses = "|status:" + statuses
                }
                let area = ''
                if (this.SelectArea) {
                    area = '|area__id.e:' + this.SelectArea
                }
                let merchant = ''
                if (this.SelectMerchant) {
                    merchant = '|branch.merchant.id.e:' + this.SelectMerchant
                }
                let branch = ''
                if (this.SelectBranch) {
                    branch = '|branch.id.e:' + this.SelectBranch
                }
                let paymentgroup = ''
                if (this.SelectPaymentGroup) {
                    paymentgroup = '|paymentgroup.id.e:' + this.SelectPaymentGroup
                }
                let orderdate = ''
                if (this.order_date.length > 0) {
                    if (this.order_date.length == 1) {
                        orderdate = '|recognition_date:' + this.order_date[0]
                    } else {
                        let date = this.order_date[0]
                        let date2 = this.order_date[1]
                        if (date > date2) {
                            orderdate = '|recognition_date.gte:' + date2 + '|recognition_date.lte:' + date
                        } else {
                            orderdate = '|recognition_date.gte:' + date + '|recognition_date.lte:' + date2
                        }
                    }
                }
                let deliverydate = ''
                if (this.delivery_date.length > 0) {
                    if (this.delivery_date.length == 1) {
                        deliverydate = '|delivery_date:' + this.delivery_date[0]
                    } else {
                        let date = this.delivery_date[0]
                        let date2 = this.delivery_date[1]
                        if (date > date2) {
                            deliverydate = '|delivery_date.gte:' + date2 + '|delivery_date.lte:' + date
                        } else {
                            deliverydate = '|delivery_date.gte:' + date + '|delivery_date.lte:' + date2
                        }
                    }
                } else {
                    deliverydate = '|delivery_date:' + new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10)
                }

                let wrt = ''
                if (this.SelectWrt) {
                    wrt = '|wrt.id.e:' + this.SelectWrt
                }
                let warehouse = ''
                if (this.SelectWarehouse) {
                    warehouse = '|warehouse.id.e:' + this.SelectWarehouse
                }
                let ordertype = ''
                if (this.order_type_id) {
                    ordertype = '|ordertype.id.e:' + this.order_type_id
                }
                let city = ''
                if (this.city_id) {
                    city = '|branch.subdistrict.district.city.id.e:' + this.city_id
                }
                let businesstype = ''
                if (this.business_type_id) {
                    businesstype = '|archetype_id.businesstype.id.e:' + this.business_type_id
                }
                let salesperson = ''
                if (this.sales_person_id) {
                    salesperson = '|salesperson.id.e:' + this.sales_person_id
                }
                this.render = true
                this.loading = true;
                this.$http.get("/sales/order", {
                    params: {
                        page: this.pagination.page,
                        perpage: this.pagination.rowsPerPage,
                        embeds: 'branch_id,wrt_id,area_id,warehouse_id,payment_group_sls_id,ordertype,branch.subdistrict.district.city,archetype_id.businesstype,salesperson',
                        conditions: 'code.icontains:' + search + area + merchant + branch + paymentgroup + orderdate + deliverydate + wrt + warehouse + statuses +
                        ordertype + city + businesstype + salesperson,
                        orderby: this.orderby,
                    }
                }).then(response => {
                    this.loading = false
                    if (response) {
                        let item = response.data.data
                        if (item === null) {
                            this.pagination.totalItems = 0
                            this.items = []
                        } else {
                            item.forEach(e => {
                                this.items.push(e)
                            });
                            this.pagination.totalItems = response.data.total
                        }
                    }
                });
            },
            // For Filter Area
            areaSelected(d) {
                this.SelectArea = ""
                this.clearArea = true
                if (d) {
                    this.clearArea = false
                    this.SelectArea = d.id
                }
                this.pagination.page = 0
                this.lastPage = 1
                Vue.nextTick(() => {
                    this.items = []
                    this.renderData(this.search, this.statuses)
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
                this.pagination.page = 0
                this.lastPage = 1
                Vue.nextTick(() => {
                    this.items = []
                    this.renderData(this.search, this.statuses)
                });
            },
            // For Filter Payment Group
            paymentgroupSelected(d) {
                this.SelectPaymentGroup = ""
                if (d) {
                    this.SelectPaymentGroup = d.id
                }
                this.pagination.page = 0
                this.lastPage = 1
                Vue.nextTick(() => {
                    this.items = []
                    this.renderData(this.search, this.statuses)
                });
            },
            // For Filter Branch
            branchSelected(d) {
                this.SelectBranch = ""
                if (d) {
                    this.SelectBranch = d.id
                }
                this.pagination.page = 0
                this.lastPage = 1
                Vue.nextTick(() => {
                    this.items = []
                    this.renderData(this.search, this.statuses)
                });
            },
            // For Filter WRT
            wrtSelected(d) {
                this.SelectWrt = ""
                if (d) {
                    this.SelectWrt = d.id
                }
                this.pagination.page = 0
                this.lastPage = 1
                Vue.nextTick(() => {
                    this.items = []
                    this.renderData(this.search, this.statuses)
                });
            },
            // For Filter Warehouse
            warehouseSelected(d) {
                this.SelectWarehouse = ""
                if (d) {
                    this.SelectWarehouse = d.id
                }
                this.pagination.page = 0
                this.lastPage = 1
                Vue.nextTick(() => {
                    this.items = []
                    this.renderData(this.search, this.statuses)
                });
            },
            // For Filter Order Type
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
            // For Filter City
            citySelected(d) {
                this.city_id = ""
                if (d) {
                    this.city_id = d.city_id
                }
                Vue.nextTick(() => {
                    this.items = []
                    this.renderData(this.search, this.statuses)
                });
            },
            // For Filter Business Type
            SelectBusinessTypeFilter(d) {
                this.business_type_id = ""
                if (d) {
                    this.business_type_id = d.id
                }
                Vue.nextTick(() => {
                    this.items = []
                    this.renderData(this.search, this.statuses)
                });
            },
            // For Filter Sales Person
            salespersonSelected(d) {
                this.sales_person_id = "";
                if (d) {
                    this.sales_person_id = d.id;
                }
                Vue.nextTick(() => {
                    this.items = []
                    this.renderData(this.search, this.statuses)
                });
            },
            // For validation and change date format
            setDateValidation() {
                if (this.delivery_date_input == '' || !this.delivery_date_input) {
                    this.delivery_date_input = new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10)
                    this.delivery_date = [new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10)]
                }
                Vue.nextTick(() => {
                    this.items = []
                    this.renderData(this.search, this.statuses)
                });
            },
        },
        watch: {
            'search': {
                handler: function (val) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function () {
                        that.pagination.page = 0
                        that.lastPage = 1
                        Vue.nextTick(() => {
                            that.items = []
                            that.renderData(val, that.statuses)
                        });
                    }, 1000);
                },
                deep: true
            },
            'order_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.order_date[0] = this.$moment(val).format('YYYY-MM-DD')
                                this.pagination.page = 0
                                this.lastPage = 1
                                Vue.nextTick(() => {
                                    this.items = []
                                    this.renderData(this.search, this.statuses)
                                });
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0, 10)
                            let date2 = val.substr(14, 23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                this.order_date[0] = this.$moment(date1).format('YYYY-MM-DD')
                                this.order_date[1] = this.$moment(date2).format('YYYY-MM-DD')
                                if (this.order_date.length == 2) {
                                    this.pagination.page = 0
                                    this.lastPage = 1
                                    Vue.nextTick(() => {
                                        this.items = []
                                        this.renderData(this.search, this.statuses)
                                    });
                                }
                            }
                        }
                    } else if (val == "") {
                        this.pagination.page = 0
                        this.lastPage = 1
                        this.order_date = []
                        Vue.nextTick(() => {
                            this.items = []
                            this.renderData(this.search, this.statuses)
                        });
                    }
                },
                deep: true
            },
            'order_date': {
                handler: function (val) {
                    if (val) {
                        this.order_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
            'delivery_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            this.items = []
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.delivery_date[0] = this.$moment(val).format('YYYY-MM-DD')
                                if (this.render == true) {
                                    this.pagination.page = 0
                                    this.lastPage = 1
                                    Vue.nextTick(() => {
                                        this.items = []
                                        this.renderData(this.search, this.statuses)
                                    });
                                }
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0, 10)
                            let date2 = val.substr(14, 23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                if (this.delivery_date.length == 2) {
                                    let date3 = new Date(this.delivery_date[0])
                                    let date4 = new Date(this.delivery_date[1])
                                    if (parseInt((date4 - date3) / (24 * 3600 * 1000)) > 30 || parseInt((date4 - date3) / (24 * 3600 * 1000)) < -30) {
                                        if (date4 < date3) {
                                            this.render = false
                                            this.delivery_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                            this.delivery_date.splice(1, 1)
                                        } else {
                                            this.render = false
                                            this.delivery_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                            this.delivery_date.splice(1, 1)
                                        }
                                    } else {
                                        this.pagination.page = 0
                                        this.lastPage = 1
                                        Vue.nextTick(() => {
                                            this.items = []
                                            this.renderData(this.search, this.statuses)
                                        });
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
            'statuses': {
                handler: function (val) {
                    let that = this
                    this.pagination.page = 0
                    this.lastPage = 1
                    Vue.nextTick(() => {
                        this.items = []
                        that.renderData(this.search, val)
                    });
                },
                deep: true
            },
        },
    }
</script>
