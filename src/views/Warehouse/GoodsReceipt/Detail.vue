<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mb24">
                <v-col class="fs24 bold">
                    {{items.code}}
                </v-col>
                <v-col class="d-flex justify-end align-end">
                    <div v-if="this.items.status == 1">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            depressed
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
                    <v-menu offset-y >
                    <template v-slot:activator="{ on }">
                        <v-btn icon v-on="on">
                            <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                    </template>
                        <v-list class="bg-white">
                            <v-list-item v-if="this.items.status == 2 && this.items.stock_type == 1" v-privilege="'tfs_crt'" :to="`/warehouse/goods-receipt/detail/${items.id}/transfer-sku`">
                                <v-list-item-content>
                                    <v-list-item-title>Transfer SKU</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item v-if="this.items.status == 1 && this.items.inbound_type != 2" v-privilege="'gr_upd'" :to="`/warehouse/goods-receipt/update/${items.id}`">
                                <v-list-item-content>
                                    <v-list-item-title>Update</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-icon>mdi-open-in-new</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                            <div v-if="this.items.status == 1 && this.items.inbound_type != 2">
                                <hr>
                            </div>
                            <v-list-item v-if="this.items.status == 1" v-privilege="'gr_cnf'" @click="confirm(items.id)">
                                <v-list-item-content>
                                    <v-list-item-title>Confirm</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div v-if="this.items.status == 1">
                                <hr>
                            </div>
                            <v-list-item v-if="this.items.status == 1" v-privilege="'gr_can'" @click="modelDialog = true">
                                <v-list-item-content>
                                    <v-list-item-title>Cancel</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div v-if="this.items.status == 1">
                                <hr>
                            </div>
                            <v-list-item @click="seeHistory()">
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
                    <DetailRowNew :name="'Area'" :value="items.warehouse.area.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Warehouse'" :value="items.warehouse.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Actual Arrival Date'" :value="formatDate(items.ata_date)"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Actual Arrival Time'" :value="items.ata_time"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew v-if="items.goods_transfer !== null" :name="'GT Code'" :value="items.goods_transfer.code" :routePath="'/warehouse/goods-transfer/detail/'+items.goods_transfer.id"/>
                    <DetailRowNew v-else :name="'GT Code'" :value="'-'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Inbound Type'" :value="items.inbound_type == 2 ? 'Goods Transfer' : 'Purchase Order'"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Stock Type'" :value="items.stock_type == 2 ? 'Waste Stock' : 'Goods Stock'"/>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <DetailRowNew :name="'Note'" :value="items.note" :align="true"/>
                </v-col>
            </v-row>
        </div>
        <div class="box" v-if="items.inbound_type == 1">
            <v-row class="mb24">
                <v-col class="fs24 bold">
                    Purchase Order
                </v-col>
                <v-col class="d-flex justify-end align-end">
                    <div v-if="items.purchase_order.status == 1">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
                            small
                            class="no-caps mb4"
                            :color="statusMaster('active')"
                        >Active</v-btn>
                    </div>
                    <div v-else-if="items.purchase_order.status == 2">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            class="no-caps mb4"
                            :color="statusMaster('finished')"
                        >Finished</v-btn>
                    </div>
                    <div v-else-if="items.purchase_order.status == 3">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            class="no-caps mb4"
                            :color="statusMaster('cancelled')"
                        >Cancelled</v-btn>
                    </div>
                    <div v-else-if="items.purchase_order.status == 5">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            class="no-caps mb4"
                            :color="statusMaster('draft')"
                        >Draft</v-btn>
                    </div>
                </v-col>
            </v-row>
            <v-row v-if="items.purchase_order !== null">
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Supplier'" :value="items.purchase_order.supplier.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Purchase Order Code'" :value="items.purchase_order.code" :routePath="'/purchase/order/'+items.purchase_order.id"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Purchase Order Date'" :value="formatDate(items.purchase_order.recognition_date)"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Estimated Arrival Date'" :value="formatDate(items.purchase_order.eta_date)"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Estimated Arrival Time'" :value="items.purchase_order.eta_time"/>
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table">
            Products
        </div>
        <div class="box-body-table">
            <v-data-table
                :mobile-breakpoint="0"
                :headers="table.fields"
                :items="items.goods_receipt_items"
                :hide-default-footer="true"
                :items-per-page="-1"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.index + 1 }}</td>
                        <td>{{ props.item.product.code }} - {{ props.item.product.name }}</td>
                        <td>{{ props.item.product.uom.name }}</td>
                        <td>{{ formatPrice(props.item.purchase_order_item == null ? props.item.receive_qty : props.item.purchase_order_item.order_qty) }}</td>
                        <td>{{ formatPrice(props.item.delivery_qty) }}</td>
                        <td>{{ props.item.goods_receipt.inbound_type == 2 ? props.item.reject_reason_convert : formatPrice(props.item.reject_qty) }}</td>
                        <td>{{ formatPrice(props.item.receive_qty) }}</td>
                        <td>{{ props.item.note }}</td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <div class="ma12 wp100">
            <v-row v-if="items.inbound_type == 1">
                <v-col cols="12" md="6">
                    <div class="box-col" v-privilege="'sr_rdd'">
                        <div class="bold">
                            Supplier Return
                        </div>
                        <div class="hr-title my16"/>
                        <div v-if="items.supplier_return">
                            <div v-for="(item, idx) in items.supplier_return" :key="idx" >
                                <v-row>
                                    <v-col class="d-flex align-center">
                                        <router-link 
                                            :to="`/warehouse/supplier-return/detail/${item.id}`" 
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
                                        <div v-if="item.status == 2">
                                            <v-btn
                                                elevation="0"
                                                rounded
                                                small
                                                class="no-caps"
                                                :color="statusMaster('finished')"
                                            >Finished
                                            </v-btn>
                                        </div>
                                        <div v-if="item.status == 3">
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
                            </div>
                            <v-divider class="my-3"/>
                        </div>
                        <v-row v-else>
                            <v-col class="flex-align-center">
                                No data to display
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
                <v-col cols="12" md="6">
                    <div class="box-col" v-privilege="'dn_rdd'">
                        <div class="bold">
                            Debit Note
                        </div>
                        <div class="hr-title my16"/>
                        <div v-if="items.debit_note">
                            <div v-for="(item, idx) in items.debit_note" :key="idx" >
                                <v-row>
                                    <v-col class="d-flex align-center">
                                        <router-link 
                                            :to="`/finance/debit-note/detail/${item.id}`" 
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
                                        <div v-if="item.status == 2">
                                            <v-btn
                                                elevation="0"
                                                rounded
                                                small
                                                class="no-caps"
                                                :color="statusMaster('finished')"
                                            >Finished
                                            </v-btn>
                                        </div>
                                        <div v-if="item.status == 3">
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
                            </div>
                            <v-divider class="my-3"/>
                        </div>
                        <v-row v-else>
                            <v-col class="flex-align-center">
                                No data to display
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" md="6">
                    <div class="box-col" v-privilege="'sr_rdd'">
                        <div class="bold">
                            Transfer SKU
                        </div>
                        <div class="hr-title my16"/>
                        <div v-if="items.transfer_SKU">
                            <div v-for="(item, idx) in items.transfer_SKU" :key="idx" >
                                <v-row>
                                    <v-col class="d-flex align-center">
                                        <router-link 
                                            :to="`/warehouse/transfer-sku/detail/${item.id}`" 
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
                                        <div v-if="item.status == 2">
                                            <v-btn
                                                elevation="0"
                                                rounded
                                                small
                                                class="no-caps"
                                                :color="statusMaster('finished')"
                                            >Finished
                                            </v-btn>
                                        </div>
                                        <div v-if="item.status == 3">
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
                            </div>
                            <v-divider class="my-3"/>
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
        <ConfirmationDialogNew :sendData="ConfirmData"/>
        <v-dialog
            v-model="modelDialog"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">Cancellation Note<span class="text-red"> *</span></span>
                </v-card-title>
                <v-card-text>
                    <v-textarea
                        name="note"
                        v-model="note.note"
                        :counter="100"
                        maxlength="100"
                        rows="3"
                        outlined
                        :error-messages="error.note"
                        required
                        dense
                    >
                        <template v-slot:label>
                            Note<span class="text-red">*</span>
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
                        @click="cancelOrder()"
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                    >Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <LoadingBar :value="overlay"/>
    </v-container>
