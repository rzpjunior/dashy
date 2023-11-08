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
                        onkeypress='return event.charCode >= 48 && event.charCode <= 57'
                        dense
                        maxlength="2"
                        :prefix="prefixCategoryCode"
                        :error="error.code"
                    >
                        <template v-slot:label>
                            Product Code<span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="product_name"
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
                        disabled
                        :dense="true"
                    ></SelectUom>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <div class="text-black40 fs14 -mt20">Weigth *</div>
                    <vue-numeric
                        name="weight"
                        class="formNumericNewDisable text-black40"
                        separator="."
                        disabled
                        placeholder="0,00"
                        :precision="2"
                        v-model="items.unit_weight"
                    ></vue-numeric>
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
                                >
                                </v-text-field>
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
                    >
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="4" class="-mt24">
                    <v-text-field
                        name="tax_percentage"
                        v-model="form.tax_percentage"
                        required
                        onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46"
                        outlined
                        maxlength="5"
                        dense
                        label="Tax (%)"
                        :disabled="form.taxable === 2"
                    >
                    </v-text-field>
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
            <div class="fs16 bold">Catalog</div>
            <v-row class="mt24">
                <v-col cols="12" class="-mt24">
                    <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                            <div v-on="{ ...tooltip }">
                                <MultiSelectProductTag
                                    v-model="productTags"
                                    :productTag="productTagsUpdate"
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
                <v-col cols="12" md="6" class="-mt34">
                    <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                            <div
                                v-on="{ ...tooltip }"
                                class="text-black60 fs14 mb40"
                            >
                                Minimum Order Qty<span class="text-red">*</span>
                                <vue-numeric
                                    name="min_order_qty"
                                    :class="!error.order_min_qty ? 'formNumericNew' : 'formNumericErrNew'"
                                    separator="."
                                    placeholder="0,00"
                                    :precision="2"
                                    v-model="form.order_min_qty"
                                    onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode <= 44"
                                ></vue-numeric>
                                <div
                                    v-if="error.order_min_qty"
                                    class="mt-1 ml-3 fs12 text-red"
                                >
                                    {{ error.order_min_qty }}
                                </div>
                            </div>
                        </template>
                        <span>This will be used in mobile application</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12" md="6" class="-mt34">
                    <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                            <div
                                v-on="{ ...tooltip }"
                                class="text-black60 fs14 mb40"
                            >
                                Maximum Order Qty
                                <vue-numeric
                                    name="max_order_qty"
                                    class="formNumericNew"
                                    separator="."
                                    placeholder="0,00"
                                    :precision="2"
                                    v-model="form.order_max_qty"
                                    onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode <= 44"
                                ></vue-numeric>
                            </div>
                        </template>
                        <span>This will be used on all application</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12" class="-mt49">
                    <div class="text-black60 fs14 mb40">
                        Maximum Delivery Date
                        <vue-numeric
                            name="max_delivery_date"
                            class="formNumericNew left"
                            placeholder="0"
                            v-model.number="form.max_day_delivery_date"
                            onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                        ></vue-numeric>
                    </div>
                </v-col>
                <v-col cols="12" class="-mt39">
                    <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                            <div v-on="{ ...tooltip }">
                                <MultiSelectArcheType
                                    v-model="archeTypes"
                                    :archeType="archeTypesUpdate"
                                    @selected="archeTypeSelected"
                                    :norequired="true"
                                    :error="error.exclude_archetype"
                                    :dense="true"
                                    :disbled="false"
                                />
                            </div>
                        </template>
                        <span>This product will not showing on customer apps</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <SelectOrderChannel
                        name="orderchannelrestriction"
                        @selected="restrictChannelSelected"
                        v-model="restrictChannel"
                        :orderchannel="restrictChannelUpdate"
                        :label="'Order Channel Restriction'"
                        :dense="true"
                        :norequired="true"
                        :error="error.order_channel_restriction"
                    ></SelectOrderChannel>
                </v-col>
                <v-col cols="12" class="-mt14">
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
                    <v-row>
                        <UploadImageMultiple
                            :name="form.name"
                            :data="arrImg"
                            :error="error.images"
                            class="ma-3"
                        />
                    </v-row>
                </v-col>
            </v-row>
        </div>
        <div class="box-header-table">Storability Warehouse List</div>
        <div class="box-body-table">
            <v-simple-table>
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="grey--text text--darken-4">
                                Storability Assigned Warehouse
                            </th>
                            <th width="50%" class="grey--text text--darken-4">
                                Safety Stock
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            style="height: 48px"
                            v-for="item in form.storability_stock"
                            :key="item.warehouse_id"
                        >
                            <td>{{ item.warehouse_name }}</td>
                            <td>
                                <vue-numeric-input
                                    id="updatePro"
                                    align="center"
                                    style="width: 126px"
                                    v-model="item.stock_qty"
                                >
                                </vue-numeric-input>
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </div>
        <div class="box-start">
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
                        >
                            <span class="text-black80">Cancel</span>
                        </v-btn>
                        <v-btn
                            depressed
                            color="#50ABA3"
                            class="main-btn white--text"
                            @click="confirmButton()"
                        >
                            Update
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData" />
    </v-container>
