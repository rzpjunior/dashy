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
                    <div v-if="items.status == 2">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            class="no-caps mb4"
                            :color="statusMaster('finished')"
                            >Finished</v-btn
                        >
                    </div>
                    <div v-if="items.status == 3">
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
                            <v-list-item
                                v-if="items.status == 1"
                                @click="confirm(items.id)"
                                v-privilege="'tfs_cnf'"
                            >
                                <v-list-item-content>
                                    <v-list-item-title
                                        >Confirm</v-list-item-title
                                    >
                                </v-list-item-content>
                            </v-list-item>
                            <hr v-if="items.status == 1">
                            <v-list-item
                                v-if="items.status == 1"
                                @click="cancel(items.id)"
                            >
                                <v-list-item-content>
                                    <v-list-item-title
                                        >Cancel</v-list-item-title
                                    >
                                </v-list-item-content>
                            </v-list-item>
                            <hr v-if="items.status == 1">
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
                <v-col v-if="items.goods_receipt && items.purchase_order" cols="12" md="6" class="-mt24">
                    <DetailRowNew
                        :name="'Purchase Order Code'"
                        :value="items.goods_receipt.purchase_order.code"
                        :routePath="
                            '/purchase/order/' +
                            items.goods_receipt.purchase_order.id
                        "
                    />
                </v-col>
                <v-col v-if="items.goods_receipt && items.goods_transfer" cols="12" md="6" class="-mt24">
                    <DetailRowNew
                        :name="'Goods Transfer Code'"
                        :value="items.goods_transfer.code"
                        :routePath="
                            '/goods/transfer/' +
                            items.goods_transfer.id
                        "
                    />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew
                        v-if="items.goods_receipt"
                        :name="'Goods Receipt Code'"
                        :value="items.goods_receipt.code"
                        :routePath="
                            '/warehouse/goods-receipt/detail/' +
                            items.goods_receipt.id
                        "
                    />
                    <DetailRowNew
                        v-else
                        :name="'Goods Receipt Code'"
                        :value="'-'"
                    />
                </v-col>
                <v-col v-if="items.goods_receipt && items.purchase_order" cols="12" md="6" class="-mt24">
                    <DetailRowNew
                        :name="'Supplier Name'"
                        :value="
                            items.goods_receipt.purchase_order.supplier.name
                        "
                    />
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <DetailRowNew :name="'Note'" :value="items.note" />
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table">Products</div>
        <div class="box-body-table">
            <v-data-table
                :mobile-breakpoint="0"
                :headers="table.fields"
                :items="items.transfer_sku_items"
                :hide-default-footer="true"
                :items-per-page="-1"
            >
                <template v-slot:item="props">
                    <tr style="height: 48px">
                        <td>{{ props.index + 1 }}</td>
                        <td>
                            {{ props.item.product.name }} <br />
                            {{ props.item.product.code }}
                        </td>
                        <td>
                            {{ props.item.product.uom.name }}
                        </td>
                        <td>
                            {{
                                items.goods_receipt
                                    ? formatPrice(props.item.po_qty)
                                    : "-"
                            }}
                        </td>
                        <td>
                            {{
                                items.goods_receipt
                                    ? formatPrice(props.item.gr_qty)
                                    : "-"
                            }}
                        </td>
                        <td>
                            {{ props.item.transfer_product.name }}<br />
                            {{ props.item.transfer_product.code }}
                        </td>
                        <td>{{ props.item.transfer_product.uom.name }}</td>
                        <td>{{ formatPrice(props.item.transfer_qty) }}</td>
                        <td>{{ formatPrice(props.item.waste_qty) }}</td>
                        <td>{{ props.item.waste_reason_value }}</td>
                        <td>{{ formatPrice(props.item.discrepancy) }}</td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <AuditLogNew :data="dataAuditLog"/>
        <ConfirmationDialogNew :sendData="ConfirmData" />
        <LoadingBar :value="overlay" />
    </v-container>
</template>
<script>
export default {
    name: "TransferSKUDetail",
    data() {
        return {
            overlay: true,
            items: {
                code: "",
                status: "",
                id: "",
                transfer_sku_items: [],
                warehouse: {
                    area: {
                        name: ''
                    }
                }
            },
            dataAuditLog : {},
            ConfirmData: {},
            table: {
                fields: [
                    {
                        text: "No.",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "Product",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "UOM",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "PO Qty",
                        width: "12%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "GR Qty",
                        width: "12%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "Transfer To",
                        width: "12%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "UOM",
                        width: "12%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "Qty Transfer",
                        width: "12%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "Waste Qty",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "Waste Reason",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "Balance(Kg)",
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
        let self = this;
        this.$root.$on("event_success", function (res) {
            if (res) {
                self.renderData();
            }
        });
    },
    methods: {
        //show history sku item level
        seeHistory() {
            this.dataAuditLog = {
                model : true,
                id: this.$route.params.id,
                type: "transfer_sku"
            }
        },
        // confirm change status active -> finished
        confirm(id) {
            this.ConfirmData = {
                model: true,
                status: true,
                title: "Confirm Transfer SKU",
                text: "Are you sure to confirm this transfer SKU? Stock will be updated",
                urlApi: "warehouse/transfer_sku/confirm/" + id,
                data: {},
            };
        },
        cancel(id) {
            this.ConfirmData = {
                model: true,
                status: true,
                title: "Cancel Transfer SKU",
                text: "Are you sure to cancel this transfer SKU?",
                urlApi: "warehouse/transfer_sku/cancel/" + id,
                data: {},
            };
        },
        // get detail transfer sku by id
        renderData() {
            this.$http
                .get("/warehouse/transfer_sku/" + this.$route.params.id)
                .then((response) => {
                    if (response.data.data) {
                        this.items = response.data.data;
                    }
                })
                .finally(() => {
                    this.overlay = false;
                });
        },
    },
};
</script>
