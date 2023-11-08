<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mb24">
                <v-col class="fs24 bold ">
                    {{items.code}}
                </v-col>
                <v-col class="d-flex justify-end align-end">
                    <div v-if="this.items.status == 1">
                        <v-btn
                            elevation="0"
                            rounded
                            depressed
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
                    <v-menu offset-y >
                        <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list class="bg-white">
                            <v-list-item @click="modelDialogCommit = true" v-if="this.items.status == 1" v-privilege="'st_crt'">
                                <v-list-item-content>
                                    <v-list-item-title>Confirm</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div v-if="this.items.status == 1">
                                <hr>
                            </div>
                            <v-list-item @click="modelDialog= true" v-if="this.items.status == 1" v-privilege="'st_can'">
                                <v-list-item-content>
                                    <v-list-item-title>Cancel</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div v-if="this.items.status == 2">
                                <hr>
                            </div>
                            <v-list-item @click="exportStockOpname" v-if="this.items.status == 2" v-privilege="'st_dl'">
                                <v-list-item-content>
                                    <v-list-item-title>Export</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div>
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
                    <DetailRowNew :name="'Stock Opname Date'" :value="formatDate(items.recognition_date)"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Stock Type'" :value="items.stock_type == 2 ? 'Waste Stock' : 'Good Stock'" />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Area'" :value="items.warehouse.area.code+' - '+items.warehouse.area.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Warehouse'" :value="items.warehouse.code+' - '+items.warehouse.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Category'" :value="items.category.code+' - '+items.category.name"/>
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
                :items="items.stock_opname_items"
                :hide-default-footer="true"
                :items-per-page="-1"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.index + 1 }}</td>
                        <td>{{ props.item.product.code }} - {{ props.item.product.name }}</td>
                        <td>{{ props.item.product.uom.name }}</td>
                        <td>{{ props.item.initial_stock }}</td>
                        <td>{{ props.item.final_stock }}</td>
                        <td>{{ props.item.adjust_qty }}</td>
                        <td>{{ props.item.opname_reason_value }}</td>
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
            <LoadingBar :value="overlay"/>
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
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                        @click="modelDialog = false"
                    >
                        <span class="text-black80">Cancel</span>
                    </v-btn>
                    <v-btn
                        @click="cancelStockOpname()"
                        depressed
                        color="#50ABA3"
                        :disabled="btnCancel"
                        class="main-btn white--text"
                    >Save</v-btn>
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
                    <span class="text-title-modal">Confirm Stock Opname</span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">
                        Are you sure to Confirm this Stock Opname? <br>
                        Stock value will be updated
                    </span>
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
                        <span class="text-black80">Cancel</span>
                    </v-btn>
                    <v-btn
                        @click="confirmStockOpname()"
                        :disabled="btnConfirm"
                        depressed
                        color="#50ABA3"
                        class="main-btn white--text"
                    >Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
export default {
    name: 'StockOpnameDetail',
    data() {
        return {
            id_po : '',
            overlay: false,
            btnConfirm: false,
            overlayCancel: false,
            btnCancel: false,
            items : {
                code: '',

                category: {
                    code: '',
                    name: ''
                },
                warehouse : {
                    area : {
                        code: '',
                        name : ''
                    },
                    code: '',
                    name : ''
                },
                note: '',
                stock_opname_items: []
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
                        text:'Initial Stock',
                        class: 'grey--text text--darken-4',
                        sortable: false,
                    },
                    {
                        text:'Final Stock',
                        class: 'grey--text text--darken-4',
                        sortable: false
                    },
                    {
                        text:'Adjustment Qty',
                        class: 'grey--text text--darken-4',
                        sortable: false
                    },
                    {
                        text:'Opname Reason',
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
        }
    },
    created() {
        this.renderData();
    },
    methods : {
        exportStockOpname() {
                const today = new Date();
                const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                const dateTime = date;
                this.$http.get("warehouse/stock_opname/download/form/"+this.items.id
                ).then(response => {
                    axios({
                        url: response.data.data,
                        method: 'GET',
                        responseType: 'blob',
                    }).then((responses) => {
                        var fileURL = window.URL.createObjectURL(new Blob([responses.data]));
                        var fileLink = document.createElement('a');

                        fileLink.href = fileURL;
                        fileLink.setAttribute('download', 'ExportStockOpname_'+ dateTime +'.xlsx');
                        document.body.appendChild(fileLink);

                        fileLink.click();
                    });
                    }).catch((err) => {
                        return Promise.reject({ Error: 'something went wrong', err});
                    });
            },
        cancelStockOpname() {
            this.btnCancel = true
            this.overlayCancel = true
            this.$http.put("/warehouse/stock_opname/cancel/"+this.$route.params.id, this.note).then(response => {
                Vue.$toast.open({
                    position: 'top-right',
                    message: 'Data has been cancelled successfully',
                    type: 'success',
                });
                this.renderData()
                this.modelDialog = false
                this.overlayCancel = false
                this.btnCancel = false
            }).catch(e => {
                this.error = e.errors
                this.modelDialogCommit = false
                this.overlayCancel = false
                this.btnCancel = false
            });
        },
        confirmStockOpname() {
            this.btnConfirm = true
            this.overlay = true
            this.$http.put("/warehouse/stock_opname/confirm/"+this.$route.params.id, {}).then(response => {
                Vue.$toast.open({
                    position: 'top-right',
                    message: 'Data has been confirm successfully',
                    type: 'success',
                });
                this.renderData()
                this.modelDialogCommit = false
                this.overlay = false
                this.btnConfirm = true
            }).catch(e => {
                this.error = e.errors
                this.modelDialogCommit = false
                this.overlay = false
                this.btnConfirm = true
            });
        },
        seeHistory() {
            this.dataAuditLog = {
                model : true,
                id: this.$route.params.id,
                type: "stock_opname"
            }
        },
        async renderData(){
            await this.$http.get("/warehouse/stock_opname/"+this.$route.params.id).then(response => {
                this.items = response.data.data
                if(this.items === null){
                    this.items = {}
                }
            });
        },
    }
}
</script>