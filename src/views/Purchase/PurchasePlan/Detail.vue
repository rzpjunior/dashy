<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mb24">
                <v-col class="fs24 bold">
                    {{ items.code }}
                </v-col>
                <v-col class="d-flex justify-end align-end">
                    <div v-if="items.status == 1">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            depressed
                            class="no-caps mb4"
                            :color="statusMaster('active')"
                            >Active</v-btn
                        >
                    </div>
                    <div v-else-if="items.status == 2">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            class="no-caps mb4"
                            :color="statusMaster('finished')"
                            >Finished</v-btn
                        >
                    </div>
                    <div v-else>
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            class="no-caps mb4"
                            :color="statusMaster('cancelled')"
                            >Cancelled</v-btn
                        >
                    </div>
                    <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list class="bg-white">
                            <v-list-item v-if="items.status === 1" :to="`/purchase/plan/update/${items.id}`" v-privilege="'ppl_upd'">
                                <v-list-item-content>
                                    <v-list-item-title>Update</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-icon>mdi-open-in-new</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                            <div v-if="items.status == 1 && items.total_purchase_qty <= 0">
                                <hr>
                            </div>
                            <v-list-item v-if="items.status === 1 && items.total_purchase_qty <= 0" @click="modelDialog= true" v-privilege="'ppl_can'">
                                <v-list-item-content>
                                    <v-list-item-title>Cancel</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <div v-if="items.status == 1">
                                <hr>
                            </div>
                            <v-list-item v-if="items.status === 1" @click="confirm(items.id)" v-privilege="'ppl_cnf'">
                                <v-list-item-content>
                                    <v-list-item-title>Confirm</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew
                        :name="'Supplier Organization'"
                        :value="items.supplier_organization.name"
                    />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew
                        :name="'Area'"
                        :value="items.warehouse.area.name"
                    />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew
                        :name="'Warehouse'"
                        :value="items.warehouse.name"
                    />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew
                        :name="'Purchase Plan Date'"
                        :value="formatDate(items.recognition_date)"
                    />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew
                        :name="'Estimated Arrival Date'"
                        :value="formatDate(items.eta_date)"
                    />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew
                        :name="'Estimated Arrival Time'"
                        :value="items.eta_time"
                    />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew
                        v-if="items.assigned_to"
                        :name="'Field Purchaser'"
                        :value="items.assigned_to.name"
                    />
                    <DetailRowNew
                        v-else
                        :name="'Field Purchaser'"
                        :value="'-'"
                    />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew
                        :name="'Completion Progress'"
                        :progress="true"
                        :value="completionProgress"
                    />
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <DetailRowNew :name="'Note'" :value="items.note" :align="true" />
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table">Products</div>
        <div class="box-body-table">
            <v-data-table
                :mobile-breakpoint="0"
                :headers="table.fields"
                :items="items.purchase_plan_items"
                :hide-default-footer="true"
                :items-per-page="-1"
            >
                <template v-slot:item="props">
                    <tr style="height: 48px" @click="props.item.purchase_order_items.length > 0 ? props.expand(!props.isExpanded) : ''">
                        <td> {{ props.index + 1 }} </td>
                        <td> {{ props.item.product.name }} <br /> {{ props.item.product.code }}</td>
                        <td> {{ props.item.product.uom.name }} </td>
                        <td> {{ formatPrice(props.item.order_qty) }} </td>
                        <td> {{ formatPrice(props.item.unit_price) }} </td>
                        <td> {{ formatPrice(props.item.purchase_qty) }} </td>
                        <td> {{ formatPrice(props.item.subtotal) }} </td>
                        <td> {{ formatPrice(toPercentage(props.item)) + ' %' }} </td>
                        <td> <v-btn icon v-show="props.item.purchase_order_items.length > 0"><v-icon small>{{props.isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'}} </v-icon></v-btn> </td>
                    </tr>
                </template>
                <template v-slot:expanded-item="{ item }">
                    <tr style="height: 48px" v-show="item.purchase_order_items.length > 0">
                        <td />
                        <td> <div class="bold">Purchase Order</div> </td>
                        <td colspan="2"> <div class="bold">Supplier</div> </td>
                        <td />
                        <td> <div class="bold">Purchase Qty</div> </td>
                        <td> <div class="bold">Status</div> </td>
                        <td colspan="2" />
                    </tr>
                    <tr style="height: 48px" v-for="(data, index) in item.purchase_order_items" :key="data.id + index">
                        <td />
                        <td> <div> <a :href="$router.resolve({path: '/purchase/order/' + data.purchase_order.id}).href" class="routerLink linkReload"> {{ data.purchase_order.code }} </a> </div> </td>
                        <td colspan="2"> <div> {{ data.purchase_order.supplier.name }} </div> </td>
                        <td />
                        <td> <div> {{ formatPrice(data.purchase_qty) }} </div> </td>
                        <td> 
                            <div v-if="data.purchase_order.status == 1">
                                <v-btn
                                    elevation="0"
                                    rounded
                                    small
                                    class="no-caps mb4"
                                    :color="statusMaster('active')"
                                >Active</v-btn>
                            </div>
                            <div v-else-if="data.purchase_order.status == 2">
                                <v-btn
                                    elevation="0"
                                    rounded
                                    small
                                    class="no-caps mb4"
                                    :color="statusMaster('finished')"
                                >Finished</v-btn>
                            </div>
                            <div v-else-if="data.purchase_order.status == 3">
                                <v-btn
                                    elevation="0"
                                    rounded
                                    small
                                    class="no-caps mb4"
                                    :color="statusMaster('cancelled')"
                                >Cancelled</v-btn>
                            </div>
                            <div v-else-if="data.purchase_order.status == 5">
                                <v-btn
                                    elevation="0"
                                    rounded
                                    small
                                    class="no-caps mb4"
                                    :color="statusMaster('draft')"
                                >Draft</v-btn>
                            </div>
                        </td>
                        <td colspan="2" />
                    </tr>
                </template>
            </v-data-table>
        </div>
        <div class="box-end">
            <v-row >
                <v-col class="text-black60" cols="12" md="6">
                </v-col>
                <v-col class="text-black60" cols="12" md="6">
                    <div class="row fs20 text-black bold -mt10 mb2">
                        <div class="col">
                            Grand Total (Rp):
                        </div>
                        <div class="col d-flex justify-end">
                            {{formatPrice(items.total_price)}}
                        </div>
                    </div>
                </v-col>
            </v-row>
        </div>
        <LoadingBar :value="overlay" />
        <ConfirmationDialogNew :sendData="ConfirmData" />
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
                        v-model="note"
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
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                        @click="cancelPurchasePlan()"
                    >Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
import Vue from 'vue'
export default {
    name: "PurchasePlanDetail",
    data() {
        return {
            expanded: [],
            overlay: true,
            items: {
                code: "",
                status: "",
                id: "",
                purchase_plan_items: [],
                supplier_organization: {
                    name: "",
                },
                warehouse: {
                    name: "",
                    area: {
                        name: "",
                    }
                },
                recognition_date: "",
                eta_date: "",
                assigned_to: {
                    name: "",
                },
                total_purchase_qty: 0,
                total_purchase_plan_qty: 0,
                total_price: "",
            },
            note: "",
            modelDialog: false,
            error : {},
            ConfirmData: {},
            table: {
                fields: [
                    {
                        text: "No.",
                        width: "5%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "Product",
                        width: "20%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "UOM",
                        width: "10%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "Purchase Plan Qty",
                        width: "10%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "Unit Price",
                        width: "15%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "Purchase Qty",
                        width: "10%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "Subtotal",
                        width: "15%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "Purchase Percentage",
                        width: "10%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "",
                        width: "5%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                ],
            },
        };
    },
    created() {
        this.renderData();
    },
    mounted() {
        let self = this
        this.$root.$on('event_success', function(res){
            if (res) {
                self.renderData()
            }
        });
    },
    methods: {
        // convert to percentage
        toPercentage(data) {
            return Number(data.purchase_qty) / Number(data.order_qty) * 100
        },
        // get detail purchase plan by id
        renderData() {
            this.$http.get("/purchase/plan/" + this.$route.params.id).then((response) => {
                const data = response.data.data
                if (data) {
                    this.items = {
                        ...data,
                        purchase_plan_items : data.purchase_plan_items ? data.purchase_plan_items.map((item) => {
                            return {
                                ...item,
                                purchase_order_items: item.purchase_order_items.sort((a,b) => a.purchase_qty > b.purchase_qty ? 1 : -1)
                            }
                        }).sort((a,b)=> this.toPercentage(a) > this.toPercentage(b) ? 1 : -1) : []
                    }
                }
            }).finally(() => {
                this.overlay = false;
            });
        },
        // cancel purchase plan
        cancelPurchasePlan() {
            this.overlay = true
            this.$http.put("/purchase/plan/cancel/"+this.$route.params.id, {note: this.note}).then(response => {
                Vue.$toast.open({
                    position: 'top-right',
                    message: 'Data has been cancelled successfully',
                    type: 'success',
                });
                this.renderData()
                this.modelDialog = false
                this.overlay = false
            }).catch(e => {
                this.error = e.errors
            })
        },
        // confirm purchase plan
        confirm(id) {
            this.ConfirmData = {
                model: true,
                status: true,
                title: "Confirm Purchase Plan",
                text: "Are you sure to confirm this Purchase Plan ?",
                urlApi: "/purchase/plan/confirm/" + id,
                data: {},
            };
        },
    },
    computed: {
        completionProgress(){
            return Number(this.items.total_purchase_qty) / Number(this.items.total_purchase_plan_qty) * 100
        }
    }
};
</script>