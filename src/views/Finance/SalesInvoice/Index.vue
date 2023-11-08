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
                        <span>Search by Invoice Code, Order Code</span>
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
                        name="area"
                        :dense="true"
                        :aux_data="2"
                        @selected="areaSelected"
                        v-privilege="'filter_rdl'"
                    >
                    </SelectArea>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectMerchant
                        :norequired="true"
                        @selected="merchantSelected"
                        :dense="true"
                        :label="'Customer'"
                        v-privilege="'filter_rdl'"
                    ></SelectMerchant>
                </v-col>
                <v-col cols="12" md="3" class="-mt24" v-if="outlet">
                    <SelectBranch
                        :norequired="true"
                        :merchant="SelectMerchant"
                        :dense="true"
                        @selected="branchSelected"
                        :label="'Outlet'"
                    ></SelectBranch>
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
                        v-model="order_date_model"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-text-field
                                    name="order_date"
                                    label="Invoice Date"
                                    prepend-inner-icon="mdi-calendar"
                                    dense
                                    v-model="order_date_input"
                                    @blur="setDateValidation()"
                                    maxlength="24"
                                    outlined
                                    style="margin-bottom:-30px;"
                                ></v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            persistent-hint
                            v-model="order_date"
                        ></v-date-picker>
                    </v-menu>
                    <span class="text-black60 fs12">Max 31 days can be selected</span>
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
                                    name="delivery_date"
                                    label="Order Delivery Date"
                                    prepend-inner-icon="mdi-calendar"
                                    dense
                                    readonly
                                    clearable
                                    @click:clear="delivery_date = [],delivery_date_input = ''"
                                    v-model="delivery_date_input"
                                    maxlength="24"
                                    outlined
                                ></v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            persistent-hint
                            v-model="delivery_date"
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
                        @click="bulkPaymentDialog = true; countClickBulky()"
                        class="no-caps bold"
                        v-privilege="'sp_crt'"
                    >
                    <span class="text-white">
                        Create Bulk Payment
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
                :items-per-page="pagination.rowsPerPage"
                @update:items-per-page="getItemPerPage"
                @update:page="getPagination"
                :footer-props="{'items-per-page-options':[5,10,15,20,25],'disable-pagination':false,'disableItemsPerPage':false}"
            >

                <template v-slot:[`footer.page-text`]="props">
                    {{ props.pageStart }} - {{ props.pageStop}} of {{pagination.totalItems}}
                </template>
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td @click="countOptionClickCodes()">
                            <router-link :to="{ path: `/finance/si/detail/${props.item.id}` }" target="_blank" class="routerLink" v-privilege="'si_rdd'">
                                {{props.item.code}}
                            </router-link>
                        </td>
                        <td>{{props.item.recognition_date | moment("DD/MM/YYYY")}}</td>
                        <td>{{props.item.sales_order.code}}</td>
                        <td>{{props.item.sales_order.order_type.name}}</td>
                        <td>{{props.item.sales_order.delivery_date | moment("DD/MM/YYYY")}}</td>
                        <td>
                        <span v-if="props.item.sales_order.branch.merchant.customer_group == 1">
                                {{props.item.sales_order.branch.merchant.name}}<br>
                                <label style="color: #768F9C;">
                                    {{props.item.sales_order.branch.name}}
                                </label>
                            </span>
                            <span v-else>{{props.item.sales_order.branch.merchant.name}}</span>
                        </td>
                        <td>{{props.item.sales_order.area.name}}</td>
                        <td>{{formatPrice(props.item.total_charge)}}</td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip 
                                    :color="statusMaster('active')"
                                > Active </v-chip>
                            </div>
                            <div v-else-if="props.item.status == 2">
                                <v-chip 
                                    :color="statusMaster('finished')"
                                >Finished</v-chip>
                            </div>
                            <div v-else-if="props.item.status == 3">
                                <v-chip
                                    :color="statusMaster('cancelled')"
                                > Cancelled</v-chip>
                            </div>
                            <div v-else-if="props.item.status == 6">
                                <v-chip
                                    :color="statusMaster('partial')"
                                > Partial </v-chip>
                            </div>
                        </td>
                        <td @click="countClickDirectPayment()">
                            <router-link
                                v-if="props.item.status==1 || props.item.status==6"
                                :to="{ path: `/finance/si/sp/create/${props.item.id}` }"
                                target="_blank"
                                class="routerLink"
                                v-privilege="'sp_crt'"
                            >
                                <v-tooltip top>
                                    <template v-slot:activator="{ on: tooltip }">
                                        <v-btn
                                            v-on="{ ...tooltip }"
                                            icon
                                            :name="`getremaining_${props.index}`"
                                        >
                                            <v-icon>mdi-playlist-plus</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Create Payment</span>
                                </v-tooltip>
                            </router-link>
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
                                    <v-list-item @click="countOptionClick()" v-privilege="'si_rdd'" :to="`/finance/si/detail/${props.item.id}`">
                                        <v-list-item-content>
                                            <v-list-item-title>Detail</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <v-list-item v-privilege="'si_upd'" v-if="props.item.status== 1" :to="`/finance/si/update/${props.item.id}`">
                                        <v-list-item-content>
                                            <v-list-item-title>Update</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <div v-privilege="'si_prt'" v-if="props.item.status== 1 || props.item.status== 2">
                                        <hr>
                                    </div>
                                    <v-list-item v-privilege="'si_prt'" v-if="props.item.status== 1 || props.item.status== 2" @click="downloadPdf(props.item.id)">
                                        <v-list-item-content>
                                            <v-list-item-title>Print</v-list-item-title>
                                        </v-list-item-content>
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
        <ConfirmationDialog :sendData="ConfirmData"/>
        <v-dialog
            v-model="bulkPaymentDialog"
            persistent
            max-width="750px"
        >
            <v-card class="OpenSans">
                <v-card-title>
                    <v-row>
                        <v-col class="fs20 bold h70 mt12" cols="12" md="6">
                            Select Main Outlet / Agent
                        </v-col>
                        <v-col class="flex-align-end h70 mt8" cols="12" md="6">
                            <v-menu
                                ref="menu"
                                v-model="delivery_select_model"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                            >
                                <template v-slot:activator="{ on }">
                                    <div v-on="on">
                                        <v-text-field
                                            name="delivery_select"
                                            prepend-inner-icon="mdi-calendar"
                                            dense
                                            v-model="delivery_select_input"
                                            @blur="setDateValidation()"
                                            maxlength="24"
                                            outlined
                                        >
                                            <template v-slot:label>Delivery Date<span style="color:red;">*</span>
                                            </template>
                                        </v-text-field>
                                    </div>
                                </template>
                                <v-date-picker
                                    range
                                    persistent-hint
                                    v-model="delivery_select"
                                ></v-date-picker>
                            </v-menu>
                        </v-col>
                    </v-row>
                </v-card-title>
                <div class="hr-title-modal mt1"/>
                <v-card-text>
                    <v-row class="fs16">
                        <v-col cols="12" md="12">
                            <v-data-table
                                :headers="table.selectFields"
                                :items="form"
                                :hide-default-footer="true"
                                :items-per-page="-1"
                            >
                                <template v-slot:item="props">
                                    <tr>
                                        <td>
                                            <SelectCustomerTable
                                                :name="`customer_${props.index}`"
                                                @click.native="setCustomerIdx(props.index)"
                                                @selected="customerSelected"
                                                :product="props.item.customer"
                                                :error="errCustomer(props.index)"
                                                :refs="`${props.index+1}-${refs},${form.length}`"
                                                :update="update"
                                                style="margin-left:-10px"
                                            ></SelectCustomerTable>
                                        </td>
                                        <td>{{props.item.area}}</td>
                                        <td>
                                            <div class="d-flex justify-end">
                                                <div v-if="props.index == form.length-1">
                                                    <v-btn
                                                        icon
                                                        name="addcustomer"
                                                        @click="addCustomer()"
                                                    >
                                                        <img src="/icon/plus.png" height="22px" width="22px"/>
                                                    </v-btn>
                                                </div>
                                                <div v-if="form.length != 1">
                                                    <v-btn
                                                        icon
                                                        :name="`removecustomer_${props.index}`"
                                                        @click="removeCustomer(props.index)"
                                                    >
                                                        <img src="/icon/close-new.png" height="20px" width="20px"/>
                                                    </v-btn>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </template>
                            </v-data-table>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions class="pb-7 pr-7">
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="bulkPaymentDialog = false,resetCustomer()"
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                    >
                        <span class="text-black80">Cancel</span>
                    </v-btn>
                    <v-btn
                        @click="changeField = false,nextMethod()"
                        :disabled="disabledBtnProcess"
                        class="main-btn white--text ml8"
                        depressed
                        color="#50ABA3"
                    >Process</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <LoadingBar :value="overlay"/>
    </v-container>
