<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="name"
                        v-model="form.name"
                        required
                        outlined
                        maxlength="50"
                        :error-messages="error.name"
                        dense
                    >
                        <template v-slot:label>
                            Name<span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectSupplierOrganization
                        :label="'Supplier Organization'"
                        :dense="true"
                        name="SupplierOrganization"
                        :error="error.supplier_organization_id"
                        @selected="supplierorganizationSelected"
                        :norequired="true"
                    >
                    </SelectSupplierOrganization>
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
                        :disabled="disabled"
                    ></SelectSupplierComodity>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectSupplierBadge
                        name="supplier_badge"
                        @selected="supplierbadgeSelected"
                        required
                        :error="error.supplier_badge_id"
                        :dense="true"
                        :disabled="!supplier_comodity || disabled"
                        :clear="!supplier_comodity"
                        :supplier_badge="supplier_badge"
                        :selected_comodity="form.supplier_commodity_id"
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
                        :disabled="!supplier_badge"
                        :selected_badge="form.supplier_badge_id"
                        :clear="!supplier_badge"
                        :selected_commodity="form.supplier_commodity_id"
                        :supplier_type="supplier_type"
                    ></SelectSupplierType>
                </v-col>
                <v-col cols="12" md="6" class="-mt24"></v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <v-divider class="mb24"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="pic_name"
                        v-model="form.pic_name"
                        required
                        outlined
                        maxlength="30"
                        :error-messages="error.pic_name"
                        v-on:keypress="letterOnly($event)"
                        dense
                    >
                        <template v-slot:label>
                            PIC Name<span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="email"
                        v-model="form.email"
                        required
                        outlined
                        :rules="form.email ? emailRules : []"
                        dense
                        :error-messages="error.email"
                    >
                        <template v-slot:label> Email </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="phone_number"
                        v-model="form.phone_number"
                        maxlength="15"
                        onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                        required
                        outlined
                        :error-messages="error.phone_number"
                        :rules="form.phone_number ? phoneRules : []"
                        dense
                        type="number"
                    >
                        <template v-slot:label>
                            Phone Number<span class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="alt_phone_number"
                        v-model="form.alt_phone_number"
                        maxlength="100"
                        onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                        outlined
                        dense
                        :error-messages="error.alt_phone_number"
                        :rules="form.alt_phone_number ? phoneRules : []"
                        type="number"
                    >
                        <template v-slot:label>
                            Alternative Phone Number
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectPurchaseTerm
                        name="payment_term"
                        @selected="purchasetermSelected"
                        required
                        :error="error.term_payment_pur_id"
                        :dense="true"
                        :purchase_term="term_payment_pur"
                    ></SelectPurchaseTerm>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectPaymentMethod
                        name="payment_method"
                        @selected="paymentmethodSelected"
                        required
                        :error="error.payment_method_id"
                        :dense="true"
                    ></SelectPaymentMethod>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectBoolean
                        :label="'Rejectable'"
                        :dense="true"
                        name="Rejectable"
                        @selected="rejectableSelected"
                        :error="error.rejectable"
                    >
                    </SelectBoolean>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectBoolean
                        :label="'Returnable'"
                        :dense="true"
                        name="Returnable"
                        @selected="returnableSelected"
                        :error="error.returnable"
                    >
                    </SelectBoolean>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <v-divider class="mb24"/>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectSubDistrictAll
                        name="sub_district"
                        @selected="subdistrictallSelected"
                        required
                        :sub_district="sub_district"
                        :error="error.sub_district_id"
                        :dense="true"
                        :disabled="disabled"
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
                <v-col cols="12" md="6" class="-mt24">
                    <v-text-field
                        name="name"
                        v-model="form.block_number"
                        :required="form.supplier_type_id == '458752' ? true : false"
                        outlined
                        maxlength="50"
                        :error-messages="error.block_number"
                        dense
                        :disabled="form.supplier_type_id == '458752' ? false : true"
                    >
                        <template v-slot:label>
                            Block Number<span v-if="form.supplier_type_id == '458752'" class="text-red">*</span>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="-mt24"> </v-col>
                <v-col cols="12" md="6" class="-mt24">
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
                <v-col cols="12" md="6" class="-mt24">
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
                            v-privilege="'sup_rdl'"
                            @click="$router.go(-1)"
                        >
                            <span class="text-black80">Cancel</span>
                        </v-btn>
                        <v-btn
                            depressed
                            color="#50ABA3"
                            class="main-btn white--text"
                            v-privilege="'sup_crt'"
                            @click="confirmButton()"
                            >Create</v-btn
                        >
                    </v-card-actions>
                </v-col>
            </v-row>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData" />
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
            supplier_organization: null,
            term_payment_pur: null,
            payment_method: null,
            sub_district: "",
            postal_code: "",
            district: "",
            city: "",
            province: "",
            isDataFromOrganization: false,
            form: {
                name: "",
                supplier_type_id: "",
                pic_name: "",
                supplier_badge_id: "",
                supplier_commodity_id: "",
                supplier_organization_id: "",
                phone_number: "",
                alt_phone_number: "",
                email: "",
                address: "",
                term_payment_pur_id: "",
                payment_method_id: "",
                note: "",
                sub_district_id: "",
                block_number: "",
                rejectable: 2,
                returnable: 2,
            },
            emailRules: [
                (v) => !!v || "Please Enter email",
                (v) => /.+@.+/.test(v) || "E-mail must be valid",
            ],
            phoneRules: [
                (v) => (v && v.length >= 8) || "Phone number at least 8 digits",
                (v) => (v && v.length <= 15) || "Max phone number 15 digits",
            ],
            error: {},
        };
    },
    mounted() {
        let self = this;
        this.$root.$on("event_error", function (err) {
            self.error = err;
        });
    },
    created() {
        let data = this.$store.state.ProspectSupplier;
        if (data != null) {
            this.setBefore(data);
        }
    },
    methods: {
        // Field Letter Only
        letterOnly(e) {
            let char = String.fromCharCode(e.keyCode);
            if (/^[a-zA-Z\s]*$/.test(char)) return true;
            else e.preventDefault();
        },
        // Set Data from Prospective Supplier
        setBefore(data) {
            this.$http
                .get("/purchase/prospect/supplier/" + data.supplier)
                .then((response) => {
                    let item = response.data.data;
                    this.form = {
                        prospect_supplier_id: data.supplier,
                        name: item.name,
                        supplier_type_id: "",
                        pic_name: item.pic_name,
                        phone_number: item.phone_number,
                        alt_phone_number: item.alt_phone_number,
                        email: "",
                        address: item.street_address,
                        term_payment_pur_id: "",
                        payment_method_id: "",
                        note: "",
                        sub_district_id: "",
                    };
                    this.$http
                        .get("/sub_district/filter", {
                            params: {
                                embeds: "district.city.province_id",
                                conditions: "id.e:" + item.sub_district.id,
                            },
                        })
                        .then((response) => {
                            this.subdistrictallSelected(response.data.data[0]);
                            this.$store.commit("setProspectSupplier", null);
                        });
                });
        },
        // For Confirm Create Supplier
        confirmButton() {
            if (this.form.prospect_supplier_id) {
                this.ConfirmData = {
                    model: true,
                    title: "Create Supplier",
                    text: "Are you sure want to create this Supplier?",
                    urlApi: "/purchase/supplier",
                    nextPage: "/purchase/prospective/supplier",
                    post: true,
                    data: this.form,
                };
            } else {
                this.ConfirmData = {
                    model: true,
                    title: "Create Supplier",
                    text: "Are you sure want to create this Supplier?",
                    urlApi: "/purchase/supplier",
                    nextPage: "/purchase/supplier",
                    post: true,
                    data: this.form,
                };
            }
        },
        // Select Supplier Comodity
        suppliercomoditySelected(d) {
            this.supplier_comodity = null;
            this.form.supplier_commodity_id = "";
            if (d) {
                this.supplier_comodity = d;
                this.form.supplier_commodity_id = d.id;
            }
        },
        // Select Supplier Badge
        supplierbadgeSelected(d) {
            this.supplier_badge = null;
            this.form.supplier_badge_id = "";
            if (d) {
                this.supplier_badge = d;
                this.form.supplier_badge_id = d.id;
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
        // Select Supplier Organization
        supplierorganizationSelected(d) {
            this.supplier_organization = null;
            this.form.supplier_organization_id = "";
            if (d) {
                this.isDataFromOrganization = true
                this.suppliercomoditySelected(d.supplier_commodity)
                this.supplierbadgeSelected(d.supplier_badge)
                this.suppliertypeSelected(d.supplier_type)
                this.purchasetermSelected(d.term_payment_pur)
                this.supplier_organization = d;
                this.form.supplier_organization_id = d.id;
                this.form.address = d.address;
                this.form.note = d.note;
                setTimeout(()=> {
                    this.isDataFromOrganization = false
                }, 100)
                this.subdistrictallSelected(d.sub_district)
            }
        },
        // Select Purchase Term
        purchasetermSelected(d) {
            this.term_payment_pur = null;
            this.form.term_payment_pur_id = "";
            if (d !== "") {
                this.term_payment_pur = d;
                this.form.term_payment_pur_id = d.id;
            }
        },
        // Select Payment Method
        paymentmethodSelected(d) {
            this.payment_method = null;
            this.form.payment_method_id = "";
            if (d !== "") {
                this.payment_method = d;
                this.form.payment_method_id = d.id;
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
        // select rejectable field
        rejectableSelected(d) {
            this.form.rejectable = ""
            if (d) {
                this.form.rejectable = d.value
            }
        },
        // select returnable field
        returnableSelected(d) {
            this.form.returnable = ""
            if (d) {
                this.form.returnable = d.value
            }
        }
    },
    computed: {
        disabled() {
            if (this.supplier_organization) {
                return true
            } else {
                return false
            }
        },
    },
    watch: {
        // reset supplier badge & type when comodity change
        supplier_comodity: {
            handler: function () {
                if (!this.isDataFromOrganization){
                    this.supplier_badge = null;
                    this.supplier_type = null;
                    this.form.supplier_type_id = "";
                    this.form.supplier_badge_id = "";
                }
            },
            deep: true,
        },
        // reset supplier type when badge change
        supplier_badge: {
            handler: function () {
                if (!this.isDataFromOrganization){
                    this.supplier_type = null;
                    this.form.supplier_type_id = "";
                }
            },
            deep: true,
        },
        // hapus input 0 didepan
        'form.phone_number': {
            handler: function (val) {
                if (val) {
                    let that = this
                    that.form.phone_number = val.replace(/^0+/, '')
                }
            },
            deep: true
        },
        // hapus input 0 didepan
        'form.alt_phone_number': {
            handler: function (val) {
                if (val) {
                    let that = this
                    that.form.alt_phone_number = val.replace(/^0+/, '')
                }
            },
            deep: true
        },
        'form.supplier_type_id': {
            handler: function () {
                this.form.block_number = ""
            }
        }
    },
};
</script>
