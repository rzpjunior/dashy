<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="name"
                        required
                        outlined
                        maxlength="50"
                        dense
                        v-model="form.name"
                        :error-messages="error.name"
                        :rules="rules.name"
                    >
                        <template v-slot:label>
                            Name<span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectSupplierComodity
                        name="comodity"
                        @selected="suppliercomoditySelected"
                        required
                        :label="'Commodity'"
                        :error="error.supplier_commodity_id"
                        :dense="true"
                        :is_all="false"
                        :supplier_comodity="supplier_comodity"
                        :disabled="true"
                    ></SelectSupplierComodity>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectSupplierBadge
                        name="supplier_badge"
                        @selected="supplierbadgeSelected"
                        required
                        :error="error.supplier_badge_id"
                        :dense="true"
                        :disabled="true"
                        :clear="!supplier_comodity"
                        :selected_comodity="form.supplier_commodity_id"
                        :supplier_badge="supplier_badge"
                    ></SelectSupplierBadge>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectSupplierType
                        name="type"
                        @selected="suppliertypeSelected"
                        required
                        :label="'Type'"
                        :error="error.supplier_type_id"
                        :dense="true"
                        :disabled="true"
                        :selected_badge="form.supplier_badge_id"
                        :clear="!supplier_badge || !supplier_comodity"
                        :selected_commodity="form.supplier_commodity_id"
                        :supplier_type="supplier_type"
                    ></SelectSupplierType>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectPurchaseTerm
                        name="payment_term"
                        @selected="purchasetermSelected"
                        required
                        :error="error.purchase_term_id"
                        :purchase_term="purchase_term"
                        :dense="true"
                        :disabled="true"
                    ></SelectPurchaseTerm>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectSubDistrictAll
                        name="sub_district"
                        @selected="subdistrictallSelected"
                        required
                        :sub_district="sub_district"
                        :error="error.sub_district_id"
                        :dense="true"
                        :disabled="true"
                    ></SelectSubDistrictAll>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="district"
                        v-model="district"
                        required
                        outlined
                        disabled
                        dense
                    >
                        <template v-slot:label> District * </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="city"
                        v-model="city"
                        required
                        outlined
                        dense
                        disabled
                    >
                        <template v-slot:label> City * </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="province"
                        v-model="province"
                        required
                        outlined
                        dense
                        disabled
                    >
                        <template v-slot:label> Province * </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <v-textarea
                        name="address"
                        v-model="form.address"
                        required
                        outlined
                        maxlength="350"
                        :counter="350"
                        rows="3"
                        :error-messages="error.address"
                    >
                        <template v-slot:label>
                            Address<span class="text-red">*</span>
                        </template>
                    </v-textarea>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <v-textarea
                        name="note"
                        v-model="form.note"
                        :counter="250"
                        maxlength="250"
                        outlined
                        label="Note"
                        rows="3"
                    />
                </v-col>
            </v-row>
        </div>
        <div class="box">
            <v-row>
                <v-col>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            depressed
                            outlined
                            color="#EBEBEB"
                            class="main-btn"
                            @click="$router.go(-1)"
                        >
                            <span class="text-black80">Cancel</span>
                        </v-btn>
                        <v-btn
                            depressed
                            color="#50ABA3"
                            class="main-btn white--text"
                            @click="confirmButton()"
                            v-privilege="'sor_upd'"
                            >Save</v-btn
                        >
                    </v-card-actions>
                </v-col>
            </v-row>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData" />
        <LoadingBar :value="isLoading" />
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            ConfirmData: "",
            supplier_comodity: null,
            supplier_type: null,
            supplier_badge: null,
            purchase_term: null,
            sub_district: "",
            postal_code: "",
            district: "",
            city: "",
            province: "",
            form: {
                name: "",
                note: "",
                supplier_badge_id: "",
                supplier_commodity_id: "",
                supplier_type_id: "",
                purchase_term_id: "",
                sub_district_id: "",
                address: "",
                status: 1,
            },
            error: {},
            rules: {
                name: [(v) => !!v || "Please enter name."],
            },
            isLoading: true,
            selected_comodity: null,
            selected_badge: null,
        };
    },
    mounted() {
        this.renderData();
        let self = this;
        this.$root.$on("event_error", function (err) {
            self.error = err;
        });
    },
    methods: {
        // Select Supplier Comodity
        suppliercomoditySelected(d) {
            this.supplier_comodity = null;
            this.form.supplier_commodity_id = "";
            this.selected_comodity = null;
            if (d) {
                this.supplier_comodity = d;
                this.form.supplier_commodity_id = d.id;
                this.selected_comodity = d;
            }
        },
        // Select Supplier Badge
        supplierbadgeSelected(d) {
            this.supplier_badge = null;
            this.form.supplier_badge_id = "";
            if (d) {
                this.supplier_badge = d;
                this.form.supplier_badge_id = d.id;
                this.selected_badge = d;
            }
        },
        // Select Supplier Type
        suppliertypeSelected(d) {
            this.supplier_type = null;
            this.form.supplier_type_id = "";
            if (d !== "") {
                this.supplier_type = d;
                this.form.supplier_type_id = d.id;
            }
        },
        // Select Purchase Term
        purchasetermSelected(d) {
            this.purchase_term = null;
            this.form.purchase_term_id = "";
            if (d !== "") {
                this.purchase_term = d;
                this.form.purchase_term_id = d.id;
            }
        },
        // Select Subdistrict
        subdistrictallSelected(d) {
            this.sub_district = null;
            this.form.sub_district_id = "";
            this.postal_code = null;
            this.district = null;
            this.city = null;
            this.province = null;
            if (d) {
                this.sub_district = d;
                this.form.sub_district_id = d.id;
                this.postal_code = d.postal_code;
                this.district = d.district.name;
                this.city = d.district.city.name;
                this.province = d.district.city.province.name;
            }
        },
        // put supplier organization
        confirmButton() {
            this.ConfirmData = {
                model: true,
                title: "Update Supplier Organization",
                text: "Are you sure want to update this Supplier Organization?",
                urlApi: "/purchase/supplier/organization/" + this.$route.params.id,
                nextPage: "/purchase/supplier-organization/",
                data: {
                    ...this.form,
                    ...(this.sub_district && {
                        district_id: this.sub_district.district.id,
                        city_id: this.sub_district.district.city.id,
                        province_id: this.sub_district.district.city.province.id,
                    }),
                },
            };
        },
        // get detail supplier type
        renderData() {
            this.$http.get("/purchase/supplier/organization/" + this.$route.params.id).then((response) => {
                if (response.data.data) {
                    this.form = {
                        name: response.data.data.name,
                        note: response.data.data.note,
                        address: response.data.data.address,
                    };
                    this.purchasetermSelected(response.data.data.term_payment_pur);
                    this.suppliercomoditySelected(response.data.data.supplier_commodity);
                    this.suppliertypeSelected(response.data.data.supplier_type);
                    this.supplierbadgeSelected(response.data.data.supplier_badge);
                    this.subdistrictallSelected(response.data.data.sub_district);
                }
            }).finally(() => {
                this.isLoading = false;
            });
        },
    },
};
</script>