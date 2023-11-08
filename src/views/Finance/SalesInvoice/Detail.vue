<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mb24">
                <v-col class="fs24 bold">
                    {{salesInvoiceDetail.code}}
                </v-col>
                <v-col class="d-flex justify-end align-end">
                    <v-btn
                        v-if="salesInvoiceDetail.status == 1"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('active')"
                        >
                        Active
                    </v-btn>
                    <v-btn
                        v-if="salesInvoiceDetail.status == 2"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('finished')"
                        >
                        Finished
                    </v-btn>
                    <v-btn
                        v-if="salesInvoiceDetail.status == 3"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('cancelled')"
                    >
                        Cancelled
                    </v-btn>
                    <v-btn
                        v-if="salesInvoiceDetail.status == 6"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('partial')"
                    >
                        Partial
                    </v-btn>
                    <v-menu>
                        <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list class="bg-white">
                            <v-list-item v-privilege="'sp_crt'" @click="createPayment(salesInvoiceDetail.id)" v-if="salesInvoiceDetail.status == 1 || salesInvoiceDetail.status == 6">
                                <v-list-item-content>
                                    <v-list-item-title>Create Payment</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-icon>mdi-open-in-new</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                            <v-list-item v-privilege="'sp_rdl'" :to="{ name: 'SalesPaymentList', params: { id: salesInvoiceDetail.id } }" v-if="salesInvoiceDetail.sales_payment">
                                <v-list-item-content>
                                    <v-list-item-title>Payment List</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-icon>mdi-open-in-new</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                            <v-list-item v-privilege="'si_upd'" :to="{ name: 'SalesInvoiceUpdate', params: { id: salesInvoiceDetail.id } }" v-if="salesInvoiceDetail.status == 1">
                                <v-list-item-content>
                                    <v-list-item-title>Update</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-icon>mdi-open-in-new</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                            <div v-if="salesInvoiceDetail.status == 1">
                                <hr>
                            </div>
                            <v-list-item @click="modelDialog= true" v-if="salesInvoiceDetail.status == 1" v-privilege="'si_can'">
                                <v-list-item-content>
                                    <v-list-item-title>Cancel</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div v-if="salesInvoiceDetail.status == 1">
                                <hr>
                            </div>
                            <v-list-item v-privilege="'si_prt'" @click="downloadPdf(salesInvoiceDetail.id)" v-if="salesInvoiceDetail.status == 1 || salesInvoiceDetail.status == 2
                            || salesInvoiceDetail.status == 3 || salesInvoiceDetail.status == 6">
                                <v-list-item-content>
                                    <v-list-item-title>Print</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div>
                                <hr>
                            </div>
                            <v-list-item @click="printPdf(salesInvoiceDetail.id)" v-privilege="'si_edn_prt'">
                                <v-list-item-content>
                                    <v-list-item-title>Print Nota</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div v-privilege="'si_edn_prt'">
                                <hr />
                            </div>
                            <v-list-item @click="printPdfTermal(salesInvoiceDetail.id)" v-privilege="'si_edn_prt'">
                                <v-list-item-content>
                                    <v-list-item-title>Print Nota Thermal</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div v-privilege="'si_edn_prt'">
                                <hr />
                            </div>
                            <v-list-item @click="seeHistory(salesInvoiceDetail.id)">
                                <v-list-item-content>
                                    <v-list-item-title>See History</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Invoice Customer Code'" :value="salesInvoiceDetail.code_ext"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Payment Term'" :value="salesInvoiceDetail.term_payment_sls.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Invoice Date'" :value="formatDate(salesInvoiceDetail.recognition_date)"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Payment Group'" :value="salesInvoiceDetail.payment_group_sls.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Invoice Term'" :value="salesInvoiceDetail.term_invoice_sls.name"/>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <DetailRowNew :name="'Billing Address'" :value="salesInvoiceDetail.billing_address" :align="true"/>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <DetailRowNew :name="'Note'" :value="salesInvoiceDetail.note" :align="true"/>
                </v-col>
            </v-row>
        </div>
        <div class="box-start">
            <v-row class="mb24">
                <v-col class="fs16 bold">
                    Sales Order
                </v-col>
                <v-col class="d-flex justify-end align-end">
                    <v-btn
                        v-if="salesInvoiceDetail.sales_order.status == 1"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('active')"
                    >
                        Active
                    </v-btn>
                    <v-btn
                        v-if="salesInvoiceDetail.sales_order.status == 2"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('finished')"
                    >
                        Finished
                    </v-btn>
                    <v-btn
                        v-if="salesInvoiceDetail.sales_order.status == 3"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('cancelled')"
                    >
                        Cancelled
                    </v-btn>
                    <v-btn
                        v-if="salesInvoiceDetail.sales_order.status == 7"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('on_delivery')"
                    >
                        On Delivery
                    </v-btn>
                    <v-btn
                        v-if="salesInvoiceDetail.sales_order.status == 8"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('delivered')"
                    >
                        Delivered
                    </v-btn>
                    <v-btn
                        v-if="salesInvoiceDetail.sales_order.status == 9"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('invoiced_not_delivered')"
                    >
                        Invoiced Not Delivered
                    </v-btn>
                    <v-btn
                        v-if="salesInvoiceDetail.sales_order.status == 10"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('invoiced_on_delivery')"
                    >
                        Invoiced On Delivery
                    </v-btn>
                    <v-btn
                        v-if="salesInvoiceDetail.sales_order.status == 11"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('invoiced_delivered')"
                    >
                        Invoiced Delivered
                    </v-btn>
                    <v-btn
                        v-if="salesInvoiceDetail.sales_order.status == 12"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('paid_not_delivered')"
                    ><span>Paid not Delivered</span>
                    </v-btn>
                    <v-btn
                        v-if="salesInvoiceDetail.sales_order.status == 13"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('paid_on_delivery')"
                    >
                        Paid on Delivery
                    </v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Order Code'" :value="salesInvoiceDetail.sales_order.code" :routePath="'/sales-order/detail/'+salesInvoiceDetail.sales_order.id"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Order Date'" :value="formatDate(salesInvoiceDetail.sales_order.recognition_date)"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Order Delivery Date'" :value="formatDate(salesInvoiceDetail.sales_order.delivery_date)"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Order Type'" :value="salesInvoiceDetail.sales_order.order_type.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Customer'" :value="salesInvoiceDetail.sales_order.branch.merchant.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Outlet'" :value="salesInvoiceDetail.sales_order.branch.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Area'" :value="salesInvoiceDetail.sales_order.branch.area.name"/>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <DetailRowNew :name="'Shipping Address'" :value="salesInvoiceDetail.sales_order.shipping_address" :align="true"/>
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table -mt4">
            Products
        </div>
        <div class="box-body-table">
            <v-data-table
                :mobile-breakpoint="0"
                :headers="table.fields"
                :items="items"
                :loading="loading"
                :hide-default-footer="true"
                :items-per-page="items.length"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.index + 1 }}</td>
                        <td>
                            {{ props.item.product.code }} - {{ props.item.product.name }}<br>
                            <span class="text-black60" v-if="props.item.sales_order_item.discount_qty > 0">
                                Qty Discount {{ props.item.invoice_qty > props.item.sales_order_item.discount_qty? props.item.sales_order_item.discount_qty : props.item.invoice_qty }} {{ props.item.product.uom.name }}
                            </span>
                        </td>
                        <td>{{ props.item.product.uom.name }}</td>
                        <td class="right">{{ formatPrice(props.item.invoice_qty) }}</td>
                        <td class="right">{{ formatPrice(props.item.unit_price) }}</td>
                        <td class="right">{{ props.item.sales_order_item.unit_price_discount > 0? formatPrice(props.item.sales_order_item.unit_price_discount * (props.item.invoice_qty > props.item.sales_order_item.discount_qty? props.item.sales_order_item.discount_qty : props.item.invoice_qty)):'-' }}</td>
                        <td class="right">{{ formatPrice(props.item.subtotal) }}</td>
                        <td>{{ props.item.note }}</td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <div class="box-end">
            <v-row>
                <v-col cols="12" md="6">
                    <DetailRowNew v-if="salesInvoiceDetail.vou_redeem_code" :name="'Voucher Code'" :value="salesInvoiceDetail.vou_redeem_code"/>
                    <DetailRowNew v-else :name="'Voucher Code'" :value="'-'"/>
                    <v-alert
                        v-if="(salesInvoiceDetail.sales_order.voucher != null && salesInvoiceDetail.sales_order.voucher.type == 4)"
                        color="#EBEBEB"
                        dark
                        outlined
                        style="border-radius: 10px; padding: 10px;"
                    >
                        <img
                            src="/icon/EdenPoint-Icon.svg"
                            alt="icon buy"
                            height="26px"
                            width="26px"
                            class="ml10 vertical-middle"
                        />
                        <span class="text-black pl8">Cashback EdenPoint {{formatUnitPrice(salesInvoiceDetail.sales_order.voucher.disc_amount)}}</span>
                    </v-alert>
                    <DetailRowNew :name="'Adjustment Note'" :value="salesInvoiceDetail.adj_note"/>
                </v-col>
                <v-col class="text-black60" cols="12" md="6">
                    <div class="row">
                        <div class="col">
                            Total :
                        </div>
                        <div class="col d-flex justify-end text-black">
                            {{formatPrice(salesInvoiceDetail.total_price)}}
                        </div>
                    </div>
                    <div class="-mt20">
                        <div class="row" v-if="voucherType == 1">
                            <div class="col">
                                Total Discount :
                            </div>
                            <div class="col d-flex justify-end text-black">
                                - {{formatPrice(salesInvoiceDetail.vou_disc_amount)}}
                            </div>
                        </div>
                    </div>
                    <div class="-mt20">
                        <div class="row">
                            <div class="col">
                                Delivery Fee :
                            </div>
                            <div class="col d-flex justify-end text-black">
                                {{formatPrice(salesInvoiceDetail.delivery_fee)}}
                            </div>
                        </div>
                    </div>
                    <div class="-mt20">
                        <div class="row" v-if="voucherType == 3">
                            <div class="col">
                                Delivery Discount :
                            </div>
                            <div class="col d-flex justify-end text-black">
                                - {{formatPrice(salesInvoiceDetail.vou_disc_amount)}}
                            </div>
                        </div>
                    </div>
                    <div class="-mt20">
                        <div class="row" v-if="salesInvoiceDetail.point_redeem_amount != 0">
                            <div class="col">
                                EdenPoint :
                            </div>
                            <div class="col d-flex justify-end text-black">
                                - {{formatPrice(salesInvoiceDetail.point_redeem_amount)}}
                            </div>
                        </div>
                    </div>
                    <div class="-mt20">
                        <div class="row">
                            <div class="col">
                                Adjustment :
                            </div>
                            <div class="col d-flex justify-end text-black">
                                {{salesInvoiceDetail.adjustment == 2 ? "-" : ""}} {{formatPrice(salesInvoiceDetail.adj_amount)}}
                            </div>
                        </div>
                    </div>
                    <div class="-mt20">
                        <div class="row" v-if="voucherType == 2">
                            <div class="col">
                                Grand Total Discount :
                            </div>
                            <div class="col d-flex justify-end text-black">
                                - {{formatPrice(salesInvoiceDetail.vou_disc_amount)}}
                            </div>
                        </div>
                    </div>
                    <v-divider class="my-4"/>
                    <div class="-mt15 fs20 text-black bold">
                        <div class="row">
                            <div class="col">
                                Grand Total (Rp) :
                            </div>
                            <div class="col d-flex justify-end text-black">
                                {{formatPrice(salesInvoiceDetail.total_charge)}}
                            </div>
                        </div>
                    </div>
                    <div class="-mt15 fs20 text-black bold">
                        <div class="row">
                            <div class="col">
                                Remaining Amount (Rp) :
                            </div>
                            <div class="col d-flex justify-end text-black">
                                {{formatPrice(salesInvoiceDetail.remaining_amount)}}
                            </div>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </div>
        <v-dialog
            v-model="modelDialog"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">Cancel Sales Invoice</span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">Why was this sales invoice cancelled?</span>
                    <v-textarea
                        name="note"
                        v-model="note.note"
                        :counter="100"
                        outlined
                        :error-messages="error.note"
                        required
                        class="mt-6"
                        rows="3"
                    >
                        <template v-slot:label>
                            Note<span style="color:red">*</span>
                        </template>
                    </v-textarea>
                </v-card-text>
                <v-card-actions class="pb-4 -mt6">
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="modelDialog = false"
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
                        @click="cancelOrder()"
                    >
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <AuditLogNew :data="dataAuditLog"/>
        <LoadingBar :value="overlay"/>
    </v-container>
