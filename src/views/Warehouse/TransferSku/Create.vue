<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <SelectWarehouse
                        disabled
                        name="warehouse"
                        :warehouse="warehouse"
                        :aux_data="2"
                        :dense="true"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <v-textarea
                        name="note"
                        v-model="note"
                        :counter="350"
                        outlined
                        :error-messages="error.note"
                        required
                        dense
                    >
                        <template v-slot:label> Note </template>
                    </v-textarea>
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table">Transfer Product</div>
        <div class="box-body-table">
            <v-data-table
                :headers="table.fields"
                :items="products"
                :hide-default-footer="true"
                :items-per-page="-1"
                mobile-breakpoint="0"
            >
                <template v-slot:item="props">
                    <tr class="h48">
                        <td>
                            <div class="flex-align-start full-height mt16">
                                <SelectProductTable
                                    :name="`product_${props.index}`"
                                    @click.native="setProductIdx(props.index)"
                                    @selected="productSelected"
                                    :refs="`${props.index + 1}-${refs},${
                                        products.length
                                    }`"
                                    :update="update"
                                    :isCompletedProduct="true"
                                    :warehouse="user.warehouse.id"
                                    :error="error.products_0_id"
                                ></SelectProductTable>
                            </div>
                        </td>
                        <td>
                            <div class="flex-align-start full-height mt16">
                                {{ props.item.uom || "-" }}
                            </div>
                        </td>
                        <td>
                            <div class="flex-align-start full-height mt16">
                                {{
                                    props.item.available_qty.toString().length >
                                    0
                                        ? props.item.available_qty
                                        : "-"
                                }}
                            </div>
                        </td>
                        <td>
                            <div class="flex-row-between">
                                <vue-numeric
                                    name="total_transfer"
                                    separator=","
                                    class="productNumeric w200"
                                    :precision="products[props.index].transfers[0].decimal_enabled == 2 ? 0 : 2"
                                    placeholder="Total Transfer"
                                    @click.native="setProductChildIdx(props.index, 0)"
                                    v-model="products[props.index].total_transfer_qty"
                                    :disabled="Number(props.item.available_qty) <= 0"
                                    :minus="false"
                                ></vue-numeric>
                                <div class="px16">
                                    <vue-numeric
                                        name="waste_qty"
                                        separator=","
                                        class="productNumeric w200"
                                        :precision="products[props.index].transfers[0].decimal_enabled == 2 ? 0 : 2"
                                        placeholder="Waste Qty"
                                        @click.native="setProductChildIdx(props.index, 0)"
                                        v-model="products[props.index].transfers[0].waste_qty"
                                        :disabled="Number(props.item.available_qty) <= 0"
                                        :minus="false"
                                    ></vue-numeric>
                                </div>
                                <div class="px16 mt10">
                                    <SelectGlossary
                                        v-if="products[props.index].transfers[0].waste_qty > 0"
                                        v-model="products[props.index].transfers[0].waste_reason"
                                        outlined
                                        :dense="true"
                                        :norequired="true"
                                        label="Waste Reason"
                                        @selected="wasteReasonSelected"
                                        table="all"
                                        attribute="waste_reason"
                                        class="rounded-form-sm"
                                        :error="error.waste_reason_id0"
                                    >
                                    </SelectGlossary>
                                </div>
                                <div>
                                    <div>Balance(Kg)</div>
                                    <br />
                                    <div class="-mt16">
                                        <span v-html="checkDiscrepancy(props.index)"></span>
                                        <v-tooltip right>
                                            <template v-slot:activator="{ on: tooltip }">
                                                <v-icon
                                                    v-on="{ ...tooltip }"
                                                    right
                                                    class="-mt5 ml30"
                                                    :color="iconColor"
                                                >
                                                    mdi-information-outline
                                                </v-icon>
                                            </template>
                                            <span>
                                                If There is any balance left, please transfer to the Origin Product
                                            </span>
                                        </v-tooltip>
                                    </div>
                                </div>
                            </div>
                            <div class="pb16">
                                <v-data-table
                                    :headers="table.transfers"
                                    :items="products[props.index].transfers.slice(1,products[props.index].transfers.length)"
                                    :hide-default-footer="true"
                                    :items-per-page="-1"
                                    mobile-breakpoint="0"
                                >
                                    <template v-slot:item="data">
                                        <tr class="h48">
                                            <td>
                                                <SelectProductTable
                                                    :name="`product_${props.index}_${data.index}`"
                                                    @click.native="setProductChildIdx(props.index,data.index + 1)"
                                                    @selected="productChildSelected"
                                                    :refs="`${
                                                        data.index + 1
                                                    }-${refs},${
                                                        products[props.index]
                                                            .transfers.length
                                                    }`"
                                                    :update="update"
                                                    :isCompletedProduct="true"
                                                    :disabled="Number(props.item.available_qty) <= 0"
                                                    :warehouse="user.warehouse.id"
                                                    :category="category_id"
                                                    :product_id="prd_id"
                                                ></SelectProductTable>
                                            </td>
                                            <td>
                                                <div>
                                                    <vue-numeric
                                                        name="transfer_to"
                                                        separator=","
                                                        class="productNumeric"
                                                        placeholder="Transfer Qty"
                                                        @click.native="setProductChildIdx(props.index,data.index + 1)"
                                                        :precision="data.item.decimal_enabled == 2 ? 0 : 2"
                                                        v-model="products[props.index].transfers[data.index + 1].transfer_qty"
                                                        :disabled="Number(props.item.available_qty) <= 0 || products[props.index].transfers[data.index + 1].id === ''"
                                                        :minus="false"
                                                    ></vue-numeric>
                                                </div>
                                            </td>
                                            <td class="center">
                                                {{
                                                    products[props.index]
                                                        .transfers[
                                                        data.index + 1
                                                    ].uom || "-"
                                                }}
                                            </td>
                                            <td>
                                                <div class="d-flex justify-end">
                                                    <div v-if="data.index + 2 === products[props.index].transfers.length">
                                                        <v-btn
                                                            icon
                                                            :name="`addchildproduct_${data.index}`"
                                                            @click="addChildProduct(props.index)"
                                                        >
                                                            <img
                                                                src="/icon/plus.png"
                                                                height="22px"
                                                                width="22px"
                                                            />
                                                        </v-btn>
                                                    </div>
                                                    <div v-if="products[props.index].transfers.length > 2">
                                                        <v-btn
                                                            icon
                                                            :name="`removechildproduct_${data.index}`"
                                                            @click="removeChildProduct(props.index,data.index + 1)"
                                                        >
                                                            <img
                                                                src="/icon/close-new.png"
                                                                height="20px"
                                                                width="20px"
                                                            />
                                                        </v-btn>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </template>
                                </v-data-table>
                            </div>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
        <div class="box">
            <v-row>
                <v-col>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            @click="$router.go(-1)"
                            depressed
                            outlined
                            color="#EBEBEB"
                            class="main-btn"
                            v-privilege="'tfs_rdl'"
                        >
                            <span class="text-black80">Cancel</span>
                        </v-btn>
                        <v-btn
                            depressed
                            color="#50ABA3"
                            class="main-btn white--text"
                            @click="confirmButton()"
                            v-privilege="'tfs_crt'"
                            :disabled="checkTransferSKUSave"
                        >
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData" />
    </v-container>
</template>

<script>
import Vue from "vue";
export default {
    name: "TransferSku",
    data() {
        return {
            items: {
                warehouse: {
                    area: {
                        name: "",
                    },
                    name: "",
                },
                purchase_order: {
                    code: "",
                    id: "",
                    supplier: {
                        name: "",
                    },
                },
                code: "",
                id: "",
            },
            products: [
                {
                    name: "",
                    product_id: "",
                    uom: "",
                    available_qty: 0,
                    available_weight: 0,
                    unit_weight: 0,
                    total_transfer_qty: 0,
                    transfers: [
                        {
                            name: "",
                            id: "",
                            transfer_qty: 0,
                            waste_qty: 0,
                            waste_reason: "",
                            unit_weight: 0,
                            code: "",
                            uom: "",
                            decimal_enabled: "",
                        },
                        {
                            name: "",
                            id: "",
                            transfer_qty: 0,
                            waste_qty: 0,
                            waste_reason: "",
                            unit_weight: 0,
                            code: "",
                            uom: "",
                            decimal_enabled: "",
                        },
                    ],
                },
            ],
            update: false,
            productIdx: "",
            productChildIdx: "",
            refs: "",
            error: {},
            ConfirmData: {},
            warehouse: "",
            note: "",
            category_id: "",
            total_discrepancy: 0,
            prd_id: "",
            userName: "",
            userCode: "",
            wasteReason: [],
            iconColor: '',
            table: {
                fields: [
                    {
                        text: "Product",
                        width: "25%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "UOM",
                        width: "5%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "Available Qty",
                        width: "5%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "Transfer Qty / Waste Qty / Waste Reason / Balance",
                        width: "70%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                ],
                transfers: [
                    {
                        text: "To Product",
                        width: "40%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "Quantity",
                        width: "30%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "UOM",
                        width: "30%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                ],
            },
        };
    },
    mounted() {
        let self = this;
        self.getWarehouse();
        this.$root.$on("event_error", function (err) {
            self.error = err;
        });
    },
    computed: {
        // get global state user
        user() {
            return this.$store.getters.getStaff;
        },
        // disable button transfer to
        disable() {
            return (
                this.products[0].total_transfer_qty === "" &&
                this.products[0].transfers[0].waste_qty === ""
            );
        },
        // disable button create transfer sku
        validateTransferTo() {
            return this.products[0].transfers
                .slice(1, this.products[0].transfers.length)
                .findIndex(
                    (data) => data.transfer_qty === "" && data.id !== ""
                );
        },
        checkTransferSKUSave() {
            if (this.total_discrepancy != 0 ) {
                return true
            }
            return false
        },
    },
    methods: {
        // get warehouse id
        getWarehouse() {
            this.$http.get("/user/staff/" + this.user.id).then((response) => {
                if (response.data.data) {
                    this.warehouse = response.data.data.warehouse;
                    this.userName = response.data.data.name
                    this.userCode = response.data.data.code
                }
            });
        },
        //to count discrepancy between qty transfer and unit weight also waste qty if there is any
        checkDiscrepancy(index){
            let weight_parent = 0
            let weight_child = 0
            let weight_waste = 0
            let total = 0
            for (let i = 0; i < this.products[index].transfers.length; i++) {
                weight_child += parseFloat(+this.products[index].transfers[i].transfer_qty) * parseFloat(this.products[index].transfers[i].unit_weight)
                weight_waste = parseFloat(this.products[index].transfers[0].waste_qty) * parseFloat(this.products[index].unit_weight)
            }
            weight_parent = parseFloat(this.products[index].total_transfer_qty) * parseFloat(this.products[index].unit_weight)
            total = parseFloat(this.products[index].available_weight) - weight_parent - weight_child - weight_waste
            this.total_discrepancy = Math.abs(total.toFixed(2))
            if (isNaN(total)) {
                total = 0
            }
            if(total.toFixed(2) < 0) return this.iconColor = 'red', `<span style="color:red; font-weight: 700;">${total.toFixed(2)}</span>`
            if(total.toFixed(2) > 0) return this.iconColor = 'red', `<span style="color: #ffaf00; font-weight: 700;">${total.toFixed(2)}</span>`
            return this.iconColor = 'green', `<span style="color:green; font-weight: 700;">${Math.abs(total.toFixed(2))}</span>`
        },
        // untuk mengambil index product yang dipilih
        setProductIdx(idx) {
            this.productIdx = idx;
        },
        // untuk mengambil index product & index product transfer to yang dipilih
        setProductChildIdx(index, childIndex) {
            this.productChildIdx = childIndex;
            this.productIdx = index;
        },
        // untuk set state product yang dipilih
        productSelected(d) {
            this.category_id = ''
            this.prd_id = ''
            this.products[this.productIdx].name = "";
            this.products[this.productIdx].product_id = "";
            this.products[this.productIdx].uom = "";
            this.products[this.productIdx].available_qty = 0;
            this.products[this.productIdx].available_weight = 0;
            this.products[this.productIdx].unit_weight = 0;
            this.products[this.productIdx].total_transfer_qty = 0;
            this.products[this.productIdx].transfers = [
                {
                    name: "",
                    id: "",
                    transfer_qty: 0,
                    waste_qty: 0,
                    waste_reason: "",
                    unit_weight: 0,
                    code: "",
                    uom: "",
                    decimal_enabled: "",
                },
                {
                    name: "",
                    id: "",
                    transfer_qty: 0,
                    waste_qty: 0,
                    unit_weight: 0,
                    waste_reason: "",
                    code: "",
                    uom: "",
                    decimal_enabled: "",
                },
            ];
            if (d) {
                this.category_id = d.product.category.id
                this.prd_id = d.product.id
                this.products[this.productIdx].name = d.product.name;
                this.products[this.productIdx].product_id = d.product.id;
                this.products[this.productIdx].uom = d.product.uom.name;
                this.products[this.productIdx].unit_weight = d.product.unit_weight;
                this.products[this.productIdx].available_weight =
                    d.available_stock * d.product.unit_weight;
                this.products[this.productIdx].available_qty =
                    d.available_stock;
                this.products[this.productIdx].transfers[0].id = d.product.id;
                this.products[this.productIdx].transfers[0].name =
                    d.product.name;
                this.products[this.productIdx].transfers[0].code =
                    d.product.code;
                this.products[this.productIdx].transfers[0].uom =
                    d.product.uom.name;
                this.products[this.productIdx].transfers[0].unit_weight =
                    d.product.unit_weight;
                this.products[this.productIdx].transfers[0].decimal_enabled =
                    d.product.uom.decimal_enabled;
            }
        },
        // untuk set state product transfer to yang dipilih
        productChildSelected(d) {
            this.products[this.productIdx].transfers[
                this.productChildIdx
            ].name = "";
            this.products[this.productIdx].transfers[this.productChildIdx].id =
                "";
            this.products[this.productIdx].transfers[
                this.productChildIdx
            ].transfer_qty = "";
            this.products[this.productIdx].transfers[
                this.productChildIdx
            ].waste_qty = "";
            this.products[this.productIdx].transfers[
                this.productChildIdx
            ].code = "";
            this.products[this.productIdx].transfers[this.productChildIdx].uom =
                "";
            this.products[this.productIdx].transfers[
                this.productChildIdx
            ].unit_weight = "";
            this.products[this.productIdx].transfers[
                this.productChildIdx
            ].decimal_enabled = "";

            if (d) {
                this.products[this.productIdx].transfers[
                    this.productChildIdx
                ].name = d.product.name;
                this.products[this.productIdx].transfers[
                    this.productChildIdx
                ].id = d.product.id;
                this.products[this.productIdx].transfers[
                    this.productChildIdx
                ].code = d.product.code;
                this.products[this.productIdx].transfers[
                    this.productChildIdx
                ].uom = d.product.uom.name;
                this.products[this.productIdx].transfers[
                    this.productChildIdx
                ].unit_weight = d.product.unit_weight;
                this.products[this.productIdx].transfers[
                    this.productChildIdx
                ].decimal_enabled = d.product.uom.decimal_enabled;
            }
        },
        // untuk menambahkan row product transfer to
        addChildProduct(index) {
            this.update = false;
            this.products[index].transfers.push({
                name: "",
                id: "",
                transfer_qty: 0,
                waste_qty: 0,
                waste_reason: "",
                unit_weight: 0,
                code: "",
            });
            this.refs = false;
            Vue.nextTick(() => {
                this.refs = true;
                this.setProductChildIdx(
                    this.products.length - 1,
                    this.products[index].transfers.length - 1
                );
            });
        },
        // untuk menghapus row product transfer to
        removeChildProduct(index, childIndex) {
            this.products[index].transfers.splice(childIndex, 1);
        },
        // untuk post api transfer sku
        confirmButton() {
            if (this.products[0].transfers[0].waste_qty == 0) { // handle if waste_qty == 0 waste reason not send to DB
                this.products[0].transfers[0].waste_reason = 0
            }
            this.ConfirmData = {
                model: true,
                title: "Create Transfer SKU",
                text: this.total_discrepancy !== 0 ? `⚠️There is a balance of ${this.total_discrepancy} Kg⚠️ Are You sure you want to continue?` : "Are you sure want to create transfer SKU?",
                urlApi: `/warehouse/transfer_sku`,
                nextPage: "/warehouse/transfer-sku",
                data: {
                    note: this.note,
                    warehouse_id: this.user.warehouse.id,
                    products: this.products.map((product, index) => {
                        return {
                            id: product.product_id,
                            total_transfer_qty: Number(
                                product.total_transfer_qty
                            ),
                            available_qty: Number(
                                product.available_qty
                            ),
                            transfer_to: product.transfers
                                .map((transfer, childIndex) => {
                                    if (transfer.id) {
                                        return {
                                            product_id: transfer.id,
                                            transfer_qty:
                                                childIndex === 0
                                                    ?
                                                      Number(
                                                          this.products[index]
                                                              .total_transfer_qty
                                                      ) 
                                                    : Number(
                                                          transfer.transfer_qty
                                                      ),
                                            waste_qty: Number(
                                                transfer.waste_qty
                                            ),
                                            waste_reason: Number(transfer.waste_reason)
                                        };
                                    }
                                })
                                .filter((data) => data),
                        };
                    }),
                },
                post: true,
            };
        },
        wasteReasonSelected (d) {
            this.products[this.productIdx].transfers[this.productIdx].waste_reason = "";
            if (d) {
                this.products[this.productIdx].transfers[this.productIdx].waste_reason = d.value;
            }
        }
    },
};
</script>
