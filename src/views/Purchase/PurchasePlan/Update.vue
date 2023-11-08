<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row>
                <v-col class="fs24 bold mb24">
                    {{ code }}
                </v-col>
            </v-row>
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <SelectSupplierOrganization
                        :label="'Supplier Organization'"
                        :dense="true"
                        name="SupplierOrganization"
                        :error="error.supplier_organization_id"
                        @selected="supplierorganizationSelected"
                        :supplier_organization="supplier_organization"
                        :disabled="true"
                    >
                    </SelectSupplierOrganization>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectArea
                        :area="area"
                        name="area"
                        :dense="true"
                        :aux_data="2"
                        @selected="areaSelected"
                        :error="error.area_id"
                        :disabled="true"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectWarehouse
                        name="warehouse"
                        :aux_data="2"
                        :dense="true"
                        :area_id="form.area_id"
                        :warehouse="warehouse"
                        :disabled="true"
                        @selected="warehouseSelected"
                        :error="error.warehouse_id"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="recognition_date_model"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-text-field
                                    name="recognition_date"
                                    prepend-inner-icon="mdi-calendar"
                                    outlined
                                    v-model="form.recognition_date"
                                    :error-messages="error.recognition_date"
                                    clearable
                                    @click:clear="form.recognition_date = ''"
                                    dense
                                >
                                    <template v-slot:label>
                                        Purchase Plan Date<span class="text-red"
                                            >*</span
                                        >
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            v-model="form.recognition_date"
                            @input="recognition_date_model = false"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="eta_date_model"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-text-field
                                    name="eta_date"
                                    prepend-inner-icon="mdi-calendar"
                                    outlined
                                    :error-messages="error.eta_date"
                                    v-model="form.eta_date"
                                    dense
                                    clearable
                                    @click:clear="form.eta_date = ''"
                                >
                                    <template v-slot:label>
                                        Estimated Arrival Date<span
                                            class="text-red"
                                            >*</span
                                        >
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            v-model="form.eta_date"
                            @input="eta_date_model = false"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-menu
                        ref="menuTime"
                        v-model="eta_time_model"
                        :close-on-content-click="false"
                        :return-value.sync="form.eta_time"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                name="eta_time"
                                prepend-inner-icon="mdi-clock-outline"
                                outlined
                                clearable
                                maxlength="5"
                                onkeypress="return event.charCode >= 48 && event.charCode <= 58"
                                @click:clear="form.eta_time = ''"
                                v-model="form.eta_time"
                                :error-messages="error.eta_time"
                                dense
                                v-bind="attrs"
                                v-on="on"
                                @blur="$refs.menuTime.save(form.eta_time)"
                            >
                                <template v-slot:label>
                                    Estimated Arrival Time<span class="text-red"
                                        >*</span
                                    >
                                </template>
                            </v-text-field>
                        </template>
                        <v-time-picker
                            format="24hr"
                            v-if="eta_time_model"
                            v-model="form.eta_time"
                            full-width
                            @click:minute="$refs.menuTime.save(form.eta_time)"
                        ></v-time-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectUser
                        name="field_purchaser"
                        :error="error.pic_staff_id"
                        @selected="fieldPurchaserSelected"
                        :label="'Field Purchaser'"
                        :dense="true"
                        norequired="true"
                        :is_field_purchaser="true"
                        :warehouse_id="form.warehouse_id"
                        :disabled="!form.warehouse_id || purchase_plan_qty > 0"
                        :clear="!warehouse"
                        :user="fieldPurchaser"
                    />
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <v-textarea
                        name="note"
                        v-model="form.note"
                        :counter="250"
                        outlined
                        :error-messages="error.note"
                        required
                        rows="3"
                        maxlength="250"
                    >
                        <template v-slot:label> Note </template>
                    </v-textarea>
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table">Products</div>
        <div class="box-body-table">
            <v-data-table
                :headers="table.fields"
                :items="form.purchase_plan_items"
                :hide-default-footer="true"
                :items-per-page="-1"
                mobile-breakpoint="0"
            >
                <template v-slot:item="props">
                    <tr>
                        <td>{{ props.index + 1 }}</td>
                        <td>
                            <div v-if="isMobile">
                                <SelectProductTable
                                    :name="`product_${props.index}`"
                                    @click.native="setProductIdx(props.index)"
                                    @selected="productSelected"
                                    :warehouse="form.warehouse_id"
                                    :product="props.item.product"
                                    :pb="1"
                                    style="width: 215px"
                                    :error="errorMessage(props.index, 'product')"
                                    :refs="`${props.index + 1}-${refs},${itemlength}`"
                                ></SelectProductTable>
                            </div>
                            <div v-else>
                                <SelectProductTable
                                    :name="`product_${props.index}`"
                                    @click.native="setProductIdx(props.index)"
                                    @selected="productSelected"
                                    :warehouse="form.warehouse_id"
                                    :product="props.item.product"
                                    :pb="1"
                                    :error="errorMessage(props.index, 'product')"
                                    :refs="`${props.index + 1}-${refs},${itemlength}`"
                                ></SelectProductTable>
                            </div>
                        </td>
                        <td>{{ props.item.uom }}</td>
                        <td>
                            <div v-if="isMobile">
                                <vue-numeric
                                    :name="`qty_${props.index}`"
                                    :class="showError(props.index, 'qty') ? 'productNumeric' : 'productNumericErr'"
                                    separator="."
                                    style="width: 126px"
                                    placeholder="0,00"
                                    @focus="productIdx = props.index"
                                    @blur="sumSubtotal()"
                                    :precision="allowDecimal(props.item.product)"
                                    dense
                                    v-model="props.item.qty"
                                ></vue-numeric>
                                <div class="ml-3 fs9 text-red">
                                    {{ showError(props.index, 'qty') ? "" : errorMessage(props.index, 'qty') }}
                                </div>
                            </div>
                            <div v-else>
                                <vue-numeric
                                    :name="`qty_${props.index}`"
                                    :class="showError(props.index, 'qty') ? 'productNumeric' : 'productNumericErr'"
                                    separator="."
                                    placeholder="0,00"
                                    @focus="productIdx = props.index"
                                    @blur="sumSubtotal()"
                                    :precision="allowDecimal(props.item.product)"
                                    dense
                                    v-model="props.item.qty"
                                ></vue-numeric>
                                <div class="ml-3 fs9 text-red">
                                    {{ showError(props.index, 'qty') ? "" : errorMessage(props.index, 'qty') }}
                                </div>
                            </div>
                        </td>
                        <td>
                            <div v-if="isMobile">
                                <vue-numeric
                                    :name="`unit_price_${props.index}`"
                                    :class="showError(props.index, 'price') ? cogsUnitPrice(props.index) : 'productNumericErr'"
                                    separator="."
                                    placeholder="0"
                                    style="width: 126px"
                                    @focus="productIdx = props.index"
                                    @blur="sumSubtotal(), checkCOGS(props)"
                                    dense
                                    v-model="props.item.unit_price"
                                ></vue-numeric>
                                <div class="ml-3 fs12" style="color: #e2621a">
                                    {{ cogsUnitPrice2(props.index) }}
                                </div>
                                <div class="ml-3 fs9 text-red">
                                    {{ showError(props.index, "price") ? "" : errorMessage(props.index, 'price') }}
                                </div>
                            </div>
                            <div v-else>
                                <vue-numeric
                                    :name="`unit_price_${props.index}`"
                                    :class="showError(props.index, 'price') ? cogsUnitPrice(props.index) : 'productNumericErr'"
                                    separator="."
                                    placeholder="0"
                                    @focus="productIdx = props.index"
                                    @blur="sumSubtotal(), checkCOGS(props)"
                                    dense
                                    v-model="props.item.unit_price"
                                ></vue-numeric>
                                <div class="ml-3 fs12" style="color: #e2621a">
                                    {{ cogsUnitPrice2(props.index) }}
                                </div>
                                <div class="ml-3 fs9 text-red">
                                    {{ showError(props.index, "price") ? "" : errorMessage(props.index, 'price') }}
                                </div>
                            </div>
                        </td>
                        <td class="right">
                            {{ formatPrice(props.item.subtotal) }}
                        </td>
                        <td>
                            <div class="d-flex justify-end">
                                <div
                                    v-if="props.index == form.purchase_plan_items.length - 1"
                                >
                                    <v-btn
                                        icon
                                        name="addproduct"
                                        @click="addProduct()"
                                    >
                                        <img
                                            src="/icon/plus.png"
                                            height="22px"
                                            width="22px"
                                        />
                                    </v-btn>
                                </div>
                                <div
                                    v-if="form.purchase_plan_items.length != 1 && props.item.purchase_qty <= 0"
                                >
                                    <v-btn
                                        icon
                                        :name="`removeproduct_${props.index}`"
                                        @click="removeProduct(props.index)"
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
        <div class="box-end">
            <v-row>
                <v-col v-if="!isMobile"> </v-col>
                <v-col class="text-black60">
                    <div class="row fs20 text-black bold -mt10 mb2">
                        <div class="col">Grand Total (Rp):</div>
                        <div class="col d-flex justify-end">
                            {{ totalPrice }}
                        </div>
                    </div>
                </v-col>
            </v-row>
            <v-row class="hr-title" />
            <v-row>
                <v-col>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            to="/purchase/plan"
                            depressed
                            outlined
                            color="#EBEBEB"
                            class="main-btn"
                        >
                            <span class="text-black80">Cancel</span>
                        </v-btn>
                        <v-btn
                            depressed
                            color="#50ABA3"
                            class="main-btn white--text"
                            @click="confirmButton()"
                            v-privilege="'ppl_crt'"
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
    name: "PurchasePlanUpdate",
    data() {
        return {
            form: {
                area_id: "",
                warehouse_id: "",
                recognition_date: "",
                eta_date: "",
                eta_time: "",
                note: "",
                purchase_plan_items: [],
                supplier_organization_id: "",
                field_purchaser_id: "",
            },
            supplier_organization: null,
            fieldPurchaser: null,
            area: null,
            code: "",
            warehouse: null,
            recognition_date: "",
            eta_date: "",
            eta_time: "",
            eta_time_model: "",
            eta_date_model: "",
            recognition_date_model: "",
            eta_time: "",
            std_dev: "",
            warning: {},
            error: {},
            ConfirmData: {},
            disabledBtnAddApply: true,
            isMobile: false,
            itemlength: 0,
            purchase_plan_qty: 0,
            table: {
                fields: [
                    {
                        text: "No.",
                        class: "grey--text text--darken-4",
                        width: "5%",
                        sortable: false,
                    },
                    {
                        text: "Product",
                        class: "grey--text text--darken-4",
                        width: "20%",
                        sortable: false,
                    },
                    {
                        text: "UOM",
                        class: "grey--text text--darken-4",
                        width: "5%",
                        sortable: false,
                    },
                    {
                        text: "Purchase Plan Qty",
                        class: "grey--text text--darken-4",
                        width: "25%",
                        sortable: false,
                    },
                    {
                        width: "25%",
                        class: "grey--text text--darken-4",
                        text: "Unit Price",
                        sortable: false,
                    },
                    {
                        text: "Subtotal",
                        class: "grey--text text--darken-4",
                        width: "10%",
                        sortable: false,
                    },
                    {
                        width: "2%",
                        sortable: false,
                    },
                ],
            },
            productIdx: "",
            refs: "",
            totalProduct: 0,
        };
    },
    computed: {
        totalPrice() {
            let total = 0;
            this.totalProduct = 0;
            let array = this.form.purchase_plan_items;
            for (let i = 0; i < array.length; i++) {
                total += Math.round(array[i].subtotal);
            }
            this.totalProduct = total;
            let val = (total / 1).toFixed(2).replace(".", ",");
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
    },
    async mounted() {
        let self = this;
        this.$root.$on("event_error", function (err) {
            self.error = err;
        });
        window.onresize = () => {
            if (window.screen.width < 769) {
                this.isMobile = true;
            } else {
                this.isMobile = false;
            }
        };
        await this.renderData();
    },
    created() {
        this.$http.get("/config/app?conditions=attribute.icontains:std_dev_cogs").then((response) => {
            this.std_dev = parseFloat(response.data.data[0].value);
        });
        if (window.screen.width < 769) {
            this.isMobile = true;
        } else {
            this.isMobile = false;
        }
    },
    methods: {
        // For check cogs
        checkCOGS(props) {
            let idx = props.index;
            let unit_price = props.item.unit_price;
            let product_id = props.item.product_id;
            let std_dev = this.std_dev;
            let cogs = 0;
            let warehouse = "";
            if (this.form.warehouse_id) {
                warehouse = "|warehouse.id.e:" + this.form.warehouse_id;
            }
            let eta_date = "";
            if (this.form.eta_date) {
                eta_date = "|eta_date.lt:" + this.form.eta_date;
            }
            let product = "";
            if (product_id) {
                product = "|product.id.e:" + product_id;
            }
            this.overlay = true;
            this.$http.get("/purchase/cogs", {
                params: {
                    page: 1,
                    perpage: 1,
                    orderby: "-eta_date",
                    conditions: "id.icontains:" + warehouse + eta_date + product,
                },
            }).then((response) => {
                if (response.data.data) {
                    cogs = response.data.data[0].total_avg;
                }
                let deviation = Math.abs(((cogs - unit_price) / cogs) * 100);
                if (deviation > std_dev) {
                    let json = JSON.parse(JSON.stringify(this.warning));
                    json[idx] = true;
                    this.warning = JSON.parse(JSON.stringify(json));
                } else {
                    let json = JSON.parse(JSON.stringify(this.warning));
                    for (var key in json) {
                        if (key == idx) {
                            delete json[idx];
                        }
                    }
                    this.warning = JSON.parse(JSON.stringify(json));
                }
            });
        },
        // For show warning unusual price
        cogsUnitPrice2(idx) {
            for (var key in this.warning) {
                if (key == idx) {
                    return "Unusual Price";
                }
            }
            return "";
        },
        // For assign class when input unit price
        cogsUnitPrice(idx) {
            for (var key in this.warning) {
                if (key == idx) {
                    return "productNumericWarningWithMargin";
                }
            }
            return "productNumeric";
        }, 
        // for check error
        showError(index, name) {
            for (var key in this.error) {
                if (key.includes(index) && key.includes(`${name}`)) {
                    return false
                }
            }
            return true
        },
        // for show error
        errorMessage(index, name) {
            for (var key in this.error) {
                if (key.includes(index) && key.includes(`${name}`)) {
                    return this.error[key]
                }
            }
        },
        // For remove product
        removeProduct(idx) {
            this.form.purchase_plan_items.splice(idx, 1);
            for (var key in this.error) {
                if (key.includes(idx) && key.includes("price")) {
                    delete this.error[key];
                }
                if (key.includes(idx) && key.includes("qty")) {
                    delete this.error[key];
                }
                if (key.includes(idx) && key.includes("product")) {
                    delete this.error[key];
                }
            }
        },
        // For set product index
        setProductIdx(idx) {
            this.productIdx = idx;
        },
        // For select product
        productSelected(d) {
            this.form.purchase_plan_items[this.productIdx].product = "";
            this.form.purchase_plan_items[this.productIdx].product_id = "";
            if (d) {
                this.form.purchase_plan_items[this.productIdx].product = d;
                this.form.purchase_plan_items[this.productIdx].product_id = d.id;
                this.form.purchase_plan_items[this.productIdx].uom = d.uom.name;
                this.form.purchase_plan_items[this.productIdx].id = this.form.purchase_plan_items[this.productIdx].id ? this.form.purchase_plan_items[this.productIdx].id : "";
            }
        },
        // For sum subtotal
        sumSubtotal() {
            let unit_price = this.form.purchase_plan_items[this.productIdx].unit_price;
            let qty = this.form.purchase_plan_items[this.productIdx].qty;
            this.form.purchase_plan_items[this.productIdx].subtotal = Math.round(unit_price * qty);
        },
        // For add product
        addProduct() {
            this.form.purchase_plan_items.push({
                product: "",
                product_id: "",
                uom: "",
                qty: 0,
                unit_price: 0,
                subtotal: 0,
                id: "",
                purchase_qty: 0,
            });
            this.itemlength = this.form.purchase_plan_items.length;
            this.refs = false;
            Vue.nextTick(() => {
                this.refs = true;
                this.setProductIdx(this.form.purchase_plan_items.length - 1);
            });
        },
        // For confirm button
        confirmButton() {
            let data = {
                recognition_date: this.form.recognition_date || '',
                eta_date: this.form.eta_date || '',
                eta_time: this.form.eta_time || '',
                field_purchaser_id: this.form.field_purchaser_id,
                note: this.form.note,
                purchase_plan_items: this.form.purchase_plan_items.filter((d)=> d.product_id !== '').map(
                    (item) => {
                        return {
                            product_id: item.product_id,
                            purchase_plan_qty: item.qty,
                            unit_price: item.unit_price,
                            id: item.id
                        };
                    }
                ),
            };
            this.ConfirmData = {
                model: true,
                title: "Update Purchase Plan",
                text: "Are you sure want to update this Purchase plan?",
                urlApi: "/purchase/plan/" + this.$route.params.id,
                nextPage: "/purchase/plan",
                data: data,
            };
        },
        // For select area
        areaSelected(d) {
            this.area = null;
            this.form.area_id = "";
            this.warehouse = null;
            this.form.warehouse_id = "";
            if (d) {
                this.area = d;
                this.form.area_id = d.id;
            }
        },
        // For select warehouse
        warehouseSelected(d) {
            this.form.warehouse_id = "";
            this.warehouse = null;
            this.fieldPurchaser = null;
            this.form.field_purchaser_id = "";
            if (d) {
                this.warehouse = d;
                this.form.warehouse_id = d.id;
            }
            this.addProductValid();
        },
        // For add product valid
        addProductValid() {
            if (this.warehouse != null && this.form.eta_date) {
                if (this.form.purchase_plan_items.length == 0) {
                    this.form.purchase_plan_items.push({
                        product: "",
                        product_id: "",
                        uom: "",
                        qty: 0,
                        unit_price: 0,
                        subtotal: 0,
                        id: "",
                        purchase_qty: 0,
                    });
                }
                this.disabledBtnAddApply = false;
            } else {
                this.disabledBtnAddApply = true;
            }
        },
        // For select field purchaser
        fieldPurchaserSelected(d) {
            this.fieldPurchaser = null;
            this.form.field_purchaser_id = "";
            if (d) {
                this.fieldPurchaser = d;
                this.form.field_purchaser_id = d.id;
            }
        },
        // Select Supplier Organization
        supplierorganizationSelected(d) {
            this.supplier_organization = null;
            this.form.supplier_organization_id = "";
            if (d) {
                this.supplier_organization = d;
                this.form.supplier_organization_id = d.id;
            }
        },
        // render data
        async renderData() {
            await this.$http.get("/purchase/plan/" + this.$route.params.id).then((response) => {
                this.purchase_plan_qty = response.data.data.total_purchase_qty;
                this.code = response.data.data.code;
                this.form.eta_date = this.$moment(response.data.data.eta_date).format("YYYY-MM-DD");
                this.form.recognition_date = this.$moment(response.data.data.recognition_date).format("YYYY-MM-DD");
                this.areaSelected(response.data.data.warehouse.area);
                this.warehouseSelected(response.data.data.warehouse);
                if (response.data.data.assigned_to) {
                    this.fieldPurchaserSelected(response.data.data.assigned_to);
                }
                this.supplierorganizationSelected(response.data.data.supplier_organization);
                this.form.note = response.data.data.note;
                this.form.eta_time = response.data.data.eta_time;
                this.form.purchase_plan_items = response.data.data.purchase_plan_items.map((item) => {
                    return {
                        product: item.product,
                        product_id: item.product.id,
                        uom: item.product.uom.name,
                        qty: item.order_qty,
                        unit_price: item.unit_price,
                        subtotal: item.subtotal,
                        id: item.id,
                        purchase_qty: item.purchase_qty
                    };
                });
            });
        },
        // allow decimal
        allowDecimal(product) {
            if (product){
                if (product.uom.decimal_enabled == 1){
                    return 2
                }
                return 0
            }
        }
    },
    watch: {
        "form.eta_time": {
            handler: function (val) {
                if(val){
                    if (val.length == 5) {
                        let h = val.slice(0, 2);
                        let m = val.slice(-2);
                        if (parseInt(h) > 23 && parseInt(m) > 59) {
                        this.form.eta_time = "00:00";
                        } else if (parseInt(h) > 23) {
                            this.form.eta_time = "00:" + m;
                        } else if (parseInt(m) > 59) {
                            this.form.eta_time = h + ":00";
                        }
                    }
                }
            },
            deep: true,
        },
        "form.eta_date": {
            handler: function (val) {
                this.addProductValid();
            },
            deep: true,
        },
    },
};
</script>