</template>

<script>
    import Vue from 'vue'
    export default {
        name: "SalesInvoiceDetail",
        data() {
            return {
                overlay: false,
                modelDialog : false,
                loading: false,
                note : {
                    note : "",
                },
                error : {},
                table: {
                    fields: [
                        {
                            text:'No.',
                            sortable: false,
                            width: "5%",
                            class: 'grey--text text--darken-4',
                        },
                        {
                            text:'Product',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                        },
                        {
                            text:'UOM',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                        },
                        {
                            text:'Invoice Qty',
                            sortable: false,
                            align : 'right',
                            class: 'grey--text text--darken-4',
                        },
                        {
                            text:'Unit Price',
                            sortable: false,
                            align : 'right',
                            class: 'grey--text text--darken-4',
                        },
                        {
                            text:'Discount Amount',
                            sortable: false,
                            align : 'right',
                            class: 'grey--text text--darken-4',
                        },
                        {
                            text:'Subtotal',
                            sortable: false,
                            align : 'right',
                            class: 'grey--text text--darken-4',
                        },
                        {
                            text:'Note',
                            sortable: false,
                            class: 'grey--text text--darken-4',
                        },
                    ],
                },
                items: [],
                ConfirmData : {},
                dataAuditLog : {},
                salesInvoiceDetail:{
                    term_invoice_sls : {
                        name : '',
                    },
                    term_payment_sls : {
                        name : '',
                    },
                    payment_group_sls : {
                        name : '',
                    },
                    sales_order : {
                        branch : {
                            merchant: {
                                name : '',
                            },
                            area : {
                                name : '',
                            }
                        },
                        shipping_address : '',
                        order_type: {
                            name: ''
                        }
                    }
                },
                error:{},
                loading:true,
                amount : 0,
                adjnote : '',
                image : '',
                total_amount : 0,
                total_charge : 0,
                id_si:'',
                voucherType: '',
            }
        },
        mounted () {
            this.renderData()
            let self = this
            this.$root.$on('event_success', function(res){
                if (res) {
                    self.renderData()
                }
            });
        },
        methods:{
            async renderData(){
                this.loading=true
                await this.$http.get("/finance/sales/invoice/"+this.$route.params.id)
                .then(response => {
                    this.loading = false
                    this.items = response.data.data.sales_invoice_items
                    if(this.items === null){
                        this.items = []
                    }
                    this.total_charge = response.data.data.total_charge
                    this.salesInvoiceDetail = response.data.data

                    if (this.salesInvoiceDetail.voucher_type) {
                        this.voucherType = this.salesInvoiceDetail.voucher_type
                    }
                });
            },
            createPayment(val) {
                this.$store.commit('setCreatePayment', 'true');
                this.$router.push('/finance/si/sp/'+val)
            },
            formatPrice(value) {
                let val = (value/1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
            cancelOrder() {
                this.$http.put("/finance/sales/invoice/cancel/"+this.$route.params.id, this.note).then(response => {
                    Vue.$toast.open({
                        position: 'top-right',
                        message: 'Data has been cancelled successfully',
                        type: 'success',
                    });
                    this.renderData()
                    this.modelDialog = false
                }).catch(e => {
                    this.error = e.errors
                });
            },
            seeHistory(id) {
                this.dataAuditLog = {
                    model : true,
                    id: id,
                    type: "sales_invoice"
                }
            },
            //For print nota
            printPdf(id) {
                this.overlay = true
                this.$http.get("/finance/sales/invoice/print-edn/" + id, {
                    params: {
                        format: 1
                    },
                }).then(response => {
                    window.open(response.data.file, '_blank');
                    this.overlay = false
                })
            },
            //For print nota
            printPdfTermal(id) {
                this.overlay = true
                this.$http.get("/finance/sales/invoice/print-edn/" + id, {
                    params: {
                        format: 2
                    },
                }).then(response => {
                    window.open(response.data.file, '_blank');
                    this.overlay = false
                })
            },
            downloadPdf(id){
                this.overlay = true
                 this.id_si = id
                 this.$http.get("/finance/sales/invoice/print/"+this.id_si)
                    .then(response => {
                        this.filePdf = response.data.file
                        window.open(this.filePdf,'_blank');
                        this.overlay = false
                    })
            },
        },
        computed: {
            staff () {
                return this.$store.getters.getStaff
            }
        },
    }
</script>
