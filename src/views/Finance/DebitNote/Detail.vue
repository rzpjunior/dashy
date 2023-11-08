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
                            <v-list-item v-if="this.items.status == 1" @click="print(items.id)" v-privilege="'dn_prt'">
                                <v-list-item-content>
                                    <v-list-item-title>Print</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Supplier Return'" :value="items.supplier_return.code" :routePath="'/warehouse/supplier-return/detail/'+items.supplier_return.id"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Warehouse'" :value="items.supplier_return.warehouse.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Return Date'" :value="formatDate(items.supplier_return.recognition_date)"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Supplier Name'" :value="items.supplier_return.supplier.code+' - '+items.supplier_return.supplier.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'GR Number'" :value="items.supplier_return.good_receipt.code" :routePath="'/warehouse/goods-receipt/detail/'+items.supplier_return.good_receipt.id"/>
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
                :items="items.debit_note_items"
                :hide-default-footer="true"
                :items-per-page="-1"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.index + 1 }}</td>
                        <td>{{ props.item.product.code }} - {{ props.item.product.name }}</td>
                        <td>{{ props.item.product.uom.name }}</td>
                        <td>{{ formatPrice(props.item.received_qty) }}</td>
                        <td>{{ formatPrice(props.item.return_qty) }}</td>
                        <td>{{ formatUnitPrice(props.item.unit_price) }}</td>
                        <td>{{ formatPrice(props.item.subtotal) }}</td>
                        <td>{{ props.item.note }}</td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <div class="ma12 wp100">
            <v-row class="d-flex justify-end">
                <v-col cols="12" md="6">
                    <div class="box-col">
                        <div class="row">
                            <div class="col">
                                Total Amount:
                            </div>
                            <div class="col d-flex justify-end text-black">
                                {{formatPrice(items.total_price)}}
                            </div>
                        </div>
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
export default {
    name: 'DetailCreditNote',
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
            total_amount: '',
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
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Return Qty',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Unit Price',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Amount',
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
    computed:{
        countAmount() {
            if(this.items !== null){
                var countAmount = this.cni.reduce((acc, item) => acc + item.subtotal, 0);
                this.total_amount = countAmount
            }else{
                this.total_amount = 'No Data'
            }
            return this.total_amount
        },
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
        print(id) {
            this.overlay = true
            this.$http.get("/finance/debit_note/print/" + id)
                .then(response => {
                    this.filePdf = response.data.file
                    window.open(this.filePdf, '_blank');
                    this.overlay = false
                })
        },
        //render data detail CN
        renderData(){
            this.$http.get("/finance/debit_note/"+this.$route.params.id).then(response => {
                this.items = response.data.data
                this.cni = response.data.data.debit_note_items
                this.countAmount()
            });
        },
    }
}
</script>