</template>
<script>
import Vue from 'vue'
export default {
    name: 'DetailGoodsReceipt',
    data() {
        return {
            overlay: false,
            items : {
                warehouse : {
                    name : "",
                    area : {
                        name : ''
                    }
                },
                purchase_order : {
                    recognition_date : "",
                    eta_time : "",
                    eta_date : "",
                    code : "",
                    supplier: {
                        name : ""
                    }
                },
                goods_transfer : {
                    code : ""
                },
                goods_receipt_items : []
            },
            dataAuditLog : {},
            ConfirmData : {},
            inbound_type: '',
            modelDialog : false,
            note : {
                note : "",
            },
            error : {},
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
                        sortable: false
                    },
                    {
                        text:'UOM',
                        class: 'grey--text text--darken-4',
                        sortable: false
                    },
                    {
                        text:'Order Qty',
                        width: "12%",
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Delivery Qty',
                        width: "12%",
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Reject Qty',
                        width: "12%",
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Received Qty',
                        width: "12%",
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Note',
                        class: 'grey--text text--darken-4',
                        sortable: false
                    }
                ],
            },
        }
    },
    created() {
        this.renderData()
    },
    mounted() {
        let self = this
        this.$root.$on('event_success', function(res){
            if (res) {
                self.renderData()
            }
        });
    },
    methods : {
        confirm(id) {
            this.ConfirmData = {
                model : true,
                status : true,
                title : "Confirm Goods Receipt",
                text : "Are you sure to confirm this goods receipt? Stock will be updated",
                urlApi : 'warehouse/goods/receipt/confirm/'+id,
                data : {
                    inbound_type: this.inbound_type
                }
            }
        },
        cancelOrder() {
            this.overlay = true
            this.$http.put("/warehouse/goods/receipt/cancel/"+this.$route.params.id, this.note).then(response => {
                this.modelDialog = false
                this.overlay = false
                Vue.$toast.open({
                    position: 'top-right',
                    message: 'Data has been cancelled successfully',
                    type: 'success',
                });
                this.renderData()
            }).catch(e => {
                this.overlay = false
                this.error = e.errors
            });
        },
        seeHistory() {
            this.dataAuditLog = {
                model : true,
                id: this.$route.params.id,
                type: "goods_receipt"
            }
        },
        renderData(){
            this.$http.get("/warehouse/goods/receipt/"+this.$route.params.id).then(response => {
                this.items = response.data.data
                if(this.items.inbound_type == 1){
                    this.inbound_type = 'purchase_order'
                }else{
                    this.inbound_type = 'goods_transfer'
                }
                if (this.items.inbound_type == 2) {
                    this.table.fields[3].text = "Transfer Qty"
                    this.table.fields[5].text = "Reject Reason"
                    return this.table.fields[3].text, this.table.fields[5].text
                }
            });
        },
    }
}
</script>