</template>
<script>
export default {
    name: "UpdateProduct",
    data() {
        return {
            ConfirmData: {},
            storability_stock: [],
            uoms: null,
            productTags: null,
            archeTypes: null,
            restrictChannel: null,
            prefixCategoryCode: '',
            productTagsUpdate: null,
            archeTypesUpdate: null,
            restrictChannelUpdate: null,
            categories: null,
            dialog: false,
            category_parent: '',
            product_code: '',
            category_grand_parent: '',
            items: {},
            error: {},
            arrImg: [],
            form: {
                code: "",
                name: "",
                up_code: "",
                uom_id: "",
                description: "",
                spare_percentage: "",
                tax_percentage: "",
                taxable: null,
                category_id: "",
                product_tag: [],
                exclude_archetype: [],
                order_channel_restriction: [],
                images: [],
                note: "",
                storability_stock: [],
            },
        };
    },
    methods: {
        switchTaxable(){
            if(this.form.taxable === 2) {
                this.form.tax_percentage = 0
            }
        },
        productTagSelected(d) {
            this.productTags = null;
            let arr = [];
            if (d !== "") {
                this.productTags = d;
                for (let i = 0; i < d.length; i++) {
                    if (d[i].value) {
                        arr.push(d[i].value);
                    } else {
                        arr.push(d[i]);
                    }
                }
            }
            this.form.product_tag = arr;
        },
        archeTypeSelected(d) {
            this.archeTypes = null;
            let arr = [];
            if (d !== "") {
                this.archeTypes = d;
                for (let i = 0; i < d.length; i++) {
                    if (d[i].id) {
                        arr.push(d[i].id);
                    } else {
                        arr.push(d[i]);
                    }
                }
            }
            this.form.exclude_archetype = arr;
        },
        restrictChannelSelected(d) {
            this.restrictChannel = null;
            let arr = [];
            if (d !== "") {
                this.restrictChannel = d;
                for (let i = 0; i < d.length; i++) {
                    arr.push(String(d[i].value));
                }
            }
            this.form.order_channel_restriction = arr;
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
            this.categories = null;
            this.form.category_id = "";
            this.category_parent = "";
            this.category_grand_parent = "";
            this.prefixCategoryCode = "";
            if (d !== "" && d !== undefined && d !== null) {
                this.categories = d;
                if (d) this.form.category_id = d.id;
                this.prefixCategoryCode = d.code.slice(0, -2)
                this.$http.get("/inventory/category/filter",{params:{
                    conditions:'id.e:'+d.id,
                }}).then(response => {
                    this.category_parent = response.data.data[0].parent.code + ' - ' + response.data.data[0].parent.name
                    this.category_grand_parent = response.data.data[0].grand_parent.code + ' - ' + response.data.data[0].grand_parent.name
                });

            }
        },
        renderData() {
            let arr = [];
            let arrArcheType = [];
            let producttag = [];
            let archetype = [];
            let arrRestrictChannel = [];
            let restrictChannel = [];
            let updRestrictChannel = [];
            this.$http
                .get("/inventory/product/" + this.$route.params.id)
                .then((response) => {
                    this.items = response.data.data;
                    this.product_code = this.items.code.slice(6)
                    this.form = {
                        name: this.items.name,
                        up_code: this.items.up_code,
                        uom_id: this.items.uom.id,
                        spare_percentage: String(this.items.spare_percentage),
                        tax_percentage: String(this.items.tax_percentage),
                        taxable: this.items.taxable,
                        description: this.items.description,
                        category_id: this.items.category.id,
                        order_min_qty: this.items.order_min_qty,
                        order_max_qty: this.items.order_max_qty,
                        max_day_delivery_date: this.items.max_day_delivery_date,
                        note: this.items.note,
                        product_tag: [],
                        images: [],
                        storability_stock: [],
                    };
                    if (this.items.tag_product) {
                        if (this.items.tag_product.includes(",")) {
                            arr = this.items.tag_product.split(",");
                        } else {
                            arr.push(this.items.tag_product);
                        }
                        this.form.product_tag = arr;
                        for (let i = 0; i < arr.length; i++) {
                            this.$http
                                .get(
                                    "inventory/tag_product?conditions=value:" +
                                        arr[i]
                                )
                                .then((res) => {
                                    producttag.push(res.data.data[0]);
                                });
                        }
                    }
                    this.productTagsUpdate = producttag;
                    
                    //get data exclude archetype
                    if (this.items.exclude_archetype) {
                        if (this.items.exclude_archetype.includes(",")) {
                            arrArcheType = this.items.exclude_archetype.split(",");
                        } else {
                            arrArcheType.push(this.items.exclude_archetype);
                        }
                        this.form.exclude_archetype = arrArcheType;
                        for (let i = 0; i < arrArcheType.length; i++) {
                            this.$http
                                .get(
                                    "customer/archetype?conditions=id.e:" +
                                        +arrArcheType[i]
                                )
                                .then((res) => {
                                    archetype.push(res.data.data[0]);
                                });
                        }
                    }
                    this.archeTypesUpdate = archetype;

                    //get data order channel restriction
                    if (this.items.order_channel_restriction) {
                        arrRestrictChannel = this.items.order_channel_restriction
                        for (let i = 0; i < arrRestrictChannel.length; i++) {
                            restrictChannel.push(
                                {
                                    value: arrRestrictChannel[i].value_int,
                                    note: arrRestrictChannel[i].note
                                }
                            )
                            updRestrictChannel.push(String(arrRestrictChannel[i].value_int));
                        }
                    }
                    this.form.order_channel_restriction = updRestrictChannel;
                    this.restrictChannelUpdate = restrictChannel;
                    

                    let img = this.items.product_image;
                    if (img) {
                        for (let i = 0; i < img.length; i++) {
                            this.arrImg.push({
                                image: true,
                                imageError: "",
                                imgUrl: img[i].image_url,
                                nameFile: img[i].image_url,
                            });
                            this.form.images.push(img[i].image_url);
                        }
                    }
                    this.uomSelected(response.data.data.uom);
                    this.categorySelected(response.data.data.category);
                });
        },
        renderWarehouse() {
            let arr = [];
            let arr2 = [];
            this.form.storability_stock = [];
            this.$http
                .get(
                    "/warehouse/stock?embeds=warehouse_id,warehouse.area_id&conditions=status:1|product_id.e:" +
                        this.$route.params.id
                )
                .then((response) => {
                    arr2 = response.data.data;
                    for (let i = 0; i < arr2.length; i++) {
                        arr.push({
                            warehouse_id: arr2[i].warehouse.id,
                            warehouse_name:
                                arr2[i].warehouse.code +
                                " - " +
                                arr2[i].warehouse.name +
                                " (" +
                                arr2[i].warehouse.area.code +
                                " - " +
                                arr2[i].warehouse.area.name +
                                ")",
                            stock_qty: arr2[i].safety_stock,
                        });
                    }
                });
            this.form.storability_stock = arr;
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
            if (this.max_day_delivery_date == "") {
                this.max_day_delivery_date = 0;
            }
            this.form.code = this.prefixCategoryCode + this.product_code
            this.ConfirmData = {
                model: true,
                title: "Update Product",
                text: "Are you sure want to update this product?",
                urlApi: "/inventory/product/" + this.$route.params.id,
                nextPage: "/inventory/product/detail/" + this.$route.params.id,
                data: this.form,
                image: true,
                timer: 1000,
            };
        },
    },
    created() {
        this.renderData();
        let self = this;
        setTimeout(() => {
            self.renderWarehouse();
        }, 1500);
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
};
</script>