</template>
<script>
    import Vue from 'vue'
    export default {
        name: "SalesInvoiceIndex",
        data() {
            return {
                sortby: '-id',
                orderby: '-id',
                filter : false,
                sorts: [
                    {
                        text: 'Default',
                        value: '-id'
                    },
                    {
                        text: 'Invoice Code (A-Z)',
                        value: 'code'
                    },
                    {
                        text: 'Invoice Code (Z-A)',
                        value: '-code'
                    },
                    {
                        text: 'Invoice Date (A-Z)',
                        value: 'recognition_date'
                    },
                    {
                        text: 'Invoice Date (Z-A)',
                        value: '-recognition_date'
                    },
                    {
                        text: 'Order Code (A-Z)',
                        value: 'salesorder.code'
                    },
                    {
                        text: 'Order Code (Z-A)',
                        value: '-salesorder.code'
                    },
                    {
                        text: 'Delivery Date (A-Z)',
                        value: 'salesorder.delivery_date'
                    },
                    {
                        text: 'Delivery Date (Z-A)',
                        value: '-salesorder.delivery_date'
                    },
                    {
                        text: 'Customer (A-Z)',
                        value: 'salesorder.branch.merchant.name'
                    },
                    {
                        text: 'Customer (Z-A)',
                        value: '-salesorder.branch.merchant.name'
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
                pagination: {
                    page: 0,
                    rowsPerPage: 11,
                    totalItems: 0
                },
                lastPage: 0,
                overlay: false,
                id_si: '',
                ConfirmData: {},
                search: '',
                loading: false,
                statuses: 999,
                order_type_id: '',
                order_date_model: '',
                order_date_input: new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10),
                order_date: [
                    new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10)
                ],
                delivery_date_model: '',
                delivery_date_input: '',
                delivery_date: [],
                delivery_select_model: '',
                delivery_select_input: new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10),
                delivery_select: [
                    new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10)
                ],
                area_id: '',
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
                        text: 'Partial',
                        value: 6
                    },
                ],
                table: {
                    fields: [
                        {
                            text: 'Invoice Code',
                            width: "15%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text: 'Invoice Date',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Order Code',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Order Type',
                            width: "15%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Order Delivery Date',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Customer',
                            width: "15%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Area',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Total Invoice',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Status',
                            width: "5%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            width: "2%",
                            sortable: false
                        },
                        {
                            width: "2%",
                            sortable: false
                        },
                    ],
                    selectFields: [
                        {
                            text: 'Customer Name',
                            width: "70%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text: 'Area',
                            width: "25%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: '',
                            width: "5%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                    ],
                },
                productIdx: '',
                items: [],
                refs: '',
                confirmation: {
                    valueName: 'Sales Term',
                    action: '',
                    status: '',
                    urlPath: '',
                    parentPath: '/finance/spt/term',
                },
                SelectMerchant: '',
                render: true,
                outlet: false,
                SelectBranch: '',
                filePdf: '',
                update: false,

                bulkPaymentDialog: false,
                form: [
                    {
                        customer: "",
                        customer_id: "",
                        area: ""
                    }
                ],
                error: {},
                customerIdx: '',
                refs: '',
                update: false,
                disabledBtnAdd: false,
                disabledBtnProcess: true,
            }
        },
        mounted() {
            Vue.nextTick(() => {
                this.items = []
                this.renderData('', this.statuses)
            });
            let self = this
            this.$root.$on('event_success', function (res) {
                if (res) {
                    Vue.nextTick(() => {
                        self.items = []
                        self.renderData(self.search, self.statuses)
                    });
                }
            });
        },
        methods: {
            // For shorting data table
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
            // For request data table based on number row per page
            getItemPerPage(val) {
                this.pagination.rowsPerPage = val + 1
                this.lastPage = 1
                Vue.nextTick(() => {
                    this.items = []
                    this.renderData(this.search, this.statuses)
                });
            },
            // For know how much pages used in table
            getPagination(val) {
                this.pagination.page = val
                if (this.lastPage < val) {
                    this.lastPage = val
                    Vue.nextTick(() => {
                        this.renderData(this.search, this.statuses)
                    });
                }
            },
            // For get data from API
            renderData(search, statuses) {
                this.loading = true;
                if (statuses === 999) {
                    statuses = ''
                } else {
                    statuses = "|status:" + statuses
                }
                let areaID = ''
                if (this.area_id) {
                    areaID = "|sales_order_id.area.id.e:" + this.area_id
                } else {
                    areaID = ''
                }
                let merchant = ''
                if (this.SelectMerchant) {
                    merchant = '|sales_order_id.branch.merchant.id.e:' + this.SelectMerchant
                }
                let branch = ''
                if (this.SelectBranch) {
                    branch = '|sales_order_id.branch.id.e:' + this.SelectBranch
                }
                let ordertype = ''
                if (this.order_type_id) {
                    ordertype = '|salesorder.ordertype.id.e:' + this.order_type_id
                }

                let orderDate = ''
                if (this.order_date.length > 0) {
                    if (this.order_date.length == 1) {
                        orderDate = '|recognition_date:' + this.order_date[0]
                    } else {
                        let date = this.order_date[0]
                        let date2 = this.order_date[1]
                        if (date > date2) {
                            orderDate = '|recognition_date.gte:' + date2 + '|recognition_date.lte:' + date
                        } else {
                            orderDate = '|recognition_date.gte:' + date + '|recognition_date.lte:' + date2
                        }
                    }
                } else {
                    orderDate = '|recognition_date:' + new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10)
                }

                let deliveryDate = ''
                if (this.delivery_date.length > 0) {
                    if (this.delivery_date.length == 1) {
                        deliveryDate = '|sales_order_id.delivery_date:' + this.delivery_date[0]
                    } else {
                        deliveryDate = '|sales_order_id.delivery_date.gte:' + this.delivery_date[0] + '|sales_order_id.delivery_date.lte:' + this.delivery_date[1]
                    }
                }
                this.render = true
                this.$http.get("/finance/sales/invoice", {
                    params: {
                        page: this.pagination.page,
                        perpage: this.pagination.rowsPerPage,
                        conditions: 'Or.code.icontains:' + search + '%2COr.sales_order_id.code.icontains:'
                        + search + statuses + areaID + merchant + branch + orderDate + deliveryDate + ordertype,
                        embeds: 'sales_order_id.branch,sales_order_id.branch.merchant,sales_order_id.area,sales_order_id.order_type_sls_id',
                        orderby: this.orderby,
                    }
                }).then(response => {
                    this.loading = false;
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
                });
            },
            // For remove customer
            removeCustomer(idx) {
                this.form.splice(idx, 1)
                for (var key in this.error) {
                    if (key.includes(idx) && key.includes('customer_id')) {
                        delete this.error[key];
                    }
                }

            },
            setCustomerIdx(idx) {
                this.customerIdx = idx
            },
            // For Select Customer
            customerSelected(d) {
                this.form[this.customerIdx].customer = ''
                this.form[this.customerIdx].customer_id = ''
                this.form[this.customerIdx].area = ''
                if (d) {
                    this.form[this.customerIdx].customer = d
                    this.form[this.customerIdx].customer_id = d.id
                    this.form[this.customerIdx].area = d.finance_area.name
                }
            },
            // For Add Customer
            addCustomer() {
                this.update = false;
                this.form.push(
                    {
                        customer: "",
                        customer_id: "",
                        area: ""
                    }
                )
                this.refs = false
                Vue.nextTick(() => {
                    this.refs = true
                    this.setCustomerIdx(this.form.length - 1)
                });
            },
            // For reset customer list when cancel create bulk payment
            resetCustomer() {
                this.form = [
                    {
                        delivery_date_bulk: "",
                        customer_id: "",
                        area: ""
                    }
                ]
            },
            //For check duplicate customer
            errCustomer(idx) {
                let holdValue = this.form[idx].customer_id
                if (this.form[idx].customer_id) {
                    for (let j = 0; j < this.form.length; j++) {
                        if (holdValue == this.form[j].customer_id && idx != j) {
                            this.disabledBtnProcess = true
                            return 'Duplicate Customer ' + this.form[j].customer.name
                        }
                    }
                }
            },
            //For go to create bulk payment next process
            nextMethod() {
                let data = {
                    customer_bulk: this.form,
                    delivery_date_bulk: this.delivery_select
                }
                this.$store.commit('setBulkPayment', data);
                this.$router.push('/finance/si/spb')
            },
            // For select filter status
            statusSelected(val) {
                this.statuses = null;
                if (val !== '' && val !== undefined) {
                    this.pagination.page = 0
                    this.lastPage = 1
                    this.items = []
                    this.statuses = val.value;
                }
            },
            // For select filter area
            areaSelected(d) {
                this.area = null;
                this.area_id = '';
                if (d !== '' && d !== undefined) {
                    this.area = d;
                    this.area_id = d.id;
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
            downloadPdf(id) {
                this.overlay = true
                this.id_si = id
                this.$http.get("/finance/sales/invoice/print/" + this.id_si)
                    .then(response => {
                        this.filePdf = response.data.file
                        window.open(this.filePdf, '_blank');
                        this.overlay = false
                    })
            },
            // For select filter merchant
            merchantSelected(d) {
                this.outlet = false
                this.SelectMerchant = ""
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
            // For select filter branch
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
            createPayment(val) {
                this.$store.commit('setCreatePayment', 'true');
                this.$router.push('/finance/si/sp/' + val)
            },
            setDateValidation() {
                if (!this.order_date_input || this.order_date_input == '') {
                    this.order_date_input = new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10)
                    this.order_date = [new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10)]
                }
            },
            countOptionClick() {
                this.$gtag.config({'page_title': 'Sales Invoice List - Options Click'})
            },
            countOptionClickCodes() {
                this.$gtag.config({'page_title': 'Sales Invoice List - Codes Click'})
            },
            countClickBulky() {
                this.$gtag.config({'page_title': 'Sales Invoice List - Bulky Click'})
            },
            countClickDirectPayment() {
                this.$gtag.config({'page_title': 'Sales Invoice List - Direct Payment Click'})
            },
        },

        computed: {
            staff() {
                return this.$store.getters.getStaff
            },
            totalcustomer() {
                let total = 0
                for (let i = 0; i < this.form.length; i++) {
                    if (this.form[i].customer_id) {
                        total += 1;
                    }
                }
                return total
            }
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
            'statuses': {
                handler: function (val) {
                    this.pagination.page = 0
                    this.lastPage = 1
                    let that = this
                    Vue.nextTick(() => {
                        that.items = []
                        that.renderData(this.search, val)
                    });
                },
                deep: true
            },
            'area_id': {
                handler: function (area_id) {
                    let that = this;
                    this.pagination.page = 0
                    this.lastPage = 1
                    Vue.nextTick(() => {
                        this.items = []
                        that.renderData(this.search, this.statuses)
                    });
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
                                if (this.order_date.length == 2) {
                                    let date3 = new Date(this.order_date[0])
                                    let date4 = new Date(this.order_date[1])
                                    if (parseInt((date4 - date3) / (24 * 3600 * 1000)) > 30 || parseInt((date4 - date3) / (24 * 3600 * 1000)) < -30) {
                                        if (date4 < date3) {
                                            this.render = false
                                            this.order_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                            this.order_date.splice(1, 1)
                                        } else {
                                            this.render = false
                                            this.order_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                            this.order_date.splice(1, 1)
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
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.delivery_date[0] = this.$moment(val).format('YYYY-MM-DD')
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
                                this.delivery_date[0] = this.$moment(date1).format('YYYY-MM-DD')
                                this.delivery_date[1] = this.$moment(date2).format('YYYY-MM-DD')
                                if (this.delivery_date.length == 2) {
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
                        this.delivery_date = []
                        Vue.nextTick(() => {
                            this.items = []
                            this.renderData(this.search, this.statuses)
                        });
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
            'delivery_select_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.delivery_select[0] = this.$moment(val).format('YYYY-MM-DD')
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0, 10)
                            let date2 = val.substr(14, 23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                if (this.delivery_select.length == 2) {
                                    let date3 = new Date(this.delivery_select[0])
                                    let date4 = new Date(this.delivery_select[1])
                                    if (parseInt((date4 - date3) / (24 * 3600 * 1000)) > 30 || parseInt((date4 - date3) / (24 * 3600 * 1000)) < -30) {
                                        if (date4 < date3) {
                                            this.render = false
                                            this.delivery_select[0] = this.$moment(date3).format('YYYY-MM-DD')
                                            this.delivery_select.splice(1, 1)
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                deep: true
            },
            'delivery_select': {
                handler: function (val) {
                    if (val) {
                        this.delivery_select_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
            'form': {
                handler: function (val) {
                    // for disable button add customer
                    if (this.form.length >= 5) {
                        this.disabledBtnAdd = true
                    } else {
                        this.disabledBtnAdd = false
                    }
                    // for disable button process to create bulk payment
                    if (this.totalcustomer == this.form.length) {
                        if (this.form.length > 0) {
                            this.disabledBtnProcess = false
                        } else {
                            this.disabledBtnProcess = true
                        }
                    } else {
                        this.disabledBtnProcess = true
                    }
                },
                deep: true
            }
        },
    }
</script>