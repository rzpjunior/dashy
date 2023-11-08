<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mb24">
                <v-col class="fs24 bold">
                    {{deliveryOrderDetail.code}}
                </v-col>
                <v-col class="d-flex justify-end align-end">
                    <v-btn
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4 mr10"
                        :color="statusMaster('draft')"
                    >
                        Printed ({{ deliveryOrderDetail.delta_print }})
                    </v-btn>
                    <v-btn
                        v-if="deliveryOrderDetail.status == 1"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('active')"
                    >
                        Active
                    </v-btn>
                    <v-btn
                        v-if="deliveryOrderDetail.status == 2"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('finished')"
                    >
                        Finished
                    </v-btn>
                    <v-btn
                        v-if="deliveryOrderDetail.status == 3"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('cancelled')"
                    >
                        Cancelled
                    </v-btn>
                    <v-btn
                        v-if="deliveryOrderDetail.status == 4"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('deleted')"
                    >
                        Deleted
                    </v-btn>
                    <v-btn
                        v-if="deliveryOrderDetail.status == 5"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('on_delivery')"
                    >
                        On Delivery
                    </v-btn>
                    <v-btn
                        v-if="deliveryOrderDetail.status == 6"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('delivered')"
                    >
                        Delivered
                    </v-btn>
                    <v-btn
                        v-if="deliveryOrderDetail.status == 7"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('failed')"
                    >
                        Failed
                    </v-btn>
                    <v-menu>
                        <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list class="bg-white">
                            <v-list-item v-if="deliveryOrderDetail.status == 1 || deliveryOrderDetail.status == 5 || deliveryOrderDetail.status == 6 || deliveryOrderDetail.status == 7" :to="{ name: 'DeliveryOrderUpdate', params: { id: deliveryOrderDetail.id } }" v-privilege="'do_upd'">
                                <v-list-item-content>
                                    <v-list-item-title>Update</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-icon>mdi-open-in-new</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                            <v-list-item v-if="deliveryOrderDetail.status == 1 || deliveryOrderDetail.status == 6 || deliveryOrderDetail.status == 7" :to="{ name: 'DeliveryOrderConfirm', params: { id: deliveryOrderDetail.id } }" v-privilege="'do_cnf'">
                                <v-list-item-content>
                                    <v-list-item-title>Confirm</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-icon>mdi-open-in-new</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                            <div v-if="deliveryOrderDetail.status == 1 || deliveryOrderDetail.status == 5 || deliveryOrderDetail.status == 6 || deliveryOrderDetail.status == 7">
                                <hr>
                            </div>
                            <v-list-item v-if="deliveryOrderDetail.status == 1 || deliveryOrderDetail.status == 5 || deliveryOrderDetail.status == 6 || deliveryOrderDetail.status == 7" @click="modelDialog= true" v-privilege="'do_can'">
                                <v-list-item-content>
                                    <v-list-item-title>Cancel</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div>
                                <hr>
                            </div>
                            <v-list-item @click="print(deliveryOrderDetail.id)" v-privilege="'do_prt'">
                                <v-list-item-content>
                                    <v-list-item-title>Print</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div>
                                <hr>
                            </div>
                            <v-list-item @click="seeHistory()">
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
                    <DetailRowNew :name="'Delivery Date'" :value="formatDate(deliveryOrderDetail.recognition_date)"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'WRT'" :value="deliveryOrderDetail.wrt.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Warehouse Origin'" :value="deliveryOrderDetail.warehouse.name"/>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <DetailRowNew :name="'Shipping Address'" :value="deliveryOrderDetail.shipping_address" :align="true"/>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <DetailRowNew :name="'Note'" :value="deliveryOrderDetail.note" :align="true"/>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <DetailRowNew :name="'Cancellation Note'" :value="deliveryOrderDetail.cancellation_note" v-if="deliveryOrderDetail.cancellation_note" :align="true"/>
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
                        v-if="deliveryOrderDetail.sales_order.status == 1"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('active')"
                        >
                        Active
                    </v-btn>
                    <v-btn
                        v-if="deliveryOrderDetail.sales_order.status == 2"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('finished')"
                        >
                        Finished
                    </v-btn>
                    <v-btn
                        v-if="deliveryOrderDetail.sales_order.status == 3"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('cancelled')"
                        >
                        Cancelled
                    </v-btn>
                    <v-btn
                        v-if="deliveryOrderDetail.sales_order.status == 7"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('on_delivery')"
                        >
                        On Delivery
                    </v-btn>
                    <v-btn
                        v-if="deliveryOrderDetail.sales_order.status == 8"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('delivered')"
                        >
                        Delivered
                    </v-btn>
                    <v-btn
                        v-if="deliveryOrderDetail.sales_order.status == 9"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('invoiced_not_delivered')"
                        >
                        Invoiced Not Delivered
                    </v-btn>
                    <v-btn
                        v-if="deliveryOrderDetail.sales_order.status == 10"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('invoiced_on_delivery')"
                        >
                        Invoiced On Delivery
                    </v-btn>
                    <v-btn
                        v-if="deliveryOrderDetail.sales_order.status == 11"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('invoiced_delivered')"
                        >
                        Invoiced Delivered
                    </v-btn>
                    <v-btn
                        v-if="deliveryOrderDetail.sales_order.status == 12"
                        elevation="0"
                        rounded
                        small
                        class="no-caps mb4"
                        :color="statusMaster('paid_not_delivered')"
                        >
                        Paid not Delivered
                    </v-btn>
                    <v-btn
                        v-if="deliveryOrderDetail.sales_order.status == 13"
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
                    <DetailRowNew :name="'Order Code'" :value="deliveryOrderDetail.sales_order.code" :routePath="'/sales-order/detail/'+deliveryOrderDetail.sales_order.id"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Order Date'" :value="formatDate(deliveryOrderDetail.sales_order.recognition_date)"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Order Type'" :value="deliveryOrderDetail.sales_order.order_type.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Customer'" :value="deliveryOrderDetail.sales_order.branch.merchant.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24" v-if="deliveryOrderDetail.sales_order.branch.merchant.customer_group === 1">
                    <DetailRowNew :name="'Outlet'" :value="deliveryOrderDetail.sales_order.branch.merchant.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Payment Term'" :value="deliveryOrderDetail.sales_order.term_payment_sls.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Invoice Term'" :value="deliveryOrderDetail.sales_order.term_invoice_sls.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Payment Group'" :value="deliveryOrderDetail.sales_order.payment_group.name"/>
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
                        <td>{{ props.item.product.code }} - {{ props.item.product.name }}</td>
                        <td>{{ props.item.product.uom.name }}</td>
                        <td class="right">{{ props.item.deliver_qty }}</td>
                        <td class="right">{{ props.item.receive_qty }}</td>
                        <td>{{ props.item.receipt_item_note }}</td>
                        <td>{{ props.item.order_item_note }}</td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <div class="ma12 wp100">
            <v-row>
                <v-col cols="12" md="6">
                    <div class="box-col" v-privilege="'do_rdd'">
                        <div class="bold">
                            Delivery Return
                        </div>
                        <div class="hr-title my16"/>
                        <div v-if="do_items.length>0">
                            <div v-for="(item, idx) in do_items" :key="idx" >
                                <v-row>
                                    <v-col class="d-flex align-center">
                                        <router-link 
                                            :to="`/warehouse/delivery-return/detail/${item.id}`" 
                                            target="_blank"
                                        >
                                            {{item.code}}
                                        </router-link>
                                    </v-col>
                                    <v-col class="d-flex justify-end">
                                        <div v-if="item.status == 1">
                                            <v-chip
                                                :color="statusMaster('active')"
                                            ><span class="pa-md-2">Active</span></v-chip>
                                        </div>
                                        <div v-if="item.status == 2">
                                            <v-chip
                                                :color="statusMaster('finished')"
                                            ><span class="pa-md-2">Finished</span></v-chip>
                                        </div>
                                        <div v-if="item.status == 3">
                                            <v-chip
                                                :color="statusMaster('cancelled')"
                                            ><span class="pa-md-2">Cancelled</span></v-chip>
                                        </div>
                                    </v-col>
                                </v-row>
                                <v-divider class="my-3"/>
                            </div>
                        </div>
                        <v-row v-else>
                            <v-col class="flex-align-center">
                                No data to display
                            </v-col>
                        </v-row>
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
                <LoadingBar :value="overlayCancel"/>
                <v-card-title>
                    <span class="text-title-modal">Cancel Delivery Order</span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">Why was this delivery order cancelled?</span>
                    <v-textarea
                        name="note"
                        v-model="cancellation_note.note"
                        :counter="100"
                        outlined
                        required
                        maxlength="100"
                        class="mt-6"
                        rows="3"
                    >
                        <template v-slot:label>
                            Note<span style="color:red">*</span>
                        </template>
                    </v-textarea>
                </v-card-text>
                <v-card-actions class="pb-4">
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
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                        @click="cancelOrder()"
                        :disabled="disableBtn"
                    >Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <AuditLogNew :data="dataAuditLog"/>
        <LoadingBar :value="overlay"/>
        <v-dialog
            v-model="modalPrintInvoice"
            max-width="402px"
        >
            <v-card class="OpenSans">
            <LoadingBar :value="overlayPrintInvoice"/>  
                <v-card-title>
                    <span class="text-title-modal">Print Invoice</span>
                    <v-spacer></v-spacer>
                    <v-btn
                        icon
                        @click="modalPrintInvoice = false"
                    >
                        <img src="/icon/close-new.png" height="20px" width="20px"/>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <span>Don't forget to print this invoice</span>
                </v-card-text>
                <div v-for="(item, idx) in deliveryOrderDetail.sales_invoice" :key="idx">
                    <v-card-actions v-if="item.status !== 3 && item.status !== 4" class="pb-6 mr-6">
                        <v-spacer></v-spacer>
                        <v-btn
                            @click="printInvoice(item.id)"
                            depressed
                            color="#50ABA3"
                            class="main-btn white--text"
                        >
                            <v-icon left>
                                mdi-printer
                            </v-icon>
                            Print
                        </v-btn>
                    </v-card-actions>
                </div>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
    import Vue from 'vue'

    export default {
        name: "DeliveryOrderDetail",
        data() {
            return {
                modalPrintInvoice: false,
                overlayPrintInvoice: false,
                cancellation_note: {
                    note: "",
                },
                id_do: '',
                overlay: false,
                overlayCancel: false,
                disableBtn: false,
                loading: false,
                id_si: '',
                filePdf: '',
                table: {
                    fields: [
                        {
                            text:'No.',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Product',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'UOM',
                            class: 'grey--text text--darken-4',
                            sortable:false,
                        },
                        {
                            text:'Delivery Qty',
                            align:'right',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Received Qty',
                            align:'right',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Received Note',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Order Note',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                    ],
                },
                items: [{
                    product: {
                        code: '',
                        name: '',
                        uom: {
                            name: ''
                        }
                    }
                }],
                do_items: [],
                deliveryOrderDetail: {
                    code: '',
                    sales_order: {
                        code: '',
                        term_payment_sls: {
                            name: ''
                        },
                        term_invoice_sls: {
                            name: ''
                        },
                        payment_group: {
                            name: ''
                        },
                        branch: {
                            merchant: {
                                name: ''
                            },
                            name: ''
                        },
                        area: {
                            name: ''
                        },
                        order_type: {
                            name: ''
                        }
                    },
                    wrt: {
                        name: ''
                    },
                    warehouse: {
                        name: ''
                    },
                },
                dataAuditLog: {},
                modelDialog: false,
                note: {
                    note: "",
                },
            }
        },
        methods: {
            print(id) {
                this.overlay = true
                this.id_so = id
                this.$http.get("/warehouse/delivery_order/print/" + this.id_so)
                    .then(response => {
                        this.filePdf = response.data.file
                        window.open(this.filePdf, '_blank');
                        this.renderData()
                        this.overlay = false
                    })
            },
            async renderData() {
                this.loading = true
                await this.$http.get("/warehouse/delivery_order/" + this.$route.params.id, {
                    params: {
                        embeds: "sales_order,branch.merchant.payment_term,branch.merchant.invoice_term,branch.merchant,sales_order_id.term_payment_sls_id,sales_order_id.term_invoice_sls_id"
                    }
                }).then(response => {
                    this.loading = false
                    if (response.data.data.delivery_order_items) {
                        this.items = response.data.data.delivery_order_items
                        if (this.items === null) {
                            this.items = []
                        }
                    }
                    this.deliveryOrderDetail = response.data.data
                    if (response.data.data.sales_invoice) {
                        if (response.data.data.sales_invoice) {
                            let arr = response.data.data.sales_invoice
                            for (let i = 0; i < arr.length; i++) {
                                if (response.data.data.sales_invoice.length > 0) {
                                    if (this.deliveryOrderDetail.sales_order.term_invoice_sls.code == 'SIT0002' && this.deliveryOrderDetail.sales_invoice[i].status !== 3 && this.deliveryOrderDetail.sales_invoice[i].status !== 4) {
                                        this.modalPrintInvoice = true
                                    }
                                }
                            }
                        }
                    }
                    if (this.$route.params != undefined) { // hanlde sentry undefined for route params
                        this.$http.get("/warehouse/delivery_return", {
                            params: {
                                embeds: "warehouse_id,warehouse.area_id",
                                conditions: "deliveryorder.id.e:" + this.$route.params.id,
                            }
                        }).then(responseDR => {
                            this.loading = false
                            this.do_items = responseDR.data.data
                            if (this.do_items === null) {
                                this.do_items = []
                            }
                        });
                    }
                });
            },
            printInvoice(id) {
                this.overlayPrintInvoice = true
                this.id_si = id
                this.$http.get("/finance/sales/invoice/print/" + this.id_si)
                    .then(response => {
                        this.filePdf = response.data.file
                        window.open(this.filePdf, '_blank');
                        this.overlayPrintInvoice = false
                    })
            },
            seeHistory() {
                this.dataAuditLog = {
                    model: true,
                    id: this.$route.params.id,
                    type: "delivery_order"
                }
            },
            // cancelOrder() {
            //     this.disableBtn = true
            //     this.overlayCancel = true
            //     this.$http.put("/warehouse/delivery_order/cancel/" + this.$route.params.id,
            //         this.cancellation_note
            //     ).then(response => {
            //         Vue.$toast.open({
            //             position: 'top-right',
            //             message: 'Data has been cancelled successfully',
            //             type: 'success',
            //         });
            //         this.renderData()
            //         this.disableBtn = false
            //         this.overlayCancel = false
            //         this.modelDialog = false
            //     }).catch(e => {
            //         this.error = e.errors
            //         this.disableBtn = false
            //         this.overlayCancel = false
            //     });
            // },
            cancelOrder() {
                let self = this;
                this.disableBtn = true
                this.overlayCancel = true
                this.$http.put("/warehouse/delivery_order/produce_cancel/" + this.$route.params.id,
                    this.cancellation_note
                ).then(response => {
                    Vue.$toast.open({
                        position: 'top-right',
                        message: 'Data has been cancelled successfully',
                        type: 'success',
                    });
                    self.renderData()
                    self.disableBtn = false
                    self.overlayCancel = false
                    self.modelDialog = false
                    // let timer = setInterval(function () {
                    //     self.$http.get("/jobs/" + response.data.data.id).then(responses => {
                    //         if (responses.data.data.status === 4) {
                    //             clearTimeout(timer);
                    //             Vue.$toast.open({
                    //                 position: 'top-right',
                    //                 message: 'Data has been cancelled successfully',
                    //                 type: 'success',
                    //             });
                    //             self.renderData()
                    //             self.disableBtn = false
                    //             self.overlayCancel = false
                    //             self.modelDialog = false
                    //         } else if (responses.data.data.status === 5) {
                    //             clearTimeout(timer);
                    //             self.disableBtn = false
                    //             self.overlayCancel = false
                    //         }
                    //     });

                    // }, 2000);
                }).catch(e => {
                    this.error = e.errors
                    this.disableBtn = false
                    this.overlayCancel = false
                });
            },
        },
        computed: {
            staff() {
                return this.$store.getters.getStaff
            }
        },
        created() {
            this.renderData()
        },
    }
</script>
