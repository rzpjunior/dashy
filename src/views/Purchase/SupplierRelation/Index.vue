<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row>
                <v-col cols="12" md="3">
                    <SelectSupplierComodity
                        :dense="true"
                        name="commodity"
                        :norequired="true"
                        @selected="suppliercomoditySelected"
                        :is_all="true"
                    >
                    </SelectSupplierComodity>
                </v-col>
                <v-col cols="12" md="3">
                    <SelectSupplierBadge
                        :dense="true"
                        name="badge"
                        :norequired="true"
                        @selected="supplierbadgeSelected"
                    >
                    </SelectSupplierBadge>
                </v-col>
                <v-col cols="12" md="3">
                    <SelectSupplierType
                        :dense="true"
                        name="SupplierType"
                        :norequired="true"
                        @selected="suppliertypeSelected"
                    >
                    </SelectSupplierType>
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row>
                <v-col class="flex-align-end">
                    <v-btn
                        depressed
                        color="#50ABA3"
                        :to="{ name: 'SupplierRelationCreate' }"
                        class="no-caps bold"
                        v-privilege="'sur_crt'"
                    >
                        <span class="text-white">
                            Create Supplier Relation
                        </span>
                    </v-btn>
                </v-col>
            </v-row>
        </div>
        <div class="box-body-table">
            <v-data-table
                :headers="table.fields"
                :loading="loading"
                :items="items"
                :items-per-page="10"
                mobile-breakpoint="0"
            >
                <template v-slot:item="props">
                    <tr style="height: 48px">
                        <td>
                            {{
                                props.item.supplier_commodity
                                    ? props.item.supplier_commodity.name
                                    : "-"
                            }}<br />
                            <span class="text-black60">{{
                                props.item.supplier_commodity
                                    ? props.item.supplier_commodity.code
                                    : "-"
                            }}</span>
                        </td>
                        <td>
                            {{ props.item.supplier_badge.name }}
                            <br />
                            <span class="text-black60">
                                {{ props.item.supplier_badge.code }}</span
                            >
                        </td>
                        <td>
                            {{ props.item.supplier_type.name }}<br />
                            <span class="text-black60">{{
                                props.item.supplier_type.code
                            }}</span>
                        </td>
                        <td>
                            <v-menu offset-y>
                                <template v-slot:activator="{ on: menu }">
                                    <v-btn icon v-on="{ ...menu }"
                                        ><v-icon dark
                                            >mdi-dots-vertical</v-icon
                                        ></v-btn
                                    >
                                </template>
                                <v-list class="bg-white">
                                    <v-list-item
                                        :to="`/purchase/supplier-relation/update/${props.item.id}`"
                                        v-privilege="'sur_upd'"
                                    >
                                        <v-list-item-content>
                                            <v-list-item-title
                                                >Update</v-list-item-title
                                            >
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
    </v-container>
</template>

<script>
export default {
    name: "SupplierRelation",
    data() {
        return {
            loading: false,
            table: {
                fields: [
                    {
                        text: "Commodity",
                        width: "35%",
                        sortable: false,
                        class: "grey--text text--darken-4",
                    },
                    {
                        text: "Badge",
                        class: "grey--text text--darken-4",
                        width: "30%",
                        sortable: false,
                    },
                    {
                        text: "Type",
                        width: "30%",
                        sortable: false,
                        class: "grey--text text--darken-4",
                    },
                    {
                        text: "",
                        class: "grey--text text--darken-4",
                        width: "5%",
                        sortable: false,
                    },
                ],
            },
            items: [],
            supplier_commodity: null,
            supplier_badge: null,
            supplier_type: null,
        };
    },
    mounted() {
        this.renderData("", "", "");
    },
    methods: {
        // get list, search, & filter by status
        renderData(commodityId, badgeId, typeId) {
            this.loading = true;
            this.items = [];
            this.$http.get("/purchase/supplier/group", {
                params: {
                    perpage: 100,
                    supplier_commodity_id: Number(commodityId),
                    supplier_badge_id: Number(badgeId),
                    supplier_type_id: Number(typeId),
                    orderby: "-id",
                },
            }).then((response) => {
                if (response.data.data) {
                    this.items = response.data.data;
                    if (this.items === null) {
                        this.items = [];
                    }
                }
            }).finally(() => (this.loading = false));
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
    },
    watch: {
        supplier_commodity: {
            handler: function (val) {
                this.renderData(
                    val ? val.id : "",
                    this.supplier_badge ? this.supplier_badge.id : "",
                    this.supplier_type ? this.supplier_type.id : ""
                );
            },
            deep: true,
        },
        supplier_badge: {
            handler: function (val) {
                this.renderData(
                    this.supplier_commodity ? this.supplier_commodity.id : "",
                    val ? val.id : "",
                    this.supplier_type ? this.supplier_type.id : ""
                );
            },
            deep: true,
        },
        supplier_type: {
            handler: function (val) {
                this.renderData(
                    this.supplier_commodity ? this.supplier_commodity.id : "",
                    this.supplier_badge ? this.supplier_badge.id : "",
                    val ? val.id : ""
                );
            },
            deep: true,
        },
    },
};
</script>
