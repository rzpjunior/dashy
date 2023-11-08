<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew
                            v-if="items.inbound_type == 1"
                            :name="'Area'"
                            :value="items.warehouse.area.name"
                    />
                    <DetailRowNew
                            v-else
                            :name="'Origin'"
                            :value="items.goods_transfer.origin.name"
                    />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew
                            v-if="items.inbound_type == 1"
                            :name="'Warehouse'"
                            :value="items.warehouse.name"
                    />
                    <DetailRowNew
                            v-else
                            :name="'Destination'"
                            :value="items.goods_transfer.destination.name"
                    />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew
                            v-if="items.inbound_type == 1"
                            :name="'Purchase Order Code'"
                            :value="items.purchase_order.code"
                            :routePath="
                            '/purchase/order/' + items.purchase_order.id
                        "
                    />
                    <DetailRowNew
                            v-else
                            :name="'Goods Transfer Code'"
                            :value="items.goods_transfer.code"
                            :routePath="
                            '/warehouse/goods-transfer/detail/' + items.goods_transfer.id
                        "
                    />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew
                            :name="'Goods Receipt Code'"
                            :value="items.code"
                            :routePath="
                            '/warehouse/goods-receipt/detail/' + items.id
                        "
                    />
                </v-col>
                <v-col v-if="items.inbound_type == 1" cols="12" md="6" class="-mt24">
                    <DetailRowNew
                            :name="'Supplier Name'"
                            :value="items.purchase_order.supplier.name"
                    />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew
                            :name="'Stock Type'"
                            :value="items.stock_type == 2 ? 'Waste Stock' : 'Goods Stock'"
                    />
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table">Products</div>
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
                            <div class="mt32 flex-align-start full-height">
                                {{ props.index + 1 }}
                            </div>
                        </td>
                        <td>
                            <div class="mt16 flex-align-start full-height">
                                <v-autocomplete
                                        :items="filteredProductGR"
                                        item-text="name"
                                        placeholder="Select Product"
                                        class="rounded-form-sm"
                                        return-object
                                        outlined
                                        @change="productSelected"
                                        @click.native="setProductIdx(props.index)"
                                        :item-disabled="checkIsItemDisabled"
                                        dense
                                        :search-input.sync="search"
                                        :no-filter="true"
                                        :error-messages="totalTransferQty(props.index) + totalWasteQty(props.index) > Number(products[props.index].gr_qty) ? 'Total transfer to exceed GR qty' : ''"
                                >
                                    <template
                                            slot="selection"
                                            slot-scope="data"
                                    >
                                        <div class="select-item">
                                            {{ data.item.product.code }}
                                            {{ data.item.product.name }}
                                        </div>
                                    </template>
                                    <template slot="item" slot-scope="data">
                                        {{ data.item.product.code }}
                                        {{ data.item.product.name }}
                                    </template>
                                </v-autocomplete>
                            </div>
                        </td>
                        <td>
                            <div class="flex-align-start full-height mt29">
                                {{ props.item.uom || "-" }}
                            </div>
                        </td>
                        <td>
                            <div class="flex-align-start full-height mt29">
                                {{ props.item.gr_qty || "-" }}
                            </div>
                        </td>
                        <td>
                            <div v-for="(child, childIndex) in products[props.index].transfers" :key="childIndex">
                                <div v-if="childIndex === 0"
                                     :class="childIndex + 1 === products[props.index].transfers.length ? 'h90 flex-justify-around' : 'h55'">
                                    <div :class="products[props.index].transfers[0].code ? 'pt10 select-item' : 'pt8 select-item'">
                                        {{ products[props.index].transfers[0].code || "-" }}
                                        {{ products[props.index].transfers[0].name }}
                                    </div>
                                    <div v-if="childIndex + 1 === products[props.index].transfers.length"
                                         class="flex-row-align-center -ml8">
                                        <v-btn
                                                :disabled="products[props.index].product_id.length < 1"
                                                icon
                                                :name="`addchildproduct_${childIndex}`"
                                                @click="addChildProduct(props.index, childIndex)"
                                        >
                                            <img
                                                    src="/icon/plus.png"
                                                    height="22px"
                                                    width="22px"
                                            />
                                        </v-btn>
                                        <div class="text-black60 fs12">
                                            Product Transfer
                                        </div>
                                    </div>
                                </div>
                                <div v-else>
                                    <SelectProductTable
                                            :name="`product_${props.index}_${childIndex}`"
                                            @click.native="setProductChildIdx(props.index, childIndex)"
                                            @selected="productChildSelected"
                                            :refs="`${childIndex + 1}-${refs},${products[props.index].transfers.length}`"
                                            :selectedProduct="products[props.index].transfers"
                                            :uom="products[props.index].uom_id"
                                            :update="update"
                                            :disabled="products[props.index].product_id.length === 0"
                                            :warehouse="items.warehouse.id"
                                            :category="products[props.index].category_id"
                                            :product_id="products[props.index].prd_id"
                                    ></SelectProductTable>
                                    <div v-if="childIndex + 1 === products[props.index].transfers.length"
                                         class="flex-row-align-center -ml8">
                                        <v-btn
                                                icon
                                                :name="`addchildproduct_${childIndex}`"
                                                @click="addChildProduct(props.index,childIndex)"
                                        >
                                            <img
                                                    src="/icon/plus.png"
                                                    height="22px"
                                                    width="22px"
                                            />
                                        </v-btn>
                                        <div class="text-black60 fs12">
                                            Product Transfer
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="flex-align-start full-height">
                                <div v-for="(child, childIndex) in products[props.index].transfers" :key="childIndex"
                                     class="h45">
                                    <div v-if="childIndex === 0"
                                         :class="childIndex + 1 === products[props.index].transfers.length">
                                        <vue-numeric
                                                name="transfer_qty"
                                                separator=","
                                                class="productNumeric"
                                                placeholder="Qty Transfer"
                                                @click.native="setProductIdx(props.index)"
                                                :precision="products[props.index].transfers[childIndex].decimal_enabled == 2 ? 0 : 2"
                                                v-model="products[props.index].transfers[childIndex].transfer_qty"
                                                :disabled="products[props.index].product_id.length < 1 || products[props.index].transfers[childIndex].id === ''"
                                                :minus="false"
                                        ></vue-numeric>
                                    </div>
                                    <div v-else>
                                        <vue-numeric
                                                name="transfer_qty"
                                                separator=","
                                                class="productNumeric mt18"
                                                placeholder="Qty Transfer"
                                                @click.native="setProductIdx(props.index)"
                                                :precision="products[props.index].transfers[childIndex].decimal_enabled == 2 ? 0 : 2"
                                                v-model="products[props.index].transfers[childIndex].transfer_qty"
                                                :disabled="products[props.index].product_id.length < 1 || products[props.index].transfers[childIndex].id === ''"
                                                :minus="false"
                                        ></vue-numeric>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="flex-align-start full-height mt29">
                                <span v-html="checkDiscrepancy(props.index)"></span>
                                <v-tooltip right>
                                    <template v-slot:activator="{ on: tooltip }">
                                        <v-icon
                                                v-on="{ ...tooltip }"
                                                right
                                                class="-mt22 ml50"
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
                        </td>
                        <td>
                            <div class="flex-align-start full-height">
                                <div
                                        v-for="(child, childIndex) in products[props.index].transfers"
                                        :key="childIndex"
                                >
                                    <vue-numeric
                                            v-if="childIndex === 0"
                                            name="waste_qty"
                                            separator=","
                                            class="productNumeric"
                                            placeholder="Waste Qty"
                                            @click.native="setProductIdx(props.index)"
                                            :precision="products[props.index].transfers[childIndex].decimal_enabled == 2 ? 0 : 2"
                                            v-model="products[props.index].transfers[childIndex].waste_qty"
                                            :disabled="products[props.index].product_id.length < 1"
                                            :minus="false"
                                    ></vue-numeric>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="flex-align-start full-height mt14">
                                <SelectGlossary
                                        v-if="products[props.index].transfers[0].waste_qty > 0"
                                        v-model="products[props.index].transfers[0].waste_reason"
                                        @click.native="setReasonIdx(props.index)"
                                        outlined
                                        :dense="true"
                                        :norequired="true"
                                        label="Waste Reason"
                                        table="all"
                                        attribute="waste_reason"
                                        class="rounded-form-sm"
                                        @selected="wasteReasonSelected"
                                        :error="errWasteReason(props.index)"
                                        :class="errWasteReason(props.index) ? 'formProductErr' : ''"
                                >
                                </SelectGlossary>
                            </div>
                        </td>
                        <td>
                            <div class="flex-justify-center full-height">
                                <div
                                        v-for="(child, childIndex) in products[props.index].transfers"
                                        :key="childIndex"
                                        class="h55"
                                >
                                    <div class="d-flex justify-end">
                                        <div v-if="childIndex + 1 === products[props.index].transfers.length && props.index + 1 === products.length">
                                            <v-btn
                                                    icon
                                                    :name="`addproduct_${props.index}`"
                                                    @click="addProduct(props.index)"
                                                    :disabled="disabledBtnAddApply"
                                            >
                                                <img
                                                        src="/icon/plus.png"
                                                        height="22px"
                                                        width="22px"
                                                />
                                            </v-btn>
                                        </div>
                                        <div v-if="childIndex > 0 && props.index === 0">
                                            <v-btn
                                                    icon
                                                    :name="`removechildproduct_${childIndex}`"
                                                    @click="removeChildProduct(props.index, childIndex)"
                                            >
                                                <img
                                                        src="/icon/close-new.png"
                                                        height="20px"
                                                        width="20px"
                                                />
                                            </v-btn>
                                        </div>
                                        <div v-if="props.index > 0">
                                            <v-btn
                                                    icon
                                                    :name="`removechildproduct_${childIndex}`"
                                                    @click="removeChildProduct(props.index, childIndex)"
                                            >
                                                <img
                                                        src="/icon/close-new.png"
                                                        height="20px"
                                                        width="20px"
                                                />
                                            </v-btn>
                                        </div>
                                    </div>
                                </div>
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
                                v-privilege="'gr_rdl'"
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
        <ConfirmationDialogNew :sendData="ConfirmData"/>
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
                    goods_transfer: {
                        code: "",
                        origin: {
                            name: "",
                        },
                        destination: {
                            name: "",
                        },
                    }
                },
                products: [
                    {
                        product: "",
                        product_id: "",
                        category_id: "",
                        prd_id: "",
                        uom: "",
                        uom_id: "",
                        gr_weight: 0,
                        gr_qty: "",
                        total: 0,
                        transfers: [
                            {
                                name: "",
                                id: "",
                                transfer_qty: 0,
                                waste_qty: 0,
                                waste_reason: "",
                                code: "",
                                unit_weight: 0,
                                decimal_enabled: "",
                            },
                        ],
                    },
                ],
                total_discrepancy: 0,
                userName: '',
                userCode: '',
                update: false,
                refs: false,
                productIdx: "",
                reasonIdx: "",
                productsTransferTo: [],
                filteredProductGR: [],
                search: "",
                productChildIdx: "",
                category_id: "",
                prd_id: "",
                disabledBtnAddApply: false,
                error: {},
                ConfirmData: {},
                iconColor: '',
                table: {
                    fields: [
                        {
                            text: "No.",
                            width: "5%",
                            class: "grey--text text--darken-4",
                            sortable: false,
                        },
                        {
                            text: "Product Name",
                            width: "15%",
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
                            text: "GR Qty",
                            width: "5%",
                            class: "grey--text text--darken-4",
                            sortable: false,
                        },
                        {
                            text: "Transfer to",
                            width: "15%",
                            class: "grey--text text--darken-4",
                            sortable: false,
                        },
                        {
                            text: "Qty Transfer",
                            width: "10%",
                            class: "grey--text text--darken-4",
                            sortable: false,
                        },
                        {
                            text: "Balance(Kg)",
                            width: "10%",
                            class: "grey--text text--darken-4",
                            sortable: false,
                        },
                        {
                            text: "Waste Qty",
                            width: "10%",
                            class: "grey--text text--darken-4",
                            sortable: false,
                        },
                        {
                            text: "",
                            width: "20%",
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
                wasteIdx: ""
            };
        },
        mounted() {
            this.renderData();
            this.getUser();
            let self = this
            this.$root.$on('event_error', function (err) {
                self.error = err
            });
        },
        watch: {
            // untuk search list product good receipt
            search: {
                handler: function (val) {
                    if (val) {
                        const newFiltered = this.items.goods_receipt_items
                            .map((i) => {
                                return {
                                    ...i,
                                    label: i.product.code + " " + i.product.name,
                                };
                            })
                            .filter((item) =>
                                item.label.toLowerCase().includes(val.toLowerCase())
                            );

                        this.filteredProductGR = newFiltered;
                    }
                },
                deep: true,
            },
            error: {
                handler: function (val) {
                    if (val) {
                        if (val.warehouse_id) {
                            Vue.$toast.open({
                                position: 'top-right',
                                message: val.warehouse_id,
                                type: 'error',
                            });
                        }
                    }
                },
                deep: true,
            }
        },
        computed: {
            //get staff
            staff() {
                return this.$store.getters.getStaff
            },
            // validasi sebelum save transfer sku
            checkTransferSKUSave() {
                if (this.total_discrepancy != 0 ) {
                    return true
                }
                return false
            },
        },
        methods: {
            //to count discrepancy between qty transfer and unit weight also waste qty if there is any
            checkDiscrepancy(index) {
                let weight_child = 0
                let weight_waste = 0
                let total = 0
                for (let i = 0; i < this.products[index].transfers.length; i++) {
                    weight_child += parseFloat(this.products[index].transfers[i].transfer_qty) * parseFloat(this.products[index].transfers[i].unit_weight)
                    weight_waste = parseFloat(this.products[index].transfers[0].waste_qty) * parseFloat(this.products[index].unit_weight)
                }
                total = parseFloat(this.products[index].gr_weight) - weight_child - weight_waste
                this.total_discrepancy = Math.abs(total.toFixed(2))
                if (isNaN(total)) {
                    total = 0
                }
                if (total.toFixed(2) < 0) return this.iconColor = 'red', `<span style="color:red; font-weight: 700;">${total.toFixed(2)}</span>`
                if (total.toFixed(2) > 0) return this.iconColor = 'red', `<span style="color: #ffaf00; font-weight: 700;">${total.toFixed(2)}</span>`
                return this.iconColor = 'green', `<span style="color:green; font-weight: 700;">${Math.abs(total.toFixed(2))}</span>`
            },
            // untuk menghitung total transfer qty tiap product good receipt yang dipilih
            totalTransferQty(index) {
                return this.products[index || 0].transfers
                    .map((transfer) => Number(transfer.transfer_qty))
                    .reduce((a, b) => a + b);
            },
            // untuk menghitung total waste qty tiap product good receipt yang dipilih
            totalWasteQty(index) {
                return this.products[index || 0].transfers
                    .map((transfer) => Number(transfer.waste_qty))
                    .reduce((a, b) => a + b);
            },
            // untuk mengambil data product yang tersedia di good receipt tersebut
            renderData() {
                this.$http
                    .get("/warehouse/goods/receipt/" + this.$route.params.id)
                    .then((response) => {
                        this.items = response.data.data;
                        this.filteredProductGR = response.data.data.goods_receipt_items;
                    });
            },
            // untuk mengambil index product yang dipilih
            setProductIdx(idx) {
                this.productIdx = idx;
                if (this.products[idx].transfers[0].waste_qty <= 0) {
                    this.products[idx].transfers[0].waste_reason = 0
                }
            },
            setWasteIdx(idx) { // untuk set state waste index
                this.wasteIdx = idx
            },
            // untuk mengambil index product & index product transfer to yang dipilih
            setProductChildIdx(index, childIndex) {
                this.productChildIdx = childIndex;
                this.productIdx = index;
            },
            // untuk set state product yang dipilih
            productSelected(d) {
                this.category_id = d.product.category.id
                this.prd_id = d.product.id
                this.products[this.productIdx].product = "";
                this.products[this.productIdx].product_id = "";
                this.products[this.productIdx].transfers = [
                    {
                        name: "",
                        id: "",
                        transfer_qty: 0,
                        waste_qty: 0,
                        waste_reason: "",
                        unit_weight: 0,
                        decimal_enabled: "",
                    },
                ];

                if (d) {
                    this.products[this.productIdx].category_id = d.product.category.id
                    this.products[this.productIdx].prd_id = d.product.id
                    this.products[this.productIdx].product = d.product.name;
                    this.products[this.productIdx].product_id = d.product.id;
                    this.products[this.productIdx].uom = d.product.uom.name;
                    this.products[this.productIdx].uom_id = d.product.uom.id;
                    this.products[this.productIdx].gr_weight = d.receive_qty * d.product.unit_weight;
                    this.products[this.productIdx].unit_weight = d.product.unit_weight;
                    this.products[this.productIdx].gr_qty = d.receive_qty;
                    this.products[this.productIdx].transfers[0].id = d.product.id;
                    this.products[this.productIdx].transfers[0].name = d.product.name;
                    this.products[this.productIdx].transfers[0].code = d.product.code;
                    this.products[this.productIdx].transfers[0].unit_weight = d.product.unit_weight;
                    this.products[this.productIdx].transfers[0].decimal_enabled = d.product.uom.decimal_enabled;
                }
            },
            // untuk set state product transfer to yang dipilih
            productChildSelected(d) {
                let productItemChild = this.products[this.productIdx].transfers[this.productChildIdx]
                productItemChild.name = "";
                productItemChild.id = "";
                productItemChild.transfer_qty = 0;
                productItemChild.waste_qty = 0;
                productItemChild.decimal_enabled = "";
                if (d) {
                    productItemChild.name = d.name;
                    productItemChild.id = d.id;
                    productItemChild.unit_weight = d.unit_weight
                    productItemChild.decimal_enabled = d.uom.decimal_enabled;
                }
            },
            // untuk mengecek product itu sudah dipilih sebelumnya atau tidak
            checkIsItemDisabled(item) {
                let productIsSelected = this.products.findIndex((product) => product.product_id === item.product.id) !== -1;
                let productIsUsed = this.filteredProductGR.filter((e) => e.is_disabled === 1);
                let registeredProduct = productIsUsed.findIndex((e) => e.id === item.id) !== -1
                if (registeredProduct || productIsSelected) {
                    return true
                } else {
                    return false
                }
            },
            // untuk menambahkan row product baru
            addProduct() {
                this.update = false;
                this.products.push({
                    product: "",
                    product_id: "",
                    uom: "",
                    uom_id: "",
                    gr_weight: 0,
                    gr_qty: "",
                    total: 0,
                    transfers: [
                        {
                            name: "",
                            id: "",
                            transfer_qty: 0,
                            waste_qty: 0,
                            waste_reason: "",
                            code: "",
                            decimal_enabled: "",
                            unit_weight: 0,
                        },
                    ],
                });
                this.refs = false;
                Vue.nextTick(() => {
                    this.refs = true;
                    this.setProductIdx(this.products.length - 1);
                });
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
                    code: "",
                    unit_weight: 0,
                    decimal_enabled: "",
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
                if (childIndex === 0) {
                    return this.products.splice(index, 1);
                }
                this.products[index].transfers.splice(childIndex, 1);
            },
            // untuk mengambil index reason yang dipilih
            setReasonIdx(idx) {
                this.reasonIdx = idx;
            },
            // handle errro waste reason
            errWasteReason(idx) {
                for (var key in this.error) {
                    if (key == 'waste_reason_id' + idx) {
                        return this.error[key]
                    }
                }
            },
            wasteReasonSelected(d) { // untuk selected waste reason
                this.products[this.reasonIdx].transfers[0].waste_reason = "";
                if (d) {
                    this.products[this.reasonIdx].transfers[0].waste_reason = d.value;
                }
            },
            getUser() {
                this.loaded = false
                this.$http.get("/user/staff/" + this.staff.id)
                    .then(response => {
                        let dataWr = response.data.data
                        this.userName = dataWr.name
                        this.userCode = dataWr.code
                    });

            },
            // untuk post api transfer sku
            confirmButton() {
                this.ConfirmData = {
                    model: true,
                    title: "Create Transfer SKU",
                    text: this.total_discrepancy !== 0 ? `⚠️There is a balance of ${this.total_discrepancy} Kg⚠️ Are You sure you want to continue?` : "Are you sure want to create transfer SKU?",
                    urlApi: `/warehouse/goods/receipt/${this.items.id}/transfer_sku`,
                    nextPage: "/warehouse/transfer-sku",
                    data: {
                        good_receipts_id: this.items.id,
                        warehouse_id: this.items.warehouse.id,
                        purchase_order_id: this.items.purchase_order === null ? '' : this.items.purchase_order.id,
                        goods_transfer_id: this.items.goods_transfer === null ? '' : this.items.goods_transfer.id,
                        inbound_type: this.items.goods_transfer ? 'goods_transfer' : 'purchase_order',
                        status: this.items.status,
                        products: this.products.map((product) => {
                            return {
                                id: product.product_id,
                                gri_qty: product.gr_qty,
                                transfer_to:
                                    product.transfers.map((transfer) => {
                                        return {
                                            product_id: transfer.id,
                                            transfer_qty: Number(
                                                transfer.transfer_qty
                                            ),
                                            waste_qty: Number(
                                                transfer.waste_qty
                                            ),
                                            waste_reason: Number(transfer.waste_reason)
                                        };
                                    })
                            };
                        }),
                    },
                    post: true,
                };
            },
        },
    };
</script>
