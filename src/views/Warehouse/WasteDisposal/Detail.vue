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
                            <v-list-item v-if="this.items.status == 1" v-privilege="'wd_cnf'" @click="confirm(items.id)">
                                <v-list-item-content>
                                    <v-list-item-title>Confirm</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div v-if="this.items.status == 1">
                                <hr>
                            </div>
                            <v-list-item v-if="this.items.status == 1" v-privilege="'wd_can'" @click="modelDialog = true">
                                <v-list-item-content>
                                    <v-list-item-title>Cancel</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div v-if="this.items.status == 1">
                                <hr>
                            </div>
                            <v-list-item  v-privilege="'wd_prt'" @click="print(items.id)">
                                <v-list-item-content>
                                    <v-list-item-title>Print</v-list-item-title>
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
                    <DetailRowNew :name="'Area'" :value="items.warehouse.area.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Warehouse'" :value="items.warehouse.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Waste Disposal Date'" :value="formatDate(items.recognition_date)"/>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <DetailRowNew :name="'Note'" :value="items.note" :align="true"/>
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table">
            Products
            <div class="mt10" style="font-weight: lighter;">
                **Live stock, last updated at {{this.$moment(new Date).format('DD/MM/YYYY HH:mm:ss')}}
            </div>
        </div>
        <div class="box-body-table">
            <v-data-table
                :mobile-breakpoint="0"
                :headers="table.fields"
                :items="items.waste_disposal_item"
                :hide-default-footer="true"
                :items-per-page="-1"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.index + 1 }}</td>
                        <td>{{ props.item.product.code }} - {{ props.item.product.name }}</td>
                        <td>{{ props.item.product.uom.name }}</td>
                        <td>{{ formatPrice(props.item.stock.waste_stock) }}</td>
                        <td>{{ formatPrice(props.item.dispose_qty) }}</td>
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
                    <span class="text-title-modal">Cancellation Note<span style="color:red"> *</span></span>
                </v-card-title>
                <v-card-text>
                    <v-textarea
                        name="note"
                        v-model="note.cancellation_note"
                        :counter="100"
                        maxlength="100"
                        rows="3"
                        outlined
                        :error-messages="error.cancellation_note"
                        required
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
    data() {
        return {
            id_wd : "",
            overlay: false,
            items : {
                warehouse : {
                    name : "",
                    area : {
                        name : ''
                    }
                },
                waste_disposal_item : []
            },
            dataAuditLog : {},
            ConfirmData : {},
            modelDialog : false,
            note : {
                cancellation_note : "",
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
                        text:'**Waste Stock',
                        class: 'grey--text text--darken-4',
                        width: "12%",
                        sortable: false,
                    },
                    {
                        text:'Quantity',
                        class: 'grey--text text--darken-4',
                        width: "12%",
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
        print(id){
            this.overlay = true
            this.id_wd = id
            this.$http.get("/warehouse/waste/disposal/print/"+this.id_wd)
                .then(response => {
                    this.filePdf = response.data.file
                    window.open(this.filePdf,'_blank');
                    this.overlay = false
                })
        },
        confirm(id) {
            this.ConfirmData = {
                model : true,
                status : true,
                title : "Confirm Waste Disposal",
                text : "Are you sure to confirm this waste disposal?",
                urlApi : '/warehouse/waste/disposal/confirm/'+id,
                data : {}
            }
        },
        cancelOrder() {
            this.overlay = true
            this.$http.put("/warehouse/waste/disposal/cancel/"+this.$route.params.id, this.note).then(response => {
                this.overlay = false
                this.modelDialog = false
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
                type: "waste_disposal"
            }
        },
        renderData(){
            this.$http.get("/warehouse/waste/disposal/"+this.$route.params.id).then(response => {
                this.items = response.data.data
            });
        },
    }
}
</script>