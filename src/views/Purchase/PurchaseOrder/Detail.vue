<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mt24" v-if="items.images">
                <v-col cols="12" class="-mt24">
                    <v-row class="mt5">
                        <div class="img-product ma-2" v-for="(item, idx) in items.images" :key="idx">
                            <DisplayPhotoOverlay :src="item.image_url" :large_img="true"/>
                        </div>
                    </v-row>
                </v-col>
            </v-row>
            <v-row class="mb24">
                <v-col class="fs24 bold">
                    <p>{{items.code}}</p>
                </v-col>
                <v-col class="d-flex justify-end align-end">
                    <div v-if="this.items.status == 1">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            class="no-caps mb4"
                            :color="statusMaster('active')"
                        >Active</v-btn>
                    </div>
                    <div v-else-if="this.items.status == 2">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            class="no-caps mb4"
                            :color="statusMaster('finished')"
                        >Finished</v-btn>
                    </div>
                    <div v-else-if="this.items.status == 3">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            class="no-caps mb4"
                            :color="statusMaster('cancelled')"
                        >Cancelled</v-btn>
                    </div>
                    <div v-else-if="this.items.status == 5">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            class="no-caps mb4"
                            :color="statusMaster('draft')"
                        >Draft</v-btn>
                    </div>
                    <div v-if="items.supplier_badge">
                        <v-btn 
                            v-privilege="'po_mrk'"
                            v-if="items.status == 5 && items.supplier_badge.name == 'Central Market'"
                            :to="`/purchase/order/market-purchase/${items.id}`"
                            icon
                        ><v-icon>mdi-shopping</v-icon></v-btn>
                    </div>
                    <v-menu offset-y >
                    <template v-slot:activator="{ on }">
                        <v-btn icon v-on="on">
                            <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                    </template>
                        <v-list class="bg-white">
                            <v-list-item v-if="this.items.status == 5" :to="`/purchase/order/update/${this.items.id}`" v-privilege="'po_upd'">
                                <v-list-item-content>
                                    <v-list-item-title>Update</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-icon>mdi-open-in-new</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                            <v-list-item v-if="this.items.status == 1 && statusPi" :to="`/purchase/order/update-product/${this.items.id}`" v-privilege="'po_upd_prd'">
                                <v-list-item-content>
                                    <v-list-item-title>Update Product</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-icon>mdi-open-in-new</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                            <v-list-item v-if="this.items.status == 1 && items.total_invoice == 0" :to="`/finance/purc-invoice/create/${this.items.id}`" v-privilege="'pi_crt'">
                                <v-list-item-content>
                                    <v-list-item-title>Create Invoice</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-icon>mdi-open-in-new</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                            <div>
                                <hr>
                            </div>
                            <v-list-item @click="modelDialogCommit = true" v-if="this.items.status == 5" v-privilege="'po_cmt'">
                                <v-list-item-content>
                                    <v-list-item-title>Commit</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div v-if="this.items.status == 5">
                                <hr>
                            </div>
                            <v-list-item @click="modelDialog= true" v-if="(this.items.status == 1 || this.items.status == 5) && statusGr && items.total_invoice == 0" v-privilege="'po_can'">
                                <v-list-item-content>
                                    <v-list-item-title>Cancel</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div v-if="(this.items.status == 1 || this.items.status == 5) && statusGr && items.total_invoice == 0">
                                <hr>
                            </div>
                            <v-list-item @click="downloadPdf(items.id)" v-privilege="'po_prt'">
                                <v-list-item-content>
                                    <v-list-item-title>Print</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item @click="downloadExcel(items.id)" v-privilege="'pd_dl'" v-if="items.status == 1">
                                <v-list-item-content>
                                    <v-list-item-title>Download PD</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item @click="seeHistory()" v-privilege="'filter_rdl'">
                                <v-list-item-content>
                                    <v-list-item-title>History</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Supplier'" :value="items.supplier.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Supplier Organization'" :value="items.supplier.supplier_organization ? items.supplier.supplier_organization.name : '-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Payment Term'" :value="items.term_payment_pur.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Area'" :value="items.warehouse.area.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Warehouse'" :value="items.warehouse.name"/>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <DetailRowNew :name="'Warehouse Address'" :align="true" :value="items.warehouse_address"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Order Date'" :value="formatDate(items.recognition_date)"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Estimated Arrival Date'" :value="formatDate(items.eta_date)"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Estimated Arrival Time'" :value="items.eta_time"/>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <DetailRowNew :name="'Note'" :value="items.note" :align="true"/>
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table">
            Products
        </div>
        <div class="box-body-table">
            <v-data-table
                :headers="table.fields"
                :items="items.purchase_order_items"
                :hide-default-footer="true"
                :items-per-page="-1"
                mobile-breakpoint="0"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.index + 1 }}</td>
                        <td>{{ props.item.product.name }}</td>
                        <td>{{ props.item.product.uom.name }}</td>
                        <td class="right">{{ formatPrice(props.item.order_qty) }}</td>
                        <td class="right">{{ formatPrice(props.item.purchase_qty) }}</td>
                        <td class="right">
                            <span v-if="props.item.include_tax === 1">
                                {{ formatUnitPrice(Math.round(props.item.unit_price_tax)) }}
                            </span>
                            <span v-else>
                                {{ formatUnitPrice(Math.round(props.item.unit_price)) }}
                            </span>
                            </td>
                        <td>{{ props.item.tax_percentage }}</td>
                        <td>
                            <span v-if="props.item.include_tax === 1">Yes</span>
                            <span v-else>No</span>
                        </td>
                        <td class="right">
                            <div v-if="props.item.include_tax === 1">
                                <span>{{ formatPrice(Math.round(props.item.unit_price_tax * (100 / (100 + props.item.tax_percentage)))) }}</span>
                                /
                                <span v-if="props.item.tax_percentage">{{ formatPrice(Math.round(props.item.unit_price_tax)) }}</span>
                                <span v-else>0</span>
                            </div>
                            <div v-else>
                                <span>{{ formatPrice(Math.round(props.item.unit_price)) }}</span>
                                /
                                <span v-if="props.item.tax_percentage">{{ formatPrice(Math.round(props.item.unit_price * (100+props.item.tax_percentage) /100)) }}</span>
                                <span v-else>0</span>
                            </div>
                        </td>
                        <td class="right">{{ formatPrice(Math.round(props.item.tax_amount)) }}</td>
                        <td class="right">{{ formatPrice(Math.round(props.item.subtotal)) }}</td>
                        <td>
                            <span v-if="props.item.note">{{ props.item.note }}</span>
                            <span v-else>-</span>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <div class="box-end">
            <v-row >
                <v-col class="text-black60" cols="12" md="6">
                </v-col>
                <v-col class="text-black60" cols="12" md="6">
                    <div class="row">
                        <div class="col">
                            Total:
                        </div>
                        <div class="col d-flex justify-end text-black">
                            {{formatPrice(items.total_price)}}
                        </div>
                    </div>
                    <div class="-mt20">
                        <div class="row">
                            <div class="col">
                                Total Tax Amount:
                            </div>
                            <div class="col d-flex justify-end text-black">
                                {{ totalTaxAmount }}
                            </div>
                        </div>
                    </div>
                    <div class="-mt20">
                        <div class="row">
                            <div class="col">
                                Delivery Fee:
                            </div>
                            <div class="col d-flex justify-end text-black">
                                {{formatPrice(items.delivery_fee)}}
                            </div>
                        </div>
                    </div>
                    <v-divider class="my-4"/>
                    <div class="row fs20 text-black bold -mt10 mb2">
                        <div class="col">
                            Grand Total (Rp):
                        </div>
                        <div class="col d-flex justify-end">
                            {{formatPrice(items.total_charge)}}
                        </div>
                    </div>
                </v-col>
            </v-row>
        </div>
        <div class="ma12 wp100">
            <v-row>
                <v-col cols="12" md="6">
                    <div class="box-col">
                        <div class="bold">
                            Goods Receipt
                        </div>
                        <div class="hr-title my16"/>
                        <div v-if="items.goods_receipt">
                            <div v-for="(item, idx) in items.goods_receipt" :key="idx" >
                                <v-row>
                                    <v-col class="d-flex align-center">
                                        <router-link 
                                            :to="`/warehouse/goods-receipt/detail/${item.id}`" 
                                            target="_blank"
                                        >
                                            {{item.code}}
                                        </router-link>
                                    </v-col>
                                    <v-col class="d-flex justify-end">
                                        <div v-if="item.status == 1">
                                            <v-btn
                                                elevation="0"
                                                rounded
                                                small
                                                class="no-caps"
                                                :color="statusMaster('active')"
                                            >Active
                                            </v-btn>
                                        </div>
                                        <div v-else-if="item.status == 2">
                                            <v-btn
                                                elevation="0"
                                                rounded
                                                small
                                                class="no-caps"
                                                :color="statusMaster('finished')"
                                            >Finished
                                            </v-btn>
                                        </div>
                                        <div v-else-if="item.status == 3">
                                            <v-btn
                                                elevation="0"
                                                rounded
                                                small
                                                class="no-caps"
                                                :color="statusMaster('cancelled')"
                                            >Cancelled
                                            </v-btn>
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
                <v-col cols="12" md="6">
                    <div class="box-col">
                        <div class="bold">
                            Purchase Invoice
                        </div>
                        <div class="hr-title my16"/>
                        <div v-if="items.purchase_invoice">
                            <div v-for="(item, idx) in items.purchase_invoice" :key="idx" >
                                <v-row>
                                    <v-col class="d-flex align-center">
                                        <router-link 
                                            :to="`/finance/purc-invoice/${item.id}`" 
                                            target="_blank"
                                        >
                                            {{item.code}}
                                        </router-link>
                                    </v-col>
                                    <v-col class="d-flex justify-end">
                                        <div v-if="item.status == 1">
                                            <v-btn
                                                elevation="0"
                                                rounded
                                                small
                                                class="no-caps"
                                                :color="statusMaster('active')"
                                            >Active
                                            </v-btn>
                                        </div>
                                        <div v-else-if="item.status == 2">
                                            <v-btn
                                                elevation="0"
                                                rounded
                                                small
                                                class="no-caps"
                                                :color="statusMaster('finished')"
                                            >Finished
                                            </v-btn>
                                        </div>
                                        <div v-else-if="item.status == 3">
                                            <v-btn
                                                elevation="0"
                                                rounded
                                                small
                                                class="no-caps"
                                                :color="statusMaster('cancelled')"
                                            >Cancelled
                                            </v-btn>
                                        </div>
                                        <div v-else-if="item.status == 6">
                                            <v-btn
                                                elevation="0"
                                                rounded
                                                small
                                                class="no-caps"
                                                :color="statusMaster('partial')"
                                            >Partial
                                            </v-btn>
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
        <AuditLogNew :data="dataAuditLog"/>
        <v-dialog
            v-model="modelDialog"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">Cancellation Note <span style="color:red">*</span></span>
                </v-card-title>
                <v-card-text>
                    <v-textarea
                        name="note"
                        v-model="note.note"
                        :counter="100"
                        outlined
                        maxlength="100"
                        rows="3"
                        :error-messages="error.note || error.purchase_order"
                        required
                        class="rounded-form mt-6"
                    >
                        <template v-slot:label>
                            Note
                        </template>
                    </v-textarea>
                </v-card-text>
                <v-card-actions class="pb-4">
                <v-spacer></v-spacer>
                    <v-btn
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                        @click="modelDialog = false"
                    >
                        <span class="text-black80">Cancel</span>
                    </v-btn>
                    <v-btn
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                        @click="cancelOrder()"
                    >Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="modelDialogCommit"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">Commit Purchase Order</span>
                </v-card-title>
                <v-card-text>
                    <p>
                        Are you sure to commit this purchase order? <br>
                        This purchase order can not be updated afterwards
                    </p>
                </v-card-text>
                <v-card-actions class="pb-4">
                <v-spacer></v-spacer>
                    <v-btn
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                        @click="modelDialogCommit = false"
                    >
                        <span class="text-black80">No</span>
                    </v-btn>
                    <v-btn
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                        @click="commitOrder()"
                    >Yes</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <LoadingBar :value="overlay"/>
    </v-container>
