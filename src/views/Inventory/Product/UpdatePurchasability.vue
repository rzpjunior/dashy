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
                <v-col cols="12" class="-mt24 mb24">
                    <span class="text-black40 fs14">Main Image<span style="color:red">*</span></span>
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
                                            <div class="text-black40 mt-2 fs14">Max : 2 Mb</div>
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
                                    <div class="text-black40 mt-2 fs14">Max : 2 Mb</div>
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
            <v-row class="mt24">
                <v-col>
                    <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                            <div v-on="{ ...tooltip }">
                                <v-switch
                                    v-model="items.storability"
                                    label="Storability"
                                    color="#50ABA3"
                                    inset
                                    :false-value="2"
                                    :true-value="1"
                                    disabled
                                ></v-switch>
                            </div>
                        </template>
                       <span>Product can be stored</span>
                    </v-tooltip>
                    <div class="-mt20 ml54" v-if="items.storability == 1">
                        <v-checkbox
                            v-for="(item, idx) in items.warehouse_sto" :key="idx"
                            v-model="checkbox"
                            :label="`${item.code} - ${item.name} (${item.area.code} - ${item.area.name})`"
                            color="#50ABA3"
                            disabled
                            class="-mb28"
                        ></v-checkbox>
                    </div>
                    <v-row>
                        <v-col>
                            <v-tooltip top>
                                <template v-slot:activator="{ on: tooltip }">
                                    <div v-on="{ ...tooltip }">
                                        <v-switch
                                            v-model="items.salability"
                                            label="Salability"
                                            color="#50ABA3"
                                            inset
                                            disabled
                                            :false-value="2"
                                            :true-value="1"
                                            class="mt30"
                                        ></v-switch>
                                    </div>
                                </template>
                               <span>Product can be sale</span>
                            </v-tooltip>
                            <div class="-mt20 ml54" v-if="items.salability == 1">
                                <v-checkbox
                                    v-for="(item, idx) in items.warehouse_sal" :key="idx"
                                    v-model="checkbox"
                                    :label="`${item.code} - ${item.name} (${item.area.code} - ${item.area.name})`"
                                    color="#50ABA3"
                                    disabled
                                    class="-mb28"
                                ></v-checkbox>
                            </div>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col>
                    <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                            <div v-on="{ ...tooltip }">
                                <v-switch
                                    v-model="data.purchasability"
                                    label="Purchasability"
                                    color="#50ABA3"
                                    inset
                                    @click="changeStatus()"
                                    :false-value="2"
                                    :true-value="1"
                                ></v-switch>
                            </div>
                        </template>
                       <span>Product can be purchased</span>
                    </v-tooltip>
                    <div class="-mt20 ml54" v-if="data.purchasability == 1">
                        <v-checkbox
                            v-for="(item, idx) in warehouselists" :key="idx"
                            v-model="data.warehouse_checked"
                            multiple
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
    name: "UpdatePurchasability",
    data () {
        return {
            ConfirmData : {},
            data : {
                purchasability: "",
                warehouse_checked: [],
                warehouse_unchecked: []
            },
            productTag : [],
            checkbox : true,
            warehouselists : [],
            uoms : null,
            categories : null,
            items : {},
            error : {}
        }
    },
    mounted () {
        let self = this
        this.$root.$on('event_error', function(err){
            self.error = err
        });
    },
    methods : {
        changeStatus() {
            this.data.warehouse_checked = []
        },
        uomSelected(d) {
            this.uoms = null;
            this.items.uom = '';
            if (d !== ''  && d !== undefined) {
                this.uoms = d;
                if(d)
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
                this.data.purchasability = this.items.purchasability
                this.data.warehouse_checked = this.items.warehouse_pur_arr
                if(this.items.tag_product_str !== "")
                this.productTag = this.items.tag_product_str.split(',');
                this.uomSelected(response.data.data.uom)
                this.categorySelected(response.data.data.category)
            });
            this.$http.get("config/warehouse?embeds=area_id,sub_district_id&conditions=aux_data:2|status:1").then(response => {
                this.warehouselists = response.data.data
            });
        },
        confirmButton() {
            let arr = []
            let arr2 = JSON.parse(JSON.stringify(this.data.warehouse_checked))
            for (let i = 0; i < this.warehouselists.length; i++) {
                arr.push(this.warehouselists[i].id)
            }
            this.data.warehouse_unchecked = arr.filter(x => !arr2.includes(x));
            this.ConfirmData = {
                model : true,
                title : "Update Product - Purchasability",
                text : "Are you sure want to update this product purchasability?",
                urlApi : "/inventory/product/purchasability/"+this.$route.params.id,
                nextPage : "/inventory/product/detail/"+this.$route.params.id,
                data : this.data
            }
        }
    },
    created() {
        this.renderData()
    }
}
</script>