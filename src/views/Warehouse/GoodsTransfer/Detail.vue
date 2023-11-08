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
                    <v-menu offset-y >
                    <template v-slot:activator="{ on }">
                        <v-btn icon v-on="on">
                            <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                    </template>
                        <v-list class="bg-white">
                            <v-list-item 
                                v-if="this.items.status == 1 || this.items.status == 5" 
                                v-privilege="'gt_upd'" 
                                @click="redirect(items.id, 'update')"
                            >
                                <v-list-item-content>
                                    <v-list-item-title>Update</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-icon>mdi-open-in-new</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                            <div v-if="this.items.status == 1 || this.items.status == 5" >
                                <hr>
                            </div>
                            <v-list-item 
                                v-if="this.items.status == 5" 
                                v-privilege="'gt_cmt'" 
                                @click="redirect(items.id, 'commit')"
                            >
                                <v-list-item-content>
                                    <v-list-item-title>Commit</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-icon>mdi-open-in-new</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                            <div v-if="this.items.status == 5" >
                                <hr>
                            </div>
                            <v-list-item v-if="this.items.status == 1" v-privilege="'gt_can'" @click="modelDialog = true">
                                <v-list-item-content>
                                    <v-list-item-title>Cancel</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div v-if="this.items.status == 1">
                                <hr>
                            </div>
                            <v-list-item @click="downloadPdf(items.id)"  :class="draft || this.items.status == 3 ? 'hidden' : ''">
                                <v-list-item-content>
                                    <v-list-item-title>Print</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div :class="draft ? 'hidden' : ''">
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
                    <DetailRowNew :name="'Request Date'" :value="formatDate(items.request_date)"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24" :class="draft ? 'hidden' : ''">
                    <DetailRowNew :name="'Departure Date'" :value="formatDate(items.recognition_date)"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24" :class="draft ? 'hidden' : ''">
                    <DetailRowNew :name="'Estimated Arrival Time'" :value="items.eta_time"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24" :class="draft ? 'hidden' : ''">
                    <DetailRowNew :name="'Estimated Arrival Date'" :value="formatDate(items.eta_date)"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Area Destination'" :value="items.destination.area.code+' - '+items.destination.area.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Warehouse Destination'" :value="items.destination.code+' - '+items.destination.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24" :class="draft ? 'hidden' : ''">
                    <DetailRowNew :name="'Area Origin'" :value="items.origin.area.code+' - '+items.origin.area.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24" :class="draft ? 'hidden' : ''">
                    <DetailRowNew :name="'Warehouse Origin'" :value="items.origin.code+' - '+items.origin.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Stock Type'" :value="items.stock_type == 2 ? 'Waste Stock' : 'Good Stock'"/>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <DetailRowNew :name="'Warehouse Destination Address'" :value="items.destination.street_address+', '+items.destination.sub_district.concat_address+', '+items.destination.sub_district.postal_code" :align="true"/>
                </v-col>
                <v-col cols="12" class="-mt24" :class="draft ? 'hidden' : ''">
                    <DetailRowNew :name="'Warehouse Origin Address'" :value="items.origin.street_address+', '+items.origin.sub_district.concat_address+', '+items.origin.sub_district.postal_code" :align="true"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24" :class="!finished ? 'hidden' : ''">
                    <DetailRowNew :name="'Actual Arrival Time'" :value="items.ata_time"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24" :class="!finished ? 'hidden' : ''">
                    <DetailRowNew :name="'Actual Arrival Date'" :value="formatDate(items.ata_date)"/>
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
                :headers="items.status ===  5 ? table.fieldsDraft : table.fields"
                :items="items.goods_transfer_item"
                :hide-default-footer="true"
                :items-per-page="-1"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.index + 1 }}</td>
                        <td>{{ props.item.product.code }} - {{ props.item.product.name }}</td>
                        <td>{{ props.item.product.uom.name }}</td>
                        <td>{{ formatPrice(props.item.request_qty) }}</td>
                        <td :class="draft ? 'hidden' : ''">{{ formatPrice(props.item.delivery_qty) }}</td>
                        <td :class="draft ? 'hidden' : ''">{{ formatPrice(props.item.unit_cost) }}</td>
                        <td :class="draft ? 'hidden' : ''">{{ formatPrice(props.item.subtotal) }}</td>
                        <td :class="draft ? 'hidden' : ''">{{ formatPrice(props.item.receive_qty) }}</td>
                        <td>{{ props.item.note }}</td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <div class="box-end" :hidden="draft ? true : false">
            <v-row>
                <v-col>
                    <div class="row" v-if="items.additional_cost_note">
                        <div class="col text-black60">
                            Additional Note :
                        </div>
                        <div class="col d-flex justify-end text-black">
                            {{items.additional_cost_note}}
                        </div>
                    </div>
                    <v-divider class="my-4"/>
                </v-col>
                <div style="width:5%"/>
                <v-col class="text-black60r">
                    <div class="row">
                        <div class="col text-black60">
                            Total :
                        </div>
                        <div class="col d-flex justify-end text-black">
                            {{formatPrice(items.total_cost)}}
                        </div>
                    </div>
                    <div class="row" v-if="items.additional_cost != 0">
                        <div class="col text-black60">
                            Additional Cost :
                        </div>
                        <div class="col d-flex justify-end text-black">
                            {{formatPrice(items.additional_cost)}}
                        </div>
                    </div>
                    <v-divider class="my-4"/>
                    <div class="row fs20 text-black bold -mt10 mb2">
                        <div class="col">
                            Grand Total (Rp) :
                        </div>
                        <div class="col d-flex justify-end">
                            {{formatPrice(items.total_charge)}}
                        </div>
                    </div>
                </v-col>
            </v-row>
        </div>
        <LockDialog :model="updateCheck" :locked_by="locked_by_name" :locked_text="locked_text"/>
        <AuditLogNew :data="dataAuditLog"/>
        <LoadingBar :value="overlay"/>
        <div class="ma12 wp100">
            <v-row>
                <v-col cols="12" md="6">
                    <div class="box-col" v-privilege="'gr_rdd'">
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
                        rows="3"
                        maxlength="100"
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
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                        @click="modelDialog = false"
                    ><span class="text-black80">Cancel</span></v-btn>
                    <v-btn
                        @click="cancelOrder()"
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                        :disabled="cancelDis"
                    >Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
