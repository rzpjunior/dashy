<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mb24">
                <v-col class="fs24 bold">
                    {{purchaseInvoiceDetail.code}}
                </v-col>
                <v-col class="d-flex justify-end align-end">
                    <div v-if="purchaseInvoiceDetail.status == 1">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('active')"
                        >
                            Active
                        </v-btn>
                    </div>
                    <div v-if="purchaseInvoiceDetail.status == 2">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('finished')"
                        >
                            Finished
                        </v-btn>
                    </div>
                    <div v-if="purchaseInvoiceDetail.status == 3">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('cancelled')"
                        >
                            Cancelled
                        </v-btn>
                    </div>
                    <div v-if="purchaseInvoiceDetail.status == 6">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('partial')"
                        >
                            Partial
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Purchase Invoice Date'" :value="formatDate(purchaseInvoiceDetail.recognition_date)"/>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <DetailRowNew :name="'Note'" :value="purchaseInvoiceDetail.note" :align="true"/>
                </v-col>
            </v-row>
        </div>
        <div class="box-start">
            <v-row class="mb24">
                <v-col class="fs16 bold">
                    Purchase Order
                </v-col>
                <v-col class="d-flex justify-end align-end">
                    <div v-if="purchaseInvoiceDetail.purchase_order.status == 1">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('active')"
                        >
                            Active
                        </v-btn>
                    </div>
                    <div v-if="purchaseInvoiceDetail.purchase_order.status == 2">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('finished')"
                        >
                            Finished
                        </v-btn>
                    </div>
                    <div v-if="purchaseInvoiceDetail.purchase_order.status == 3">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('cancelled')"
                        >
                            Cancelled
                        </v-btn>
                    </div>
                    <div v-if="purchaseInvoiceDetail.purchase_order.status == 7">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('on_delivery')"
                        >
                            On Delivery
                        </v-btn>
                    </div>
                    <div v-if="purchaseInvoiceDetail.purchase_order.status == 8">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('delivered')"
                        >
                            Delivered
                        </v-btn>
                    </div>
                    <div v-if="purchaseInvoiceDetail.purchase_order.status == 9">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('invoiced_not_delivered')"
                        >
                            Invoiced Not Delivered
                        </v-btn>
                    </div>
                    <div v-if="purchaseInvoiceDetail.purchase_order.status == 10">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('invoiced_on_delivery')"
                        >
                            Invoiced On Delivery
                        </v-btn>
                    </div>
                    <div v-if="purchaseInvoiceDetail.purchase_order.status == 11">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('invoiced_delivered')"
                        >
                            Invoiced Delivered
                        </v-btn>
                    </div>
                    <div v-if="purchaseInvoiceDetail.purchase_order.status == 12">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('paid_not_delivered')"
                        >
                            Paid not Delivered
                        </v-btn>
                    </div>
                    <div v-if="purchaseInvoiceDetail.purchase_order.status == 13">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('paid_on_delivery')"
                        >
                            Paid on Delivery
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Order Code'" :value="purchaseInvoiceDetail.purchase_order.code"/>
                    <DetailRowNew :name="'Customer'" :value="purchaseInvoiceDetail.purchase_order.supplier.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Order Date'" :value="formatDate(purchaseInvoiceDetail.purchase_order.recognition_date)"/>
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table -mt4">
            Payment List
        </div>
        <div class="box-body-table">
            <v-data-table
                :mobile-breakpoint="0"
                :headers="table.fields"
                :items="items"
                :hide-default-footer="true"
                :items-per-page="items.length"
            >
                <template v-slot:item="props">
                    <tr>
                        <td>{{ props.item.code }}</td>
                        <td>{{ formatPrice(props.item.amount) }}</td>
                        <td>{{ props.item.payment_method.name }}</td>
                        <td>{{ formatDate(props.item.recognition_date) }}</td>
                        <td> 
                            <div v-if="props.item.bank_payment_voucher_number">
                                {{ props.item.bank_payment_voucher_number }}
                            </div>
                            <div v-else>
                                 -
                            </div>
                        </td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                >
                                    <span class="pa-md-2"> Active </span>
                                </v-chip>
                            </div>
                            <div v-else-if="props.item.status == 2">
                                <v-chip
                                    :color="statusMaster('finished')"
                                > Finished </v-chip>
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
                        <td>
                            <v-img v-if="props.item.image_url"
                                class="rounded-form my-3"
                                height="130"
                                width="200"
                                :src="props.item.image_url"
                            ></v-img>
                            <span v-else>-</span>
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
                                    <v-list-item v-privilege="'pp_can'" v-if="props.item.status=='1' || props.item.status=='2'" @click="changeStatus(props.item.id)">
                                        <v-list-item-content>
                                            <v-list-item-title>Cancel</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item @click="seeHistory(props.item.id)">
                                        <v-list-item-content>
                                            <v-list-item-title>See History</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <div class="box-end">
            <v-row>
                <div class="row d-flex align-end justify-end pa20">
                    <v-btn
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                        @click="$router.go(-1)"
                        v-privilege="'pp_rdl'"
                    >
                        <span class="text-black80">Back</span>
                    </v-btn>
                    <v-btn
                        v-if="purchaseInvoiceDetail.status == 1 || purchaseInvoiceDetail.status == 6"
                        @click="dialog = true"
                        v-privilege="'pp_crt'"
                        depressed
                        color="#50ABA3"
                        class="main-btn white--text"
                    >
                        Create Payment
                    </v-btn>
                </div>
            </v-row>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
        <AuditLogNew :data="dataAuditLog"/>
        <v-dialog
            v-model="dialog"
            max-width="1037px"
        >
            <LoadingBar :value="overlay"/>
            <v-card class="OpenSans">
                <v-card-title>
                    <v-row>
                        <v-col class="text-title-modal" cols="12" md="11">
                            Create Payment
                        </v-col>
                        <v-col class="flex-align-end" cols="12" md="1">
                            <v-btn
                                icon
                                @click="dialog = false"
                            >
                                <v-img src="/icon/close-new.png" max-height="24px" max-width="24px"></v-img>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>     
                <div class="hr-title-modal mt1"/>
                <v-card-text class="mt-6">
                    <v-row>
                        <v-col cols="12" md="6">
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
                                            name="payment_date"
                                            prepend-inner-icon="mdi-calendar"
                                            outlined
                                            required
                                            clearable
                                            @click:clear="payment_date = ''"
                                            v-model="payment_date"
                                            maxlength="10"
                                            onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 45"
                                            dense
                                        >
                                            <template v-slot:label>
                                                Purchase Payment Date <span class="text-red">*</span>
                                            </template>
                                        </v-text-field>
                                    </div>
                                </template>
                                <v-date-picker
                                    no-title
                                    v-model="payment_date"
                                    @input="payment_date_model = false"
                                ></v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-co cols="12" md="6">
                            <SelectPaymentMethod
                                name="payment_method"
                                :label="'Payment Method '"
                                @selected="paymentmethodSelected"
                                required
                                :error="error.payment_method_id"
                                :dense="true"
                            ></SelectPaymentMethod>
                        </v-co>
                        <v-col cols="12" md="6" class="-mt24">
                            <v-text-field
                                name="bank_payment_voucher_number"
                                v-model="bank_payment_voucher_number"
                                required
                                outlined
                                maxlength="20"
                                dense
                                :error-messages="error.bank_payment_voucher_number"
                            >
                                <template v-slot:label>
                                    Bank Payment Voucher Number<span class="text-red">*</span>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="-mt45">
                            <div class="fs12">
                                Amount <span class="text-red">*</span>
                            </div>
                            <vue-numeric
                                name="paid_amount"
                                class="productNumeric -ml1 -mt1"
                                placeholder="0,00"
                                separator="."
                                :precision="2"
                                required
                                v-model.number="amount"
                                onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
                                :error-messages="error.amount"
                            >
                                <template v-slot:label>
                                    Amount <span class="text-red">*</span>
                                </template>
                            </vue-numeric>
                        </v-col>
                    </v-row>
                </v-card-text>
                <div class="hr-title-modal -mt28"/>
                <v-card-text>
                    <v-row>
                        <v-col class="d-flex">
                            <v-checkbox
                                name="paid_off"
                                v-model="paid_off"
                                :label="'Paid Off'"
                            ></v-checkbox>
                            <v-checkbox
                                class="ml26"
                                name="with_image"
                                v-model="with_image"
                                :label="'With Image'"
                            ></v-checkbox>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" class="d-flex -mt20">
                            <v-textarea
                                v-model="note"
                                name="adj_note"
                                required
                                outlined
                                rows="4"
                            >
                                <template v-slot:label>
                                    <div>
                                        Note
                                    </div>
                                </template>
                            </v-textarea>
                            <SelectSingleImageNew
                                v-if="with_image" 
                                :forImgName="purchaseInvoiceDetail.code" 
                                :errorMsg="error.image" 
                                :maxSize="2" 
                                :extention="'JPG'"
                                class="ml32"
                            >
                            </SelectSingleImageNew>
                        </v-col>
                    </v-row>
                </v-card-text>
                <div class="hr-title-modal -mt10"/>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                        @click="dialog = false"
                    >
                        <span class="text-black80">Cancel</span>
                    </v-btn>
                    <v-btn
                        @click="createPurchasePayment()"
                        depressed
                        color="#50ABA3"
                        class="main-btn white--text"
                    >
                        Pay
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
    export default {
        name: "purchaseInvoiceDetail",
        data() {
            return {
                dialog: false,
                loading: true,
                table: {
                    fields: [
                        {
                            text:'Payment Code',
                            sortable: false,
                            class: 'grey--text text--darken-4'
                        },
                        {
                            text:'Amount (Rp)',
                            sortable: false,
                            class: 'grey--text text--darken-4'
                        },
                        {
                            text:'Payment Method',
                            sortable: false,
                            class: 'grey--text text--darken-4'
                        },
                        {
                            text:'Payment Date',
                            sortable: false,
                            class: 'grey--text text--darken-4'
                        },
                        {
                            text:'Bank Payment Voucher Number',
                            sortable: false,
                            class: 'grey--text text--darken-4'
                        },
                        {
                            text:'Status',
                            sortable: false,
                            class: 'grey--text text--darken-4'
                        },
                        {
                            text:'Image',
                            width: "20%",
                            sortable: false,
                            class: 'grey--text text--darken-4'
                        },
                        {
                            width: "5%",
                            sortable: false,
                            class: 'grey--text text--darken-4'
                        },
                    ],
                },
                items: [],
                form : {},
                ConfirmData : {},
                dataAuditLog : {},
                purchaseInvoiceDetail:{
                    purchase_order : {
                        status : '',
                        supplier : {
                            name : '',
                        }
                    }
                },
                error:{},
                payment_date_model : '',
                payment_date : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                payment_method:'',
                payment_method_id: '',
                amount : 0,
                paid_off : false,
                with_image : false,
                note : '',
                image : '',
                total_amount : 0,
                bank_payment_voucher_number : '',
                total_charge : 0,
                overlay: false,
            }
        },
        computed: {
            staff () {
                return this.$store.getters.getStaff
            }
        },
        methods:{
            // For get api payment list
            async renderData(){
                this.loading=true
                    await this.$http.get("/finance/purchase/invoice/"+this.$route.params.id)
                    .then(response => {
                        this.purchaseInvoiceDetail = response.data.data
                        this.total_charge = response.data.data.total_charge
                        this.$http.get("/finance/purchase/payment",{params:{
                                embeds:'purchaseinvoice,purchaseinvoice.purchaseorder,paymentmethod',
                                conditions:"purchaseinvoice.id.e:"+this.$route.params.id,
                            }}).then(responsePayment => {
                                this.items = responsePayment.data.data
                                if(this.items === null){
                                    this.items = []
                                }
                                if(responsePayment.data.data.length){
                                    for (let i=0;i<responsePayment.data.data.length; i++) {
                                        if(responsePayment.data.data[i].amount && (responsePayment.data.data[i].status === 2)){
                                            this.total_amount += parseFloat(responsePayment.data.data[i].amount)
                                            this.amount = this.total_charge -  this.total_amount
                                        }
                                    }
                                }
                        });
                        if (this.amount == 0) {
                            this.amount = this.total_charge
                        }
                        this.loading = false
                    });
            },
            // For create purchase payment
            createPurchasePayment() {
                this.overlay = true
                let paidOff = ''
                if (this.paid_off == true) {
                    paidOff = 1
                } else {
                    paidOff = 2
                }

                this.form = {
                    recognition_date : this.payment_date,
                    payment_method_id: this.payment_method_id,
                    amount: parseFloat(this.amount),
                    paid_off: paidOff,
                    note: this.note,
                    image_url: this.image,
                    purchase_invoice_id: this.purchaseInvoiceDetail.id,
                    bank_payment_voucher_number : this.bank_payment_voucher_number
                }
                this.$http.post('/finance/purchase/payment',this.form)
                .then(response => {
                    this.$toast.open({
                        position: 'top-right',
                        message: 'Data has been saved successfully',
                        type: 'success',
                    });
                    location.reload()
                })
                .catch(e => {
                    this.overlay = false
                    this.error = e.errors
                });
            },
            // For change status
            changeStatus(id) {
                this.ConfirmData = {
                    model : true,
                    status : true,
                    statusMsg : "Success to Cancel this Payment",
                    title : "Cancellation note",
                    text : "Cancellation note",
                    urlApi : "/finance/purchase/payment/cancel/"+id,
                    cancelNote : "Note",
                    data : {}
                }
            },
            // For see history
            seeHistory(id) {
                this.dataAuditLog = {
                    model : true,
                    id: id,
                    type: "purchase_payment"
                }
            },
            // For select payment method
            paymentmethodSelected(d) {
                this.payment_method = '';
                this.payment_method_id = '';
                if (d !== '') {
                    this.payment_method = d;
                    this.payment_method_id = d.id
                }
            },
        },
        created() {
            this.renderData()
        },
        mounted () {
            let self = this
            this.$root.$on('event_success', function(res){
                if (res) {
                    window.location.reload();
                }
            });
            this.$root.$on('event_error', function(err){
                self.error = err
                self.imageError = err.image;
            });
            this.$root.$on('event_singleImage', function(image){
                self.image = image
            });
        },
        watch: {
            with_image: {
                handler: function (val) { // ini untuk clear data
                    if(val == false){
                        this.image = ''
                    }
                },
                deep: true
            },
        },
    }
</script>