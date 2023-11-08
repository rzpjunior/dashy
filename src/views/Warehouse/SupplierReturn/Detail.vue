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
                            <v-list-item v-if="this.items.status == 1" v-privilege="'supr_upd'" :to="`/warehouse/supplier-return/update/${items.id}`">
                                <v-list-item-content>
                                    <v-list-item-title>Update</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-icon>mdi-open-in-new</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                            <div v-if="this.items.status == 1">
                                <hr>
                            </div>
                            <v-list-item v-if="this.items.status == 1" v-privilege="'supr_cnf'" @click="confirm(items.id)">
                                <v-list-item-content>
                                    <v-list-item-title>Confirm</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div v-if="this.items.status == 1">
                                <hr>
                            </div>
                            <v-list-item v-if="this.items.status == 1" v-privilege="'supr_can'" @click="modelDialog = true">
                                <v-list-item-content>
                                    <v-list-item-title>Cancel</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div v-if="this.items.status == 1">
                                <hr>
                            </div>
                            <v-list-item v-if="this.items.status == 2" @click="print(items.id)" v-privilege="'supr_prt'">
                                <v-list-item-content>
                                    <v-list-item-title>Print</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div v-if="this.items.status == 2">
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
                    <DetailRowNew :name="'Return Date'" :value="formatDate(items.recognition_date)"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Warehouse'" :value="items.warehouse.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'GR Number'" :value="items.good_receipt.code" :routePath="'/warehouse/goods-receipt/detail/'+items.good_receipt.id"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Supplier Name'" :value="items.supplier.code+' - '+items.supplier.name"/>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <DetailRowNew :name="'Note'" :value="items.note" :align="true"/>
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
                :items="items.supplier_return_items"
                :hide-default-footer="true"
                :items-per-page="-1"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.index + 1 }}</td>
                        <td>{{ props.item.product.code }} - {{ props.item.product.name }}</td>
                        <td>{{ props.item.product.uom.name }}</td>
                        <td>{{ formatPrice(props.item.received_qty) }}</td>
                        <td>{{ formatPrice(props.item.return_good_qty) }}</td>
                        <td>{{ props.item.note }}</td>
                    </tr>
                </template>
            </v-data-table>
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
                        v-model="cancellation_note"
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
            filePdf: '',
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
                goods_receipt_items : []
            },
            dataAuditLog : {},
            ConfirmData : {},
            modelDialog : false,
            note : {
                note : "",
            },
            cancellation_note: "",
            error : {},
            form:{
                warehouse_id: '',
                supplier_id: '',
                recognition_date: '',
                good_receipt_id: '',
                note:'',
                supplier_return_item: []
            },
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
                        text:'Received Qty',
                        width: "12%",
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Return Qty',
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
                window.location.reload()
            }
        });
    },
    methods : {
        //print supplier return
        print(id) {
            this.overlay = true
            this.$http.get("/warehouse/supplier_return/print/" + id)
                .then(response => {
                    this.filePdf = response.data.file
                    window.open(this.filePdf, '_blank');
                    this.overlay = false
                })
        },
        confirm(id) {
            this.ConfirmData = {
                model : true,
                status : true,
                title : "Confirm Supplier Return",
                text : "Are you sure to confirm this supplier return? Stock log will be updated",
                urlApi : 'warehouse/supplier_return/confirm/'+id,
                data : this.form
            }
        },
        cancelOrder() {
            this.overlay = true
            this.$http.put("/warehouse/supplier_return/cancel/"+this.$route.params.id, {
                cancellation_note: this.cancellation_note
            }).then(response => {
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
                type: "supplier_return"
            }
        },
        renderData(){
            this.$http.get("/warehouse/supplier_return/"+this.$route.params.id).then(response => {
                this.items = response.data.data
                this.form.warehouse_id = this.items.warehouse.id
                this.form.supplier_id = this.items.supplier.id
                this.form.recognition_date = this.$moment(this.items.recognition_date).format('YYYY-MM-DD')
                this.form.good_receipt_id = this.items.good_receipt.id
                this.items.supplier_return_items.forEach(e => {
                    this.form.supplier_return_item.push({
                        product_id:e.product.id,
                        uom:e.product.uom.name,
                        received_qty:e.received_qty,
                        return_good_qty:e.return_good_qty,
                        note:e.note
                    })
                });
            });
        },
    }
}
</script>