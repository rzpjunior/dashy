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
                            class="no-caps mb4"
                            depressed
                            small
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
                            <v-list-item @click="modelDialogCommit = true" v-if="this.items.status == 1" v-privilege="'we_cnf'">
                                <v-list-item-content>
                                    <v-list-item-title>Confirm</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div v-if="this.items.status == 1">
                                <hr>
                            </div>
                            <v-list-item @click="modelDialog= true" v-if="this.items.status == 1" v-privilege="'we_can'">
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
                    <DetailRowNew :name="'Area'" :value="items.warehouse.area.code+' - '+items.warehouse.area.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Warehouse'" :value="items.warehouse.code+' - '+items.warehouse.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Warehouse Entry Date'" :value="formatDate(items.recognition_date)"/>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <DetailRowNew :name="'Note'" :value="items.note" :align="true"/>
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table">
            Products
            <div class="mt10" style="font-weight: lighter;">
                **Live stock last update at {{timestamp}}
            </div>
        </div>
        <div class="box-body-table">
            <v-data-table
                :mobile-breakpoint="0"
                :headers="table.fields"
                :items="items.waste_entry_items"
                :hide-default-footer="true"
                :items-per-page="-1"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.index + 1 }}</td>
                        <td>{{ props.item.product.code }} - {{ props.item.product.name }}</td>
                        <td>{{ props.item.product.uom.name }}</td>
                        <td>{{ formatPrice(props.item.available_stock) }}</td>
                        <td>{{ formatPrice(props.item.waste_stock) }}</td>
                        <td>{{ formatPrice(props.item.waste_qty) }}</td>
                        <td>{{ props.item.waste_reason_value }}</td>
                        <td>{{ props.item.note }}</td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <AuditLogNew :data="dataAuditLog"/>
        <v-dialog
            v-model="modelDialog"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">Cancellation Note <span class="text-red">*</span></span>
                </v-card-title>
                <v-card-text>
                    <v-textarea
                        name="note"
                        v-model="note.note"
                        :counter="100"
                        outlined
                        maxlength="100"
                        rows="3"
                        :error-messages="error.note"
                        required
                        dense
                    >
                        <template v-slot:label>
                            Note
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
                        @click="cancelWasteEntry()"
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                        :disabled="btnCancel"
                    >Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="modelDialogCommit"
            persistent
            max-width="470px"
        >
            <LoadingBar :value="overlay"/>
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">Confirm Waste Entry</span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">Are you sure to Confirm this Waste Entry?</span>
                    </v-card-text>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="modelDialogCommit = false"
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                    >
                        <span class="text-black80">Cancel</span>
                    </v-btn>
                    <v-btn
                        @click="confirmWasteEntry()"
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                        :disabled="btnConfirm"
                    >Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
export default {
    name: 'WasteEntryDetail',
    data() {
        return {
            id_po : '',
            overlay: false,
            btnConfirm: false,
            overlayCancel: false,
            btnCancel: false,
            items : {
                code: '',
                warehouse : {
                    area : {
                        code: '',
                        name : ''
                    },
                    code: '',
                    name : ''
                },
                note: '',
                waste_entry_items: [{
                    product: {
                        id : '',
                        code: '',
                        name: '',
                        uom : {
                            name: ''
                        },
                    waste_stock: '',
                    waste_qty: '',
                    available_stock: '',
                    note: ''
                    }
                }]
            },
            dataAuditLog : {},
            modelDialog : false,
            modelDialogCommit: false,
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
                        text:'**Stock',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'**Waste Stock',
                        class: 'grey--text text--darken-4',
                        sortable: false
                    },
                    {
                        text:'Quantity',
                        class: 'grey--text text--darken-4',
                        sortable: false
                    },
                    {
                        text:'Waste Reason',
                        class: 'grey--text text--darken-4',
                        sortable: false
                    },
                    {
                        text:'Note',
                        class: 'grey--text text--darken-4',
                        sortable: false
                    }
                ],
            },
            timestamp: ""
        }
    },

    created() {
        this.renderData();
        this.dateTimeNow();
    },
    methods : {
        dateTimeNow(){
            const today = new Date();
            const date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
            const time = today.getHours() + ":" + today.getMinutes()+ ":" + today.getSeconds();
            const dateTime = date +' '+ time;
            this.timestamp = dateTime;
        },
        cancelWasteEntry() {
            this.btnCancel = true
            this.overlayCancel = true
            this.$http.put("/warehouse/waste/entry/cancel/"+this.$route.params.id, this.note).then(response => {
                Vue.$toast.open({
                    position: 'top-right',
                    message: 'Data has been cancelled successfully',
                    type: 'success',
                });
                this.renderData()
                this.modelDialog = false
                this.overlayCancel = false
            }).catch(e => {
                this.error = e.errors
                this.modelDialogCommit = false
                this.overlayCancel = false
            });
        },
        confirmWasteEntry() {
            this.btnConfirm = true
            this.overlay = true
            this.$http.put("/warehouse/waste/entry/confirm/"+this.$route.params.id, {
                warehouse_id : this.items.warehouse.id,
                waste_entry_items: [{
                    product_id : this.items.waste_entry_items[0].product.id,
                    waste_stock : this.items.waste_stock,
                    note : this.items.note
                }]
            }).then(response => {
                Vue.$toast.open({
                    position: 'top-right',
                    message: 'Data has been confirm successfully',
                    type: 'success',
                });
                this.overlay = false
                this.modelDialogCommit = false
                this.renderData()

            }).catch(e => {
                this.overlay = false
                this.error = e.errors
                this.modelDialogCommit = false
            });
        },
        seeHistory() {
            this.dataAuditLog = {
                model : true,
                id: this.$route.params.id,
                type: "waste_entry"
            }
        },
        async renderData(){
            await this.$http.get("/warehouse/waste/entry/"+this.$route.params.id).then(response => {
                this.items = response.data.data
                if(this.items === null){
                    this.items = {}
                }
            });
        },
    }
}
</script>