import Vue from 'vue'
export default {
    name: 'DetailGoodsTransfer',
    data() {
        return {
            cancelDis: false,
            id_gt : "",
            items : {
                origin : {
                    street_address : "",
                    name : "",
                    area : {
                        name : ''
                    },
                    sub_district : {
                        concat_address : "",
                        postal_code : "",
                    }
                },
                destination : {
                    street_address : "",
                    name : "",
                    area : {
                        name : ''
                    },
                    sub_district : {
                        concat_address : "",
                        postal_code : "",
                    }
                },
                goods_transfer_item : [],
                status: 1,
            },
            dataAuditLog : {},
            user_role_id: '',
            user_id: '',
            updateCheck: false,
            locked_by_name: '',
            overlay : false,
            ConfirmData : {},
            modelDialog : false,
            note : {
                note : "",
            },
            error : {},
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
                        sortable: false
                    },
                    {
                        text:'UOM',
                        class: 'grey--text text--darken-4',
                        sortable: false
                    },
                    {
                        text:'Request Qty',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Transfer Qty',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Unit Cost',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Subtotal',
                        sortable: false,
                        class: 'grey--text text--darken-4',
                    },
                    {
                        text:'Receive Qty.',
                        sortable: false,
                        class: 'grey--text text--darken-4',
                    },
                    {
                        text:'Note',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                ],
                fieldsDraft: [
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
                        text:'Request Qty',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Note',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                ],
            },
            draft: false,
            finished: false,
            locked_text: '',
        }
    },
    created() {
        this.renderData()
    },
    mounted() {
        let self = this
        this.$root.$on('event_success', function(res){
            if (res) {
                self.user_role_id = this.$store.state.staff.role.id
                self.user_id = this.$store.state.staff.id
                self.renderData()
            }
        });
    },
    methods : {
        downloadPdf(id){
            this.overlay = true
            this.id_gt = id
            this.$http.get("/warehouse/goods/transfer/print/"+this.id_gt)
            .then(response => {
                this.filePdf = response.data.file
                window.open(this.filePdf,'_blank');
                this.overlay = false
            })
        },
        cancelOrder() {
            this.cancelDis = true
            this.overlay = true
            this.$http.put("/warehouse/goods/transfer/cancel/"+this.$route.params.id, this.note).then(response => {
                this.cancelDis = true
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
                type: "goods_transfer"
            }
        },
        renderData(){
            this.$http.get("/warehouse/goods/transfer/"+this.$route.params.id).then(response => {
                let res = response.data.data
                this.items = res
                this.draft = res.status === 5 ? true : false
                this.finished = res.status === 2 ? true : false
            });
        },
        redirect(id, page) {
            this.overlay = true
            if (this.items.locked == 1) {
                if (this.items.locked_by.id == this.user_id) {
                    this.$router.push('/warehouse/goods-transfer/'+page+'/'+id);
                } else {
                    this.overlay = false
                    this.updateCheck = true
                    this.locked_by_name = this.items.locked_by.name
                    this.locked_text = 'Goods Transfer'
                }
            } else {
                if (this.items.goods_receipt.length > 0) {
                    let gr = this.items.goods_receipt
                    let grActiveFound = false
                    gr.map((e) => {
                        if (e.status === 1) {
                            grActiveFound = true
                        }
                    })
                    if (grActiveFound) {
                        this.overlay = false
                        Vue.$toast.open({
                            position: 'top-right',
                            message: "You can't Update, there is a Goods Receipt Active on this Document",
                            type: 'error',
                        });
                    } else {
                        this.$router.push('/warehouse/goods-transfer/'+page+'/'+id);
                    }
                } else {
                    this.$router.push('/warehouse/goods-transfer/'+page+'/'+id);
                }
            }
        },
    }
}
</script>