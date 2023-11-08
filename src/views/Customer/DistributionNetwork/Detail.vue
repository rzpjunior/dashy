<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row>
                <v-col cols="12" md="3">
                    <img
                        v-if="merchant.ktp_photos_url !== null"
                        class="rounded-form preview-image"
                        :src="merchant.ktp_photos_url[0]"
                    />
                    <div v-else :class="'rounded-form text-black60'+imageSizeHandler(merchant)"><p>No image</p></div>   
                    <br v-if="merchant.ktp_photos_url !== null">
                    <span class="ml10">KTP</span>             
                </v-col>
                <v-col cols="12" md="9">
                    <div v-if="merchant.merchant_photos_url !== null" style="display:flex;">
                        <div v-for="image in merchant.merchant_photos_url" :key="image" style="margin-right:20px">
                            <img
                                class="rounded-form preview-image"
                                :src="image"
                            />
                        </div>
                    </div>
                    <div v-else :class="'rounded-form text-black60'+imageSizeHandler(merchant)"><p>No image</p></div>
                    <span class="ml10">Outlet</span>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="fs24 bold">{{merchant.code}}</v-col>
                <v-col class="d-flex justify-end -mt5">
                    <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on" class="-mt3">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list class="bg-white">
                            <v-list-item
                                v-privilege="'dis_net_rst_psw'"
                                @click="merchantId = merchant.id, modelDialog = true"
                            >
                                <v-list-item-title>
                                    Reset Password
                                </v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="seeHistory()">
                                <v-list-item-content>
                                    <v-list-item-title>History</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-col>
            </v-row>
            <div class="mb30"/>
            <v-row class="mt-5">
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Merchant Name'" :value="merchant.code && merchant.name ? merchant.code+' - '+merchant.name : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Phone Number'" :value="merchant.phone_number ? merchant.phone_number : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Business Type'" :value="merchant.business_type.name ? merchant.business_type.name : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Payment Term'" :value="merchant.payment_term.name ? merchant.payment_term.name : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Invoice Term'" :value="merchant.invoice_term.name ? merchant.invoice_term.name : '-'"/>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <DetailRowNew :name="'Address'" :value="merchant.billing_address ? merchant.billing_address : '-'" :align="true"/>
                </v-col>
            </v-row>
        </div>
        <div class="mt10 mr12 ml12 wp100">
            <v-row>
                <v-col cols="12" md="6">
                    <div class="box-col fill-height">
                        <v-row><v-col cols="12" class="fs16 bold">Order Performance</v-col></v-row>
                        <div class="hr-title mx-1 mb12 mt12 mb30"/>
                        <v-progress-linear
                            v-if="orderIsLoading"
                            indeterminate
                            color="green"
                        ></v-progress-linear>
                        <v-row v-else>
                            <v-col cols="12" class="-mt24">Filter</v-col>
                            <v-col cols="12" md="9" class="-mt24">
                                <v-row>
                                    <v-col cols="12" md="6">
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
                                                    <v-tooltip bottom>
                                                        <template v-slot:activator="{ on: tooltip }">
                                                            <div v-on="{ ...tooltip}">
                                                                <v-text-field
                                                                    prepend-inner-icon="mdi-calendar"
                                                                    outlined
                                                                    clearable
                                                                    maxlength="24"
                                                                    @click:clear="order_date = [],order_date_input =''"
                                                                    v-model="order_date_input"
                                                                    dense
                                                                >
                                                                    <template v-slot:label>
                                                                        Invoice Date
                                                                    </template>
                                                                </v-text-field>
                                                            </div>
                                                        </template>
                                                    <span>Order Date</span>
                                                    </v-tooltip>
                                                </div>
                                            </template>
                                            <v-date-picker
                                                range
                                                v-model="order_date"
                                            >
                                                <v-spacer></v-spacer>
                                                <v-btn
                                                    text
                                                    color="primary"
                                                    @click="order_date_model = false"
                                                >OK</v-btn>
                                            </v-date-picker>
                                        </v-menu>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12" md="3" class="flex-align-end -mt24">
                                <v-btn
                                    class="only-btn white--text px-10 py-5"
                                    depressed
                                    color="#50ABA3"
                                    elevation="0"
                                    @click="fetchTopProduct()"
                                    :disabled="disableButton"
                                >Use Filter</v-btn>
                            </v-col>
                            <v-col cols="12" class="-mt24">
                                <DetailRowNew :name="'Product Name'" :value="top_product.name ? top_product.name : '-'"/>
                            </v-col>
                            <v-col cols="12" class="-mt24">
                                <DetailRowNew :name="'Quantity Sell/Product'" :value="order_performance.qty_sell !== undefined ? (order_performance.qty_sell+' KG') : '-'"/>
                            </v-col>
                            <v-col cols="12" class="-mt24">
                                <DetailRowNew :name="'Average Revenue'" :value="order_performance.avg_sales !== undefined ? 'Rp. '+formatPrice(order_performance.avg_sales) : '-'"/>
                            </v-col>
                            <v-col cols="12" class="-mt24">
                                <DetailRowNew :name="'Total Number of Order'" :value="order_performance.order_total !== undefined ? order_performance.order_total : '-'"/>
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
                <v-col cols="12" md="6">
                    <div class="box-col fill-height">
                        <v-row><v-col cols="12" class="fs16 bold">Payment Performance</v-col></v-row>
                        <div class="hr-title mx-1 mb12 mt12"/>
                        <v-progress-linear
                            v-if="paymentIsLoading"
                            indeterminate
                            color="green"
                        ></v-progress-linear>
                        <v-row v-else>
                            <v-col cols="12">
                                <v-row class="gray-row-container">
                                    <v-col cols="12" class="-mt12">
                                        <span class="text-black60">Jumlah Kredit :</span>
                                        <span class="font-weight-bold">{{ ' Rp. '+(payment_performance.credit_limit_amount!==undefined?formatPrice(payment_performance.credit_limit_amount):'-')}}</span>
                                    </v-col>
                                    <v-col cols="12" class="-mt12">
                                        <v-progress-linear
                                            :value="payment_performance.credit_limit_usage_remaining_percentage"
                                            height="25"
                                            :rounded="true"
                                            color="#C6EB93"
                                        >
                                            <strong>{{ parseFloat(payment_performance.credit_limit_usage_remaining_percentage).toFixed(2) }} %</strong>
                                        </v-progress-linear>
                                    </v-col>
                                    <v-col cols="12" class="-mt12">
                                        <v-row>
                                            <v-col cols="12" md="6">                                                
                                                <span class="text-black60">Jumlah Terpakai :</span>
                                                <span class="font-weight-bold">{{ ' Rp. '+(payment_performance.remaining_outstanding!==undefined?formatPrice(payment_performance.remaining_outstanding):'-')}}</span>
                                            </v-col>
                                            <v-col cols="12" md="6" class="text-right">                                                
                                                <span class="text-black60">Sisa Kredit :</span>
                                                <span class="font-weight-bold">{{ ' Rp. '+(payment_performance.credit_limit_remaining!==undefined?formatPrice(payment_performance.credit_limit_remaining):'-')}}</span>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>
                                <v-row class="row-container">
                                    <v-col cols="12" md="6" class="grandchild-container">
                                        <div class="child-container mr5">
                                            <span class="text-black60">Total Hutang :</span>
                                            <div class="big-value">{{' Rp. '+(payment_performance.remaining_outstanding!==undefined?formatPrice(payment_performance.remaining_outstanding):'-')}}</div>
                                        </div>
                                    </v-col>
                                    <v-col cols="12" md="6" class="grandchild-container">
                                        <div class="child-container ml5">
                                            <span class="text-black60">Total Hutang Jatuh Tempo:</span>
                                            <div class="big-value text-red">{{' Rp. '+(payment_performance.overdue_debt_amount!==undefined?formatPrice(payment_performance.overdue_debt_amount):'-')}}</div>
                                        </div>
                                    </v-col>
                                </v-row>
                                <v-row class="row-container">
                                    <v-col cols="12" md="6" class="grandchild-container">
                                        <div class="child-container mr5">
                                            <span class="text-black60">Rata-Rata Pembayaran :</span>
                                            <div class="big-value">{{' Rp. '+(payment_performance.average_payment_amount!==undefined?formatPrice(payment_performance.average_payment_amount):'-')}}</div>
                                        </div>
                                    </v-col>
                                    <v-col cols="12" md="6" class="grandchild-container">
                                        <div class="child-container ml5">
                                            <span class="text-black60">Periode Rata-Rata Pembayaran:</span>
                                            <div class="big-value">{{payment_performance.average_payment_period!==undefined?(payment_performance.average_payment_period+' Days'):'-'}}</div>
                                        </div>
                                    </v-col>
                                </v-row>                      
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
            </v-row>
        </div>
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
                        <span>Search by code</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12" md="5" class="h1"/>
                <v-col cols="12" md="3">
                    <v-autocomplete
                        v-model="sortBy"
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
                    <v-menu
                        ref="menu"
                        v-model="invoice_date_model"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on: tooltip }">
                                        <div v-on="{ ...tooltip}">
                                            <v-text-field
                                                prepend-inner-icon="mdi-calendar"
                                                outlined
                                                clearable
                                                maxlength="24"
                                                @click:clear="invoice_date = [],invoice_date_input =''"
                                                v-model="invoice_date_input"
                                                dense
                                            >
                                                <template v-slot:label>
                                                    Invoice Date
                                                </template>
                                            </v-text-field>
                                        </div>
                                    </template>
                                <span>Invoice Date</span>
                                </v-tooltip>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            v-model="invoice_date"
                        >
                            <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="invoice_date_model = false"
                            >OK</v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-select
                        v-model="status"
                        :items="statuses"
                        item-text="text"
                        item-value="value"
                        outlined
                        dense
                    ></v-select>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="overdue_date_model"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on: tooltip }">
                                        <div v-on="{ ...tooltip}">
                                            <v-text-field
                                                prepend-inner-icon="mdi-calendar"
                                                outlined
                                                clearable
                                                maxlength="24"
                                                @click:clear="overdue_date = [],overdue_date_input =''"
                                                v-model="overdue_date_input"
                                                dense
                                            >
                                                <template v-slot:label>
                                                    Overdue Date
                                                </template>
                                            </v-text-field>
                                        </div>
                                    </template>
                                <span>Overdue Date</span>
                                </v-tooltip>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            v-model="overdue_date"
                        >
                            <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="overdue_date_model = false"
                            >OK</v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table -mt4">
            Order Payment List
        </div>
        <div class="box-body-table">
            <v-data-table
                :mobile-breakpoint="0"
                :headers="table"
                :items="items"
                :loading="loading"
                :items-per-page="5"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>
                            <span v-if="!props.item.sales_order.code">-</span>
                            <router-link v-else :to="{ path: `/sales-order/detail/${props.item.sales_order.id}` }" target="_blank" class="routerLink" v-privilege="'so_rdd'">
                                {{ props.item.sales_order.code}}
                            </router-link>
                        </td>
                        <td>
                            <span v-if="!props.item.code">-</span>
                            <router-link v-else :to="{ path: `/finance/si/detail/${props.item.id}` }" target="_blank" class="routerLink" v-privilege="'si_rdd'">
                                {{ props.item.code}}
                            </router-link>
                            <br>
                            <label style="color: #768F9C; font-size: 12px;">
                                {{ props.item.recognition_date ? formatDate(props.item.recognition_date) : '-' }}
                            </label>
                        </td>
                        <td>
                            {{ props.item.due_date ? formatDate(props.item.due_date) : '-'}}
                            <br>
                            <label style="color: #768F9C; font-size: 12px;">
                                {{ props.item.status_description ? props.item.status_description : '-' }}
                            </label>
                        </td>
                        <td>{{ props.item.total_charge ? ('Rp. '+formatPrice(props.item.total_charge)) : '-'}}</td>
                        <td>{{ props.item.total_paid ? ('Rp. '+formatPrice(props.item.total_paid)) : '-'}}</td>
                        <td>{{ props.item.payment_percentage ? (parseFloat(props.item.payment_percentage).toFixed(2)+' %') : '-'}}</td>
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
                    </tr>
                </template>
            </v-data-table>
        </div>
        <v-dialog
            v-model="modelDialog"
            persistent
            max-width="470px"
        >
            <LoadingBar :value="loadingBar" />
            <v-card class="OpenSans">
                <v-card-title>
                    <div class="text-title-modal">Reset Password</div>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">Are you sure want to reset this user password to default password?</span>
                </v-card-text>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                        @click="resetPassword()"
                    >
                        <span class="text-black80">Yes</span>
                    </v-btn>
                    <v-btn
                    class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                        
                        @click="modelDialog = false"
                    >
                        Cancel
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="successDialog"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">Success Reset Password</span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">Password has been reset to default password (12345678)</span>
                </v-card-text>
                <v-card-actions class="pb-4 -mt6">
                    <v-spacer></v-spacer>
                    <v-btn
                        depressed
                        color="#50ABA3"
                        class="main-btn white--text"
                        @click="successDialog = false"
                    >
                        Ok
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <AuditLogNew :data="dataAuditLog" />
    </v-container>
