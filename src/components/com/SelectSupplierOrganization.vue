<template>
    <v-autocomplete
        v-model="supplier_organizations"
        :items="items"
        :placeholder="placeholder"
        :loading="isLoading"
        item-text="name"
        :dense="dense"
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled"
        return-object
        outlined
        :error-messages="error"
        clearable
    >
        <template slot="selection" slot-scope="data">
            <div class="select-item">
                {{ data.item.code }} - {{ data.item.name }}
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.code }} - {{ data.item.name }}
        </template>
        <template v-slot:label>
            <div v-if="label">
                <span v-if="!norequired"
                    >{{ label
                    }}<span :class="disabled ? '' : 'text-red'">*</span></span
                >
                <span v-else>{{ label }}</span>
            </div>
            <div v-else>
                <span v-if="!norequired"
                    >Supplier Organization<span :class="disabled ? '' : 'text-red'"
                        >*</span
                    ></span
                >
                <span v-else>Supplier Organization</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
export default {
    name: "SelectSupplierOrganization",
    data() {
        return {
            items: [],
            placeholder: "",
            isLoading: false,
            search: "",
            supplier_organizations: null,
            timeout: null,
        };
    },
    props: [
        "supplier_organization",
        "disabled",
        "clear",
        "error",
        "label",
        "norequired",
        "dense",
    ],
    methods: {
        //Get Data List Supplier Organization
        remoteSearch(search) {
            this.placeholder = "Loading items...";
            this.isLoading = true;
            this.$http.get("/purchase/supplier/organization/filter", {
                    params: {
                        perpage: 10,
                        conditions: "status:1|name.icontains:" + search,
                        embeds: 'subdistrict,subdistrict.district,subdistrict.district.city,subdistrict.district.city.province',
                    },
                }).then((response) => {
                this.items = response.data.data;
                if (this.items === null) {
                    this.items = [];
                }
                this.isLoading = false;
                let label = "Supplier Oraganization";
                if (this.label) label = this.label;
                this.placeholder = "Select " + label;
            });
        },
        //Auto Select Supplier Organization
        autoSelectByID(val) {
            if (val) {
                this.$http.get("/purchase/supplier/organization/filter", {
                    params: {
                        conditions: "id.e:" + val.id,
                        embeds: 'subdistrict,subdistrict.district,subdistrict.district.city,subdistrict.district.city.province',
                    },
                }).then((response) => {
                    this.items.push(response.data.data[0]);
                    this.supplier_organizations = response.data.data[0];
                });
            }
        },
        //Select Supplier Organization
        selected(event) {
            this.$emit("selected", event);
        },
    },
    mounted() {
        this.remoteSearch("");
    },
    watch: {
        //For Search on field
        search: {
            handler: function (val) {
                if (this.timeout) clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    if (val) {
                        this.remoteSearch(val);
                    }
                }, 500);
            },
            deep: true,
        },
        // ini untuk clear data
        clear: {
            handler: function () {
                this.supplier_organizations = null;
            },
            deep: true,
        },
        // watch perubahan untuk auto select (biasa di pakai di page update)
        supplier_organization: {
            handler: function (val) {
                if (val) {
                    this.autoSelectByID(val);
                }
            },
            deep: true,
        },
    },
};
</script>