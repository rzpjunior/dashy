<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mb24">
                <v-col class="fs24 bold">
                    {{deliveryReturnDetail.code}}
                </v-col>
                <v-col class="d-flex justify-end align-end">
                    <v-btn
                        v-if="deliveryReturnDetail.status == 1"
                        elevation="0"
                        rounded
                        class="no-caps mb4"
                        :color="statusMaster('active')"
                        depressed
                        small
                        >
                        Active
                    </v-btn>
                    <v-btn
                        v-if="deliveryReturnDetail.status == 2"
                        elevation="0"
                        rounded
                        class="no-caps mb4"
                        :color="statusMaster('finished')"
                        small
                        >
                        Finished
                    </v-btn>
                    <v-btn
                        v-if="deliveryReturnDetail.status == 3"
                        elevation="0"
                        rounded
                        class="no-caps mb4"
                        :color="statusMaster('cancelled')"
                        small
                        >
                        Cancelled
                    </v-btn>
                    <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list v-if="deliveryReturnDetail.status === 1" class="bg-white">
                            <v-list-item v-privilege="'dr_upd'"  :to="{ name: 'DeliveryReturnUpdate', params: { id: deliveryReturnDetail.id } }">
                                <v-list-item-content>
                                    <v-list-item-title>Update</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-icon>mdi-open-in-new</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                            <div>
                                <hr/>
                            </div>
                            <v-list-item @click="changeStatus(deliveryReturnDetail.id)" v-privilege="'dr_can'">
                                <v-list-item-content>
                                    <v-list-item-title>Cancel</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div>
                                <hr/>
                            </div>
                            <v-list-item @click="confirmDeliveryReturn(deliveryReturnDetail.id)" v-privilege="'dr_cnf'">
                                <v-list-item-content>
                                    <v-list-item-title>Confirm</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div>
                                <hr/>
                            </div>
                            <v-list-item @click="seeHistory(deliveryReturnDetail.id)">
                                <v-list-item-content>
                                    <v-list-item-title>See History</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                        <v-list v-else class="bg-white">
                            <v-list-item @click="seeHistory(deliveryReturnDetail.id)">
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
                    <DetailRowNew :name="'Delivery Return Date'" :value="formatDate(deliveryReturnDetail.recognition_date)"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Area'" :value="deliveryReturnDetail.warehouse.area.code+' - '+deliveryReturnDetail.warehouse.area.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Warehouse'" :value="deliveryReturnDetail.warehouse.code+' - '+deliveryReturnDetail.warehouse.name"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Delivery Order Code'" :value="deliveryReturnDetail.delivery_order.code" :routePath="'/warehouse/delivery-order/detail/'+deliveryReturnDetail.delivery_order.id"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew :name="'Order Type'" :value="deliveryReturnDetail.delivery_order.sales_order.order_type.name"/>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <DetailRowNew :name="'Note'" :value="deliveryReturnDetail.note" :align="true"/>
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
                :items="items"
                :hide-default-footer="true"
                :items-per-page="items.length"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>{{ props.index + 1 }}</td>
                        <td>{{ props.item.product.code }} - {{ props.item.product.name }}</td>
                        <td>{{ props.item.product.uom.name }}</td>
                        <td>
                            <span v-if="props.item.delivery_order_item.deliver_qty">{{ formatPrice(props.item.delivery_order_item.deliver_qty) }}</span>
                            <span v-else>0,00</span>
                        </td>
                        <td>
                            <span v-if="props.item.delivery_order_item.receive_qty">{{ formatPrice(props.item.delivery_order_item.receive_qty) }}</span>
                            <span v-else>0,00</span>
                        </td>
                        <td>
                            <span v-if="props.item.return_good_qty">{{ formatPrice(props.item.return_good_qty) }}</span>
                            <span v-else>0,00</span>
                        </td>
                        <td>
                            <span v-if="props.item.return_waste_qty">{{ formatPrice(props.item.return_waste_qty) }}</span>
                            <span v-else>0,00</span>
                        </td>
                        <td>{{ props.item.return_waste_reason_value }}</td>
                        <td>{{ props.item.note }}</td>
                    </tr>
                </template>
            </v-data-table>
        </div>
    <ConfirmationDialogNew :sendData="ConfirmData"/>
    <AuditLogNew :data="dataAuditLog"/>
    </v-container>
</template>

<script>
    export default {
        name: "deliveryReturnDetail",
        data() {
            return {
                dialog: false,
                loading: false,
                table: {
                    fields: [
                        {
                            text:'No.',
                            width: "3%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Product',
                            width: "25%",
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'UOM',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Deliver Qty',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Receive Qty',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Return Goods Stock Qty',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Return Waste Stock Qty',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Return Waste Reason',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Note',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                    ],
                },
                items: [
                    {
                        status : '',
                        product : {
                            code : '',
                            name : '',
                            uom : {
                                name : '',
                            }
                        },
                        delivery_order_item : {
                            deliver_qty : '',
                        }
                    }
                ],
                form : {},
                ConfirmData : {},
                dataAuditLog : {},
                deliveryReturnDetail:{
                    code : '',
                    warehouse : {
                        code : '',
                        name : '',
                        area : {
                            code : '',
                            name : '',
                        },
                    },
                    delivery_order : {
                        code : '',
                        sales_order: {
                            order_type: {
                                name: ''
                            }
                        }
                    }
                },
                error:{},
                loading:true,
                note : '',
            }
        },
        computed: {
            staff () {
                return this.$store.getters.getStaff
            }
        },
        methods:{
            async renderData(){
                this.loading=true
                    await this.$http.get("/warehouse/delivery_return/"+this.$route.params.id)
                    .then(response => {
                        this.deliveryReturnDetail = response.data.data
                        this.items = response.data.data.delivery_return_item
                        this.loading = false
                    });
            },
            confirmDeliveryReturn(id) {
                this.ConfirmData = {
                    model : true,
                    status : true,
                    statusMsg : "Success to confirm this delivery return",
                    title : "Confirm Delivery Return",
                    text : "Are you sure want to confirm this delivery return?",
                    urlApi : "/warehouse/delivery_return/confirm/"+id,
                    data : {}
                }
            },
            changeStatus(id) {
                this.ConfirmData = {
                    model : true,
                    status : true,
                    statusMsg : "Success to Cancel this delivery return",
                    title : "Cancellation Note",
                    urlApi : "/warehouse/delivery_return/cancel/"+id,
                    cancelNote : "Note",
                    data : {}
                }
            },
            seeHistory(id) {
                this.dataAuditLog = {
                    model : true,
                    id: id,
                    type: "delivery_return"
                }
            },
        },
        created() {
            this.renderData()
        },
        mounted () {
            let self = this
            this.$root.$on('event_success', function(res){
                if (res) {
                    window.location.reload();
                }
            });
            this.$root.$on('event_error', function(err){
                self.error = err
            });
        },
    }
</script>