</template>
<script>
import Vue from 'vue'
export default {
    name: 'PurchaseOrderDetail',
    data() {
        return {
            overlay: false,
            id_po : '',
            items : {
                supplier : {
                    name : ''
                },
                term_payment_pur: {
                    name: ''
                },
                warehouse : {
                    area: {
                        name: ''
                    },
                    name : ''
                },
                note: '',
                images: []
            },
            dataAuditLog : {},
            isMobile : false,
            modelDialog : false,
            modelDialogCommit: false,
            note : {
                note : "",
            },
            error : {},
            filePdf: '',
            table: {
                fields: [
                    {
                        text:'No.',
                        class:'grey--text text--darken-4',
                        sortable: false,
                        width:'5%'
                    },
                    {
                        text:'Product',
                        class:'grey--text text--darken-4',
                        width:'10%',
                        sortable: false
                    },
                    {
                        text:'UOM',
                        class:'grey--text text--darken-4',
                        width:'5%',
                        sortable: false
                    },
                    {
                        text:'Order Qty',
                        class:'grey--text text--darken-4',
                        width:'5%',
                        sortable: false,
                        align:'right'
                    },
                    {
                        text:'Purchase Qty',
                        class:'grey--text text--darken-4',
                        width:'5%',
                        sortable: false,
                        align:'right'
                    },
                    {
                        width:'10%',
                        class:'grey--text text--darken-4',
                        text:'Unit Price',
                        sortable: false,
                        align:'right'
                    },
                    {
                        class:'grey--text text--darken-4',
                        text:'Tax (%)',
                        width: '5%',
                        sortable: false,
                    },
                    {
                        class:'grey--text text--darken-4',
                        text:'Include Tax',
                        width:'5%',
                        sortable: false,
                    },
                    {
                        class:'grey--text text--darken-4',
                        text:'Unit Price non Tax / Unit Price Tax',
                        sortable: false,
                        width:'15%'
                    },
                    {
                        class:'grey--text text--darken-4',
                        text:'Tax Amount',
                        width:'10%',
                        sortable: false,
                    },
                    {
                        text:'Subtotal',
                        class:'grey--text text--darken-4',
                        width:'10%',
                        sortable: false,
                        align:'right'
                    },
                    {
                        text:'Note',
                        class:'grey--text text--darken-4',
                        sortable: false,
                    },
                ],
            },
        }
    },
    mounted(){
        window.onresize = () => {
            if (window.screen.width < 769) {
                this.isMobile = true
            } else {
                this.isMobile = false
            }
        }
    },
    created() {
        this.renderData()
        let self = this
        setTimeout(function(){
            self.id_po = self.$route.params.id
        }, 500);
        if (window.screen.width < 769) {
            this.isMobile = true
        } else {
            this.isMobile = false
        }
    },
    computed: {
        statusPi() {
            if (!this.items.purchase_invoice) {
                return true
            } else {
                if (this.items.purchase_invoice[this.items.purchase_invoice.length-1].status == 3) {
                    return true
                } else {
                    return false
                }
            }
        },
        totalTaxAmount() {
            let total = 0;
            let array = this.items.purchase_order_items;

            if(Array.isArray(array) && array.length){
                for (let i = 0; i < array.length; i++) {
                    total += Math.round(array[i].tax_amount);
                }
                let val = (total / 1).toFixed(2).replace(".", ",");
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }
            return "0"
         },
        statusGr() {
            if (!this.items.goods_receipt || this.items.goods_receipt.length <= 0) {
                return true
            } else {
                if (this.items.goods_receipt[this.items.goods_receipt.length-1].status == 3) {
                    return true
                } else {
                    return false
                }
            }
        }
    },
    methods : {
        // For format time
        formatTime(val) {
            return this.$moment(val).format('HH:mm')
        },
        // For download PDF
        downloadPdf(id){
            this.overlay = true
            this.$http.get("/purchase/order/print/"+id)
            .then(response => {
                this.filePdf = response.data.file
                window.open(this.filePdf,'_blank');
                this.overlay = false
            })
        },
        // For download excel
        downloadExcel(id){
            this.overlay = true
            this.$http.get("/purchase/order/download-delivery/"+id+"?export=1")
            .then(response => {
                window.location.href = response.data.file
                this.overlay = false
            })
        },
        // For cancel order
        cancelOrder() {
            this.$http.put("/purchase/order/cancel/"+this.$route.params.id, this.note).then(response => {
                Vue.$toast.open({
                    position: 'top-right',
                    message: 'Data has been cancelled successfully',
                    type: 'success',
                });
                this.renderData()
                this.modelDialog = false
            }).catch(e => {
                this.error = e.errors
                this.modelDialogCommit = false
            });
        },
        // For commit order
        commitOrder() {
            this.modelDialogCommit = false
            this.overlay = true
            this.$http.put("/purchase/order/commit/"+this.$route.params.id, {}).then(response => {
                Vue.$toast.open({
                    position: 'top-right',
                    message: 'Data has been commit successfully',
                    type: 'success',
                });
                this.renderData()
                this.modelDialogCommit = false
                this.overlay = false
            }).catch(e => {
                this.error = e.errors
                this.modelDialogCommit = false
                this.overlay = false
            });
        },
        // For see history
        seeHistory() {
            this.dataAuditLog = {
                model : true,
                id: this.$route.params.id,
                type: "purchase_order"
            }
        },
        // For get detail purchase order
        renderData(){
            this.$http.get("/purchase/order/"+this.$route.params.id).then(response => {
                this.items = response.data.data
                if(this.items === null){
                    this.items = {}
                }
            });
        },
    }
}
</script>