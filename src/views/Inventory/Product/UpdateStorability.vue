<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="product_code"
                        v-model="items.code"
                        required
                        outlined
                        label="Code *"
                        disabled
                        dense
                        :error-messages="error.code"
                    >
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="product_name"
                        v-model="items.name"
                        required
                        outlined
                        disabled
                        dense
                        label="Product Name *"
                        :error-messages="error.name"
                    >
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectUom
                        name= "uom"
                        v-model="uoms"
                        @selected="uomSelected"
                        :uom="uoms"
                        required
                        disabled
                        :dense="true"
                    ></SelectUom>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectCategory
                        v-model="categories"
                        @selected="categorySelected"
                        :category="categories"
                        name= "category"
                        required
                        disabled
                        :dense="true"
                    ></SelectCategory>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <div class="text-black40 fs14 -mt20"> Weigth *</div>
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
                    <v-text-field
                        name="univ_product_code"
                        v-model="items.up_code"
                        required
                        outlined
                        disabled
                        dense
                        :error-messages="error.name"
                        label="Universal Product Code"
                    >
                    </v-text-field>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                            <div v-on="{ ...tooltip }">
                            <v-textarea
                                name="note"
                                v-model="items.note"
                                :counter="100"
                                maxlength="100"
                                outlined
                                label="Note"
                                dense
                                disabled
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
            <div class="fs16 bold">
                Catalog
            </div>
            <v-row class="mt24">
                <v-col cols="12" class="-mt24">
                    <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                            <div v-on="{ ...tooltip }">
                                <v-autocomplete
                                    name="product_tag"
                                    v-model="productTag"
                                    :items="productTag"
                                    outlined
                                    chips
                                    dense
                                    label="Product Tag *"
                                    multiple
                                    disabled
                                >
                                <template #selection="{ item }">
                                    <v-chip color="#CECECE" text-color="white">{{item}}</v-chip>
                                </template>
                                </v-autocomplete>
                            </div>
                        </template>
                       <span>Product classification in mobile application</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                            <div v-on="{ ...tooltip }">
                            <v-textarea
                                name="description"
                                v-model="items.description"
                                :counter="100"
                                maxlength="100"
                                outlined
                                disabled
                                label="Description"
                                dense
                            />
                            </div>
                        </template>
                       <span>Product description in mobile application</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12" class="-mt24 mb34">
                    <span class="text-black60 fs14">Main Image<span class="text-red">*</span></span>
                    <div class="mt-3">
                        <div class="row">
                            <div v-for="(item, idx) in items.product_image" :key="idx">
                                <v-tooltip top v-if="idx==0">
                                    <template v-slot:activator="{ on: tooltip }">
                                        <div class="img-product ma-3" v-on="{ ...tooltip }">
                                            <v-img
                                                class="rounded-form"
                                                height="180"
                                                width="250"
                                                :src="item.image_url"
                                            ></v-img>
                                            <div class="text-black60 mt-2 fs14">Max : 2 Mb</div>
                                        </div>
                                    </template>
                                <span>Default image shown in catalog</span>
                                </v-tooltip>
                                <div class="img-product ma-3" v-else>
                                    <v-img
                                        class="rounded-form"
                                        height="180"
                                        width="250"
                                        :src="item.image_url"
                                    ></v-img>
                                    <div class="text-black60 mt-2 fs14">Max : 2 Mb</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </div>
        <div class="box-start">
            <div class="fs16 bold">
                Availability
            </div>
            <div class="box-header-table">
                Storability Warehouse List
            </div>
            <div class="box-body-table">
                <v-simple-table>
                    <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="grey--text text--darken-4">Warehouse</th>
                            <th class="grey--text text--darken-4">Area</th>
                            <th class="grey--text text--darken-4">Storability</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            style="height:48px"
                            v-for="item in warehouselists"
                            :key="item.warehouse"
                        >
                            <td>{{ item.code}} - {{item.name }}</td>
                            <td>{{ item.area.code }} - {{ item.area.name }}</td>
                            <td>
                                <v-checkbox
                                    color="#50ABA3"
                                    v-model="data.warehouse_checked"
                                    multiple
                                    :value="item.id"
                                ></v-checkbox>
                            </td>
                        </tr>
                    </tbody>
                    </template>
                </v-simple-table>
            </div>
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
        <ConfirmationDialogNew :sendData="ConfirmData"/>
    </v-container>
</template>
<script>
export default {
    name: "UpdateStorability",
    data () {
        return {
            ConfirmData : {},
            warehouselists : [],
            data : {
                storability: "",
                warehouse_checked: [],
                warehouse_unchecked: []
            },
            uoms : null,
            categories : null,
            items : {},
            error : {},
            productTag : [],
        }
    },
    methods : {
        confirmButton() {
            let arr = []
            for (let i = 0; i < this.warehouselists.length; i++) {
                arr.push(this.warehouselists[i].id)
            }
            this.data.storability = 1
            this.data.warehouse_unchecked = arr.filter(x => !this.data.warehouse_checked.includes(x));
            if (this.data.warehouse_checked.length == 0) {
                this.data.storability = 2
            }
            this.ConfirmData = {
                model : true,
                title : "Update Product - Storability",
                text : "Are you sure want to update this product storability?",
                urlApi : "/inventory/product/storability/"+this.$route.params.id,
                nextPage : "/inventory/product/detail/"+this.$route.params.id,
                data : this.data
            }
        },
        uomSelected(d) {
            this.uoms = null;
            this.items.uom = '';
            if (d !== ''  && d !== undefined) {
                this.uoms = d;
                this.items.uom = d.id
            }
        },
        categorySelected(d) {
            this.categories = null;
            this.items.category = '';
            if (d !== ''  && d !== undefined) {
                this.categories = d;
                if (d)
                this.items.category = d.id
            }
        },
        renderData() {
            this.$http.get("/inventory/product/"+ this.$route.params.id).then(response => {
                this.items = response.data.data
                this.data.storability = this.items.storability
                this.data.warehouse_checked = this.items.warehouse_sto_arr
                if(this.items.tag_product_str !== "")
                this.productTag = this.items.tag_product_str.split(',');
                this.uomSelected(response.data.data.uom)
                this.categorySelected(response.data.data.category)
            });
            this.$http.get("config/warehouse?embeds=area_id,sub_district_id&conditions=aux_data:2|status:1").then(response => {
                this.warehouselists = response.data.data
            });
        }
    },
    created() {
        this.renderData()
    }
}
</script>