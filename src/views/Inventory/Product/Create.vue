<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="name"
                        v-model="category_grand_parent"
                        required
                        outlined
                        dense
                        disabled
                        maxlength="50"
                    >
                        <template v-slot:label>
                            Grand Parent (C0)
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="name"
                        v-model="category_parent"
                        required
                        outlined
                        dense
                        disabled
                        maxlength="50"
                    >
                        <template v-slot:label>
                            Parent (C1)
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectCategoryParentGP
                        v-model="categories"
                        @selected="categorySelected"
                        :category="categories"
                        name="category"
                        required
                        :error="error.category_id"
                        :dense="true"
                        :embed="3"
                    ></SelectCategoryParentGP>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="name"
                        v-model="product_code"
                        required
                        outlined
                        dense
                        maxlength="2"
                        onkeypress='return event.charCode >= 48 && event.charCode <= 57'
                        :prefix="prefixCategoryCode"
                        :disabled="disProductCode"
                        :error="error.code"
                    >
                        <template v-slot:label>
                            Product Code<span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="name"
                        v-model="form.name"
                        required
                        outlined
                        dense
                        :error-messages="error.name"
                        maxlength="50"
                    >
                        <template v-slot:label>
                            Product Name<span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectUom
                        name="uom"
                        v-model="uoms"
                        @selected="uomSelected"
                        :uom="uoms"
                        required
                        :error="error.uom_id"
                        :dense="true"
                    ></SelectUom>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <div v-if="error.uom_id" class="text-black60 fs14">
                        Weight<span class="text-red">*</span>
                    </div>
                    <div v-else class="text-black60 fs14 -mt20">
                        Weight<span class="text-red">*</span>
                    </div>
                    <vue-numeric
                        name="weight"
                        :class="!error.weight ? 'formNumericNew' : 'formNumericErrNew'"
                        separator="."
                        placeholder="0,00"
                        :precision="2"
                        v-model="form.weight"
                        dense
                    ></vue-numeric>
                    <div v-if="error.weight" class="mt-1 ml-3 fs12 text-red">
                        {{ error.weight }}
                    </div>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                            <div v-on="{ ...tooltip }">
                                <v-text-field
                                    name="univ_product_code"
                                    v-model="form.up_code"
                                    required
                                    onkeypress="return event.charCode >= 97 && event.charCode <= 122 || event.charCode >= 65 && event.charCode <= 90 || event.charCode >= 48 && event.charCode <= 57"
                                    outlined
                                    maxlength="50"
                                    dense
                                    label="Universal Product Code"
                                ></v-text-field>
                            </div>
                        </template>
                        <span>Input product barcode</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="spare_percentage"
                        v-model="form.spare_percentage"
                        required
                        onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
                        outlined
                        maxlength="5"
                        dense
                        label="Spare (%)"
                        :class="error.weight ? 'mt30' : ''"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="tax_percentage"
                        v-model="form.tax_percentage"
                        required
                        onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
                        outlined
                        maxlength="5"
                        dense
                        label="Tax (%)"
                        :class="error.weight ? 'mt30' : ''"
                        :disabled="form.taxable === 2"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="2" class="-mt36">
                    <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                            <div v-on="{ ...tooltip }">
                                <v-switch
                                    v-model="form.taxable"
                                    label="Taxable Goods"
                                    color="#50ABA3"
                                    inset
                                    :false-value="2"
                                    :true-value="1"
                                    @click="switchTaxable()"
                                ></v-switch>
                            </div>
                        </template>
                        <span>Taxable Status</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                            <div v-on="{ ...tooltip }">
                                <v-textarea
                                    name="note"
                                    v-model="form.note"
                                    :counter="250"
                                    maxlength="250"
                                    outlined
                                    label="Note"
                                    dense
                                    rows="3"
                                />
                            </div>
                        </template>
                        <span>Internal purpose</span>
                    </v-tooltip>
                </v-col>
            </v-row>
        </div>
        <div class="box-start">
            <div class="fs20 bold">Catalog</div>
            <v-row class="mt24">
                <v-col cols="12" class="-mt24">
                    <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                            <div v-on="{ ...tooltip }">
                                <MultiSelectProductTag
                                    v-model="productTags"
                                    @selected="productTagSelected"
                                    :attribute="'prd_max_tag'"
                                    :norequired="true"
                                    :error="error.product_tag"
                                    :dense="true"
                                />
                            </div>
                        </template>
                        <span>Product classification in mobile application</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                            <div v-on="{ ...tooltip }" class="text-black60 fs14 mb40">
                                Minimal Order Qty<span class="text-red">*</span>
                                <vue-numeric
                                    name="min_order_qty"
                                    :class="!error.order_min_qty ? 'formNumericNew' : 'formNumericErrNew'"
                                    separator="."
                                    placeholder="0,00"
                                    :precision="2"
                                    v-model="form.order_min_qty"
                                ></vue-numeric>
                                <div v-if="error.order_min_qty" class="mt-1 ml-3 fs12 text-red">
                                    {{ error.order_min_qty }}
                                </div>
                            </div>
                        </template>
                        <span>This will be used in mobile application</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                            <div v-on="{ ...tooltip }">
                                <v-textarea
                                    name="description"
                                    v-model="form.description"
                                    :counter="500"
                                    maxlength="500"
                                    outlined
                                    label="Description"
                                    dense
                                />
                            </div>
                        </template>
                        <span>Product description shown in mobile application</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <UploadImageMultiple
                        :name="form.name"
                        :error="error.images"
                        :dense="true"
                    />
                </v-col>
            </v-row>
        </div>
        <div class="box-start">
            <div class="fs20 bold mb18">Availability</div>
            <hr class="hr-title" />
            <v-row>
                <v-col cols="12" md="6">
                    <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                            <div v-on="{ ...tooltip }">
                                <v-switch
                                    v-model="form.storability"
                                    label="Storability"
                                    color="#50ABA3"
                                    inset
                                    :error-messages="error.warehouse_sto"
                                    :false-value="2"
                                    :true-value="1"
                                    @click="switchSto()"
                                ></v-switch>
                            </div>
                        </template>
                        <span>Product can be stored</span>
                    </v-tooltip>
                    <div class="-mt20 ml54" v-if="form.storability == 1">
                        <v-checkbox
                            :error="checkStr(error.warehouse_sto)"
                            v-for="(item, idx) in warehouselists"
                            :key="idx"
                            v-model="form.warehouse_sto"
                            :label="`${item.code} - ${item.name} (${item.area.code} - ${item.area.name})`"
                            color="#50ABA3"
                            @click="checkSto(item.id)"
                            class="-mb28"
                            multiple
                            :value="item.id"
                        ></v-checkbox>
                    </div>
                </v-col>
                <v-col cols="12" md="6">
                    <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                            <div v-on="{ ...tooltip }">
                                <v-switch
                                    v-model="form.purchasability"
                                    label="Purchasability"
                                    color="#50ABA3"
                                    inset
                                    :error-messages="error.warehouse_pur"
                                    @click="switchPur()"
                                    :false-value="2"
                                    :true-value="1"
                                ></v-switch>
                            </div>
                        </template>
                        <span>Product can be purchased</span>
                    </v-tooltip>
                    <div class="-mt20 ml54" v-if="form.purchasability == 1">
                        <v-checkbox
                            v-for="(item, idx) in warehouselists"
                            :key="idx"
                            :error="checkStr(error.warehouse_pur)"
                            v-model="form.warehouse_pur"
                            multiple
                            @click="checkPur(item.id)"
                            :value="item.id"
                            :label="`${item.code} - ${item.name} (${item.area.code} - ${item.area.name})`"
                            color="#50ABA3"
                            class="-mb28"
                        ></v-checkbox>
                    </div>
                </v-col>
            </v-row>
        </div>
        <div class="box">
            <div class="fs20 bold mb18">Routing Restriction</div>
            <hr class="hr-title" />
            <v-row>
                <v-col cols="12" md="6">
                    <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                            <div v-on="{ ...tooltip }">
                                <v-switch
                                    v-model="form.fragile_goods"
                                    label="Fragile Goods"
                                    color="#50ABA3"
                                    inset
                                    :false-value="2"
                                    :true-value="1"
                                    @click="fragileGoods(form.fragile_goods)"
                                ></v-switch>
                            </div>
                        </template>
                        <span>For help the routing process, please enable </span>
                    </v-tooltip>
                </v-col>
            </v-row>
        </div>
        <div class="box">
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    @click="$router.go(-1)"
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
                >
                    Create
                </v-btn>
            </v-card-actions>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData" />
    </v-container>
