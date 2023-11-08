<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row
                justify="center"
                class="mt24 mb24"
                v-if="this.error.supplier_group"
            >
                <v-col cols="12" md="12" class="-mt24 center">
                    <v-alert
                        dense
                        type="error"
                        :icon="false"
                        text
                        dismissible
                        v-model="error.supplier_group"
                    >
                        {{ this.error.supplier_group }}
                    </v-alert>
                </v-col>
            </v-row>
            <v-row :class="this.error.supplier_group ? '' : 'mt24'">
                <v-col cols="12" md="6" class="-mt24">
                    <SelectSupplierComodity
                        :dense="true"
                        name="commodity"
                        @selected="suppliercomoditySelected"
                        :error="error.supplier_commodity_id"
                        :is_all="true"
                        :supplier_comodity="supplier_commodity"
                    >
                    </SelectSupplierComodity>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectSupplierBadge
                        :dense="true"
                        name="badge"
                        @selected="supplierbadgeSelected"
                        :error="error.supplier_badge_id"
                        :supplier_badge="supplier_badge"
                    >
                    </SelectSupplierBadge>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectSupplierType
                        :dense="true"
                        name="SupplierType"
                        @selected="suppliertypeSelected"
                        :error="error.supplier_type_id"
                        :supplier_type="supplier_type"
                    >
                    </SelectSupplierType>
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
                            v-privilege="'sur_upd'"
                            @click="confirmButton()"
                            >Save</v-btn
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
            error: {
                supplier_group: "",
            },
            supplier_commodity: null,
            supplier_badge: null,
            supplier_type: null,
        };
    },
    mounted() {
        this.renderData();
        let self = this;
        this.$root.$on("event_error", function (err) {
            self.error = { ...this.error, ...err };
        });
    },
    methods: {
        // post supplier Relation
        confirmButton() {
            this.ConfirmData = {
                model: true,
                title: "Update Supplier Relation",
                text: "Are you sure want to update this Supplier Relation?",
                urlApi: "/purchase/supplier/group/" + this.$route.params.id,
                nextPage: "/purchase/supplier-relation",
                data: {
                    supplier_commodity_id: this.supplier_commodity
                        ? this.supplier_commodity.id
                        : "",
                    supplier_badge_id: this.supplier_badge
                        ? this.supplier_badge.id
                        : "",
                    supplier_type_id: this.supplier_type
                        ? this.supplier_type.id
                        : "",
                },
            };
        },
        // Select Supplier Comodity
        suppliercomoditySelected(d) {
            this.supplier_commodity = null;
            if (d) {
                this.supplier_commodity = d;
            }
        },
        // Select Supplier Badge
        supplierbadgeSelected(d) {
            this.supplier_badge = null;
            if (d) {
                this.supplier_badge = d;
            }
        },
        // Select Supplier Type
        suppliertypeSelected(d) {
            this.supplier_type = null;
            if (d) {
                this.supplier_type = d;
            }
        },
        // get detail supplier relation
        renderData() {
            this.$http.get("/purchase/supplier/group/" + this.$route.params.id).then((response) => {
                if (response.data.data) {
                    this.suppliercomoditySelected(
                        response.data.data.supplier_commodity
                    );
                    this.supplierbadgeSelected(
                        response.data.data.supplier_badge
                    );
                    this.suppliertypeSelected(
                        response.data.data.supplier_type
                    );
                }
            }).finally(() => (this.isLoading = false));
        },
    },
};
</script>