</template>

<script>
    export default {
        name: "DistributionNetworkDetail",
        data() {
            return {
                modalOpen: false,
                merchant: {
                    id: '',
                    code: '',
                    name: '',
                    phone_number: '',
                    business_type: {
                        name: ''
                    },
                    payment_term: {
                        name: ''
                    },
                    invoice_term: {
                        name: ''
                    },
                    billing_address: '',
                    ktp_photos_url: '',
                    merchant_photos_url: []
                },
                order_date_input : '',
                order_date_model : '',
                order_date : [],
                orderIsLoading: false,
                top_product: {
                    id: '',
                    name: ''
                },
                order_performance: [{
                    qty_sell: '',
                    avg_sales: '',
                    order_total: ''
                }],
                payment_performance: {
                    credit_limit_amount: 0,
                    credit_limit_usage_remaining_percentage: 0,
                    remaining_outstanding: 0,
                    credit_limit_remaining: 0,
                    overdue_debt_amount: 0,
                    average_payment_amount: 0,
                    average_payment_period: 0
                },
                merchantId: '',
                modelDialog: false,
                successDialog: false,
                loadingBar: false,
                dataAuditLog: {},
                paymentIsLoading: false,
                search: '',
                filter: false,
                invoice_date_model: '',
                invoice_date_input: new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10),
                invoice_date: [new Date(Date.now() + (3600 * 1000 * 7)).toISOString().substr(0, 10)],
                status: 999,
                statuses: [
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
                overdue_date: [],
                overdue_date_input : '',
                overdue_date_model : '',
                items: [{
                    code: '',
                    sales_order: {
                        code: ''
                    },
                    recognition_date: '',
                    due_date: '',
                    status_description: '',
                    total_charge: 0,
                    total_paid: 0,
                    payment_percentage: 0,
                }],
                loading: false,
                table: [
                    {
                        text:'Sales Order Code',
                        sortable: false,
                        width: "20%",
                        class: 'grey--text text--darken-4',
                    },
                    {
                        text:'Sales Invoice Code',
                        sortable: false,
                        width: "20%",
                        class: 'grey--text text--darken-4',
                    },
                    {
                        text:'Overdue Date',
                        sortable: false,
                        width: "10%",
                        class: 'grey--text text--darken-4',
                    },
                    {
                        text:'Sales Invoice Value',
                        sortable: false,
                        width: "15%",
                        class: 'grey--text text--darken-4',
                    },
                    {
                        text:'Total Sales Payment',
                        sortable: false,
                        width: "15%",
                        class: 'grey--text text--darken-4',
                    },
                    {
                        text:'Percentage Payment',
                        sortable: false,
                        width: "15%",
                        class: 'grey--text text--darken-4',
                    },
                    {
                        text:'Status',
                        sortable: false,
                        width: "5%",
                        class: 'grey--text text--darken-4',
                    },
                ],
                sortBy: '-due_date',
                sorts: [
                    {
                        text: 'Overdue Date (A-Z)',
                        value: 'due_date'
                    },
                    {
                        text: 'Overdue Date (Z-A)',
                        value: '-due_date'
                    }
                ],

            }
        },
        computed : {
            //For watch disable calculate
            disableButton() {
                if (this.order_date_input) {
                    return false
                } else {
                    return true
                }
            }
        },
        methods:{
            async renderData(){ //fetch distribution network detail
                try{
                    await this.$http.get("/customer/distribution_network/"+ this.$route.params.id).then(response => {
                        this.merchant = response.data.data
                    });
                } catch(e) {
                    console.log(e);
                }
            },
            async fetchTopProduct() { // fetch top product of distribution network
                try{
                    this.orderIsLoading = true
                    let from_date = this.order_date_input.substr(0,10)
                    let to_date = this.order_date_input.substr(14,23)
                    await this.$http.get("/customer/distribution_network/"+ this.$route.params.id+'/top_product',{params:{
                        fromdate: from_date,
                        todate: to_date
                    }}).then(response => {
                        if (response.data.data) {
                            this.top_product = response.data.data
                            this.fetchOrderPerformance()
                        }
                    });
                    this.orderIsLoading = false
                } catch(e) {
                    console.log(e);
                    this.orderIsLoading = false
                }
            },
            async fetchOrderPerformance() { // fetch order performance of distribution network
                try{
                    let from_date = this.order_date_input.substr(0,10)
                    let to_date = this.order_date_input.substr(14,23)
                    await this.$http.get("/customer/distribution_network/"+ this.$route.params.id+'/order_performance',{params:{
                        top_product_id: this.top_product.id,
                        fromdate: from_date,
                        todate: to_date
                    }}).then(response => {
                        this.order_performance = response.data.data
                    });
                    this.orderIsLoading = false
                } catch(e) {
                    console.log(e);
                    this.orderIsLoading = false
                }
            },
            async fetchPaymentPerformance(){ //fetch payment performance of distribution network 
                try{
                    this.paymentIsLoading = true
                    await this.$http.get("/customer/distribution_network/"+ this.$route.params.id+'/payment_performance').then(response => {
                        if (response.data.data) {
                            this.payment_performance = response.data.data
                        }
                    });
                    this.paymentIsLoading = false
                } catch(e) {
                    console.log(e);
                    this.paymentIsLoading = false
                }
            },
            imageSizeHandler(item){ //handling image size by class
                return item.ktp_photos_url === null && item.merchant_photos_url === null ? ' image-box' : ' image-box-big'
            },
            async fetchOrderPaymentList() {//fetch distribution network detail
                this.loading = true
                try{
                    let status = ''
                    if (this.status === 999) {
                        status = ''
                    } else {
                        status = "|status:" + this.status
                    }

                    let invoiceDate = ''
                    if (this.invoice_date.length > 0) {
                        if (this.invoice_date.length == 1) {
                            invoiceDate = '|recognition_date:' + this.invoice_date[0]
                        } else {
                            let date = this.invoice_date_input.substr(0,10)
                            let date2 = this.invoice_date_input.substr(14,23)
                            if (date > date2) {
                                invoiceDate = '|recognition_date.gte:' + date2 + '|recognition_date.lte:' + date
                            } else {
                                invoiceDate = '|recognition_date.gte:' + date + '|recognition_date.lte:' + date2
                            }
                        }
                    } else {
                        invoiceDate = ''
                    }

                    
                    let overdueDate = ''
                    if (this.overdue_date.length > 0) {
                        if (this.overdue_date.length == 1) {
                            overdueDate = '|due_date:' + this.overdue_date[0]
                        } else {
                            let date = this.overdue_date_input.substr(0,10)
                            let date2 = this.overdue_date_input.substr(14,23)
                            if (date > date2) {
                                overdueDate = '|due_date.gte:' + date2 + '|due_date.lte:' + date
                            } else {
                                overdueDate = '|due_date.gte:' + date + '|due_date.lte:' + date2
                            }
                        }
                    } else {
                        overdueDate = ''
                    }

                    await this.$http.get("/customer/distribution_network/"+ this.$route.params.id+'/order_payment_details', {params: {
                        perpage: 1000,
                        conditions: 'Or.code.icontains:'+this.search+'%2COr.sales_order_id.code.icontains:'+this.search+status+invoiceDate+overdueDate,
                        embeds: 'sales_order_id',
                        orderby: this.sortBy,
                    }}).then(response => {
                        if (response.data.data) {
                            this.items = response.data.data
                        }
                        this.loading = false
                    });
                } catch(e) {
                    console.log(e);
                    this.loading = false
                }
            },            
            funcSort(event) {// For Sortir data table
                if(event){
                    this.sortBy = event.value
                }
                this.items = []
                this.fetchOrderPaymentList()
            },
            resetPassword() { // reset password user
                this.loadingBar = true
                this.$http.put("/customer/distribution_network/reset/password/"+this.merchantId, {})
                .then(response => {
                    this.modelDialog = false
                    let self = this
                    setTimeout(() => {
                        self.loadingBar = false;
                    }, 1000);
                    this.successDialog = true
                })
                .catch(error => {
                    this.loadingBar = false
                    console.log(error)
                });
            },
            seeHistory() { // get history
                this.dataAuditLog = {
                    model: true,
                    id: this.$route.params.id,
                    type: "merchant"
                }
            },
        },
        mounted() {
            this.renderData()
            this.fetchPaymentPerformance()
            this.fetchOrderPaymentList()
        },
        watch: {
            'order_date_input': { //get order date input
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.order_date[0] = this.$moment(val).format('YYYY-MM-DD')
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0,10)
                            let date2 = val.substr(14,23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                let date3 = new Date(this.order_date[0])
                                let date4 = new Date(this.order_date[1])
                                if (parseInt((date4-date3)/(24*3600*1000)) > 31 || parseInt((date4-date3)/(24*3600*1000)) < -31) {
                                    if (date4 < date3) {
                                        this.order_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                        this.order_date.splice(1,1)
                                    } else {
                                        this.order_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                        this.order_date.splice(1,1)
                                    }
                                }
                            }
                        }
                    }
                },
                deep: true
            },
            'order_date': { // get order date
                handler: function (val) {
                    if (val) {
                        this.order_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
            'invoice_date_input': { //get invoice date input
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.invoice_date[0] = this.$moment(val).format('YYYY-MM-DD')
                                Vue.nextTick(() => {
                                    this.items = []
                                    this.fetchOrderPaymentList()
                                });
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0,10)
                            let date2 = val.substr(14,23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                let date3 = new Date(this.invoice_date[0])
                                let date4 = new Date(this.invoice_date[1])
                                if (parseInt((date4-date3)/(24*3600*1000)) > 29 || parseInt((date4-date3)/(24*3600*1000)) < -29) {
                                    if (date4 < date3) {
                                        this.invoice_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                        this.invoice_date.splice(1,1)
                                    } else {
                                        this.invoice_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                        this.invoice_date.splice(1,1)
                                    }
                                }else {
                                    this.items = []
                                    this.fetchOrderPaymentList()
                                }
                            }
                        }
                    } else {
                        this.items = []
                        this.fetchOrderPaymentList()
                    }
                },
                deep: true
            },
            'invoice_date': { // get invoice date
                handler: function (val) {
                    if (val) {
                        this.invoice_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
            'overdue_date_input': { //get overdue date input
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.overdue_date[0] = this.$moment(val).format('YYYY-MM-DD')
                                this.items = []
                                this.fetchOrderPaymentList()
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0,10)
                            let date2 = val.substr(14,23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                let date3 = new Date(this.overdue_date[0])
                                let date4 = new Date(this.overdue_date[1])
                                if (parseInt((date4-date3)/(24*3600*1000)) > 29 || parseInt((date4-date3)/(24*3600*1000)) < -29) {
                                    if (date4 < date3) {
                                        this.overdue_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                        this.overdue_date.splice(1,1)
                                    } else {
                                        this.overdue_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                        this.overdue_date.splice(1,1)
                                    }
                                }else {
                                    this.items = []
                                    this.fetchOrderPaymentList()
                                }
                            }
                        } 
                    } else {
                        this.items = []
                        this.fetchOrderPaymentList()
                    }
                },
                deep: true
            },
            'overdue_date': { // get overdue date
                handler: function (val) {
                    if (val) {
                        this.overdue_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
            'search': {
                handler: function (val) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function () {
                        that.items = []
                        that.fetchOrderPaymentList()
                    }, 1000);
                },
                deep: true
            },
            'status': {
                handler: function (val) {
                    let that = this
                    that.items = []
                    that.fetchOrderPaymentList()
                },
                deep: true
            },
        },
    }
</script>

<style scoped>
    .preview-image {
        width: 100%;
        height: 250px;
        object-fit: cover;
    }
    
    .image-box {
        width:250px;
        height:50px;
        background: #EBEBEB;
        border-style:dashed;
        border-color:gray;
        border-width:1px;
        text-align: center;
        padding-top: 10px;
        margin: 10px;
    }
    
    .image-box-big {
        width:250px;
        height:250px;
        background: #EBEBEB;
        border-style:dashed;
        border-color:gray;
        border-width:1px;
        text-align: center;
        padding-top: 110px;
        margin: 0px 0px 10px 10px;
    }

    .row-container {
        margin: 5px;
    }

    .gray-row-container {
        margin: 5px;
        background-color:#F5F5F5;
        border-radius: 8px;
        padding: 15px;
    }

    .child-container {
        background-color:#F5F5F5;
        border-radius: 8px;
        padding: 15px;
    }

    .grandchild-container {
        padding: 0px !important
    }

    .big-value {
        font-size: 18px;
        text-align: center;
        font-weight: bold;
    }
</style>