</template>
<script>
    export default {
        name: "CreateProduct",
        data() {
            return {
                ConfirmData: {},
                warehouselists: [],
                product_code: '',
                form: {
                    code: '',
                    name: "",
                    weight: 0.0,
                    spare_percentage: "",
                    tax_percentage: 0,
                    order_min_qty: 0.0,
                    warehouse_sto: [],
                    warehouse_pur: [],
                    warehouse_sal: [],
                    product_tag: [],
                    storability: 2,
                    purchasability: 2,
                    salability: 2,
                    uom_id: "",
                    category_id: "",
                    images: [],
                    description: "",
                    up_code: "",
                    note: "",
                    taxable: 2,
                    fragile_goods: 2
                },
                category_parent: '',
                category_grand_parent: '',
                error: {},
                uoms: null,
                categories: null,
                productTags: null,
                prefixCategoryCode: '',
                disProductCode: true
            };
        },
        created() {
            this.renderData();
        },
        mounted() {
            let self = this;
            this.$root.$on("event_error", function (err) {
                self.error = err;
            });
            this.$root.$on("event_multipleImage", function (url) {
                self.form.images = url;
            });
        },
        methods: {
            checkStr(val) {
                if (typeof val === "string" || val instanceof String) {
                    return true;
                } else {
                    return false;
                }
            },
            switchPur() {
                this.form.storability = 1;
                this.form.warehouse_pur = [];
                this.error.warehouse_pur = null;
            },
            switchTaxable(){
                if(this.form.taxable === 2) {
                    this.form.tax_percentage = 0
                }
            },
            checkPur(val) {
                this.error.warehouse_pur = null;
                let status = false;
                let push = true;
                let compare = false;
                for (let i = 0; i < this.form.warehouse_pur.length; i++) {
                    if (this.form.warehouse_pur[i] == val) {
                        status = true;
                    }
                }
                if (status) {
                    for (let i = 0; i < this.form.warehouse_sto.length; i++) {
                        if (this.form.warehouse_sto[i] == val) {
                            push = false;
                        }
                        if (i == this.form.warehouse_sto.length - 1) {
                            compare = true;
                        }
                    }
                    if (this.form.warehouse_sto.length == 0) {
                        compare = true;
                    }
                }
                if (push && compare) {
                    this.form.warehouse_sto.push(val);
                }
            },
            switchSto() {
                this.form.purchasability = 2;
                this.form.warehouse_sto = [];
                this.form.warehouse_pur = [];
                this.error.warehouse_sto = null;
            },
            checkSto(val) {
                this.error.warehouse_sto = null;
                let status = false;
                let arr = this.form.warehouse_pur;
                let arr2 = this.form.warehouse_pur;
                for (let i = 0; i < this.form.warehouse_sto.length; i++) {
                    if (this.form.warehouse_sto[i] == val) {
                        status = true;
                    }
                }
                if (!status) {
                    for (let i = 0; i < this.form.warehouse_pur.length; i++) {
                        if (this.form.warehouse_pur[i] == val) {
                            arr2 = arr.filter((e) => e !== val);
                        }
                    }
                }
                this.form.warehouse_pur = arr2;
            },
            productTagSelected(d) {
                this.productTags = null;
                let arr = [];
                if (d !== "") {
                    this.productTags = d;
                    for (let i = 0; i < d.length; i++) {
                        arr.push(d[i].value);
                    }
                }
                this.form.product_tag = arr;
            },
            uomSelected(d) {
                this.uoms = null;
                this.form.uom_id = "";
                if (d !== "" && d !== undefined) {
                    this.uoms = d;
                    if (d) this.form.uom_id = d.id;
                }
            },
            categorySelected(d) {
                this.disProductCode = true
                this.categories = null;
                this.form.category_id = "";
                this.product_code = "";
                this.category_parent = "";
                this.category_grand_parent = "";
                this.prefixCategoryCode = "";
                if (d !== "" && d !== undefined && d !== null) {
                    this.categories = d;
                    this.form.category_id = d.id;
                    let code = d.code
                    this.prefixCategoryCode = code.slice(0, -2);
                    this.category_parent = d.parent.code + ' - ' + d.parent.name;
                    this.category_grand_parent = d.grand_parent.code + ' - ' + d.grand_parent.name
                    this.disProductCode = false;
                }
            },
            fragileGoods(d) {
                if (d == 1) {
                    this.form.fragile_goods = 1
                } else {
                    this.form.fragile_goods = 2
                }
            },
            renderData() {
                this.$http
                    .get(
                        "config/warehouse?embeds=area_id,sub_district_id&conditions=aux_data:2|status:1"
                    )
                    .then((response) => {
                        this.warehouselists = response.data.data;
                    });
            },
            confirmButton() {
                if (this.form.spare_percentage) {
                    this.form.spare_percentage = parseFloat(
                        this.form.spare_percentage
                    );
                } else {
                    this.form.spare_percentage = 0;
                }
                if (this.form.tax_percentage) {
                    this.form.tax_percentage = parseFloat(this.form.tax_percentage);
                } else {
                    this.form.tax_percentage = 0;
                }
                this.form.code = this.prefixCategoryCode + this.product_code
                this.ConfirmData = {
                    model: true,
                    title: "Create Product",
                    text: "Are you sure want to create this product? product name, UOM, weight can not be updated afterwards.",
                    urlApi: "/inventory/product",
                    nextPage: "/inventory/product/detail/:id",
                    post: true,
                    data: this.form,
                    image: true,
                };
            },
        },
    };
</script>