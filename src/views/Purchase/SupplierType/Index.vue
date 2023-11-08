<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row>
                <v-col cols="12" md="4" class="h70">
                    <v-tooltip bottom>
                        <template
                            v-slot:activator="{ on: tooltip }"
                            v-privilege="'filter_rdl'"
                        >
                            <v-text-field
                                dense
                                v-model="search"
                                outlined
                                filled
                                placeholder="Search..."
                                prepend-inner-icon="search"
                                v-on="{ ...tooltip }"
                            >
                            </v-text-field>
                        </template>
                        <span>Search by code and name</span>
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row class="hr-title" />
            <v-row :class="filter ? 'mb24' : ''">
                <v-col>
                    Filter
                    <v-btn
                        depressed
                        x-small
                        @click="filter = !filter"
                        v-if="filter"
                        class="no-caps fs12"
                    >
                        Hide
                        <v-icon right> mdi-chevron-up </v-icon>
                    </v-btn>
                    <v-btn
                        depressed
                        x-small
                        @click="filter = !filter"
                        v-else
                        class="no-caps fs12"
                    >
                        Show
                        <v-icon right> mdi-chevron-down </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row :class="filter ? '' : 'hidden'">
                <v-col cols="12" md="3" class="-mt24">
                    <v-select
                        v-model="statuses"
                        :items="status"
                        item-text="text"
                        item-value="value"
                        outlined
                        :dense="true"
                    ></v-select>
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row>
                <v-col class="flex-align-end">
                    <v-btn
                        depressed
                        color="#50ABA3"
                        :to="{ name: 'SupplierTypeCreate' }"
                        class="no-caps bold"
                        v-privilege="'sut_crt'"
                    >
                        <span class="text-white"> Create Supplier Type </span>
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
                            {{ props.item.name }}<br />
                            <span class="text-black60">{{
                                props.item.code
                            }}</span>
                        </td>
                        <td class="center">{{ props.item.abbreviation }}</td>
                        <td>{{ props.item.note }}</td>
                        <td>
                            <div v-if="props.item.status == 1">
                                <v-chip
                                    :color="statusMaster('active')"
                                    :text-color="statusMasterText('active')"
                                    ><span class="pa-md-2">Active</span></v-chip
                                >
                            </div>
                            <div v-else>
                                <v-chip
                                    :color="statusMaster('archived')"
                                    :text-color="statusMasterText('archived')"
                                    >Archived</v-chip
                                >
                            </div>
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
                                        :to="`/purchase/supplier_type/update/${props.item.id}`"
                                        v-privilege="'sut_upd'"
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
    name: "SupplierType",
    data() {
        return {
            filter: false,
            search: "",
            statuses: 1,
            loading: false,
            table: {
                fields: [
                    {
                        text: "Code",
                        width: "20%",
                        sortable: false,
                        class: "grey--text text--darken-4",
                    },
                    {
                        text: "Abbreviation Code",
                        align: "center",
                        width: "20%",
                        class: "grey--text text--darken-4",
                        sortable: false,
                    },
                    {
                        text: "Note",
                        class: "grey--text text--darken-4",
                        width: "30%",
                        sortable: false,
                    },
                    {
                        text: "Status",
                        class: "grey--text text--darken-4",
                        width: "25%",
                        sortable: false,
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
        };
    },
    mounted() {
        this.renderData("", this.statuses);
    },
    methods: {
        renderData(search, statuses) {
            this.loading = true;
            this.items = [];
            if (statuses === 999) {
                statuses = "";
            } else {
                statuses = "|status:" + statuses;
            }
            this.$http
                .get("/purchase/supplier_type", {
                    params: {
                        perpage: 100,
                        conditions:
                            "Or.name.icontains:" +
                            search +
                            "%2COr.code.icontains:" +
                            search +
                            statuses,
                        orderby: "-id",
                    },
                })
                .then((response) => {
                    this.loading = false;
                    this.items = response.data.data;
                    if (this.items === null) {
                        this.items = [];
                    }
                });
        },
    },
    watch: {
        search: {
            handler: function (val) {
                let that = this;
                clearTimeout(this._timerId);
                this._timerId = setTimeout(function () {
                    that.renderData(val, that.statuses);
                }, 1000);
            },
            deep: true,
        },
        statuses: {
            handler: function (val) {
                let that = this;

                that.renderData(this.search, val);
            },
            deep: true,
        },
    },
};
</script>
