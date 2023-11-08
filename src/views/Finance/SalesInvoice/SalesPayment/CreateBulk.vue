<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="payment_date_model"
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
                                    required
                                    clearable
                                    dense
                                    @click:clear="payment_date = ''"
                                    v-model="payment_date"
                                    maxlength="10"
                                    onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 45"
                                    :error-messages="error.payment_date"
                                >
                                    <template v-slot:label>
                                        Payment Date<span style="color:red">*</span>
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            name="payment_date"
                            no-title
                            v-model="payment_date"
                            @input="payment_date_model = false"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectPaymentMethod
                        name="payment_method"
                        @selected="paymentmethodSelected"
                        :label="'Payment Method'"
                        :dense="true"
                        required
                        :error="error.payment_method_id"
                    ></SelectPaymentMethod>
                </v-col>
                <v-col cols="12" md="6" class="-mt24" v-if="show_channel">
                    <SelectPaymentChannel
                        name="payment_channel"
                        :label="'Payment Channel '"
                        :norequired="true"
                        :dense="true"
                        :payment_method_id="payment_method_id"
                        @selected="paymentChannelSelected"
                        required
                        :error="error.payment_channel_id"
                    ></SelectPaymentChannel>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="bank_receive_num"
                        v-model="bank_receive_num"
                        required
                        outlined
                        maxlength="50"
                        dense
                        :error-messages="error.bank_receive_num"
                    >
                        <template v-slot:label>
                            Bank Receive Voucher Number<span style="color:red;">*</span>
                        </template>
                    </v-text-field>
                </v-col>
            </v-row>
        </div>
        <div class="box-table">
            <v-data-table
                :headers="table.fields"
                :items="items"
                :loading="loading"
                :hide-default-footer="true"
                :items-per-page="-1"
            >
                <template v-slot:item="props">
                    <tr>
                        <td>{{ props.index + 1 }}</td>
                        <td>
                            {{props.item.customer}}
                            <div class="fs12" style="color:red;">{{errQty2(props.index)}}</div>
                        </td>
                        <td>{{props.item.code}}</td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                ><span class="pa-md-2">Active</span></v-chip>
                            </div>
                            <div v-else-if="props.item.status == 2">
                                <v-chip
                                    :color="statusMaster('finished')"
                                >Finished</v-chip>
                            </div>
                            <div v-else-if="props.item.status == 3">
                                <v-chip
                                    :color="statusMaster('cancelled')"
                                > Cancelled </v-chip>
                            </div>
                            <div v-else-if="props.item.status == 6">
                                <v-chip
                                    :color="statusMaster('partial')"
                                > Partial </v-chip>
                            </div>
                        </td>
                        <td>{{props.item.invoice_date | moment("DD/MM/YYYY")}}</td>
                        <td>{{props.item.delivery_date | moment("DD/MM/YYYY")}}</td>
                        <td>
                            <v-checkbox
                                name="paid_off"
                                v-model="props.item.paid_off"
                            ></v-checkbox>
                        </td>
                        <td>
                            <vue-numeric
                                :name="`amount_${props.index}`"
                                @focus="customerIdx = props.index"
                                class="productNumeric"
                                style="margin-left:-8px;"
                                placeholder="0,00"
                                separator="."
                                :precision="2"
                                v-model.number="props.item.amount"
                                :error-messages="error.amount"
                            ></vue-numeric>
                        </td>
                        <td>
                            <v-tooltip top>
                                <template v-slot:activator="{ on: tooltip }">
                                    <v-btn
                                        v-on="{ ...tooltip }"
                                        v-if="props.item.status == 6"
                                        icon
                                        :name="`getremaining_${props.index}`"
                                        @click="loading=true,getRemainingAmount(props.index)"
                                    >
                                        <v-icon>mdi-refresh</v-icon>
                                    </v-btn>
                                </template>
                                <span>Get remaining amount</span>
                            </v-tooltip>
                        </td>
                        <td>
                            <v-btn
                                icon
                                :name="`removecustomer_${props.index}`"
                                @click="setCustomerIdx(props.index),confirmRemove=true"
                            >
                                <v-img src="/icon/close.png" max-height="20px" max-width="20px"></v-img>
                            </v-btn>
                        </td>
                    </tr>
                </template>
            </v-data-table>
            <div class="box-footer-modal pa16">
            <v-row>
                <v-col class="text-black" offset="6" cols="12" md="6">
                    <div class="row fs20 bold">
                        <div class="col">
                            Total Payment :
                        </div>
                        <div class="col d-flex justify-end">
                            {{totalPayment}}
                        </div>
                    </div>
                </v-col>
            </v-row>
            </div>
        </div>
        <div class="box-end">
            <v-row>
                <v-col>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            @click="$router.go(-1)"
                            depressed
                            outlined
                            color="#EBEBEB"
                            class="main-btn"
                        >
                            <span class="text-black80">Cancel</span>
                        </v-btn>
                        <v-btn
                            depressed
                            color="#50ABA3"
                            class="main-btn white--text"
                            @click="confirmButton()"
                            :disabled="disabledBtn"
                        >
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </div>
        <v-dialog
            v-model="confirmRemove"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">Remove From List</span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">Are you sure want to remove this Invoice from create bulk payment list?</span>
                </v-card-text>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="confirmRemove=false"
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                    >
                        <span class="text-black80">Cancel</span>
                    </v-btn>
                    <v-btn
                        depressed
                        color="#50ABA3"
                        class="main-btn white--text"
                        @click="removeCustomer(customerIdx),confirmRemove=false"
                        :disabled="disabledBtn"
                    >
                        Yes
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </v-container>
</template>
<script>
    import Vue from 'vue'
    export default {
        name: 'CreateBulkPayment',
        data() {
            return {
                items: [],
                error: {},
                ConfirmData: {},
                loading: false,
                table: {
                    fields: [
                        {
                            text: 'No',
                            width: "2%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Customer',
                            width: "25%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Invoice Code',
                            width: "20%",
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
                            text: 'Invoice Date',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Delivery Date',
                            width: "10%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Paid Off',
                            width: "5%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: 'Total Payment',
                            width: "17%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: '',
                            width: "2%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text: '',
                            width: "2%",
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                    ],
                },
                customerIdx: '',
                refs: '',
                update: false,
                payment_date_model : '',
                payment_date : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                payment_method:'',
                payment_method_id: '',
                payment_channel:'',
                payment_channel_id: '',
                bank_receive_num: '',
                confirmRemove: false,
                customerIDBefore: '',
                so_delivery_date: [],
                disabledBtn: false,
            }
        },
        created() {
            let data = this.$store.state.BulkPaymentCustomer
            if (data != null) {
                if (data.delivery_date_bulk.length > 0) {
                    if (data.delivery_date_bulk.length == 1) {
                        this.so_delivery_date = data.delivery_date_bulk[0]+'|'+data.delivery_date_bulk[0]
                    } else {
                        if(data.delivery_date_bulk[0]>data.delivery_date_bulk[1]){
                            this.so_delivery_date = data.delivery_date_bulk[1]+'|'+data.delivery_date_bulk[0]
                        }else{
                            this.so_delivery_date = data.delivery_date_bulk[0]+'|'+data.delivery_date_bulk[1]
                        }
                    }
                }
                for (let i=0; i < data.customer_bulk.length; i++) {
                    if(i==0){
                        this.customerIDBefore = data.customer_bulk[i].customer_id
                    }else{
                        this.customerIDBefore = this.customerIDBefore+"|"+data.customer_bulk[i].customer_id
                    }
                }
                this.renderData()
            }
        },
        mounted () {
            let self = this
            this.$root.$on('event_error', function(err){
                self.error = err;
            });
        },
        methods: {
            // For get data from API
            renderData(){
                this.loading = true;
                let so_delivery_date = ''
                if (this.so_delivery_date){
                   so_delivery_date = this.so_delivery_date
                }
                let customerIDBefore = ''
                if (this.customerIDBefore){
                    customerIDBefore = this.customerIDBefore
                }
                this.$http.get("/finance/sales/invoice",{params:{
                        embeds:'salesorder.branch.merchant',
                        conditions:'status:6%2COr.status:1',
                        delivery_date:so_delivery_date,
                        merchant:customerIDBefore,
                        orderby:'id',
                    }}).then(response => {
                    this.loading = false;
                    let array = response.data.data
                    if(array === null){
                        this.items = []
                    }
                    if(array){
                        for (let i=0; i < array.length; i++) {
                            this.items.push(
                                {
                                    sales_invoice_id: array[i].id,
                                    customer: array[i].sales_order.branch.code+' - '+array[i].sales_order.branch.name,
                                    code: array[i].code,
                                    status: array[i].status,
                                    invoice_date: array[i].recognition_date,
                                    delivery_date: array[i].sales_order.delivery_date,
                                    amount: array[i].status === 6 ? 0 : array[i].remaining_amount,
                                }
                            )
                        }
                    }
                });
                this.$store.commit('setBulkPayment', null);
            },
            confirmButton() {
                let saveData = {
                    sales_invoice_items:[]
                }
                let paid_off_conv = ''
                saveData.payment_date = this.payment_date
                saveData.payment_method_id = this.payment_method_id
                saveData.payment_channel_id = this.payment_channel_id
                saveData.bank_receive_num = this.bank_receive_num
                for (let i=0; i < this.items.length; i++) {
                    if(this.items[i].paid_off){
                        paid_off_conv = 1
                    }else{
                        paid_off_conv = 2
                    }
                    saveData.sales_invoice_items.push(
                        {
                            amount: this.items[i].amount,
                            paid_off: paid_off_conv,
                            sales_invoice_id: this.items[i].sales_invoice_id,
                        }
                    )
                }
                this.ConfirmData = {
                    model: true,
                    title: "Create Bulk Payment",
                    text: "Are you sure want to create this bulk payment list?",
                    urlApi: "/sales/payment/bulk",
                    nextPage: "/finance/si",
                    data: saveData,
                    post: true
                }
            },
            // Show erorr message if customer not valid
            errPro(idx) {
                for (var key in this.error) {
                    if (key == 'customer_id' + idx) {
                        return this.error[key]
                    }
                }
            },
             // Show erorr message which invoice has finished
            errQty2(idx) {
                for (var key in this.error) {
                    if (key == 'id_' + idx) {
                        return this.error[key]
                    }
                }
            },
            // For remove customer
            removeCustomer(idx) {
                this.items.splice(idx, 1)
                for (var key in this.error) {
                    if (key.includes(idx) && key.includes('customer_id')) {
                        delete this.error[key];
                    }
                }

            },
            //For know index customer in array list
            setCustomerIdx(idx) {
                this.customerIdx = idx
            },
            //For get remaining amount partial status invoice
            getRemainingAmount(idx) {
                let invoiceID = this.items[idx].sales_invoice_id
                this.$http.get("/finance/sales/invoice/remaining/" + invoiceID).then(responseAmount => {
                    this.items[idx].amount = responseAmount.data.data;
                    this.loading = false
                });
            },
            //For select payment method
            paymentmethodSelected(d) {
                this.payment_method = '';
                this.payment_method_id = '';
                this.payment_channel = '';
                this.payment_channel_id = '';
                if (d !== '') {
                    this.disabledChanneldisabledChannel = d;
                    this.payment_method_id = d.id
                }
            },
            //For select payment channel
            paymentChannelSelected(d) {
                this.payment_channel = '';
                this.payment_channel_id = '';
                if (d !== '') {
                    this.payment_channel = d;
                    this.payment_channel_id = d.id
                }
            },
        },
        computed: {
            show_channel() {
                if(this.payment_method_id == 131072){
                    return true
                }else{
                    return false
                }
            },
            totalPayment() {
                let total = 0
                let array = this.items
                if(array){
                    for (let i = 0; i < array.length; i++) {
                        total += parseFloat(array[i].amount);
                    }
                }
                let val = (total / 1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
        },
        watch: {
            'items':{
                handler: function (val) {
                    if(this.items.length > 0) {
                        this.disabledBtn = false
                    }else{
                        this.disabledBtn = true
                    }
                },
                deep: true
            }
            
        }
    }
</script>