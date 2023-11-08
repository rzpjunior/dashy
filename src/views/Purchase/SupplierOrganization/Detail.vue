<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mb24">
                <v-col class="fs24 bold">
                    {{ items.name }}
                </v-col>
                <v-col class="d-flex justify-end align-end">
                    <div v-if="this.items.status == 1">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            depressed
                            class="no-caps mb4"
                            :color="statusMaster('active')"
                            >Active</v-btn
                        >
                    </div>
                    <div v-if="this.items.status == 2">
                        <v-btn
                            elevation="0"
                            rounded
                            small
                            depressed
                            class="no-caps mb4"
                            :color="statusMaster('archived')"
                            >Archived</v-btn
                        >
                    </div>
                    <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list class="bg-white">
                            <v-list-item
                                :to="`/purchase/supplier-organization/update/${items.id}`"
                                v-if="this.items.status == 1"
                                v-privilege="'sor_upd'"
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
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew 
                        :name="'Code'" 
                        :value="items.code" 
                    />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew 
                        :name="'Commodity'"
                        v-if="items.supplier_commodity"
                        :value="`${items.supplier_commodity.name}`"
                    />
                    <DetailRowNew 
                        :name="'Commodity'" 
                        v-else 
                        :value="'-'" 
                    />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew
                        v-if="items.supplier_type"
                        :name="'Type'"
                        :value="`${items.supplier_type.abbreviation} - ${items.supplier_type.name}`"
                    />
                    <DetailRowNew
                        v-else
                        :name="'Type'"
                        :value="'-'"
                    />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew
                        :name="'Supplier Badge'"
                        v-if="items.supplier_badge"
                        :value="items.supplier_badge.name"
                    />
                    <DetailRowNew
                        :name="'Supplier Badge'"
                        v-else
                        :value="'-'"
                    />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew
                        v-if="items.term_payment_pur"
                        :name="'Payment Term'"
                        :value="items.term_payment_pur.name"
                    />
                    <DetailRowNew
                        :name="'Payment Term'"
                        v-else
                        :value="'-'"
                    />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew
                        v-if="items.sub_district"
                        :name="'Sub District'"
                        :value="items.sub_district.name"
                    />
                    <DetailRowNew
                        :name="'Sub District'"
                        v-else
                        :value="'-'"
                    />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew
                        v-if="items.sub_district"
                        :name="'District'"
                        :value="items.sub_district.district.name"
                    />
                    <DetailRowNew
                        :name="'District'"
                        v-else
                        :value="'-'"
                    />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew
                        v-if="items.sub_district"
                        :name="'City'"
                        :value="items.sub_district.district.city.name"
                    />
                    <DetailRowNew
                        :name="'City'"
                        v-else
                        :value="'-'"
                    />
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <DetailRowNew
                        :name="'Province'"
                        v-if="items.sub_district"
                        :value="items.sub_district.district.city.province.name"
                    />
                    <DetailRowNew
                        :name="'Province'"
                        v-else
                        :value="'-'"
                    />
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <DetailRowNew 
                        :name="'Address'" 
                        :value="items.address" 
                        :align="true"
                    />
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <DetailRowNew
                        :name="'Note'"
                        :value="items.note"
                        :align="true"
                    />
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>

<script>
export default {
    name: "SupplierOrganizationDetail",
    data() {
        return {
            items: {
                supplier_commodity:{
                    name: "",
                },
                supplier_badge:{
                    name: "",
                },
                supplier_type: {
                    name: "",
                    abbreviation: "",
                },
                term_payment_pur: {
                    name: "",
                },
                sub_district: {
                    name: "",
                    district: {
                        name: "",
                        city: {
                            name: "",
                            province: {
                                name: "",
                            },
                        },
                    },
                },
                note: "",
                addresss: "",
                code: "",
            },
        };
    },
    methods: {
        // render detail data
        renderData() {
            this.$http.get("/purchase/supplier/organization/" + this.$route.params.id).then((response) => {
                this.items = response.data.data;
                this.loading = false;
            });
        },
    },
    mounted() {
        this.renderData();
    },
};
</script>
